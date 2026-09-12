"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/ui/page-header";
import { ProgressRing } from "@/components/ui/progress-ring";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type ActivityResponse = {
  entries: Array<{ id: string; text: string; createdAt: string }>;
  progress: { completedActions: number; totalActions: number; percent: number };
};

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["activity"],
    queryFn: async () => {
      const res = await fetch("/api/activity");
      if (!res.ok) throw new Error("Failed");
      return (await res.json()) as ActivityResponse;
    },
  });

  if (isLoading || !data) {
    return <p className="text-sm text-gray-500">Loading journey…</p>;
  }

  return (
    <div className="space-y-6 fade-up">
      <PageHeader
        title="My Journey"
        subtitle="Progress this week and recent activity across your Career GPS"
        actions={
          <Button asChild>
            <Link href="/gps">Open Career GPS</Link>
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-[220px_1fr]">
        <Card className="flex flex-col items-center justify-center p-6">
          <ProgressRing percent={data.progress.percent} label="actions done" />
          <p className="mt-3 text-center text-xs text-gray-500">
            {data.progress.completedActions} of {data.progress.totalActions} actions
            completed
          </p>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.entries.length === 0 ? (
              <p className="text-sm text-gray-500">
                No activity yet — complete a GPS action or add evidence to start the feed.
              </p>
            ) : (
              data.entries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-start justify-between gap-3 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2.5"
                >
                  <p className="text-sm text-gray-800">{entry.text}</p>
                  <span className="shrink-0 text-[11px] text-gray-400">
                    {new Date(entry.createdAt).toLocaleString()}
                  </span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
