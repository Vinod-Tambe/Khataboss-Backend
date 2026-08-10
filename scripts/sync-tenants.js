"use strict";

const { Client } = require("pg");
const { execSync } = require("child_process");
const path = require("path");
const { BASE_URL } = require("../config/db");
const { seedPermissions } = require("../prisma/seeder/permission-seeder");
const { seedMessageTemplatesForTenant } = require("../prisma/seeder/message-template-seeder");

const syncTenants = async () => {
  const masterDbUrl = `${BASE_URL}/master`;
  const client = new Client({ connectionString: masterDbUrl });

  try {
    console.log("🚀 Connecting to master database to find tenants...");
    await client.connect();

    // Fetch all tenant database names from the Owner table
    const res = await client.query('SELECT own_db FROM "Owner" WHERE own_db IS NOT NULL');
    const dbs = res.rows.map(row => row.own_db);

    if (dbs.length === 0) {
      console.log("⚠️ No tenant databases found.");
      return;
    }

    const schemaPath = path.join(__dirname, "../prisma/schema/main/schema.prisma");

    for (const dbName of dbs) {
      const tenantDbUrl = `${BASE_URL}/${dbName}`;
      console.log(`\n🔄 Syncing database schema for "${dbName}"...`);

      try {
        execSync(`npx prisma db push --schema="${schemaPath}" --accept-data-loss`, {
          env: {
            ...process.env,
            DATABASE_MAIN_URL: tenantDbUrl,
            DATABASE_URL: tenantDbUrl,
          },
          stdio: "inherit",
        });
        console.log(`✅  Database schema synced for "${dbName}".`);

        console.log(`🔐  Seeding permissions for "${dbName}"...`);
        await seedPermissions(tenantDbUrl);

        console.log(`📨  Seeding message templates for "${dbName}"...`);
        try {
          await seedMessageTemplatesForTenant(tenantDbUrl);
        } catch (seedErr) {
          console.warn(`⚠️  Message template seed skipped for "${dbName}": ${seedErr.message}`);
        }
      } catch (err) {
        console.error(`❌  Failed to sync "${dbName}":`, err.message);
      }
    }
    
    console.log("\n🌟 All tenant databases successfully synchronized!");
  } catch (error) {
    console.error("❌ Error syncing tenants:", error);
  } finally {
    await client.end();
  }
};

syncTenants();
