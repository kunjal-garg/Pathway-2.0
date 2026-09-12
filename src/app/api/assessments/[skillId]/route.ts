import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseJsonArray } from "@/lib/utils";

export async function GET(
  _req: Request,
  { params }: { params: { skillId: string } }
) {
  const skill =
    (await prisma.skill.findUnique({ where: { id: params.skillId } })) ||
    (await prisma.skill.findFirst({ where: { name: params.skillId } }));
  if (!skill) return NextResponse.json({ error: "Skill not found" }, { status: 404 });

  const questions = await prisma.quizQuestion.findMany({
    where: { skillId: skill.id },
    take: 5,
  });

  return NextResponse.json({
    skill,
    questions: questions.map((q) => ({
      id: q.id,
      prompt: q.prompt,
      options: parseJsonArray(q.choices).map((label, idx) => ({
        id: String(idx),
        label,
      })),
      correctOptionId: String(q.correctIndex),
    })),
  });
}
