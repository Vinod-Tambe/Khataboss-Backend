-- CreateEnum
CREATE TYPE "AnnouncementStatus" AS ENUM ('Active', 'Inactive');

-- CreateTable
CREATE TABLE "Announcement" (
    "ann_id" SERIAL NOT NULL,
    "ann_uuid" TEXT NOT NULL,
    "ann_title" TEXT NOT NULL,
    "ann_body" TEXT NOT NULL,
    "ann_status" "AnnouncementStatus" NOT NULL DEFAULT 'Active',
    "ann_is_pinned" BOOLEAN NOT NULL DEFAULT false,
    "ann_sort_order" INTEGER NOT NULL DEFAULT 0,
    "ann_publish_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ann_expires_at" TIMESTAMP(3),
    "ann_created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ann_created_by" TEXT,
    "ann_updated_at" TIMESTAMP(3) NOT NULL,
    "ann_updated_by" TEXT,
    "ann_deleted_at" TIMESTAMP(3),
    "ann_deleted_by" TEXT,
    "ann_is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Announcement_pkey" PRIMARY KEY ("ann_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Announcement_ann_uuid_key" ON "Announcement"("ann_uuid");

-- CreateIndex
CREATE INDEX "Announcement_ann_status_idx" ON "Announcement"("ann_status");

-- CreateIndex
CREATE INDEX "Announcement_ann_publish_at_idx" ON "Announcement"("ann_publish_at");

-- CreateIndex
CREATE INDEX "Announcement_ann_sort_order_idx" ON "Announcement"("ann_sort_order");
