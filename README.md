# Bumpboard

A cute baby name suggestion app with a live leaderboard. Suggest a name, vote it up, and tap any name to see its meaning, fun facts, trendiness, and rank — powered by AI.

Built with Next.js 16, Prisma, Vercel Postgres (Neon), Tailwind CSS, and the OpenAI API.

## Setup

1. Install dependencies: `npm install`
2. Copy `.env.example` → `.env` and fill in:
   - `DATABASE_URL` — Neon Postgres connection string (from Vercel Storage tab)
   - `OPENAI_API_KEY` — your OpenAI API key
3. Apply migrations: `npx prisma migrate deploy`
4. Run: `npm run dev`

## Features

- **Suggest names** — duplicates increment a vote counter
- **Live leaderboard** — top 20 names, ranked by votes
- **AI gatekeeper** — rejects gibberish, profanity, sentences, and other non-names before saving
- **Name details** — tap any leaderboard entry to see meaning, fun facts, trendiness, and rank. Results are cached in the database after the first lookup so we never call the AI twice for the same name

## BumpScore — how the rank is calculated

Each name receives a tier (`S` / `A` / `B` / `C` / `D`) based on a weighted assessment across five dimensions:

| Dimension          | Weight | What it measures                                        |
| ------------------ | -----: | ------------------------------------------------------- |
| Pronounceability   |   25 % | How easily English speakers can say the name correctly  |
| Uniqueness         |   25 % | Distinctiveness without being too odd or too common     |
| Timelessness       |   20 % | Whether the name will age gracefully over decades       |
| Cultural breadth   |   15 % | Whether it works across multiple cultures and languages |
| Aesthetic appeal   |   15 % | How beautiful it sounds and looks                       |

The composite score maps to a tier:

- **S — Stellar** — excellent across nearly every dimension
- **A — Awesome** — strong on most, with at most a minor weakness
- **B — Bright** — solid choice with notable trade-offs
- **C — Cute** — charming but with multiple trade-offs
- **D — Distinctive** — unusual; may face challenges (mispronunciation, dated feel, etc.)

The model returns the tier directly so the user-facing definitions stay consistent with the criteria above.

**Trendiness** is a separate 0–100 metric reflecting how popular the name feels in 2025. A name can be highly trendy but mid-tier on BumpScore (e.g. very popular but lacking timelessness), or low-trendy but high-tier (e.g. a classic that's currently out of fashion).

## OpenAI usage

- Model: `gpt-4.1-nano` (cheapest GPT-4 family model — $0.10 / $0.40 per 1M input/output tokens)
- Two distinct calls:
  1. **Validation** — runs once per *new* name suggestion. Returns `{ valid: boolean, reason? }`. If invalid, the suggestion is rejected with a friendly message
  2. **Enrichment** — runs once per name (lazy, on first detail view). Returns meaning, fun facts, trendiness, rank. Cached on the `BabyName` row so subsequent views are free
- Both use JSON mode (`response_format: { type: "json_object" }`) for reliable structured output

## Project structure

```
app/
  actions.ts             ← server actions: suggestName, getNameDetails, getLeaderboard
  components/
    NameForm.tsx         ← suggestion input
    Leaderboard.tsx      ← server component, reads from DB
    LeaderboardItem.tsx  ← client; click → opens modal
    NameModal.tsx        ← client; fetches details, displays meaning/facts/rank
lib/
  prisma.ts              ← Prisma + Neon adapter singleton
  openai.ts              ← OpenAI client singleton
  nameValidation.ts      ← OpenAI gatekeeper for new suggestions
  nameEnrichment.ts      ← OpenAI lookup for meaning + facts + trendiness + rank
prisma/
  schema.prisma
  migrations/
```

## Deploying to Vercel

1. Push to GitHub
2. Import the repo on Vercel
3. Add a Neon Postgres database via Storage → it sets `DATABASE_URL` automatically
4. Add `OPENAI_API_KEY` as an environment variable
5. Deploy

The `build` script runs `prisma migrate deploy` automatically, so schema changes ship with each deploy.
