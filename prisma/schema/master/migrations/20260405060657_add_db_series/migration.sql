-- CreateTable
CREATE TABLE "DbSeries" (
    "id" SERIAL NOT NULL,
    "series_name" TEXT NOT NULL,
    "last_number" INTEGER NOT NULL DEFAULT 1110,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DbSeries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DbSeries_series_name_key" ON "DbSeries"("series_name");
