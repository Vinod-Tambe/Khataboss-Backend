-- CreateEnum
CREATE TYPE "PlanStatus" AS ENUM ('Active', 'Inactive');

-- CreateEnum
CREATE TYPE "PlanBillingCycle" AS ENUM ('Monthly', 'Quarterly', 'Yearly', 'Lifetime');

-- AlterTable
ALTER TABLE "Owner" ADD COLUMN "own_plan_id" INTEGER;

-- CreateTable
CREATE TABLE "Plan" (
    "plan_id" SERIAL NOT NULL,
    "plan_uuid" TEXT NOT NULL,
    "plan_name" TEXT NOT NULL,
    "plan_code" TEXT NOT NULL,
    "plan_description" TEXT,
    "plan_price" DECIMAL(12,2) NOT NULL,
    "plan_offer_price" DECIMAL(12,2),
    "plan_currency" TEXT NOT NULL DEFAULT 'INR',
    "plan_billing_cycle" "PlanBillingCycle" NOT NULL DEFAULT 'Yearly',
    "plan_duration_days" INTEGER,
    "plan_max_firms" INTEGER NOT NULL DEFAULT 1,
    "plan_max_staff" INTEGER NOT NULL DEFAULT 10,
    "plan_modules" JSONB NOT NULL,
    "plan_features" JSONB,
    "plan_image" JSONB,
    "plan_is_popular" BOOLEAN NOT NULL DEFAULT false,
    "plan_sort_order" INTEGER NOT NULL DEFAULT 0,
    "plan_status" "PlanStatus" NOT NULL DEFAULT 'Active',
    "plan_created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "plan_created_by" TEXT,
    "plan_updated_at" TIMESTAMP(3) NOT NULL,
    "plan_deleted_at" TIMESTAMP(3),
    "plan_deleted_by" TEXT,
    "plan_is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("plan_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Plan_plan_uuid_key" ON "Plan"("plan_uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Plan_plan_code_key" ON "Plan"("plan_code");

-- CreateIndex
CREATE INDEX "Plan_plan_status_idx" ON "Plan"("plan_status");

-- CreateIndex
CREATE INDEX "Plan_plan_sort_order_idx" ON "Plan"("plan_sort_order");

-- CreateIndex
CREATE INDEX "Owner_own_plan_id_idx" ON "Owner"("own_plan_id");

-- AddForeignKey
ALTER TABLE "Owner" ADD CONSTRAINT "Owner_own_plan_id_fkey" FOREIGN KEY ("own_plan_id") REFERENCES "Plan"("plan_id") ON DELETE SET NULL ON UPDATE CASCADE;
