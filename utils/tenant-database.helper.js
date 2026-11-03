"use strict";

const { Client } = require("pg");
const { BASE_URL } = require("../config/db");
const { getTenantPrisma } = require("./tenantPrisma");

async function isPostgresDatabaseExisting(dbName) {
  if (!dbName) return false;
  const client = new Client({ connectionString: `${BASE_URL}/postgres` });
  try {
    await client.connect();
    const res = await client.query("SELECT 1 FROM pg_database WHERE datname = $1", [
      dbName,
    ]);
    return res.rowCount > 0;
  } catch {
    return false;
  } finally {
    await client.end().catch(() => {});
  }
}

/**
 * Tenant is ready when the PostgreSQL database exists and the owner row is present.
 */
async function isTenantOwnerRowReady(ownDb, ownUuid) {
  if (!ownDb || !ownUuid) return false;
  if (!(await isPostgresDatabaseExisting(ownDb))) return false;

  try {
    const tenantPrisma = getTenantPrisma(`${BASE_URL}/${ownDb}`);
    const row = await tenantPrisma.owner.findFirst({
      where: { own_uuid: ownUuid, own_is_deleted: false },
      select: { own_id: true },
    });
    return Boolean(row);
  } catch {
    return false;
  }
}

module.exports = {
  isPostgresDatabaseExisting,
  isTenantOwnerRowReady,
};
