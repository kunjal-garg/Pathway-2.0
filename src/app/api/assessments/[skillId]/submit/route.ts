import { NextResponse } from "next/server";
import { computeSkillProficiencies, getDemoStudent } from "@/lib/engine";
import { addEvidenceFromText, recalculateGps } from "@/lib/recalculate";
import { logActivity } from "@/lib/activity";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: { skillId: string } }
) {
  const body = await req.json();
  const student = await getDemoStudent();
  const skill =
    (await prisma.skill.findUnique({ where: { id: params.skillId } })) ||
    (await prisma.skill.findFirst({ where: { name: params.skillId } }));
  if (!skill) return NextResponse.json({ error: "Skill not found" }, { status: 404 });

  const answers = (body.answers || {}) as Record<string, string>;
  const questions = await prisma.quizQuestion.findMany({ where: { skillId: skill.id }, take: 5 });
  const total = questions.length || 1;
  const correct = questions.filter((q) => answers[q.id] === String(q.correctIndex)).length;
  const score = correct / total;
  const strength = score >= 0.8 ? "high" : score >= 0.5 ? "medium" : "low";

  const before = (await computeSkillProficiencies(student.id)).find(
    (s) => s.skillId === skill.id
  );

  await addEvidenceFromText({
    studentId: student.id,
    sourceType: "assessment",
    sourceLabel: `In-app quiz: ${skill.name} (${correct}/${total})`,
    strength,
    skillNames: [skill.name],
  });
  await logActivity(
    student.id,
    `Completed ${skill.name} assessment — scored ${correct}/${total}`
  );
  await recalculateGps(student.id);

  const after = (await computeSkillProficiencies(student.id)).find(
    (s) => s.skillId === skill.id
  );

  return NextResponse.json({
    skillId: skill.id,
    skillName: skill.name,
    correct,
    total,
    score,
    before: before
      ? { level: before.level, confidence: before.confidence }
      : { level: "Unknown", confidence: "Low" },
    after: after
      ? { level: after.level, confidence: after.confidence }
      : { level: "Unknown", confidence: "Low" },
    message: "Assessment saved. Profile, gaps, and GPS updated.",
  });
}
