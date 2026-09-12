"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PartyPopper } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { PageHeader } from "@/components/ui/page-header";

type Career = {
  id: string;
  title: string;
  description: string;
  category: string;
  medianSalary: number;
  demandTrend: string;
  requiredSkills: string[];
  preferredSkills: string[];
  typicalEducation: string;
  typicalExperience: string;
  industries: string[];
  adjacentCareers: string[];
  sampleCompanies: string[];
};

export default function CareerDetailPage() {
  const params = useParams<{ careerId: string }>();
  const router = useRouter();
  const qc = useQueryClient();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const { data: career, isLoading } = useQuery({
    queryKey: ["career", params.careerId],
    queryFn: async () => {
      const res = await fetch(`/api/careers/${params.careerId}`);
      if (!res.ok) throw new Error("Not found");
      return (await res.json()) as Career;
    },
  });

  const setTarget = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/student/target-career", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ careerId: params.careerId }),
      });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: () => {
      setConfirmOpen(true);
      toast.success("Destination set. Gaps and GPS will refresh.");
      qc.invalidateQueries();
    },
  });

  if (isLoading || !career) {
    return <p className="text-sm text-gray-500">Loading career…</p>;
  }

  return (
    <div className="space-y-6 fade-up">
      <PageHeader
        title={career.title}
        subtitle={`${career.category} · median $${career.medianSalary.toLocaleString()} · demand ${career.demandTrend}`}
        actions={
          <Button onClick={() => setTarget.mutate()} disabled={setTarget.isPending}>
            {setTarget.isPending ? "Setting…" : "Set as my destination"}
          </Button>
        }
      />

      <p className="max-w-3xl text-sm text-gray-600">{career.description}</p>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Required skills</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {career.requiredSkills.map((s) => (
              <Badge key={s} className="border-brand-200 bg-brand-50 text-brand-700">
                {s}
              </Badge>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Preferred skills</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {career.preferredSkills.map((s) => (
              <Badge key={s}>{s}</Badge>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Education</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-600">{career.typicalEducation}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Experience</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-600">{career.typicalExperience}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Companies</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {career.sampleCompanies.map((c) => (
              <Badge key={c}>{c}</Badge>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Adjacent careers</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {career.adjacentCareers.map((title) => (
            <Badge key={title}>{title}</Badge>
          ))}
          <div className="mt-3 w-full">
            <Button asChild variant="outline" size="sm">
              <Link href="/explorer">Back to explorer</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        icon={<PartyPopper className="h-5 w-5" />}
        title="Great choice!"
        footer={
          <>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Stay here
            </Button>
            <Button
              onClick={() => {
                setConfirmOpen(false);
                router.push("/profile");
              }}
            >
              Go to profile
            </Button>
          </>
        }
      >
        <p>
          <span className="font-medium text-gray-900">{career.title}</span> is now your
          destination. We’ll compare your evidence-backed profile against this role and
          refresh your weekly GPS actions.
        </p>
      </Modal>
    </div>
  );
}
