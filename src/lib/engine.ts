import { prisma } from "./prisma";
import {
  Confidence,
  EvidenceStrength,
  LEVEL_RANK,
  ProficiencyLevel,
  levelFromRank,
  strengthBoost,
} from "./types";
import { parseJsonArray } from "./utils";

export type SkillRow = {
  skillId: string;
  skillName: string;
  category: string;
  level: ProficiencyLevel;
  confidence: Confidence;
  evidence: Array<{
    id: string;
    sourceType: string;
    sourceLabel: string;
    strength: string;
  }>;
};

export async function getDemoStudent() {
  const student = await prisma.student.findFirst({
    include: { targetCareer: true },
    orderBy: { name: "asc" },
  });
  if (!student) throw new Error("No demo student found. Run npm run seed.");
  return student;
}

export async function computeSkillProficiencies(studentId: string): Promise<SkillRow[]> {
  const evidence = await prisma.evidence.findMany({
    where: { studentId },
    include: { skill: true },
    orderBy: { createdAt: "desc" },
  });

  const bySkill = new Map<string, typeof evidence>();
  for (const item of evidence) {
    const list = bySkill.get(item.skillId) || [];
    list.push(item);
    bySkill.set(item.skillId, list);
  }

  const rows: SkillRow[] = [];
  for (const [skillId, items] of bySkill) {
    const score = items.reduce(
      (sum, e) => sum + strengthBoost(e.strength as EvidenceStrength),
      0
    );
    const level = levelFromRank(Math.min(5, Math.floor(score)));
    let confidence: Confidence = "Low";
    if (items.length >= 3 || score >= 3.5) confidence = "High";
    else if (items.length >= 2 || score >= 2) confidence = "Medium";

    rows.push({
      skillId,
      skillName: items[0].skill.name,
      category: items[0].skill.category,
      level,
      confidence,
      evidence: items.map((e) => ({
        id: e.id,
        sourceType: e.sourceType,
        sourceLabel: e.sourceLabel,
        strength: e.strength,
      })),
    });
  }

  return rows.sort((a, b) => a.skillName.localeCompare(b.skillName));
}

export type GapRow = {
  skillId: string;
  skillName: string;
  importance: number;
  currentLevel: ProficiencyLevel;
  requiredLevel: ProficiencyLevel;
  priorityScore: number;
  reason: string;
  confidence: Confidence;
  isPreferred: boolean;
};

export async function computeGaps(studentId: string, careerId: string): Promise<GapRow[]> {
  const career = await prisma.career.findUnique({ where: { id: careerId } });
  if (!career) return [];

  const required = parseJsonArray(career.requiredSkills);
  const preferred = parseJsonArray(career.preferredSkills);
  const skills = await prisma.skill.findMany();
  const byName = new Map(skills.map((s) => [s.name, s]));
  const proficiency = await computeSkillProficiencies(studentId);
  const bySkillId = new Map(proficiency.map((p) => [p.skillId, p]));
  const rows: GapRow[] = [];

  required.forEach((name, idx) => {
    const skill = byName.get(name);
    if (!skill) return;
    const current = bySkillId.get(skill.id);
    const currentLevel = current?.level ?? "Unknown";
    const requiredLevel: ProficiencyLevel =
      idx < Math.ceil(required.length * 0.35) ? "Proficient" : "Applied";
    const importance = Math.max(45, 95 - idx * 3);
    const delta = Math.max(0, LEVEL_RANK[requiredLevel] - LEVEL_RANK[currentLevel]);
    const confidencePenalty =
      current?.confidence === "Low" ? 8 : current?.confidence === "Medium" ? 3 : 0;
    rows.push({
      skillId: skill.id,
      skillName: skill.name,
      importance,
      currentLevel,
      requiredLevel,
      priorityScore: Math.round(delta * 18 + importance * 0.55 + confidencePenalty),
      reason: `${skill.name} shows up in about ${importance}% of ${career.title} postings. You're at ${currentLevel}; roles typically expect ${requiredLevel}.`,
      confidence: current?.confidence ?? "Low",
      isPreferred: false,
    });
  });

  preferred.forEach((name, idx) => {
    const skill = byName.get(name);
    if (!skill || rows.some((r) => r.skillId === skill.id)) return;
    const current = bySkillId.get(skill.id);
    const currentLevel = current?.level ?? "Unknown";
    if (LEVEL_RANK[currentLevel] >= LEVEL_RANK.Applied) return;
    const importance = Math.max(25, 55 - idx * 4);
    rows.push({
      skillId: skill.id,
      skillName: skill.name,
      importance,
      currentLevel,
      requiredLevel: "Applied",
      priorityScore: Math.round(
        (LEVEL_RANK.Applied - LEVEL_RANK[currentLevel]) * 10 + importance * 0.4
      ),
      reason: `${skill.name} is preferred for ${career.title} and can differentiate stretch opportunities.`,
      confidence: current?.confidence ?? "Low",
      isPreferred: true,
    });
  });

  return rows.sort((a, b) => b.priorityScore - a.priorityScore);
}

export function thisWeekLabel() {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - now.getDay());
  return start.toISOString().slice(0, 10);
}
