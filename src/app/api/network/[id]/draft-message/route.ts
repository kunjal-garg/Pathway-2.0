import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { draftOutreachMessage } from "@/lib/ai";
import { getDemoStudent } from "@/lib/engine";

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const student = await getDemoStudent();
  const connection = await prisma.connection.findUnique({ where: { id: params.id } });
  if (!connection) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const message = await draftOutreachMessage({
    name: connection.name,
    role: connection.role,
    company: connection.company,
    school: connection.school,
    objective: connection.suggestedObjective,
    studentName: student.name,
    targetCareer: student.targetCareer?.title || "your target career",
  });
  return NextResponse.json(
    await prisma.connection.update({ where: { id: connection.id }, data: { draftMessage: message } })
  );
}
