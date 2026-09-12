"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

export default function LegacyAssessRedirectClient() {
  const router = useRouter();
  const params = useSearchParams();
  const skillName = params.get("skill") || "PyTorch";

  const { data } = useQuery({
    queryKey: ["skill-lookup", skillName],
    queryFn: async () => {
      const res = await fetch(`/api/assessments/${encodeURIComponent(skillName)}`);
      if (!res.ok) throw new Error("Failed");
      return res.json() as Promise<{ skill: { id: string } }>;
    },
  });

  useEffect(() => {
    if (data?.skill?.id) {
      router.replace(`/gps/assess/${data.skill.id}`);
    }
  }, [data, router]);

  return <p className="text-sm text-gray-500">Opening assessment…</p>;
}
