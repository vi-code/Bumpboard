import { PrismaClient } from "../generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

function getConnectionString(): string {
  const url =
    process.env.DATABASE_URL ??
    process.env.POSTGRES_PRISMA_URL ??
    process.env.POSTGRES_URL;
  if (!url) throw new Error("DATABASE_URL (or POSTGRES_PRISMA_URL / POSTGRES_URL) is not set");
  return url;
}

function createPrismaClient() {
  const adapter = new PrismaNeon({ connectionString: getConnectionString() });
  return new PrismaClient({ adapter });
}

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
