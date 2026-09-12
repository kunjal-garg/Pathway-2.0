import type { GapRow } from "./engine";

type OutreachInput = {
  name: string;
  role: string;
  company: string;
  school: string;
  objective: string;
  studentName: string;
  targetCareer: string;
};

async function callLLM(prompt: string): Promise<string | null> {
  try {
    if (process.env.OPENAI_API_KEY) {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.4,
        }),
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.choices?.[0]?.message?.content?.trim() ?? null;
    }
    if (process.env.ANTHROPIC_API_KEY) {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": process.env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-3-5-haiku-latest",
          max_tokens: 400,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.content?.[0]?.text?.trim() ?? null;
    }
  } catch {
    return null;
  }
  return null;
}

export async function explainGap(gap: GapRow, careerTitle: string): Promise<string> {
  const llm = await callLLM(
    `In 2 sentences, why does closing the ${gap.skillName} gap matter for ${careerTitle}? Current ${gap.currentLevel}, required ${gap.requiredLevel}, importance ${gap.importance}%.`
  );
  if (llm) return llm;
  return `${gap.skillName} is a high-signal requirement for ${careerTitle} — about ${gap.importance}% of postings expect it at ${gap.requiredLevel} or better. Moving from ${gap.currentLevel} to ${gap.requiredLevel} unlocks more Ready-tier opportunities and makes interview screens less risky.`;
}

export async function generateWeeklyMissions(input: {
  careerTitle: string;
  topGaps: GapRow[];
}) {
  await callLLM(
    `Generate weekly career actions for ${input.careerTitle}. Gaps: ${input.topGaps
      .slice(0, 5)
      .map((g) => g.skillName)
      .join(", ")}.`
  );
  const gaps = input.topGaps.slice(0, 5);
  const g0 = gaps[0];
  const g1 = gaps[1] ?? gaps[0];
  const g2 = gaps[2] ?? gaps[0];
  return [
    {
      type: "LEARN",
      title: `Deepen ${g0?.skillName ?? "core skills"} with a focused module`,
      why: `${g0?.skillName ?? "This skill"} appears in ~${g0?.importance ?? 70}% of ${input.careerTitle} roles you're targeting.`,
      relatedSkillIds: g0 ? [g0.skillId] : [],
      resourceLinks: ["YouTube: Focused skill crash course", "Coursera: Applied module", "Docs: Official tutorial"],
    },
    {
      type: "BUILD",
      title: `Ship a small project using ${g1?.skillName ?? "target skills"}`,
      why: "Project evidence moves proficiency from Knowledge toward Applied with Medium+ confidence.",
      relatedSkillIds: g1 ? [g1.skillId] : [],
      resourceLinks: ["Repo starter: mini portfolio project"],
    },
    {
      type: "ASSESS",
      title: `Take a quick ${g2?.skillName ?? "skill"} check`,
      why: "Assessment evidence raises confidence without waiting for a long project cycle.",
      relatedSkillIds: g2 ? [g2.skillId] : [],
      resourceLinks: g2 ? [`/gps/assess/${g2.skillId}`] : ["/gps"],
    },
    {
      type: "INTERVIEW",
      title: "Run a mock technical screen",
      why: "Interview practice surfaces uncertain requirements before real recruiter screens.",
      relatedSkillIds: gaps.slice(0, 2).map((g) => g.skillId),
      resourceLinks: ["/interview"],
    },
    {
      type: "APPLY",
      title: "Apply to one Ready or Reasonable Stretch role",
      why: "Applying converts gap analysis into market signal and interview loops.",
      relatedSkillIds: [],
      resourceLinks: ["/opportunities"],
    },
    {
      type: "CONNECT",
      title: "Send one warm outreach note",
      why: "A targeted conversation often reveals which gaps hiring teams actually care about.",
      relatedSkillIds: [],
      resourceLinks: ["/network"],
    },
    {
      type: "ATTEND",
      title: "Show up at a relevant campus or industry event",
      why: "Events create follow-up actions and new evidence opportunities in one night.",
      relatedSkillIds: [],
      resourceLinks: ["/events"],
    },
  ];
}

export async function draftOutreachMessage(input: OutreachInput): Promise<string> {
  const llm = await callLLM(
    `Draft a short LinkedIn note from ${input.studentName} to ${input.name} (${input.role} at ${input.company}). Objective: ${input.objective}. Target career: ${input.targetCareer}.`
  );
  if (llm) return llm;
  return `Hi ${input.name.split(" ")[0]},\n\nI'm ${input.studentName}, exploring a path into ${input.targetCareer}. I noticed your work as ${input.role} at ${input.company}${input.school ? ` and your ${input.school} background` : ""}. ${input.objective}\n\nWould you be open to a 15-minute chat this or next week?\n\nThanks,\n${input.studentName}`;
}

export async function summarizeAssessment(input: {
  skillName: string;
  correct: number;
  total: number;
}): Promise<string> {
  const llm = await callLLM(
    `Summarize assessment result for ${input.skillName}: ${input.correct}/${input.total} in one sentence.`
  );
  if (llm) return llm;
  return `Scored ${input.correct}/${input.total} on ${input.skillName} — evidence logged and proficiency confidence updated.`;
}

export async function summarizeInterview(answers: string[]): Promise<string> {
  const llm = await callLLM(`Summarize this mock interview in 3 sentences: ${answers.join(" | ")}`);
  if (llm) return llm;
  return "Solid structure on problem framing and tradeoffs. Strengthen concrete examples that show Applied-level ownership. Next: rehearse a 90-second project walkthrough with metrics.";
}

