"use strict";

const { execSync } = require("child_process");
const path = require("path");
const { Client } = require("pg");
const { BASE_URL } = require("../../../config/db");
const { seedPermissions } = require("../../../prisma/seeder/permission-seeder");
const { seedMessageTemplatesForTenant } = require("../../../prisma/seeder/message-template-seeder");
const { seedFormTemplatesForTenant } = require("../../../prisma/seeder/form-template-seeder");
const { seedAgreementTemplatesForTenant } = require("../../../prisma/seeder/agreement-template-seeder");
const { seedIncomeAccountsForTenant } = require("../../../prisma/seeder/income-account-seeder");
const { seedSerialNumbers } = require("../../../prisma/seeder/serial-number-seeder");

const MAIN_SCHEMA_PATH = path.join(
  __dirname,
  "../../../prisma/schema/main/schema.prisma"
);

const buildTenantDbUrl = (dbName) => `${BASE_URL}/${dbName}`;

const runPrismaDbPush = (tenantDbUrl) => {
  execSync(`npx prisma db push --schema="${MAIN_SCHEMA_PATH}" --accept-data-loss`, {
    env: {
      ...process.env,
      DATABASE_MAIN_URL: tenantDbUrl,
      DATABASE_URL: tenantDbUrl,
    },
    encoding: "utf8",
    maxBuffer: 10 * 1024 * 1024,
    stdio: ["pipe", "pipe", "pipe"],
  });
};

async function ensureTenantDatabaseExists(dbName) {
  const client = new Client({ connectionString: `${BASE_URL}/postgres` });
  try {
    await client.connect();
    const res = await client.query("SELECT 1 FROM pg_database WHERE datname = $1", [
      dbName,
    ]);
    if (res.rowCount === 0) {
      await client.query(`CREATE DATABASE "${dbName}"`);
      return { created: true };
    }
    return { created: false };
  } finally {
    await client.end();
  }
}

/**
 * Sync tenant PostgreSQL schema to prisma/schema/main (db push).
 */
async function applyTenantMigration(dbName) {
  if (!dbName || typeof dbName !== "string") {
    throw new Error("Owner database name is missing.");
  }

  const steps = [];
  const dbEnsure = await ensureTenantDatabaseExists(dbName);
  if (dbEnsure.created) {
    steps.push(`Created database "${dbName}".`);
  }

  const tenantDbUrl = buildTenantDbUrl(dbName);
  try {
    runPrismaDbPush(tenantDbUrl);
    steps.push("Applied schema sync (Prisma db push) for tenant database.");
  } catch (err) {
    const detail =
      (err.stderr && String(err.stderr).trim()) ||
      (err.stdout && String(err.stdout).trim()) ||
      err.message;
    throw new Error(`Schema sync failed: ${detail}`);
  }

  return {
    dbName,
    steps,
  };
}

/**
 * Run idempotent tenant seeders (permissions, templates, income accounts, serial numbers).
 */
async function applyTenantSeeds(dbName) {
  if (!dbName || typeof dbName !== "string") {
    throw new Error("Owner database name is missing.");
  }

  const tenantDbUrl = buildTenantDbUrl(dbName);
  const steps = [];
  const warnings = [];

  const runSeed = async (label, fn) => {
    try {
      const detail = await fn();
      steps.push({ label, ok: true, detail });
    } catch (err) {
      warnings.push({ label, error: err.message });
    }
  };

  await runSeed("Permissions catalog", async () => {
    const { count } = await seedPermissions(tenantDbUrl);
    return `${count} permission keys upserted`;
  });

  await runSeed("Message templates", async () => {
    await seedMessageTemplatesForTenant(tenantDbUrl);
    return "Templates ensured";
  });

  await runSeed("Form templates", async () => {
    await seedFormTemplatesForTenant(tenantDbUrl);
    return "Form templates ensured";
  });

  await runSeed("Agreement templates", async () => {
    await seedAgreementTemplatesForTenant(tenantDbUrl);
    return "Agreement templates ensured";
  });

  await runSeed("Income accounts", async () => {
    const firmCount = await seedIncomeAccountsForTenant(tenantDbUrl);
    return `Income accounts ensured for ${firmCount} firm(s)`;
  });

  await runSeed("Serial numbers", async () => {
    await seedSerialNumbers(tenantDbUrl);
    return "Serial number configs ensured";
  });

  return {
    dbName,
    steps,
    warnings,
    success: warnings.length === 0,
  };
}

module.exports = {
  buildTenantDbUrl,
  applyTenantMigration,
  applyTenantSeeds,
};
