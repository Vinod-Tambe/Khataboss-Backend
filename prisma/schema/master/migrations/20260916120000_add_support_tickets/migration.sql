-- CreateEnum
CREATE TYPE "SupportTicketPriority" AS ENUM ('Low', 'Medium', 'High', 'Urgent');

-- CreateEnum
CREATE TYPE "SupportTicketOwnerStatus" AS ENUM ('Sent', 'Review', 'InDiscussion', 'Development', 'Testing', 'Done', 'Delivered');

-- CreateEnum
CREATE TYPE "SupportTicketAdminStatus" AS ENUM ('Backlog', 'Todo', 'InProgress', 'DoneOnLocal', 'ReadyForTesting', 'Done', 'Delivered', 'Cancelled');

-- CreateEnum
CREATE TYPE "SupportCommentAuthorRole" AS ENUM ('Owner', 'Admin');

-- CreateTable
CREATE TABLE "SupportTicket" (
    "st_id" SERIAL NOT NULL,
    "st_uuid" TEXT NOT NULL,
    "st_own_id" INTEGER NOT NULL,
    "st_title" TEXT NOT NULL,
    "st_body" TEXT NOT NULL,
    "st_priority" "SupportTicketPriority" NOT NULL DEFAULT 'Medium',
    "st_images" JSONB,
    "st_owner_status" "SupportTicketOwnerStatus" NOT NULL DEFAULT 'Sent',
    "st_admin_status" "SupportTicketAdminStatus" NOT NULL DEFAULT 'Todo',
    "st_expected_delivery_at" TIMESTAMP(3),
    "st_created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "st_created_by" TEXT,
    "st_updated_at" TIMESTAMP(3) NOT NULL,
    "st_updated_by" TEXT,
    "st_deleted_at" TIMESTAMP(3),
    "st_deleted_by" TEXT,
    "st_is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "SupportTicket_pkey" PRIMARY KEY ("st_id")
);

-- CreateTable
CREATE TABLE "SupportTicketComment" (
    "stc_id" SERIAL NOT NULL,
    "stc_uuid" TEXT NOT NULL,
    "st_st_id" INTEGER NOT NULL,
    "stc_author_role" "SupportCommentAuthorRole" NOT NULL,
    "stc_author_uuid" TEXT NOT NULL,
    "stc_author_name" TEXT NOT NULL,
    "stc_body" TEXT NOT NULL,
    "stc_created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "stc_updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SupportTicketComment_pkey" PRIMARY KEY ("stc_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SupportTicket_st_uuid_key" ON "SupportTicket"("st_uuid");

-- CreateIndex
CREATE INDEX "SupportTicket_st_own_id_idx" ON "SupportTicket"("st_own_id");

-- CreateIndex
CREATE INDEX "SupportTicket_st_owner_status_idx" ON "SupportTicket"("st_owner_status");

-- CreateIndex
CREATE INDEX "SupportTicket_st_admin_status_idx" ON "SupportTicket"("st_admin_status");

-- CreateIndex
CREATE INDEX "SupportTicket_st_created_at_idx" ON "SupportTicket"("st_created_at");

-- CreateIndex
CREATE UNIQUE INDEX "SupportTicketComment_stc_uuid_key" ON "SupportTicketComment"("stc_uuid");

-- CreateIndex
CREATE INDEX "SupportTicketComment_st_st_id_idx" ON "SupportTicketComment"("st_st_id");

-- CreateIndex
CREATE INDEX "SupportTicketComment_stc_created_at_idx" ON "SupportTicketComment"("stc_created_at");

-- AddForeignKey
ALTER TABLE "SupportTicket" ADD CONSTRAINT "SupportTicket_st_own_id_fkey" FOREIGN KEY ("st_own_id") REFERENCES "Owner"("own_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupportTicketComment" ADD CONSTRAINT "SupportTicketComment_st_st_id_fkey" FOREIGN KEY ("st_st_id") REFERENCES "SupportTicket"("st_id") ON DELETE CASCADE ON UPDATE CASCADE;
