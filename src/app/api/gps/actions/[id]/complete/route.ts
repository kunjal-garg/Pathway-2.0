import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { addEvidenceFromText, recalculateGps } from "@/lib/recalculate";
import { parseJsonArray } from "@/lib/utils";
import { logActivity } from "@/lib/activity";

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const action = await prisma.action.findUnique({ where: { id: params.id } });
  if (!action) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await prisma.action.update({ where: { id: action.id }, data: { status: "done" } });
  await addEvidenceFromText({
    studentId: action.studentId,
    sourceType: action.type.toLowerCase(),
    sourceLabel: `Completed action: ${action.title}`,
    text: `${action.title} ${action.why}`,
  });
  await logActivity(action.studentId, `Marked done: ${action.title}`);
  const result = await recalculateGps(action.studentId);
  return NextResponse.json({
    message: "Recalculating your route… Profile updated → Gaps refreshed → GPS refreshed.",
    routeUpdated: true,
    actions: result.actions.map((a) => ({
      ...a,
      relatedSkillIds: parseJsonArray(a.relatedSkillIds),
      resourceLinks: parseJsonArray(a.resourceLinks),
    })),
  });
}
