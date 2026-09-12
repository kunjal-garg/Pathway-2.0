import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseJsonArray } from "@/lib/utils";

export async function GET() {
  const careers = await prisma.career.findMany({ orderBy: { title: "asc" } });
  return NextResponse.json(
    careers.map((c) => ({
      ...c,
      requiredSkills: parseJsonArray(c.requiredSkills),
      preferredSkills: parseJsonArray(c.preferredSkills),
      industries: parseJsonArray(c.industries),
      adjacentCareers: parseJsonArray(c.adjacentCareers),
      sampleCompanies: parseJsonArray(c.sampleCompanies),
    }))
  );
}
