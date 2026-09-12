import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseJsonArray } from "@/lib/utils";

export async function GET(req: Request) {
  const skillName = new URL(req.url).searchParams.get("skill") || "PyTorch";
  const skill = await prisma.skill.findFirst({ where: { name: skillName } });
  if (!skill) return NextResponse.json({ error: "Skill not found" }, { status: 404 });
  const questions = await prisma.quizQuestion.findMany({ where: { skillId: skill.id }, take: 5 });
  return NextResponse.json({
    skill,
    questions: questions.map((q) => ({
      id: q.id,
      prompt: q.prompt,
      choices: parseJsonArray(q.choices),
      correctIndex: q.correctIndex,
    })),
  });
}
