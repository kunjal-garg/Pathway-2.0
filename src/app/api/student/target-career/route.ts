import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getDemoStudent } from "@/lib/engine";
import { recalculateGps } from "@/lib/recalculate";
import { logActivity } from "@/lib/activity";

export async function POST(req: Request) {
  const { careerId } = await req.json();
  const student = await getDemoStudent();
  const career = await prisma.career.findUnique({ where: { id: careerId } });
  if (!career) return NextResponse.json({ error: "Career not found" }, { status: 404 });
  const updated = await prisma.student.update({
    where: { id: student.id },
    data: { targetCareerId: careerId, onboardingComplete: true },
    include: { targetCareer: true },
  });
  await logActivity(updated.id, `Set destination: ${career.title}`);
  await recalculateGps(updated.id);
  return NextResponse.json(updated);
}
