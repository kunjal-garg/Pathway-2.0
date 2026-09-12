"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { FileUp, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SAMPLE_RESUME = `
Alex Chen
Computer Vision · Python · PyTorch · OpenCV · Machine Learning
Projects: Campus robot vision club pipeline, Fine-tuned ResNet classifier
Experience: Perception tooling internship with Linux and Git
Coursework: CS231n Computer Vision, Camera models / 3D Geometry
`.trim();

export default function ResumeOnboardingPage() {
  const router = useRouter();
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const submit = useMutation({
    mutationFn: async (payload: { sourceLabel: string; text: string }) => {
      const res = await fetch("/api/student/evidence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceType: "resume",
          sourceLabel: payload.sourceLabel,
          text: payload.text,
          strength: "medium",
        }),
      });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Skills extracted from resume and added to your profile.");
      router.push("/profile");
    },
    onError: () => toast.error("Could not process resume."),
  });

  return (
    <div className="space-y-6 fade-up">
      <PageHeader
        title="Resume upload"
        subtitle="Kickstart your evidence-backed Career Profile from a resume"
      />

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>Upload resume</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              className={`flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition-colors ${
                dragging
                  ? "border-brand-500 bg-brand-50"
                  : "border-gray-200 bg-gray-50 hover:border-brand-300"
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                const file = e.dataTransfer.files?.[0];
                if (file) setFileName(file.name);
              }}
              onClick={() => {
                const input = document.createElement("input");
                input.type = "file";
                input.accept = ".pdf,.doc,.docx,.txt";
                input.onchange = () => {
                  const file = input.files?.[0];
                  if (file) setFileName(file.name);
                };
                input.click();
              }}
            >
              <FileUp className="mb-3 h-8 w-8 text-brand-600" />
              <p className="text-sm font-medium text-gray-900">
                {fileName || "Drag and drop your resume here"}
              </p>
              <p className="mt-1 text-xs text-gray-400">PDF, DOC, or TXT · demo parses locally</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                disabled={submit.isPending || !fileName}
                onClick={() =>
                  submit.mutate({
                    sourceLabel: `Resume upload: ${fileName}`,
                    text: `${fileName} ${SAMPLE_RESUME}`,
                  })
                }
              >
                {submit.isPending ? "Extracting…" : "Extract skills"}
              </Button>
              <Button
                variant="secondary"
                disabled={submit.isPending}
                onClick={() =>
                  submit.mutate({
                    sourceLabel: "Sample resume — Alex Chen",
                    text: SAMPLE_RESUME,
                  })
                }
              >
                Use a sample resume
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-brand-50/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-brand-700" />
              Your data is secure
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-600" />
                Only used to create your PathwayAI profile
              </li>
              <li className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-600" />
                Not shared with third parties
              </li>
              <li className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-600" />
                You can delete your data anytime
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
