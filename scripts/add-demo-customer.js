"use strict";

/**
 * Insert one full demo customer into tenant DB(s).
 *
 * Usage:
 *   node scripts/add-demo-customer.js              # all tenants from master
 *   node scripts/add-demo-customer.js my_tenant_db   # single tenant DB name
 */

require("../config/db");
const { Client } = require("pg");
const { BASE_URL } = require("../config/db");
const { buildTenantDbUrl } = require("../modules/owner/services/tenant-db-maintenance.service");
const { seedDemoCustomerForTenant } = require("../prisma/seeder/demo-customer-seeder");

async function listTenantDbNames() {
  const client = new Client({ connectionString: `${BASE_URL}/master` });
  await client.connect();
  try {
    const res = await client.query(
      'SELECT own_db FROM "Owner" WHERE own_db IS NOT NULL ORDER BY own_id ASC'
    );
    return res.rows.map((row) => row.own_db).filter(Boolean);
  } finally {
    await client.end();
  }
}

async function runForTenant(dbName) {
  const dbUrl = buildTenantDbUrl(dbName);
  console.log(`\n→ Tenant: ${dbName}`);
  const result = await seedDemoCustomerForTenant(dbUrl);
  if (result.action === "created") {
    console.log(
      `  ✅ Created ${result.customer_name} (${result.user_unique_code}) — firm: ${result.firm_name}`
    );
  } else {
    console.log(`  ⏭️  ${result.reason || "No change"}${result.user_unique_code ? ` (${result.user_unique_code})` : ""}`);
  }
  return result;
}

async function main() {
  const arg = process.argv[2];
  const targets = arg ? [arg] : await listTenantDbNames();

  if (!targets.length) {
    console.error("No tenant databases found. Pass DB name: node scripts/add-demo-customer.js <own_db>");
    process.exit(1);
  }

  console.log(`Adding demo customer to ${targets.length} tenant(s)...`);

  let created = 0;
  let skipped = 0;
  for (const dbName of targets) {
    try {
      const result = await runForTenant(dbName);
      if (result.action === "created") created += 1;
      else skipped += 1;
    } catch (err) {
      console.error(`  ❌ Failed for "${dbName}":`, err.message);
      process.exitCode = 1;
    }
  }

  console.log(`\nDone. Created: ${created}, skipped/unchanged: ${skipped}.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
