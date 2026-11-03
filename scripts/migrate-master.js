"use strict";

/**
 * Run master Prisma migrations against the real master database (MASTER_DB_NAME),
 * not the bare DB_URL host from .env alone.
 */
require("../config/db");
const { execSync } = require("child_process");
const path = require("path");

const schema = path.join(__dirname, "../prisma/schema/master/schema.prisma");
execSync(`npx prisma migrate deploy --schema="${schema}"`, {
  stdio: "inherit",
  env: process.env,
});
