import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { thisWeekLabel } from "@/lib/engine";
import { parseJsonArray, toJsonArray } from "@/lib/utils";
import { logActivity } from "@/lib/activity";

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const event = await prisma.event.findUnique({ where: { id: params.id } });
  if (!event) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const followUps = parseJsonArray(event.followUpActions);
  await prisma.event.update({ where: { id: event.id }, data: { attended: true } });
  await logActivity(event.studentId, `Attended event: ${event.title}`);
  await prisma.action.createMany({
    data: followUps.map((title) => ({
      studentId: event.studentId,
      type: "CONNECT",
      title,
      why: `Follow-up from attending ${event.title}.`,
      relatedSkillIds: toJsonArray([]),
      status: "suggested",
      weekOf: thisWeekLabel(),
      resourceLinks: toJsonArray(["/events"]),
    })),
  });
  return NextResponse.json({
    message: "Marked attended. Follow-up actions added to GPS.",
    routeUpdated: true,
    followUps,
  });
}
