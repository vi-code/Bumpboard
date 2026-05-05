import OpenAI from "openai";

const globalForOpenAI = globalThis as unknown as { openai: OpenAI | undefined };

export function getOpenAI(): OpenAI {
  if (!globalForOpenAI.openai) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY is not set");
    }
    globalForOpenAI.openai = new OpenAI({ apiKey });
  }
  return globalForOpenAI.openai;
}

export const OPENAI_MODEL = "gpt-4.1-nano";
