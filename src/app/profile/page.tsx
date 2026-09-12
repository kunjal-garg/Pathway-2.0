"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { PageHeader } from "@/components/ui/page-header";
import { ProficiencyLadder } from "@/components/ui/proficiency-ladder";
import { cn } from "@/lib/utils";
import type { ProficiencyLevel } from "@/lib/types";

type ProfileResponse = {
  student: {
    name: string;
    targetCareer: { title: string } | null;
  };
  skills: Array<{
    skillId: string;
    skillName: string;
    category: string;
    level: ProficiencyLevel;
    confidence: string;
    evidence: Array<{
      id: string;
      sourceType: string;
      sourceLabel: string;
      strength: string;
    }>;
  }>;
  ladder: string[];
};

const tabs = ["Skills", "Experience", "Projects", "Summary"] as const;

export default function ProfilePage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await fetch("/api/student/profile");
      if (!res.ok) throw new Error("Failed");
      return (await res.json()) as ProfileResponse;
    },
  });

  const [tab, setTab] = useState<(typeof tabs)[number]>("Skills");
  const [modalOpen, setModalOpen] = useState(false);
  const [sourceLabel, setSourceLabel] = useState("");

  const addEvidence = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/student/evidence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceType: "project",
          sourceLabel,
          text: sourceLabel,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: (body) => {
      toast.success(body.message);
      setSourceLabel("");
      setModalOpen(false);
      sessionStorage.setItem("pathwayai:routeUpdated", "1");
      qc.invalidateQueries();
    },
  });

  if (isLoading || !data) {
    return <p className="text-sm text-gray-500">Loading profile…</p>;
  }

  return (
    <div className="space-y-6 fade-up">
      <PageHeader
        title="Career Profile"
        subtitle={`${data.student.name} · targeting ${data.student.targetCareer?.title || "unset"}`}
        actions={
          <Button onClick={() => setModalOpen(true)}>
            <Plus className="h-4 w-4" /> Add evidence
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Proficiency ladder</CardTitle>
        </CardHeader>
        <CardContent>
          <ProficiencyLadder level="Professional" showLabels />
          <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-gray-500">
            {data.ladder.map((level) => (
              <span key={level} className="rounded-full bg-gray-50 px-2 py-1">
                {level}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2 border-b border-gray-100 pb-2">
        {tabs.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm font-medium",
              tab === t
                ? "bg-brand-50 text-brand-700"
                : "text-gray-500 hover:bg-gray-50"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Skills" && (
        <Card>
          <CardContent className="overflow-x-auto pt-5">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-gray-200 text-gray-400">
                <tr>
                  <th className="py-2 pr-3 font-medium">Skill</th>
                  <th className="py-2 pr-3 font-medium">Proficiency</th>
                  <th className="py-2 pr-3 font-medium">Evidence</th>
                  <th className="py-2 font-medium">Confidence</th>
                </tr>
              </thead>
              <tbody>
                {data.skills.map((row) => (
                  <tr key={row.skillId} className="border-b border-gray-100 align-top">
                    <td className="py-3 pr-3">
                      <div className="font-medium text-gray-900">{row.skillName}</div>
                      <div className="text-xs capitalize text-gray-400">{row.category}</div>
                    </td>
                    <td className="py-3 pr-3">
                      <Badge className="mb-2 border-brand-200 bg-brand-50 text-brand-700">
                        {row.level}
                      </Badge>
                      <ProficiencyLadder level={row.level} showLabels={false} />
                    </td>
                    <td className="py-3 pr-3">
                      <ul className="space-y-1">
                        {row.evidence.map((e) => (
                          <li key={e.id} className="text-xs text-gray-600">
                            <span className="font-medium capitalize">{e.sourceType}</span>:{" "}
                            {e.sourceLabel}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="py-3">
                      <Badge
                        className={
                          row.confidence === "High"
                            ? "border-brand-200 bg-brand-50 text-brand-700"
                            : row.confidence === "Medium"
                              ? "border-amber-200 bg-amber-50 text-amber-800"
                              : "border-red-200 bg-red-50 text-red-700"
                        }
                      >
                        {row.confidence}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {tab === "Experience" && (
        <Card>
          <CardContent className="space-y-3 pt-5 text-sm text-gray-700">
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <div className="font-medium text-gray-900">Perception tooling internship</div>
              <p className="mt-1 text-gray-600">
                Supported Linux/Git workflows for a campus autonomy lab; contributed
                evaluation scripts and experiment logs.
              </p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <div className="font-medium text-gray-900">Campus robot vision club</div>
              <p className="mt-1 text-gray-600">
                Built and maintained a Python vision pipeline used in weekly demos.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {tab === "Projects" && (
        <Card>
          <CardContent className="space-y-3 pt-5 text-sm text-gray-700">
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <div className="font-medium text-gray-900">Lane detection weekend build</div>
              <p className="mt-1 text-gray-600">OpenCV classical pipeline with measurable precision notes.</p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <div className="font-medium text-gray-900">Fine-tuned ResNet classifier</div>
              <p className="mt-1 text-gray-600">PyTorch training run with experiment tracking and README.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {tab === "Summary" && (
        <Card>
          <CardContent className="space-y-3 pt-5 text-sm leading-relaxed text-gray-700">
            <p>
              Alex is building toward Computer Vision Engineer with strong Python and ML
              foundations, Applied PyTorch evidence, and emerging depth in geometry and
              systems languages.
            </p>
            <p>
              Highest-leverage moves this month: raise C++ and 3D Geometry confidence,
              complete one assessment, and convert Ready-tier opportunities into outreach.
            </p>
          </CardContent>
        </Card>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        icon={<Plus className="h-5 w-5" />}
        title="Add evidence"
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={!sourceLabel || addEvidence.isPending}
              onClick={() => addEvidence.mutate()}
            >
              {addEvidence.isPending ? "Saving…" : "Save evidence"}
            </Button>
          </>
        }
      >
        <p className="mb-3">
          Describe a project, course, or artifact. We’ll keyword-match skills and bump
          proficiency.
        </p>
        <input
          value={sourceLabel}
          onChange={(e) => setSourceLabel(e.target.value)}
          placeholder="e.g. Stereo depth notebook with OpenCV + C++"
          className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm"
        />
      </Modal>
    </div>
  );
}
