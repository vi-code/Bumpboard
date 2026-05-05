"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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
