import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not allowed in production" }, { status: 403 });
  }

  await prisma.babyName.deleteMany();
  await prisma.babyName.createMany({
    data: [
      { name: "Luna", count: 5 },
      { name: "Oliver", count: 4 },
      { name: "Aurora", count: 3 },
      { name: "Milo", count: 2 },
      { name: "Aria", count: 1 },
    ],
  });

  return NextResponse.json({ message: "Seeded!" });
}
