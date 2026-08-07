"use strict";

const { PrismaClient } = require("../prisma/generated/main");

/** Reuse Prisma clients per tenant DB URL (avoid connect/disconnect per request). */
const clients = new Map();

const getTenantPrisma = (dbUrl) => {
  if (!dbUrl) {
    throw new Error("Tenant database URL is required.");
  }
  if (!clients.has(dbUrl)) {
    clients.set(
      dbUrl,
      new PrismaClient({
        datasources: { db: { url: dbUrl } },
      })
    );
  }
  return clients.get(dbUrl);
};

module.exports = { getTenantPrisma };
