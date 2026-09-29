-- AlterTable
ALTER TABLE "Announcement" ADD COLUMN "ann_template_key" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Announcement_ann_template_key_key" ON "Announcement"("ann_template_key");
