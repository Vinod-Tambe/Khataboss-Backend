-- AlterTable
ALTER TABLE "Owner" ADD COLUMN IF NOT EXISTS "own_idle_timeout_min" INTEGER NOT NULL DEFAULT 2;
