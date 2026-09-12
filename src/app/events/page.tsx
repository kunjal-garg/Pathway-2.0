"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";

type EventItem = {
  id: string;
  title: string;
  type: string;
  date: string;
  location: string;
  relevanceReason: string;
  followUpActions: string[];
  attended: boolean;
};

export default function EventsPage() {
  const qc = useQueryClient();
  const { data = [], isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const res = await fetch("/api/events");
      if (!res.ok) throw new Error("Failed");
      return (await res.json()) as EventItem[];
    },
  });

  const attend = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/events/${id}/attend`, { method: "POST" });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: (body) => {
      toast.success(body.message);
      sessionStorage.setItem("pathwayai:routeUpdated", "1");
      qc.invalidateQueries({ queryKey: ["events"] });
      qc.invalidateQueries({ queryKey: ["gps"] });
      qc.invalidateQueries({ queryKey: ["activity"] });
    },
  });

  return (
    <div className="space-y-6 fade-up">
      <PageHeader
        title="Events"
        subtitle="ATTEND lane — show up, then convert the night into GPS follow-ups"
      />

      {isLoading && <p className="text-sm text-gray-500">Loading events…</p>}

      <div className="grid gap-4 md:grid-cols-2">
        {data.map((event) => (
          <Card key={event.id} className="hover:shadow-sm">
            <CardHeader className="flex-row items-start justify-between gap-3 space-y-0">
              <div>
                <div className="mb-2 flex gap-2">
                  <Badge className="border-brand-200 bg-brand-50 text-brand-700">
                    {event.date}
                  </Badge>
                  <Badge>{event.type}</Badge>
                </div>
                <CardTitle>{event.title}</CardTitle>
                <p className="mt-1 text-sm text-gray-500">{event.location}</p>
              </div>
              <Button
                onClick={() => attend.mutate(event.id)}
                disabled={event.attended || attend.isPending}
              >
                {event.attended ? "Attended" : "Mark attended"}
              </Button>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-gray-600">
              <p>{event.relevanceReason}</p>
              <ul className="list-disc pl-5 text-xs text-gray-500">
                {event.followUpActions.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
