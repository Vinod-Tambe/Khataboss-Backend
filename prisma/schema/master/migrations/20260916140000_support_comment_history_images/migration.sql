-- CreateEnum
CREATE TYPE "SupportTicketCommentKind" AS ENUM ('Message', 'History');

-- AlterTable
ALTER TABLE "SupportTicketComment" ADD COLUMN "stc_kind" "SupportTicketCommentKind" NOT NULL DEFAULT 'Message',
ADD COLUMN "stc_images" JSONB;
