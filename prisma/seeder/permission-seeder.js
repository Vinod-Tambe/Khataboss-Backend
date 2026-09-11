"use strict";

const path = require("path");
const fs = require("fs");
const { getTenantPrisma } = require("../../utils/tenantPrisma");

const PERMISSIONS_PATH = path.join(__dirname, "../core-data/permissions.json");

let cachedCatalog = null;
let cachedKeys = null;
let cachedOwnerCatalog = null;
let cachedOwnerKeys = null;

/** Modules excluded from super-admin → owner entitlements (customers managed without RBAC). */
const OWNER_EXCLUDED_MODULES = new Set(["user"]);

const loadPermissionCatalog = () => {
  if (cachedCatalog) return cachedCatalog;
  const raw = fs.readFileSync(PERMISSIONS_PATH, "utf8");
  cachedCatalog = JSON.parse(raw);
  cachedKeys = cachedCatalog.map((p) => p.perm_key);
  return cachedCatalog;
};

/**
 * Permission catalog assignable to owners by super-admin (excludes customer/user module).
 */
const loadOwnerPermissionCatalog = () => {
  if (cachedOwnerCatalog) return cachedOwnerCatalog;
  cachedOwnerCatalog = loadPermissionCatalog().filter(
    (p) => !OWNER_EXCLUDED_MODULES.has(p.perm_module)
  );
  cachedOwnerKeys = cachedOwnerCatalog.map((p) => p.perm_key);
  return cachedOwnerCatalog;
};

/**
 * Upsert the full permission catalog into a tenant database.
 * Owners always have all permissions via role bypass (not stored as staff rows).
 * @param {string} dbUrl
 * @returns {Promise<{ count: number, keys: string[] }>}
 */
const seedPermissions = async (dbUrl) => {
  const catalog = loadPermissionCatalog();
  const prisma = getTenantPrisma(dbUrl);

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
};

/**
 * Return every permission key (owner = full access).
 */
const getAllPermissionKeys = () => {
  loadPermissionCatalog();
  return cachedKeys || [];
};

/**
 * All permission keys assignable to owners (excludes user/customer module).
 */
const getAllOwnerPermissionKeys = () => {
  loadOwnerPermissionCatalog();
  return cachedOwnerKeys || [];
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
const permissionMatrixToKeys = (matrix = {}, { ownerScope = false } = {}) => {
  const catalog = ownerScope ? loadOwnerPermissionCatalog() : loadPermissionCatalog();
  const validKeys = new Set(catalog.map((p) => p.perm_key));
  const keys = [];

  for (const [module, actions] of Object.entries(matrix || {})) {
    if (ownerScope && OWNER_EXCLUDED_MODULES.has(module)) continue;
    for (const [action, enabled] of Object.entries(actions || {})) {
      if (!enabled) continue;
      const key = `${module}.${action}`;
      if (validKeys.has(key)) keys.push(key);
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

const emptyOwnerPermissionMatrix = () => {
  const matrix = {};
  for (const item of loadOwnerPermissionCatalog()) {
    if (!matrix[item.perm_module]) matrix[item.perm_module] = {};
    matrix[item.perm_module][item.perm_action] = false;
  }
  return matrix;
};

const ownerPermissionMatrixToKeys = (matrix = {}) =>
  permissionMatrixToKeys(matrix, { ownerScope: true });

module.exports = {
  seedPermissions,
  getAllPermissionKeys,
  getAllOwnerPermissionKeys,
  keysToPermissionMatrix,
  permissionMatrixToKeys,
  ownerPermissionMatrixToKeys,
  emptyPermissionMatrix,
  emptyOwnerPermissionMatrix,
  loadPermissionCatalog,
  loadOwnerPermissionCatalog,
  OWNER_EXCLUDED_MODULES,
};
