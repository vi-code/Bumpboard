import { getOpenAI, OPENAI_MODEL } from "./openai";

export type Rank = "S" | "A" | "B" | "C" | "D";

export type NameEnrichment = {
  meaning: string;
  funFacts: string[];
  trendiness: number;
  rank: Rank;
};

const SYSTEM_PROMPT = `You are a baby name expert. For the given name, return strict JSON with EXACTLY these fields:

- "meaning": 1-2 sentences describing the origin and meaning
- "funFacts": array of EXACTLY 2 OR 3 short, interesting fun facts (each one sentence)
- "trendiness": integer 0-100 reflecting how trendy/popular the name is in 2025 (100 = extremely trendy right now, 0 = essentially unused)
- "rank": one of "S" / "A" / "B" / "C" / "D" using the BumpScore framework, weighing:
    - Pronounceability (25%) — how easy is it to say across English-speaking regions
    - Uniqueness (25%) — distinctive without being overly strange
    - Timelessness (20%) — will it age gracefully over decades
    - Cultural breadth (15%) — works across multiple cultures/languages
    - Aesthetic appeal (15%) — sounds and looks beautiful

  Tier definitions:
    "S" = Stellar (excellent across nearly every dimension)
    "A" = Awesome (strong on most, minor weakness)
    "B" = Bright (solid but with notable trade-offs)
    "C" = Cute (charming with multiple trade-offs)
    "D" = Distinctive (unusual, may face challenges)

Respond ONLY with the JSON object — no markdown, no commentary.`;

const VALID_RANKS: Rank[] = ["S", "A", "B", "C", "D"];

export async function enrichName(name: string): Promise<NameEnrichment> {
  const completion = await getOpenAI().chat.completions.create({
    model: OPENAI_MODEL,
    response_format: { type: "json_object" },
    temperature: 0.4,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: name },
    ],
  });

  const content = completion.choices[0]?.message?.content ?? "{}";
  const parsed = JSON.parse(content);

  const funFactsRaw = Array.isArray(parsed.funFacts) ? parsed.funFacts : [];
  const funFacts = funFactsRaw.slice(0, 3).map((f: unknown) => String(f)).filter(Boolean);

  const trendinessRaw = Number(parsed.trendiness);
  const trendiness = Number.isFinite(trendinessRaw)
    ? Math.max(0, Math.min(100, Math.round(trendinessRaw)))
    : 50;

  const rank: Rank = VALID_RANKS.includes(parsed.rank) ? parsed.rank : "C";

  return {
    meaning: typeof parsed.meaning === "string" && parsed.meaning ? parsed.meaning : "Meaning unavailable.",
    funFacts: funFacts.length >= 2 ? funFacts : [...funFacts, "A lovely name with a unique character."].slice(0, 2),
    trendiness,
    rank,
  };
}
