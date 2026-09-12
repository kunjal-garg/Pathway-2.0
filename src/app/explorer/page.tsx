"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

type Career = {
  id: string;
  title: string;
  description: string;
  category: string;
  medianSalary: number;
  demandTrend: string;
  requiredSkills: string[];
};

async function fetchCareers(): Promise<Career[]> {
  const res = await fetch("/api/careers");
  if (!res.ok) throw new Error("Failed to load careers");
  return res.json();
}

export default function ExplorerPage() {
  const { data = [], isLoading, error } = useQuery({
    queryKey: ["careers"],
    queryFn: fetchCareers,
  });
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("all");

  const categories = useMemo(
    () => ["all", ...Array.from(new Set(data.map((c) => c.category))).sort()],
    [data]
  );

  const filtered = data.filter((c) => {
    const matchesQ =
      !q ||
      c.title.toLowerCase().includes(q.toLowerCase()) ||
      c.description.toLowerCase().includes(q.toLowerCase());
    const matchesCat = category === "all" || c.category === category;
    return matchesQ && matchesCat;
  });

  return (
    <div className="space-y-6 fade-up">
      <PageHeader
        title="Career Explorer"
        subtitle="Where can I go? Search and filter careers to set a destination"
      />

      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search careers…"
        className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm"
      />

      <div className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
              category === c
                ? "bg-brand-600 text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            )}
          >
            {c === "all" ? "All" : c}
          </button>
        ))}
      </div>

      {isLoading && <p className="text-sm text-gray-500">Loading careers…</p>}
      {error && (
        <p className="text-sm text-red-600">Couldn’t load careers. Run npm run seed.</p>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((career) => (
          <Link key={career.id} href={`/explorer/${career.id}`}>
            <Card className="h-full transition hover:shadow-sm">
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <CardTitle>{career.title}</CardTitle>
                  <TrendBadge trend={career.demandTrend} />
                </div>
                <Badge className="w-fit">{career.category}</Badge>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-3 text-sm text-gray-600">{career.description}</p>
                <p className="mt-3 text-sm font-semibold text-gray-900">
                  Median ${career.medianSalary.toLocaleString()}
                </p>
                <div className="mt-3 flex flex-wrap gap-1">
                  {career.requiredSkills.slice(0, 4).map((s) => (
                    <Badge key={s}>{s}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

function TrendBadge({ trend }: { trend: string }) {
  if (trend === "rising")
    return (
      <Badge className="border-brand-200 bg-brand-50 text-brand-700">
        <TrendingUp className="mr-1 h-3 w-3" /> rising
      </Badge>
    );
  if (trend === "declining")
    return (
      <Badge className="border-red-200 bg-red-50 text-red-700">
        <TrendingDown className="mr-1 h-3 w-3" /> declining
      </Badge>
    );
  return (
    <Badge>
      <Minus className="mr-1 h-3 w-3" /> stable
    </Badge>
  );
}
