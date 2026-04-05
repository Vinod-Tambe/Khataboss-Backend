"use strict";

const { bootstrapDatabase } = require("../config/db");

/**
 * Standalone script to perform the full database bootstrap process:
 * 1. Ensure target database exists
 * 2. Generate Prisma client
 * 3. Run migrations
 * 4. Seed admin data
 */
const run = async () => {
  try {
    console.log("🚀  Starting full database bootstrap...");
    await bootstrapDatabase();
    console.log("🌟  Database setup and seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error("❌  Bootstrap failed:", error.message);
    process.exit(1);
  }
};

run();
