-- CreateEnum
CREATE TYPE "OwnerLoginType" AS ENUM ('Online', 'Offline');

-- AlterTable
ALTER TABLE "Owner" ADD COLUMN IF NOT EXISTS "own_login_type" "OwnerLoginType" NOT NULL DEFAULT 'Online';
