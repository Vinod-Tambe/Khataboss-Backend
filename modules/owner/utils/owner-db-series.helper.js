"use strict";

const DEFAULT_SERIES_NAME = "kboss";

/**
 * Reserve the next tenant database name in master (DbSeries).
 * Does not create PostgreSQL — only updates master registry.
 */
async function allocateOwnerDbName(masterPrisma, seriesName = DEFAULT_SERIES_NAME) {
  const series = await masterPrisma.dbSeries.findUnique({
    where: { series_name: seriesName },
  });

  if (!series) {
    const error = new Error(`Series "${seriesName}" not found in master database.`);
    error.statusCode = 500;
    throw error;
  }

  const nextNumber = series.last_number + 1;
  const dbName = `${seriesName}${nextNumber}`;

  await masterPrisma.dbSeries.update({
    where: { series_name: seriesName },
    data: { last_number: nextNumber },
  });

  return dbName;
}

module.exports = {
  DEFAULT_SERIES_NAME,
  allocateOwnerDbName,
};
