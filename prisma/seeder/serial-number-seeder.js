"use strict";

const { PrismaClient } = require("../generated/main");

/** Default serial number configurations for supported entities */
const DEFAULT_SERIAL_CONFIGS = [
  {
    entity_type: "USER",
    start_number: 1001,
    current_number: 1000,
    number_prefix: "CST-",
  },
  {
    entity_type: "FIRM",
    start_number: 1001,
    current_number: 1000,
    number_prefix: "FRM-",
  },
  {
    entity_type: "STAFF",
    start_number: 1001,
    current_number: 1000,
    number_prefix: "STF-",
  },
  {
    entity_type: "LOAN",
    start_number: 1001,
    current_number: 1000,
    number_prefix: "LN-",
  },
  {
    entity_type: "FINANCE",
    start_number: 1001,
    current_number: 1000,
    number_prefix: "FIN-",
  },
  {
    entity_type: "MONEY_LENDER",
    start_number: 1001,
    current_number: 1000,
    number_prefix: "ML-",
  },
  {
    entity_type: "AUCTION_USER",
    start_number: 1001,
    current_number: 1000,
    number_prefix: "AUC-",
  },
  {
    entity_type: "RELEASE_USER",
    start_number: 1001,
    current_number: 1000,
    number_prefix: "REL-",
  },
];

/**
 * Seed serial number configurations into a target tenant database using prisma client or dbUrl.
 * @param {object|string} target Prisma client instance or database URL string
 */
async function seedSerialNumbers(target) {
  let prisma = null;
  let ownClient = false;

  try {
    if (typeof target === "string") {
      prisma = new PrismaClient({
        datasources: { db: { url: target } },
      });
      ownClient = true;
    } else if (target && typeof target === "object") {
      prisma = target;
    } else {
      throw new Error("Invalid target provided to seedSerialNumbers");
    }

    console.log("🌱 Seeding serial number configurations...");

    for (const config of DEFAULT_SERIAL_CONFIGS) {
      const existing = await prisma.serialNumber.findUnique({
        where: { entity_type: config.entity_type },
      });

      if (!existing) {
        const created = await prisma.serialNumber.create({
          data: config,
        });
        console.log(
          `  └─ Created serial config for ${config.entity_type} (Prefix: ${config.number_prefix}, Start: ${config.start_number})`
        );
      } else {
        console.log(
          `  └─ Serial config for ${config.entity_type} already exists. Skipping.`
        );
      }
    }

    console.log("✅ Serial number configurations seeded successfully.");
  } catch (error) {
    console.error("❌ Error seeding serial number configurations:", error.message);
    throw error;
  } finally {
    if (ownClient && prisma) {
      await prisma.$disconnect();
    }
  }
}

module.exports = {
  DEFAULT_SERIAL_CONFIGS,
  seedSerialNumbers,
};
