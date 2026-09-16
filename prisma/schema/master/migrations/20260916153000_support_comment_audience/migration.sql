-- CreateEnum
CREATE TYPE "SupportCommentAudience" AS ENUM ('Both', 'Admin');

-- AlterTable
ALTER TABLE "SupportTicketComment" ADD COLUMN "stc_audience" "SupportCommentAudience" NOT NULL DEFAULT 'Both';
