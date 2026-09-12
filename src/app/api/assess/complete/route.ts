import { NextResponse } from "next/server";
import { getDemoStudent } from "@/lib/engine";
import { addEvidenceFromText, recalculateGps } from "@/lib/recalculate";

export async function POST(req: Request) {
  const body = await req.json();
  const student = await getDemoStudent();
  const score = Number(body.score || 0);
  const skillName = String(body.skillName || "PyTorch");
  const strength = score >= 0.8 ? "high" : score >= 0.5 ? "medium" : "low";
  await addEvidenceFromText({
    studentId: student.id,
    sourceType: "assessment",
    sourceLabel: `In-app quiz: ${skillName} (${Math.round(score * 100)}%)`,
    strength,
    skillNames: [skillName],
  });
  await recalculateGps(student.id);
  return NextResponse.json({ message: "Profile updated → Gaps recalculated → GPS actions refreshed.", strength });
}
