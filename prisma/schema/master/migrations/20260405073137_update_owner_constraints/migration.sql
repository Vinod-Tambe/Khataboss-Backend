-- CreateEnum
CREATE TYPE "OwnerStatus" AS ENUM ('Active', 'Inactive');

-- CreateTable
CREATE TABLE "Owner" (
    "own_id" SERIAL NOT NULL,
    "own_uuid" TEXT NOT NULL,
    "own_product_key" SERIAL NOT NULL,
    "own_db" TEXT NOT NULL,
    "own_add_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "own_first_name" TEXT NOT NULL,
    "own_middle_name" TEXT,
    "own_last_name" TEXT NOT NULL,
    "own_phone_no" TEXT,
    "own_mobile_no" TEXT NOT NULL,
    "own_email" TEXT NOT NULL,
    "own_login_id" TEXT NOT NULL,
    "own_password" TEXT NOT NULL,
    "own_status" "OwnerStatus" NOT NULL DEFAULT 'Active',
    "own_profile_img" JSONB,
    "own_refresh_token" TEXT,
    "own_refresh_expiry" TIMESTAMP(3),
    "own_jwt_token" TEXT,
    "own_jwt_expiry" TIMESTAMP(3),
    "own_login_status" BOOLEAN NOT NULL DEFAULT false,
    "own_last_login_system" JSONB,
    "own_otp" TEXT,
    "own_otp_expiry" TIMESTAMP(3),
    "own_address" TEXT,
    "own_village" TEXT,
    "own_city" TEXT,
    "own_state" TEXT,
    "own_pincode" TEXT,
    "own_created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "own_created_by" TEXT,
    "own_updated_at" TIMESTAMP(3) NOT NULL,
    "own_updated_by" TEXT,
    "own_deleted_at" TIMESTAMP(3),
    "own_deleted_by" TEXT,
    "own_is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Owner_pkey" PRIMARY KEY ("own_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Owner_own_uuid_key" ON "Owner"("own_uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Owner_own_product_key_key" ON "Owner"("own_product_key");

-- CreateIndex
CREATE UNIQUE INDEX "Owner_own_db_key" ON "Owner"("own_db");

-- CreateIndex
CREATE UNIQUE INDEX "Owner_own_mobile_no_key" ON "Owner"("own_mobile_no");

-- CreateIndex
CREATE UNIQUE INDEX "Owner_own_email_key" ON "Owner"("own_email");

-- CreateIndex
CREATE UNIQUE INDEX "Owner_own_login_id_key" ON "Owner"("own_login_id");

-- CreateIndex
CREATE INDEX "Owner_own_email_idx" ON "Owner"("own_email");

-- CreateIndex
CREATE INDEX "Owner_own_login_id_idx" ON "Owner"("own_login_id");
