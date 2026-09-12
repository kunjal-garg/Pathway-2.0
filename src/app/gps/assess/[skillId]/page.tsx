"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Assessment = {
  skill: { id: string; name: string };
  questions: Array<{
    id: string;
    prompt: string;
    options: Array<{ id: string; label: string }>;
    correctOptionId: string;
  }>;
};

export default function AssessQuizPage() {
  const params = useParams<{ skillId: string }>();
  const skillId = params.skillId;
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const { data, isLoading, error } = useQuery({
    queryKey: ["assessment", skillId],
    queryFn: async () => {
      const res = await fetch(`/api/assessments/${skillId}`);
      if (!res.ok) throw new Error("Failed");
      return (await res.json()) as Assessment;
    },
  });

  const progress = useMemo(() => {
    if (!data?.questions.length) return 0;
    return Math.round(((index + 1) / data.questions.length) * 100);
  }, [data, index]);

  const submit = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/assessments/${skillId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: (body) => {
      toast.success(body.message);
      sessionStorage.setItem("pathwayai:routeUpdated", "1");
      sessionStorage.setItem("pathwayai:assessResult", JSON.stringify(body));
      router.push(`/gps/assess/${skillId}/results`);
    },
  });

  if (isLoading) return <p className="text-sm text-gray-500">Loading assessment…</p>;
  if (error || !data) {
    return <p className="text-sm text-red-600">Could not load assessment for this skill.</p>;
  }

  const question = data.questions[index];
  const answered = Boolean(answers[question?.id]);

  return (
    <div className="space-y-6 fade-up">
      <PageHeader
        title={`Take assessment · ${data.skill.name}`}
        subtitle="Answer a few questions to raise proficiency confidence with real signal"
      />

      <div className="h-2 overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-brand-600 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-xs text-gray-400">
        Question {index + 1} of {data.questions.length}
      </p>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{question.prompt}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {question.options.map((opt) => {
            const selected = answers[question.id] === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() =>
                  setAnswers((prev) => ({ ...prev, [question.id]: opt.id }))
                }
                className={`w-full rounded-lg border px-4 py-3 text-left text-sm transition-colors ${
                  selected
                    ? "border-brand-300 bg-brand-50 text-brand-800"
                    : "border-gray-200 bg-white hover:bg-gray-50"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button
          variant="outline"
          disabled={index === 0}
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
        >
          Previous
        </Button>
        {index < data.questions.length - 1 ? (
          <Button disabled={!answered} onClick={() => setIndex((i) => i + 1)}>
            Next
          </Button>
        ) : (
          <Button
            disabled={Object.keys(answers).length < data.questions.length || submit.isPending}
            onClick={() => submit.mutate()}
          >
            {submit.isPending ? "Submitting…" : "Submit assessment"}
          </Button>
        )}
      </div>
    </div>
  );
}
