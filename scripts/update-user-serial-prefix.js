"use strict";

/**
 * One-shot migration script:
 * Updates the SerialNumber prefix for entity_type = 'USER'
 * from "USR-" to "CST-" across ALL existing tenant databases.
 *
 * Usage: node scripts/update-user-serial-prefix.js
 */

require("dotenv").config();
const { Client } = require("pg");
const { PrismaClient: MasterPrismaClient } = require("../prisma/generated/master");

const OLD_PREFIX = "USR-";
const NEW_PREFIX = "CST-";
const ENTITY_TYPE = "USER";

// Resolve base DB URL (same logic as db.js)
let rawDbUrl = "";
if (process.env.OFFLINE_DB === "true") {
  rawDbUrl = process.env.DB_URL || "";
} else {
  rawDbUrl = process.env.DATABASE_URL || process.env.DB_URL || "";
}

const getBaseUrl = (connectionString) => {
  try {
    const parsed = new URL(connectionString);
    parsed.pathname = "";
    parsed.search = "";
    parsed.hash = "";
    return parsed.toString().replace(/\/$/, "");
  } catch (e) {
    const match = connectionString.match(/^(postgresql:\/\/[^/]+)/);
    return match ? match[1] : connectionString.replace(/\/$/, "");
  }
};

const BASE_URL = getBaseUrl(rawDbUrl);

async function updatePrefixInDb(dbUrl) {
  const client = new Client({ connectionString: dbUrl });
  try {
    await client.connect();

    // Check if serial_numbers table exists
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_name = 'serial_numbers'
      ) AS exists
    `);

    if (!tableCheck.rows[0].exists) {
      console.log(`  ⚠️  Table 'serial_numbers' not found. Skipping.`);
      return false;
    }

    const result = await client.query(
      `UPDATE serial_numbers
       SET number_prefix = $1
       WHERE entity_type = $2 AND number_prefix = $3
       RETURNING entity_type, number_prefix`,
      [NEW_PREFIX, ENTITY_TYPE, OLD_PREFIX]
    );

    if (result.rowCount > 0) {
      console.log(`  ✅  Updated: ${OLD_PREFIX} → ${NEW_PREFIX} for entity_type='${ENTITY_TYPE}'`);
      return true;
    } else {
      console.log(`  ℹ️  No row found with prefix '${OLD_PREFIX}' for '${ENTITY_TYPE}'. Already updated or missing.`);
      return false;
    }
  } catch (err) {
    console.error(`  ❌  Error:`, err.message);
    return false;
  } finally {
    await client.end();
  }
}

async function main() {
  console.log("🔄  Starting serial number prefix update: USR- → CST-\n");

  // 1. Connect to master DB to get all tenant db names
  const masterUrl = `${BASE_URL}/${process.env.MASTER_DB_NAME || "master"}`;
  const masterPrisma = new MasterPrismaClient({
    datasources: { db: { url: masterUrl } },
  });

  let owners = [];
  try {
    owners = await masterPrisma.owner.findMany({
      select: { own_db: true, own_first_name: true, own_last_name: true },
    });
    console.log(`📋  Found ${owners.length} tenant database(s) in master.\n`);
  } catch (err) {
    console.error("❌  Failed to fetch owners from master DB:", err.message);
    process.exit(1);
  } finally {
    await masterPrisma.$disconnect();
  }

  let updated = 0;
  let skipped = 0;

  // 2. Loop through each tenant DB and update the prefix
  for (const owner of owners) {
    const tenantDbUrl = `${BASE_URL}/${owner.own_db}`;
    console.log(`🏢  Tenant: ${[owner.own_first_name, owner.own_last_name].filter(Boolean).join(" ") || owner.own_db}  (DB: ${owner.own_db})`);
    const wasUpdated = await updatePrefixInDb(tenantDbUrl);
    if (wasUpdated) updated++;
    else skipped++;
    console.log("");
  }

  console.log("─".repeat(50));
  console.log(`✅  Done. Updated: ${updated}  |  Skipped/Already done: ${skipped}`);
}

main().catch((err) => {
  console.error("❌  Fatal error:", err.message);
  process.exit(1);
});
