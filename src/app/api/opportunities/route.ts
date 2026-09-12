import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getDemoStudent } from "@/lib/engine";
import { parseJsonArray } from "@/lib/utils";

export async function GET() {
  const student = await getDemoStudent();
  const opportunities = await prisma.opportunity.findMany({ where: { studentId: student.id } });
  const rank: Record<string, number> = { Ready: 0, "Reasonable Stretch": 1, "Low Priority": 2 };
  opportunities.sort((a, b) => (rank[a.matchTier] ?? 9) - (rank[b.matchTier] ?? 9));
  return NextResponse.json(
    opportunities.map((o) => ({
      ...o,
      satisfiedRequirements: parseJsonArray(o.satisfiedRequirements),
      uncertainRequirements: parseJsonArray(o.uncertainRequirements),
      gapRequirements: parseJsonArray(o.gapRequirements),
    }))
  );
}
