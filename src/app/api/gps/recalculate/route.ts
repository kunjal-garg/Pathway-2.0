import { NextResponse } from "next/server";
import { getDemoStudent } from "@/lib/engine";
import { recalculateGps } from "@/lib/recalculate";
import { parseJsonArray } from "@/lib/utils";
import { logActivity } from "@/lib/activity";

export async function POST() {
  const student = await getDemoStudent();
  const result = await recalculateGps(student.id);
  await logActivity(student.id, "Recalculated weekly GPS route from current gaps");
  return NextResponse.json({
    message: "Your route has been updated.",
    routeUpdated: true,
    actions: result.actions.map((a) => ({
      ...a,
      relatedSkillIds: parseJsonArray(a.relatedSkillIds),
      resourceLinks: parseJsonArray(a.resourceLinks),
    })),
    gaps: result.gaps,
  });
}
