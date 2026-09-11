-- CreateEnum
CREATE TYPE "AnnouncementType" AS ENUM ('Notice', 'Alert', 'Warning', 'Celebration', 'Congratulation');

-- AlterTable
ALTER TABLE "Announcement" ADD COLUMN "ann_type" "AnnouncementType" NOT NULL DEFAULT 'Notice';

-- CreateIndex
CREATE INDEX "Announcement_ann_type_idx" ON "Announcement"("ann_type");
