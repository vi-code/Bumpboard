-- CreateTable
CREATE TABLE "BabyName" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BabyName_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BabyName_name_key" ON "BabyName"("name");

-- CreateIndex
CREATE INDEX "BabyName_count_idx" ON "BabyName"("count" DESC);
