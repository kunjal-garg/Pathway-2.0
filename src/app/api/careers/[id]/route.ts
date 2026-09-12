import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseJsonArray } from "@/lib/utils";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const career = await prisma.career.findUnique({ where: { id: params.id } });
  if (!career) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({
    ...career,
    requiredSkills: parseJsonArray(career.requiredSkills),
    preferredSkills: parseJsonArray(career.preferredSkills),
    industries: parseJsonArray(career.industries),
    adjacentCareers: parseJsonArray(career.adjacentCareers),
    sampleCompanies: parseJsonArray(career.sampleCompanies),
  });
}
