import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getDemoStudent } from "@/lib/engine";
import { parseJsonArray } from "@/lib/utils";

export async function GET() {
  const student = await getDemoStudent();
  const actions = await prisma.action.findMany({
    where: { studentId: student.id },
    orderBy: [{ status: "asc" }, { type: "asc" }],
  });
  return NextResponse.json({
    student,
    actions: actions.map((a) => ({
      ...a,
      relatedSkillIds: parseJsonArray(a.relatedSkillIds),
      resourceLinks: parseJsonArray(a.resourceLinks),
    })),
  });
}
