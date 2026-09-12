"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const prompts = [
  "Walk me through a computer vision project you owned end-to-end. What failed first?",
  "How would you debug a detector that works in daylight but collapses at dusk?",
  "Explain a tradeoff you made between model accuracy and latency.",
];

export default function InterviewPage() {
  const qc = useQueryClient();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>(["", "", ""]);
  const [summary, setSummary] = useState<string | null>(null);

  const submit = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: (body) => {
      setSummary(body.summary);
      toast.success(body.message);
      qc.invalidateQueries();
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-slate-900">INTERVIEW</h1>
        <p className="mt-1 text-slate-600">
          Mock AI screen — practice, get a summary, log it as evidence.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Prompt {step + 1} of {prompts.length}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="rounded-lg bg-slate-900 px-4 py-3 text-sm text-slate-100">
            {prompts[step]}
          </p>
          <textarea
            className="min-h-32 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
            value={answers[step]}
            onChange={(e) => {
              const next = [...answers];
              next[step] = e.target.value;
              setAnswers(next);
            }}
            placeholder="Type your answer…"
          />
          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={step === 0}
              onClick={() => setStep((s) => Math.max(0, s - 1))}
            >
              Back
            </Button>
            {step < prompts.length - 1 ? (
              <Button onClick={() => setStep((s) => s + 1)}>Next prompt</Button>
            ) : (
              <Button
                onClick={() => submit.mutate()}
                disabled={answers.some((a) => !a.trim()) || submit.isPending}
              >
                {submit.isPending ? "Scoring…" : "Finish & log evidence"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {summary && (
        <Card>
          <CardHeader>
            <CardTitle>Performance summary</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-700">{summary}</CardContent>
        </Card>
      )}
    </div>
  );
}
