"use strict";

const { PrismaClient } = require("../prisma/generated/main");

/** Reuse one Prisma client per tenant DB URL (avoids connection pool exhaustion). */
const clients = new Map();

const CONNECTION_LIMIT = parseInt(process.env.PRISMA_CONNECTION_LIMIT || "3", 10);
const POOL_TIMEOUT = parseInt(process.env.PRISMA_POOL_TIMEOUT || "20", 10);

/**
 * Append Prisma pool params when missing (important for Supabase session pooler limits).
 */
function withPoolParams(dbUrl) {
  if (!dbUrl) return dbUrl;
  if (/connection_limit=/i.test(dbUrl)) return dbUrl;

  try {
    const url = new URL(dbUrl);
    url.searchParams.set("connection_limit", String(CONNECTION_LIMIT));
    url.searchParams.set("pool_timeout", String(POOL_TIMEOUT));
    return url.toString();
  } catch {
    const sep = dbUrl.includes("?") ? "&" : "?";
    return `${dbUrl}${sep}connection_limit=${CONNECTION_LIMIT}&pool_timeout=${POOL_TIMEOUT}`;
  }
}

const getTenantPrisma = (dbUrl) => {
  if (!dbUrl) {
    throw new Error("Tenant database URL is required.");
  }

  if (!clients.has(dbUrl)) {
    clients.set(
      dbUrl,
      new PrismaClient({
        datasources: { db: { url: withPoolParams(dbUrl) } },
      })
    );
  }

  return clients.get(dbUrl);
};

/** Graceful shutdown (optional — e.g. process exit hook). */
const disconnectAllTenants = async () => {
  await Promise.all(
    [...clients.values()].map((client) => client.$disconnect().catch(() => {}))
  );
  clients.clear();
};

module.exports = { getTenantPrisma, disconnectAllTenants };
