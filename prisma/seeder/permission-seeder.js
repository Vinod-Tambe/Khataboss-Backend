"use strict";

const path = require("path");
const fs = require("fs");
const { PrismaClient } = require("../generated/main");

const PERMISSIONS_PATH = path.join(__dirname, "../core-data/permissions.json");

let cachedCatalog = null;
let cachedKeys = null;

const loadPermissionCatalog = () => {
  if (cachedCatalog) return cachedCatalog;
  const raw = fs.readFileSync(PERMISSIONS_PATH, "utf8");
  cachedCatalog = JSON.parse(raw);
  cachedKeys = cachedCatalog.map((p) => p.perm_key);
  return cachedCatalog;
};

/**
 * Upsert the full permission catalog into a tenant database.
 * Owners always have all permissions via role bypass (not stored as staff rows).
 * @param {string} dbUrl
 * @returns {Promise<{ count: number, keys: string[] }>}
 */
const seedPermissions = async (dbUrl) => {
  const catalog = loadPermissionCatalog();
  const prisma = new PrismaClient({
    datasources: { db: { url: dbUrl } },
  });

  try {
    for (const item of catalog) {
      await prisma.permission.upsert({
        where: { perm_key: item.perm_key },
        create: {
          perm_key: item.perm_key,
          perm_module: item.perm_module,
          perm_action: item.perm_action,
          perm_label: item.perm_label,
          perm_sort_order: item.perm_sort_order ?? 0,
        },
        update: {
          perm_module: item.perm_module,
          perm_action: item.perm_action,
          perm_label: item.perm_label,
          perm_sort_order: item.perm_sort_order ?? 0,
        },
      });
    }

    const keys = catalog.map((p) => p.perm_key);
    console.log(`✅  Seeded ${keys.length} permissions for tenant.`);
    return { count: keys.length, keys };
  } finally {
    await prisma.$disconnect();
  }
};

/**
 * Return every permission key (owner = full access).
 */
const getAllPermissionKeys = () => {
  loadPermissionCatalog();
  return cachedKeys || [];
};

/**
 * Convert flat permission keys into the nested UI matrix used by StaffDetails.
 */
const keysToPermissionMatrix = (keys = []) => {
  const matrix = {};
  for (const key of keys) {
    const [module, action] = String(key).split(".");
    if (!module || !action) continue;
    if (!matrix[module]) matrix[module] = {};
    matrix[module][action] = true;
  }
  return matrix;
};

/**
 * Convert nested UI matrix into flat permission keys.
 */
const permissionMatrixToKeys = (matrix = {}) => {
  const keys = [];
  for (const [module, actions] of Object.entries(matrix || {})) {
    for (const [action, enabled] of Object.entries(actions || {})) {
      if (enabled) keys.push(`${module}.${action}`);
    }
  }
  return keys;
};

/**
 * Empty matrix with all known actions set to false (for UI defaults).
 */
const emptyPermissionMatrix = () => {
  const matrix = {};
  for (const item of loadPermissionCatalog()) {
    if (!matrix[item.perm_module]) matrix[item.perm_module] = {};
    matrix[item.perm_module][item.perm_action] = false;
  }
  return matrix;
};

module.exports = {
  seedPermissions,
  getAllPermissionKeys,
  keysToPermissionMatrix,
  permissionMatrixToKeys,
  emptyPermissionMatrix,
  loadPermissionCatalog,
};
