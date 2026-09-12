"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";

type Opportunity = {
  id: string;
  title: string;
  company: string;
  type: string;
  matchTier: string;
  satisfiedRequirements: string[];
  uncertainRequirements: string[];
  gapRequirements: string[];
};

const tiers = ["Ready", "Reasonable Stretch", "Low Priority"] as const;

const tierStyle: Record<string, string> = {
  Ready: "border-brand-200 bg-brand-50 text-brand-800",
  "Reasonable Stretch": "border-amber-200 bg-amber-50 text-amber-800",
  "Low Priority": "border-gray-200 bg-gray-50 text-gray-600",
};

export default function OpportunitiesPage() {
  const { data = [], isLoading } = useQuery({
    queryKey: ["opportunities"],
    queryFn: async () => {
      const res = await fetch("/api/opportunities");
      if (!res.ok) throw new Error("Failed");
      return (await res.json()) as Opportunity[];
    },
  });

  const grouped = useMemo(() => {
    const map: Record<string, Opportunity[]> = {
      Ready: [],
      "Reasonable Stretch": [],
      "Low Priority": [],
    };
    for (const opp of data) {
      (map[opp.matchTier] || map["Low Priority"]).push(opp);
    }
    return map;
  }, [data]);

  return (
    <div className="space-y-6 fade-up">
      <PageHeader
        title="Opportunities"
        subtitle="APPLY lane — Ready / Reasonable Stretch / Low Priority"
      />

      {isLoading && <p className="text-sm text-gray-500">Loading roles…</p>}

      <div className="grid gap-4 lg:grid-cols-3">
        {tiers.map((tier) => (
          <div key={tier} className="space-y-3">
            <h2 className="text-sm font-semibold text-gray-900">{tier}</h2>
            {grouped[tier].map((opp) => (
              <Card key={opp.id} className="hover:shadow-sm">
                <CardHeader>
                  <Badge className={`mb-2 w-fit ${tierStyle[opp.matchTier]}`}>
                    {opp.matchTier}
                  </Badge>
                  <CardTitle>{opp.title}</CardTitle>
                  <p className="text-sm text-gray-500">
                    {opp.company} · {opp.type}
                  </p>
                </CardHeader>
                <CardContent className="space-y-2 text-xs text-gray-600">
                  <p>
                    <span className="font-medium text-brand-700">Satisfied:</span>{" "}
                    {opp.satisfiedRequirements.join(", ") || "—"}
                  </p>
                  <p>
                    <span className="font-medium text-amber-700">Uncertain:</span>{" "}
                    {opp.uncertainRequirements.join(", ") || "—"}
                  </p>
                  <p>
                    <span className="font-medium text-red-700">Gaps:</span>{" "}
                    {opp.gapRequirements.join(", ") || "—"}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
