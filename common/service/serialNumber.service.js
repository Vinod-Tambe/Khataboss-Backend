"use strict";

const { DEFAULT_SERIAL_CONFIGS, seedSerialNumbers } = require("../../prisma/seeder/serial-number-seeder");

class SerialNumberService {
  /**
   * Helper to normalize entity type strings.
   * e.g., 'user' -> 'USER', 'action_user' -> 'AUCTION_USER', etc.
   */
  normalizeEntityType(entityType) {
    if (!entityType) return "";
    const key = String(entityType).trim().toUpperCase().replace(/[\s-]+/g, "_");
    
    // Map common aliases if any
    const ALIAS_MAP = {
      USER: "USER",
      FIRM: "FIRM",
      STAFF: "STAFF",
      LOAN: "LOAN",
      GIRVI: "LOAN",
      FINANCE: "FINANCE",
      MONEY_LENDER: "MONEY_LENDER",
      MONEYLENDER: "MONEY_LENDER",
      ACTION_USER: "AUCTION_USER",
      AUCTION_USER: "AUCTION_USER",
      AUCTIONUSER: "AUCTION_USER",
      RELEASE_USER: "RELEASE_USER",
      RELEASEUSER: "RELEASE_USER",
    };

    return ALIAS_MAP[key] || key;
  }

  /**
   * Generates the next unique serial code for an entity type in an atomic transaction.
   * Increments `current_number` in the `serial_numbers` table.
   *
   * @param {object} prisma PrismaClient instance or transaction client (tx)
   * @param {string} entityType The target entity type (e.g., 'USER', 'FIRM', 'STAFF', 'LOAN', 'FINANCE', 'MONEY_LENDER', 'AUCTION_USER')
   * @returns {Promise<string>} Generated unique code string (e.g., "USR-1001", "FRM-1001")
   */
  async getNextSerialNumber(prisma, entityType) {
    const typeKey = this.normalizeEntityType(entityType);
    if (!typeKey) {
      throw new Error("Entity type is required to generate serial number.");
    }

    const executeGenerator = async (tx) => {
      // 1. Fetch existing serial number configuration
      let config = await tx.serialNumber.findUnique({
        where: { entity_type: typeKey },
      });

      // 2. If config does not exist, create from default definitions
      if (!config) {
        const defaultConfig = DEFAULT_SERIAL_CONFIGS.find(
          (c) => c.entity_type === typeKey
        ) || {
          entity_type: typeKey,
          start_number: 1001,
          current_number: 1000,
          number_prefix: `${typeKey.substring(0, 3)}-`,
        };

        config = await tx.serialNumber.create({
          data: defaultConfig,
        });
      }

      // 3. Compute next number logic
      const startNum = config.start_number ?? 1001;
      const currentNum = config.current_number ?? 1000;

      let nextNum;
      if (currentNum < startNum) {
        nextNum = startNum;
      } else {
        nextNum = currentNum + 1;
      }

      // 4. Update the current_number in database
      await tx.serialNumber.update({
        where: { sn_id: config.sn_id },
        data: { current_number: nextNum },
      });

      // 5. Build and return formatted unique code string
      const prefix = config.number_prefix || "";
      return `${prefix}${nextNum}`;
    };

    // Check if prisma is already in a transaction context (does not have $transaction method)
    if (typeof prisma.$transaction === "function") {
      return await prisma.$transaction(async (tx) => executeGenerator(tx));
    } else {
      return await executeGenerator(prisma);
    }
  }

  /**
   * Preview the next serial code without incrementing the counter.
   * @param {object} prisma Prisma Client instance
   * @param {string} entityType Target entity
   * @returns {Promise<string>}
   */
  async peekNextSerialNumber(prisma, entityType) {
    const typeKey = this.normalizeEntityType(entityType);
    if (!typeKey) {
      throw new Error("Entity type is required to preview serial number.");
    }

    let config = await prisma.serialNumber.findUnique({
      where: { entity_type: typeKey },
    });

    if (!config) {
      config =
        DEFAULT_SERIAL_CONFIGS.find((c) => c.entity_type === typeKey) || {
          entity_type: typeKey,
          start_number: 1001,
          current_number: 1000,
          number_prefix: `${typeKey.substring(0, 3)}-`,
        };
    }

    const startNum = config.start_number ?? 1001;
    const currentNum = config.current_number ?? 1000;
    const nextNum = currentNum < startNum ? startNum : currentNum + 1;
    const prefix = config.number_prefix || "";
    return `${prefix}${nextNum}`;
  }

  /**
   * Get all serial number configurations for a tenant DB.
   * @param {object} prisma Prisma Client instance
   */
  async getAllConfigs(prisma) {
    return await prisma.serialNumber.findMany({
      orderBy: { entity_type: "asc" },
    });
  }

  /**
   * Update configuration parameters for a specific entity type.
   * @param {object} prisma Prisma Client instance
   * @param {string} entityType Target entity
   * @param {object} updateData Object containing { start_number, current_number, number_prefix }
   */
  async updateConfig(prisma, entityType, updateData) {
    const typeKey = this.normalizeEntityType(entityType);
    const dataToUpdate = {};

    if (updateData.start_number !== undefined) {
      dataToUpdate.start_number = parseInt(updateData.start_number);
    }
    if (updateData.current_number !== undefined) {
      dataToUpdate.current_number = parseInt(updateData.current_number);
    }
    if (updateData.number_prefix !== undefined) {
      dataToUpdate.number_prefix = String(updateData.number_prefix).trim();
    }

    return await prisma.serialNumber.upsert({
      where: { entity_type: typeKey },
      update: dataToUpdate,
      create: {
        entity_type: typeKey,
        start_number: dataToUpdate.start_number ?? 1001,
        current_number: dataToUpdate.current_number ?? 1000,
        number_prefix: dataToUpdate.number_prefix ?? `${typeKey.substring(0, 3)}-`,
      },
    });
  }

  /**
   * Seed default serial number configurations into tenant DB.
   * @param {object} prisma Prisma Client instance
   */
  async seedDefaultSerialNumbers(prisma) {
    return await seedSerialNumbers(prisma);
  }
}

module.exports = new SerialNumberService();
