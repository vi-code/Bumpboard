-- AlterTable
ALTER TABLE "BabyName" ADD COLUMN "meaning" TEXT;
ALTER TABLE "BabyName" ADD COLUMN "funFacts" JSONB;
ALTER TABLE "BabyName" ADD COLUMN "trendiness" INTEGER;
ALTER TABLE "BabyName" ADD COLUMN "rank" TEXT;
ALTER TABLE "BabyName" ADD COLUMN "enrichedAt" TIMESTAMP(3);
