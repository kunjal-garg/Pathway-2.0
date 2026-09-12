"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";

type Action = {
  id: string;
  type: string;
  title: string;
  why: string;
  status: string;
  weekOf: string;
  resourceLinks: string[];
  relatedSkillIds: string[];
};

function actionHref(action: Action) {
  if (action.type === "ASSESS" && action.relatedSkillIds?.[0]) {
    return `/gps/assess/${action.relatedSkillIds[0]}`;
  }
  const map: Record<string, string> = {
    LEARN: "/gps",
    BUILD: "/build",
    ASSESS: "/gps",
    INTERVIEW: "/interview",
    APPLY: "/opportunities",
    CONNECT: "/network",
    ATTEND: "/events",
  };
  return map[action.type] || "/gps";
}

export default function GpsPage() {
  const qc = useQueryClient();
  const [banner, setBanner] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("pathwayai:routeUpdated") === "1") {
      setBanner(true);
      sessionStorage.removeItem("pathwayai:routeUpdated");
    }
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ["gps"],
    queryFn: async () => {
      const res = await fetch("/api/gps/actions");
      if (!res.ok) throw new Error("Failed");
      return (await res.json()) as { actions: Action[] };
    },
  });

  const complete = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/gps/actions/${id}/complete`, { method: "POST" });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: (body) => {
      toast.success(body.message || "Recalculating…");
      setBanner(true);
      sessionStorage.setItem("pathwayai:routeUpdated", "1");
      qc.invalidateQueries();
    },
  });

  const recalculate = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/gps/recalculate", { method: "POST" });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: (body) => {
      toast.success(body.message);
      setBanner(true);
      qc.invalidateQueries({ queryKey: ["gps"] });
      qc.invalidateQueries({ queryKey: ["activity"] });
    },
  });

  if (isLoading || !data) {
    return <p className="text-sm text-gray-500">Loading GPS…</p>;
  }

  const weekly = data.actions.filter((a) => a.status !== "done");
  const done = data.actions.filter((a) => a.status === "done");

  return (
    <div className="space-y-6 fade-up">
      <PageHeader
        title="Career GPS"
        subtitle="This week’s highest-value next turns — not a giant static roadmap"
        actions={
          <Button
            variant="secondary"
            onClick={() => recalculate.mutate()}
            disabled={recalculate.isPending}
          >
            {recalculate.isPending ? "Recalculating…" : "Recalculate"}
          </Button>
        }
      />

      {banner ? (
        <div className="flex items-center gap-2 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-800">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          Your route has been updated based on new evidence.
          <button
            type="button"
            className="ml-auto text-xs font-medium text-brand-700 hover:underline"
            onClick={() => setBanner(false)}
          >
            Dismiss
          </button>
        </div>
      ) : null}

      <div className="grid gap-3">
        {weekly.map((action) => (
          <Card key={action.id} className="hover:shadow-sm">
            <CardHeader className="flex-row items-start justify-between gap-3 space-y-0">
              <div>
                <div className="mb-2 flex flex-wrap gap-2">
                  <Badge className="border-brand-200 bg-brand-50 text-brand-700">
                    {action.type}
                  </Badge>
                  <Badge>week of {action.weekOf}</Badge>
                </div>
                <CardTitle className="text-base">{action.title}</CardTitle>
                <p className="mt-2 text-sm text-gray-600">{action.why}</p>
              </div>
              <div className="flex shrink-0 flex-col gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href={actionHref(action)}>Open</Link>
                </Button>
                <Button
                  size="sm"
                  onClick={() => complete.mutate(action.id)}
                  disabled={complete.isPending}
                >
                  Mark done
                </Button>
              </div>
            </CardHeader>
            {action.resourceLinks?.length ? (
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {action.resourceLinks.map((link) => (
                    <Badge key={link} className="font-normal">
                      {link}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            ) : null}
          </Card>
        ))}
      </div>

      {done.length > 0 ? (
        <div>
          <h2 className="mb-3 text-sm font-semibold text-gray-900">Completed this week</h2>
          <div className="space-y-2">
            {done.map((action) => (
              <div
                key={action.id}
                className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-500 line-through"
              >
                {action.title}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
