import { cn } from "@/lib/utils";
import { PROFICIENCY_LEVELS, LEVEL_RANK, type ProficiencyLevel } from "@/lib/types";

const SEGMENT_COLORS = [
  "bg-gray-200",
  "bg-brand-100",
  "bg-brand-200",
  "bg-brand-300",
  "bg-brand-500",
  "bg-brand-700",
];

export function ProficiencyLadder({
  level,
  showLabels = true,
  className,
}: {
  level?: ProficiencyLevel;
  showLabels?: boolean;
  className?: string;
}) {
  const active = level ? LEVEL_RANK[level] : -1;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex gap-1">
        {PROFICIENCY_LEVELS.map((name, idx) => (
          <div
            key={name}
            title={name}
            className={cn(
              "h-2.5 flex-1 rounded-sm",
              idx <= active ? SEGMENT_COLORS[idx] : "bg-gray-100"
            )}
          />
        ))}
      </div>
      {showLabels ? (
        <div className="flex justify-between text-[10px] text-gray-400">
          <span>Unknown</span>
          <span>Professional</span>
        </div>
      ) : null}
    </div>
  );
}
