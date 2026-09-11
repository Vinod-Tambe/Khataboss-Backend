-- AlterTable
ALTER TABLE "Owner" ADD COLUMN "own_max_firms" INTEGER;
ALTER TABLE "Owner" ADD COLUMN "own_max_staff" INTEGER;

-- CreateTable
CREATE TABLE "OwnerPermission" (
    "op_id" SERIAL NOT NULL,
    "op_own_id" INTEGER NOT NULL,
    "op_perm_key" TEXT NOT NULL,
    "op_granted" BOOLEAN NOT NULL DEFAULT true,
    "op_created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "op_updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OwnerPermission_pkey" PRIMARY KEY ("op_id")
);

-- CreateIndex
CREATE INDEX "OwnerPermission_op_own_id_idx" ON "OwnerPermission"("op_own_id");

-- CreateIndex
CREATE INDEX "OwnerPermission_op_perm_key_idx" ON "OwnerPermission"("op_perm_key");

-- CreateIndex
CREATE UNIQUE INDEX "OwnerPermission_op_own_id_op_perm_key_key" ON "OwnerPermission"("op_own_id", "op_perm_key");

-- AddForeignKey
ALTER TABLE "OwnerPermission" ADD CONSTRAINT "OwnerPermission_op_own_id_fkey" FOREIGN KEY ("op_own_id") REFERENCES "Owner"("own_id") ON DELETE CASCADE ON UPDATE CASCADE;
