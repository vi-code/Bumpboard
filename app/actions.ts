"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { validateName } from "@/lib/nameValidation";
import { enrichName, type Rank } from "@/lib/nameEnrichment";

export async function suggestName(formData: FormData) {
  const raw = formData.get("name");
  if (typeof raw !== "string") return { error: "Name is required" };

  const name = raw.trim().replace(/\s+/g, " ");
  if (name.length === 0) return { error: "Name is required" };
  if (name.length > 50) return { error: "Name is too long" };
  if (!/^[a-zA-Z\s'-]+$/.test(name)) {
    return { error: "Name can only contain letters, spaces, hyphens, and apostrophes" };
  }

  const normalized = name
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");

  // Skip OpenAI validation if the name already exists in our DB — we already accepted it
  const existing = await prisma.babyName.findUnique({ where: { name: normalized } });

  if (!existing) {
    try {
      const result = await validateName(normalized);
      if (!result.valid) {
        return { error: result.reason || "That doesn't look like a baby name. Try another!" };
      }
    } catch (err) {
      console.error("Name validation failed:", err);
      return { error: "Could not validate name right now. Please try again." };
    }
  }

  try {
    await prisma.babyName.upsert({
      where: { name: normalized },
      update: { count: { increment: 1 } },
      create: { name: normalized },
    });
  } catch {
    return { error: "Could not save — please try again" };
  }

  revalidatePath("/");
  return { success: true };
}

export type NameDetails = {
  name: string;
  meaning: string;
  funFacts: string[];
  trendiness: number;
  rank: Rank;
};

export async function getNameDetails(
  name: string
): Promise<{ data?: NameDetails; error?: string }> {
  const record = await prisma.babyName.findUnique({ where: { name } });
  if (!record) return { error: "Name not found" };

  if (
    record.enrichedAt &&
    record.meaning &&
    record.funFacts &&
    typeof record.trendiness === "number" &&
    record.rank
  ) {
    return {
      data: {
        name: record.name,
        meaning: record.meaning,
        funFacts: record.funFacts as string[],
        trendiness: record.trendiness,
        rank: record.rank as Rank,
      },
    };
  }

  try {
    const enrichment = await enrichName(name);
    await prisma.babyName.update({
      where: { name },
      data: {
        meaning: enrichment.meaning,
        funFacts: enrichment.funFacts,
        trendiness: enrichment.trendiness,
        rank: enrichment.rank,
        enrichedAt: new Date(),
      },
    });
    return { data: { name, ...enrichment } };
  } catch (err) {
    console.error("Name enrichment failed:", err);
    return { error: "Could not load details. Please try again." };
  }
}

export async function getLeaderboard() {
  try {
    return await prisma.babyName.findMany({
      orderBy: { count: "desc" },
      take: 20,
    });
  } catch {
    return [];
  }
}
