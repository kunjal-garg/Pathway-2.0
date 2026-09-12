export const PROFICIENCY_LEVELS = [
  "Unknown",
  "Exposure",
  "Knowledge",
  "Applied",
  "Proficient",
  "Professional",
] as const;

export type ProficiencyLevel = (typeof PROFICIENCY_LEVELS)[number];
export type Confidence = "Low" | "Medium" | "High";
export type EvidenceStrength = "low" | "medium" | "high";

export const LEVEL_RANK: Record<ProficiencyLevel, number> = {
  Unknown: 0,
  Exposure: 1,
  Knowledge: 2,
  Applied: 3,
  Proficient: 4,
  Professional: 5,
};

export function levelFromRank(rank: number): ProficiencyLevel {
  const clamped = Math.max(0, Math.min(5, Math.round(rank)));
  return PROFICIENCY_LEVELS[clamped];
}

export function strengthBoost(strength: EvidenceStrength): number {
  if (strength === "high") return 1.5;
  if (strength === "medium") return 1;
  return 0.5;
}
