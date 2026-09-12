import { NextResponse } from "next/server";
import { computeGaps, getDemoStudent } from "@/lib/engine";
import { explainGap } from "@/lib/ai";

export async function GET() {
  const student = await getDemoStudent();
  if (!student.targetCareerId || !student.targetCareer) {
    return NextResponse.json({ gaps: [], career: null });
  }
  const gaps = await computeGaps(student.id, student.targetCareerId);
  const withWhy = await Promise.all(
    gaps.slice(0, 12).map(async (gap) => ({
      ...gap,
      aiReason: await explainGap(gap, student.targetCareer!.title),
    }))
  );
  return NextResponse.json({ career: student.targetCareer, gaps: withWhy });
}
