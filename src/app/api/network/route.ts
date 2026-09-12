import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getDemoStudent } from "@/lib/engine";

export async function GET() {
  const student = await getDemoStudent();
  return NextResponse.json(
    await prisma.connection.findMany({ where: { studentId: student.id }, orderBy: { name: "asc" } })
  );
}
