import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getDemoStudent } from "@/lib/engine";
import { parseJsonArray } from "@/lib/utils";

export async function GET() {
  const student = await getDemoStudent();
  const events = await prisma.event.findMany({ where: { studentId: student.id }, orderBy: { date: "asc" } });
  return NextResponse.json(events.map((e) => ({ ...e, followUpActions: parseJsonArray(e.followUpActions) })));
}
