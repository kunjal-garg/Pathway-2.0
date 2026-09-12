import { NextResponse } from "next/server";
import { summarizeInterview } from "@/lib/ai";
import { getDemoStudent } from "@/lib/engine";
import { addEvidenceFromText, recalculateGps } from "@/lib/recalculate";

export async function POST(req: Request) {
  const body = await req.json();
  const answers = (body.answers as string[]) || [];
  const summary = await summarizeInterview(answers);
  const student = await getDemoStudent();
  await addEvidenceFromText({
    studentId: student.id,
    sourceType: "interview",
    sourceLabel: `Mock interview: ${summary.slice(0, 80)}...`,
    strength: "medium",
    text: `${summary} computer vision problem solving`,
    skillNames: ["Computer Vision", "Problem Solving", "Communication"],
  });
  await recalculateGps(student.id);
  return NextResponse.json({ summary, message: "Profile updated → Gaps recalculated → GPS actions refreshed." });
}
