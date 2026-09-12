"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function BuildPage() {
  const qc = useQueryClient();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState("OpenCV, 3D Geometry, Python");

  const save = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/student/evidence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceType: "project",
          sourceLabel: title,
          text: `${description} ${skills}`,
          strength: "high",
          skillNames: skills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
        }),
      });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: (body) => {
      toast.success(body.message);
      setTitle("");
      setDescription("");
      qc.invalidateQueries();
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-slate-900">BUILD</h1>
        <p className="mt-1 text-slate-600">
          Log a project — the fastest way to move Knowledge → Applied.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project evidence</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <input
            className="h-10 w-full rounded-md border border-slate-200 px-3 text-sm"
            placeholder="Project title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="min-h-28 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
            placeholder="What you built, tradeoffs, results…"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            className="h-10 w-full rounded-md border border-slate-200 px-3 text-sm"
            placeholder="Skills used (comma-separated)"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
          />
          <Button
            onClick={() => save.mutate()}
            disabled={!title || save.isPending}
          >
            {save.isPending ? "Saving & recalculating…" : "Log project"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
