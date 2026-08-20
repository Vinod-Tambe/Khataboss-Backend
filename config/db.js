"use strict";

const fs = require("fs");
const path = require("path");
const { Client } = require("pg");
const { execSync } = require("child_process");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

// ─── Resolve Database URL based on Environment ────────────────────────────────
const TARGET_DB = process.env.MASTER_DB_NAME || "master";

let rawDbUrl = "";
let dbMode = "";

if (process.env.ONLINE_DB === "true") {
  rawDbUrl = process.env.DATABASE_URL || "";
  dbMode = "ONLINE (DATABASE_URL)";
} else if (process.env.OFFLINE_DB === "true") {
  rawDbUrl = process.env.DB_URL || "";
  dbMode = "OFFLINE (DB_URL)";
} else {
  // Default fallback if neither is explicitly true
  rawDbUrl = process.env.DB_URL || process.env.DATABASE_URL || "";
  dbMode = process.env.DB_URL ? "Fallback (DB_URL)" : "Fallback (DATABASE_URL)";
}

// Mask connection string passwords for secure logging
const maskConnectionString = (str) => {
  if (!str) return "";
  try {
    const parsed = new URL(str);
    if (parsed.password) {
      parsed.password = "********";
    }
    return parsed.toString();
  } catch (e) {
    return str.replace(/(postgresql:\/\/.*?):(.*?)@/, "$1:********@");
  }
};

console.log(`🔌 Database Mode selected: ${dbMode}`);
console.log(`🔗 Target Base Database URL: ${maskConnectionString(rawDbUrl)}`);

// Helper to strip the database name/pathname from the connection string to get the base URL
const getBaseUrl = (connectionString) => {
  if (!connectionString) return "";
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
const MASTER_DB_URL = `${BASE_URL}/${TARGET_DB}`;

// Ensure DATABASE_MASTER_URL is set in process.env so Prisma CLI and Client pick it up
process.env.DATABASE_MASTER_URL = MASTER_DB_URL;
process.env.DATABASE_URL = MASTER_DB_URL; // fallback
process.env.DB_URL = MASTER_DB_URL; // Required by Prisma schema as env("DB_URL")

/**
 * Connect to the postgres maintenance database to check / create the target DB.
 */
const ensureDatabaseExists = async () => {
  // Connect to default "postgres" maintenance DB
  const client = new Client({ connectionString: `${BASE_URL}/postgres` });

  try {
    await client.connect();

    const res = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [TARGET_DB]
    );

    if (res.rowCount === 0) {
      console.log(`📦  Database "${TARGET_DB}" not found — creating...`);
      // Database names cannot use parameterized queries
      await client.query(`CREATE DATABASE "${TARGET_DB}"`);
      console.log(`✅  Database "${TARGET_DB}" created successfully.`);
    } else {
      console.log(`✅  Database "${TARGET_DB}" already exists.`);
    }
  } finally {
    await client.end();
  }
};

/**
 * Run Prisma migrations against the master database.
 */
const runMigrations = () => {
  const schemaPath = path.join(
    __dirname,
    "../prisma/schema/master/schema.prisma"
  );

  console.log("🔄  Running Prisma migrations...");

  execSync(`npx prisma migrate deploy --schema="${schemaPath}"`, {
    env: {
      ...process.env,
      DATABASE_MASTER_URL: MASTER_DB_URL,
      DB_URL: MASTER_DB_URL, // Ensure Prisma uses the target DB
    },
    stdio: "inherit",
  });

  console.log("✅  Prisma migrations applied.");
};

/**
 * Generate Prisma clients for both master and main schemas if they haven't been generated yet.
 */
const generateClientIfNeeded = () => {
  const schemas = [
    {
      name: "master",
      path: path.join(__dirname, "../prisma/schema/master/schema.prisma"),
      generated: path.join(__dirname, "../prisma/generated/master/index.js"),
    },
    {
      name: "main",
      path: path.join(__dirname, "../prisma/schema/main/schema.prisma"),
      generated: path.join(__dirname, "../prisma/generated/main/index.js"),
    },
  ];

  for (const schema of schemas) {
    const schemaMtime = fs.existsSync(schema.path)
      ? fs.statSync(schema.path).mtimeMs
      : 0;
    const generatedMtime = fs.existsSync(schema.generated)
      ? fs.statSync(schema.generated).mtimeMs
      : 0;
    const needsGenerate =
      !fs.existsSync(schema.generated) || schemaMtime > generatedMtime;

    if (!needsGenerate) {
      console.log(`✅  Prisma client for "${schema.name}" is up to date.`);
      continue;
    }

    console.log(`⚙️   Generating Prisma client for "${schema.name}"...`);
    try {
      execSync(`npx prisma generate --schema="${schema.path}"`, {
        stdio: "inherit",
      });
      console.log(`✅  Prisma client for "${schema.name}" generated.`);
    } catch (error) {
      console.warn(`⚠️   Failed to generate Prisma client for "${schema.name}".`);
      if (fs.existsSync(schema.generated)) {
        console.log(`💡  Existing client for "${schema.name}" will be used.`);
      } else {
        throw error;
      }
    }
  }
};

/**
 * Full bootstrap: ensure DB → generate client (if needed) → migrate → seed admin.
 */
const bootstrapDatabase = async () => {
  await ensureDatabaseExists();
  generateClientIfNeeded();
  runMigrations();

  // Seed data after migrations are applied
  const { seedAdmin, seedDbSeries } = require("../prisma/seeder/admin-seeder");
  await seedAdmin();
  await seedDbSeries();
};

/**
 * Create a new database for an owner and run migrations for the 'main' schema.
 */
const setupOwnerDatabase = async (dbName) => {
  const client = new Client({ connectionString: `${BASE_URL}/postgres` });

  try {
    await client.connect();

    // 1. Create the database
    const res = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [dbName]
    );

    if (res.rowCount === 0) {
      console.log(`📦  Creating database "${dbName}"...`);
      await client.query(`CREATE DATABASE "${dbName}"`);
      console.log(`✅  Database "${dbName}" created successfully.`);
    } else {
      console.warn(`⚠️   Database "${dbName}" already exists.`);
    }

    // 2. Sync schema for the main database
    const schemaPath = path.join(__dirname, "../prisma/schema/main/schema.prisma");
    const newDbUrl = `${BASE_URL}/${dbName}`;

    console.log(`🔄  Syncing database schema for "${dbName}"...`);
    // Using 'db push' instead of 'migrate deploy' because 'db push' directly syncs
    // the schema to the database without needing migration files, making it perfect
    // for dynamically created tenant databases.
    execSync(`npx prisma db push --schema="${schemaPath}" --accept-data-loss`, {
      env: {
        ...process.env,
        DATABASE_MAIN_URL: newDbUrl,
        DATABASE_URL: newDbUrl, // Fallback for Prisma
      },
      stdio: "inherit",
    });
    console.log(`✅  Database schema synced for "${dbName}".`);

    // 3. Seed default serial numbers for tenant database
    try {
      const { seedSerialNumbers } = require("../prisma/seeder/serial-number-seeder");
      await seedSerialNumbers(newDbUrl);
    } catch (seedErr) {
      console.warn("⚠️ Failed to seed default serial numbers:", seedErr.message);
    }


    return newDbUrl;
  } finally {
    await client.end();
  }
};

module.exports = { BASE_URL, MASTER_DB_URL, bootstrapDatabase, setupOwnerDatabase };
