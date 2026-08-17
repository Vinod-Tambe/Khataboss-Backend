"use strict";

const { PrismaClient } = require("../prisma/generated/master");
const { MASTER_DB_URL } = require("../config/db");

let masterClient = null;

const CONNECTION_LIMIT = parseInt(process.env.PRISMA_CONNECTION_LIMIT || "3", 10);
const POOL_TIMEOUT = parseInt(process.env.PRISMA_POOL_TIMEOUT || "20", 10);

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

const getMasterPrisma = () => {
  if (!masterClient) {
    if (!MASTER_DB_URL) {
      throw new Error("Master database URL is not configured.");
    }

    masterClient = new PrismaClient({
      datasources: { db: { url: withPoolParams(MASTER_DB_URL) } },
    });
  }
  return masterClient;
};

module.exports = { getMasterPrisma };
