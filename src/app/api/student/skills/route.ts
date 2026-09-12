import { NextResponse } from "next/server";
import { computeSkillProficiencies, getDemoStudent } from "@/lib/engine";

export async function GET() {
  const student = await getDemoStudent();
  return NextResponse.json(await computeSkillProficiencies(student.id));
}
