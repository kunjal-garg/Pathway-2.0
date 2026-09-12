"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  Map,
  Route,
  Gauge,
  Briefcase,
  Users,
  CalendarDays,
  Navigation,
  LayoutDashboard,
  HelpCircle,
  Settings,
  FileUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/dashboard", label: "My Journey", icon: LayoutDashboard },
  { href: "/explorer", label: "Career Explorer", icon: Compass },
  { href: "/onboarding/resume", label: "Resume", icon: FileUp },
  { href: "/profile", label: "Career Profile", icon: Map },
  { href: "/gaps", label: "Gap Analysis", icon: Gauge },
  { href: "/gps", label: "Career GPS", icon: Navigation },
  { href: "/opportunities", label: "Opportunities", icon: Briefcase },
  { href: "/network", label: "Network", icon: Users },
  { href: "/events", label: "Events", icon: CalendarDays },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-gray-200 bg-white">
      <Link href="/" className="flex items-center gap-3 px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white">
          <Route className="h-5 w-5" />
        </div>
        <div className="text-base font-semibold text-gray-900">PathwayAI</div>
      </Link>

      <nav className="flex-1 space-y-0.5 px-3 py-2">
        {nav.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-brand-50 text-brand-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-0.5 border-t border-gray-100 px-3 py-3">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
        >
          <HelpCircle className="h-4 w-4" />
          Help
        </button>
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
        >
          <Settings className="h-4 w-4" />
          Settings
        </button>
        <div className="mt-2 flex items-center gap-3 rounded-lg px-3 py-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700">
            AC
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-medium text-gray-900">Alex Chen</div>
            <div className="truncate text-xs text-gray-400">Student</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
