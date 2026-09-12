# PathwayAI 2.0 — Career GPS demo

Local, runnable Career GPS for students. Next.js 14 + TypeScript + Tailwind + Prisma/SQLite.

This is a **new** PathwayAI 2.0 project (not the older Pathway-AI repo). Visual language follows the v2 build prompt: light sidebar, brand-green accents, Inter, card/modals/toasts matching the HTML demo patterns.

## Run locally

```bash
cp .env.example .env
npm install
npx prisma db push
npm run seed
npm run dev
```

Open [http://127.0.0.1:4327](http://127.0.0.1:4327).

No API keys required. Optional `OPENAI_API_KEY` / `ANTHROPIC_API_KEY` in `.env.local` enable live AI helpers; otherwise deterministic templates are used.

## What’s included

- Landing, Explorer (+ destination modal), Resume onboarding, Profile (tabs + evidence modal), Gaps (filter chips), GPS (mark done + recalculate banner), Assessment quiz + results, Dashboard (progress ring + activity), Opportunities, Network, Events
- Seeded demo student **Alex Chen** → **Computer Vision Engineer**
- Visual reference reconstruction: `reference/pathwayai-demo.html`

## Stack

- Next.js 14 App Router
- Prisma + SQLite (`DATABASE_URL` in `.env.example`)
- Tailwind `brand` green scale from the v2 prompt
- lucide-react, TanStack Query, sonner toasts
