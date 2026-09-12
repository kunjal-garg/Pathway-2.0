import { prisma } from "./prisma";
import { computeGaps, getDemoStudent, thisWeekLabel } from "./engine";
import { generateWeeklyMissions } from "./ai";
import { toJsonArray } from "./utils";

export async function recalculateGps(studentId?: string) {
  const student = studentId
    ? await prisma.student.findUnique({ where: { id: studentId } })
    : await getDemoStudent();
  if (!student?.targetCareerId) {
    throw new Error("Student needs a target career before recalculating GPS.");
  }

  const career = await prisma.career.findUnique({ where: { id: student.targetCareerId } });
  if (!career) throw new Error("Target career not found");

  const gaps = await computeGaps(student.id, student.targetCareerId);
  const missions = await generateWeeklyMissions({
    careerTitle: career.title,
    topGaps: gaps,
  });

  await prisma.action.deleteMany({
    where: { studentId: student.id, status: { in: ["suggested", "in_progress"] } },
  });

  const week = thisWeekLabel();
  await prisma.action.createMany({
    data: missions.map((m) => ({
      studentId: student.id,
      type: m.type,
      title: m.title,
      why: m.why,
      relatedSkillIds: toJsonArray(m.relatedSkillIds),
      status: "suggested",
      weekOf: week,
      resourceLinks: toJsonArray(m.resourceLinks),
    })),
  });

  return {
    actions: await prisma.action.findMany({
      where: { studentId: student.id },
      orderBy: [{ status: "asc" }, { type: "asc" }],
    }),
    gaps,
  };
}

const KEYWORD_MAP: Array<{ keywords: string[]; skills: string[] }> = [
  { keywords: ["python", "fastapi", "django"], skills: ["Python"] },
  { keywords: ["c++", "cpp"], skills: ["C++"] },
  { keywords: ["opencv", "vision", "camera", "detection"], skills: ["OpenCV", "Computer Vision"] },
  { keywords: ["pytorch", "torch"], skills: ["PyTorch", "Deep Learning"] },
  { keywords: ["cuda", "gpu"], skills: ["CUDA"] },
  { keywords: ["geometry", "calibration", "stereo"], skills: ["3D Geometry"] },
  { keywords: ["docker"], skills: ["Docker"] },
  { keywords: ["linux"], skills: ["Linux"] },
  { keywords: ["git", "github"], skills: ["Git"] },
  { keywords: ["react", "frontend"], skills: ["React", "TypeScript"] },
  { keywords: ["sql", "database"], skills: ["SQL"] },
  { keywords: ["ros", "robot"], skills: ["ROS", "Robotics"] },
  { keywords: ["interview"], skills: ["Communication", "Problem Solving"] },
];

export async function addEvidenceFromText(input: {
  studentId: string;
  sourceType: string;
  sourceLabel: string;
  strength?: "low" | "medium" | "high";
  text?: string;
  skillNames?: string[];
}) {
  const hay = `${input.sourceLabel} ${input.text || ""}`.toLowerCase();
  const skillNames = new Set(input.skillNames || []);
  for (const rule of KEYWORD_MAP) {
    if (rule.keywords.some((k) => hay.includes(k))) {
      rule.skills.forEach((s) => skillNames.add(s));
    }
  }
  if (skillNames.size === 0) skillNames.add("Problem Solving");

  const skills = await prisma.skill.findMany({ where: { name: { in: [...skillNames] } } });
  const created = [];
  for (const skill of skills) {
    created.push(
      await prisma.evidence.create({
        data: {
          studentId: input.studentId,
          skillId: skill.id,
          sourceType: input.sourceType,
          sourceLabel: input.sourceLabel,
          strength: input.strength || "medium",
        },
      })
    );
  }
  return created;
}
