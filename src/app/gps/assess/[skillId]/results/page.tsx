"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProficiencyLadder } from "@/components/ui/proficiency-ladder";
import type { ProficiencyLevel } from "@/lib/types";

type Result = {
  skillName: string;
  correct: number;
  total: number;
  before: { level: ProficiencyLevel; confidence: string };
  after: { level: ProficiencyLevel; confidence: string };
};

export default function AssessResultsPage() {
  const params = useParams<{ skillId: string }>();
  const [result, setResult] = useState<Result | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("pathwayai:assessResult");
    if (raw) {
      try {
        setResult(JSON.parse(raw));
      } catch {
        setResult(null);
      }
    }
  }, []);

  if (!result) {
    return (
      <div className="space-y-4">
        <PageHeader title="Assessment results" subtitle="No recent result found" />
        <Button asChild>
          <Link href={`/gps/assess/${params.skillId}`}>Retake assessment</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 fade-up">
      <PageHeader
        title="Assessment results"
        subtitle={`${result.skillName} · scored ${result.correct}/${result.total}`}
      />

      <Card className="border-brand-200 bg-brand-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-brand-800">
            <CheckCircle2 className="h-5 w-5" />
            You scored {result.correct}/{result.total}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-brand-900">
          New assessment evidence was written to your profile and the GPS route was
          recalculated.
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Before</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-700">
              {result.before.level}, {result.before.confidence} confidence
            </p>
            <ProficiencyLadder level={result.before.level} />
          </CardContent>
        </Card>
        <Card className="border-brand-200">
          <CardHeader>
            <CardTitle>After</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm font-medium text-brand-800">
              {result.after.level}, {result.after.confidence} confidence
            </p>
            <ProficiencyLadder level={result.after.level} />
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button asChild>
          <Link href="/gps">
            Back to GPS <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        <Button asChild variant="secondary">
          <Link href="/profile">View updated profile</Link>
        </Button>
      </div>
    </div>
  );
}
