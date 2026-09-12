"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";

type Connection = {
  id: string;
  name: string;
  role: string;
  company: string;
  school: string;
  pathSummary: string;
  suggestedObjective: string;
  draftMessage: string;
};

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function NetworkPage() {
  const qc = useQueryClient();
  const { data = [], isLoading } = useQuery({
    queryKey: ["network"],
    queryFn: async () => {
      const res = await fetch("/api/network");
      if (!res.ok) throw new Error("Failed");
      return (await res.json()) as Connection[];
    },
  });
  const [editing, setEditing] = useState<Record<string, string>>({});

  const draft = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/network/${id}/draft-message`, { method: "POST" });
      if (!res.ok) throw new Error("Failed");
      return res.json() as Promise<Connection>;
    },
    onSuccess: (conn) => {
      toast.success("Draft outreach ready — edit before sending.");
      setEditing((prev) => ({ ...prev, [conn.id]: conn.draftMessage }));
      qc.invalidateQueries({ queryKey: ["network"] });
    },
  });

  return (
    <div className="space-y-6 fade-up">
      <PageHeader
        title="Network"
        subtitle="CONNECT lane — people who can clarify the route"
      />

      {isLoading && <p className="text-sm text-gray-500">Loading connections…</p>}

      <div className="grid gap-4 md:grid-cols-2">
        {data.map((c) => (
          <Card key={c.id} className="hover:shadow-sm">
            <CardHeader>
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
                  {initials(c.name)}
                </div>
                <div>
                  <CardTitle>{c.name}</CardTitle>
                  <p className="text-sm text-gray-500">
                    {c.role} · {c.company}
                    {c.school ? ` · ${c.school}` : ""}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-600">{c.pathSummary}</p>
              <p className="text-sm">
                <span className="font-medium">Suggested objective:</span> {c.suggestedObjective}
              </p>
              <Button
                onClick={() => draft.mutate(c.id)}
                disabled={draft.isPending}
                variant="secondary"
              >
                Draft outreach message
              </Button>
              {(editing[c.id] || c.draftMessage) && (
                <textarea
                  className="min-h-36 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                  value={editing[c.id] ?? c.draftMessage}
                  onChange={(e) =>
                    setEditing((prev) => ({ ...prev, [c.id]: e.target.value }))
                  }
                />
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
