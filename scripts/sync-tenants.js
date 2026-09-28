"use strict";

const { Client } = require("pg");
const { BASE_URL } = require("../config/db");
const {
  applyTenantMigration,
  applyTenantSeeds,
} = require("../modules/owner/services/tenant-db-maintenance.service");

const syncTenants = async () => {
  const masterDbUrl = `${BASE_URL}/master`;
  const client = new Client({ connectionString: masterDbUrl });

  try {
    console.log("🚀 Connecting to master database to find tenants...");
    await client.connect();

    const res = await client.query('SELECT own_db FROM "Owner" WHERE own_db IS NOT NULL');
    const dbs = res.rows.map((row) => row.own_db);

    if (dbs.length === 0) {
      console.log("⚠️ No tenant databases found.");
      return;
    }

    for (const dbName of dbs) {
      console.log(`\n🔄 Syncing "${dbName}"...`);
      try {
        await applyTenantMigration(dbName);
        console.log(`✅  Schema synced for "${dbName}".`);
        const seedResult = await applyTenantSeeds(dbName);
        if (seedResult.warnings?.length) {
          seedResult.warnings.forEach((w) =>
            console.warn(`  ⚠️  ${w.label}: ${w.error}`)
          );
        } else {
          console.log(`✅  Seeds applied for "${dbName}".`);
        }
      } catch (err) {
        console.error(`❌  Failed to sync "${dbName}":`, err.message);
      }
    }

    console.log("\n🌟 All tenant databases processed.");
  } catch (error) {
    console.error("❌ Error syncing tenants:", error);
  } finally {
    await client.end();
  }
};

syncTenants();
