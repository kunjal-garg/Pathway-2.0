"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { cn } from "@/lib/utils";
import type { ProficiencyLevel } from "@/lib/types";

type Gap = {
  skillId: string;
  skillName: string;
  importance: number;
  currentLevel: ProficiencyLevel;
  requiredLevel: ProficiencyLevel;
  priorityScore: number;
  reason: string;
  aiReason: string;
  confidence: string;
  isPreferred: boolean;
};

const filters = ["All Gaps", "Skills", "Experience", "Projects"] as const;

function gapBucket(gap: Gap): "Skills" | "Experience" | "Projects" {
  const name = gap.skillName.toLowerCase();
  if (name.includes("communication") || name.includes("ownership") || name.includes("problem")) {
    return "Experience";
  }
  if (name.includes("git") || name.includes("linux") || name.includes("docker")) {
    return "Projects";
  }
  return "Skills";
}

function priorityTone(score: number) {
  if (score >= 70) return "border-red-200 bg-red-50 text-red-700";
  if (score >= 45) return "border-amber-200 bg-amber-50 text-amber-800";
  return "border-brand-200 bg-brand-50 text-brand-700";
}

export default function GapsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["gaps"],
    queryFn: async () => {
      const res = await fetch("/api/gaps");
      if (!res.ok) throw new Error("Failed");
      return (await res.json()) as {
        career: { title: string } | null;
        gaps: Gap[];
      };
    },
  });
  const [filter, setFilter] = useState<(typeof filters)[number]>("All Gaps");
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!data) return [];
    if (filter === "All Gaps") return data.gaps;
    return data.gaps.filter((g) => gapBucket(g) === filter);
  }, [data, filter]);

  if (isLoading || !data) {
    return <p className="text-sm text-gray-500">Computing gaps…</p>;
  }

  return (
    <div className="space-y-6 fade-up">
      <PageHeader
        title="Gap Analysis"
        subtitle={`What matters between here and ${data.career?.title || "your target"}?`}
      />

      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-medium",
              filter === f
                ? "bg-brand-600 text-white"
                : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((gap) => {
          const open = openId === gap.skillId;
          const priority =
            gap.priorityScore >= 70 ? "High" : gap.priorityScore >= 45 ? "Medium" : "Low";
          return (
            <Card key={gap.skillId} className="hover:shadow-sm">
              <button
                className="w-full text-left"
                onClick={() => setOpenId(open ? null : gap.skillId)}
              >
                <CardHeader className="flex-row items-center justify-between space-y-0">
                  <div>
                    <CardTitle className="text-base">{gap.skillName}</CardTitle>
                    <p className="mt-1 text-xs text-gray-400">
                      {gap.currentLevel} → {gap.requiredLevel} · importance {gap.importance}%
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={priorityTone(gap.priorityScore)}>{priority}</Badge>
                    <Badge>{gap.confidence}</Badge>
                  </div>
                </CardHeader>
              </button>
              {open && (
                <CardContent className="space-y-2 border-t border-gray-100 pt-4 text-sm text-gray-600">
                  <p>{gap.reason}</p>
                  <p className="rounded-lg bg-brand-50 p-3 text-brand-900">{gap.aiReason}</p>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
