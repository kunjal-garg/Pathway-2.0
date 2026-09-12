import { NextResponse } from "next/server";
import { computeSkillProficiencies, getDemoStudent } from "@/lib/engine";
import { addEvidenceFromText, recalculateGps } from "@/lib/recalculate";
import { logActivity } from "@/lib/activity";

export async function POST(req: Request) {
  const body = await req.json();
  const student = await getDemoStudent();
  const evidence = await addEvidenceFromText({
    studentId: student.id,
    sourceType: body.sourceType || "project",
    sourceLabel: body.sourceLabel || "New evidence",
    strength: body.strength || "medium",
    text: body.text || "",
    skillNames: body.skillNames,
  });
  await logActivity(
    student.id,
    `Added evidence: ${body.sourceLabel || "New evidence"}`
  );
  await recalculateGps(student.id);
  return NextResponse.json({
    evidence,
    skills: await computeSkillProficiencies(student.id),
    message: "Evidence added. Profile and GPS updated.",
    routeUpdated: true,
  });
}
