import Link from "next/link";
import { ArrowRight, MapPin, Route, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-gray-50">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 py-16">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600 text-white">
            <Route className="h-6 w-6" />
          </div>
          <div className="text-2xl font-bold tracking-tight text-gray-900">PathwayAI</div>
        </div>

        <h1 className="max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-gray-900 md:text-5xl">
          The Career GPS for Students
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-gray-600 md:text-lg">
          Understand where you want to go, build an evidence-backed picture of where you
          are today, and get guided toward the highest-value next action — every week.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link href="/explorer">
              Explore careers <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="secondary" size="lg">
            <Link href="/dashboard">Open my journey</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/onboarding/resume">Upload a resume</Link>
          </Button>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {[
            {
              icon: MapPin,
              title: "Set a destination",
              body: "Pick a target career and see the skills that actually gate offers.",
            },
            {
              icon: Sparkles,
              title: "Evidence over self-report",
              body: "Every skill shows level, confidence, and a real evidence trail.",
            },
            {
              icon: Route,
              title: "Weekly next turns",
              body: "Mark one GPS action done and the route recalculates automatically.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-gray-200 bg-white p-5 fade-up"
            >
              <item.icon className="mb-3 h-5 w-5 text-brand-600" />
              <div className="font-semibold text-gray-900">{item.title}</div>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
