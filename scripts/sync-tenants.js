"use strict";

require("../config/db");
const { getMasterPrisma } = require("../utils/masterPrisma");
const {
  fetchOnlineTenantOwnersFromMaster,
} = require("../modules/owner/utils/owner-login-type.helper");
const {
  applyTenantMigration,
  applyTenantSeeds,
} = require("../modules/owner/services/tenant-db-maintenance.service");

const syncTenants = async () => {
  const masterPrisma = getMasterPrisma();

  try {
    console.log("🚀 Loading online tenant databases from master (skipping offline owners)...");
    const tenants = await fetchOnlineTenantOwnersFromMaster(masterPrisma);

    if (tenants.length === 0) {
      console.log("⚠️  No online tenant databases to sync.");
      return;
    }

    console.log(`📋  Syncing ${tenants.length} online tenant(s).`);

    for (const { own_db: dbName, own_login_id: loginId } of tenants) {
      console.log(`\n🔄 Syncing "${dbName}" (${loginId})…`);
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

    console.log("\n🌟 Online tenant databases processed.");
  } catch (error) {
    console.error("❌ Error syncing tenants:", error);
    process.exitCode = 1;
  }
};

syncTenants();
