-- CreateTable
CREATE TABLE "Admin" (
    "admin_id" SERIAL NOT NULL,
    "admin_uuid" TEXT NOT NULL,
    "admin_add_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "admin_first_name" TEXT NOT NULL,
    "admin_middle_name" TEXT,
    "admin_last_name" TEXT NOT NULL,
    "admin_phone_no" TEXT,
    "admin_mobile_no" TEXT,
    "admin_email" TEXT NOT NULL,
    "admin_login_id" TEXT NOT NULL,
    "admin_password" TEXT NOT NULL,
    "admin_refresh_token" TEXT,
    "admin_refresh_expiry" TIMESTAMP(3),
    "admin_jwt_token" TEXT,
    "admin_jwt_expiry" TIMESTAMP(3),
    "admin_login_status" BOOLEAN NOT NULL DEFAULT false,
    "admin_last_login_system" JSONB,
    "admin_otp" TEXT,
    "admin_otp_expiry" TIMESTAMP(3),
    "admin_address" TEXT,
    "admin_village" TEXT,
    "admin_city" TEXT,
    "admin_state" TEXT,
    "admin_pincode" TEXT,
    "admin_created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "admin_created_by" TEXT,
    "admin_updated_at" TIMESTAMP(3) NOT NULL,
    "admin_updated_by" TEXT,
    "admin_deleted_at" TIMESTAMP(3),
    "admin_deleted_by" TEXT,
    "admin_is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("admin_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_admin_uuid_key" ON "Admin"("admin_uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_admin_email_key" ON "Admin"("admin_email");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_admin_login_id_key" ON "Admin"("admin_login_id");

-- CreateIndex
CREATE INDEX "Admin_admin_email_idx" ON "Admin"("admin_email");

-- CreateIndex
CREATE INDEX "Admin_admin_login_id_idx" ON "Admin"("admin_login_id");
