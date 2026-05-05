import { getOpenAI, OPENAI_MODEL } from "./openai";

export type ValidationResult = { valid: boolean; reason?: string };

const SYSTEM_PROMPT = `You are a strict gatekeeper that decides whether a string could plausibly be used as a real-world baby name.

REJECT (return valid: false):
- Profanity, slurs, or sexually explicit terms
- Gibberish or keyboard mashing (e.g. "asdfgh", "qwerty")
- Full sentences or phrases (e.g. "I love this", "my baby")
- Names of universally reviled historical figures (e.g. Hitler, Stalin)
- Names of consumer brands, fictional villains, or pop-culture jokes used mockingly
- Random words that aren't names (e.g. "Pizza", "Banana", "Computer")

ACCEPT (return valid: true):
- Real first names from any culture, era, or language
- Uncommon-but-legitimate names
- Creative or invented names that follow human-naming conventions (vowel/consonant patterns, plausible phonetics)

Respond with strict JSON only: { "valid": boolean, "reason": "short user-facing explanation if invalid (max 80 chars), omit otherwise" }`;

export async function validateName(name: string): Promise<ValidationResult> {
  const completion = await getOpenAI().chat.completions.create({
    model: OPENAI_MODEL,
    response_format: { type: "json_object" },
    temperature: 0,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: name },
    ],
  });

  const content = completion.choices[0]?.message?.content ?? "{}";
  const parsed = JSON.parse(content);
  return {
    valid: !!parsed.valid,
    reason: typeof parsed.reason === "string" ? parsed.reason : undefined,
  };
}
