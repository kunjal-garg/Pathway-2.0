import { NextResponse } from "next/server";
import { computeSkillProficiencies, getDemoStudent } from "@/lib/engine";
import { parseJsonArray } from "@/lib/utils";

export async function GET() {
  const student = await getDemoStudent();
  const skills = await computeSkillProficiencies(student.id);
  return NextResponse.json({
    student: {
      ...student,
      targetCareer: student.targetCareer
        ? {
            ...student.targetCareer,
            requiredSkills: parseJsonArray(student.targetCareer.requiredSkills),
            preferredSkills: parseJsonArray(student.targetCareer.preferredSkills),
          }
        : null,
    },
    skills,
    ladder: ["Unknown", "Exposure", "Knowledge", "Applied", "Proficient", "Professional"],
  });
}
