import { NextResponse } from "next/server";
import { getDemoStudent } from "@/lib/engine";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const student = await getDemoStudent();
  const entries = await prisma.activityLogEntry.findMany({
    where: { studentId: student.id },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
  const actions = await prisma.action.findMany({ where: { studentId: student.id } });
  const done = actions.filter((a) => a.status === "done").length;
  const total = Math.max(actions.length, 1);
  return NextResponse.json({
    entries,
    progress: {
      completedActions: done,
      totalActions: actions.length,
      percent: Math.round((done / total) * 100),
    },
  });
}
