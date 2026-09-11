"use strict";

const path = require("path");
const fs = require("fs");
const { loadPermissionCatalog } = require("./permission-seeder");

const OWNER_MODULES_PATH = path.join(__dirname, "../core-data/owner-modules.json");

let cachedModules = null;
let cachedModuleKeys = null;
let permKeysByModuleKey = null;

const loadOwnerModuleCatalog = () => {
  if (cachedModules) return cachedModules;
  const raw = fs.readFileSync(OWNER_MODULES_PATH, "utf8");
  cachedModules = JSON.parse(raw);
  cachedModuleKeys = cachedModules.map((m) => m.module_key);
  return cachedModules;
};

const getAllOwnerModuleKeys = () => {
  loadOwnerModuleCatalog();
  return cachedModuleKeys || [];
};

const getOwnerModuleMap = () => {
  const map = new Map();
  for (const item of loadOwnerModuleCatalog()) {
    map.set(item.module_key, item);
  }
  return map;
};

const buildPermKeysByModuleKey = () => {
  if (permKeysByModuleKey) return permKeysByModuleKey;
  const catalog = loadPermissionCatalog();
  const byPermModule = new Map();
  for (const item of catalog) {
    if (!byPermModule.has(item.perm_module)) {
      byPermModule.set(item.perm_module, []);
    }
    byPermModule.get(item.perm_module).push(item.perm_key);
  }

  permKeysByModuleKey = new Map();
  for (const mod of loadOwnerModuleCatalog()) {
    const keys = new Set();
    for (const permKey of mod.perm_keys || []) {
      keys.add(permKey);
    }
    for (const permModule of mod.perm_modules || []) {
      for (const key of byPermModule.get(permModule) || []) {
        keys.add(key);
      }
    }
    permKeysByModuleKey.set(mod.module_key, [...keys]);
  }
  return permKeysByModuleKey;
};

/** Expand super-admin module keys → all staff-level permission keys for that module. */
const expandModulesToPermissionKeys = (moduleKeys = []) => {
  const lookup = buildPermKeysByModuleKey();
  const keys = new Set();
  for (const moduleKey of moduleKeys) {
    for (const permKey of lookup.get(moduleKey) || []) {
      keys.add(permKey);
    }
  }
  return [...keys];
};

const getAllModulePermissionKeys = () =>
  expandModulesToPermissionKeys(getAllOwnerModuleKeys());

const emptyOwnerModuleMap = () => {
  const map = {};
  for (const key of getAllOwnerModuleKeys()) {
    map[key] = false;
  }
  return map;
};

const ownerModuleMapFromKeys = (moduleKeys = []) => {
  const map = emptyOwnerModuleMap();
  for (const key of moduleKeys) {
    if (map[key] !== undefined) map[key] = true;
  }
  return map;
};

const ownerModuleMapToKeys = (moduleMap = {}) => {
  const valid = new Set(getAllOwnerModuleKeys());
  return Object.entries(moduleMap || {})
    .filter(([key, enabled]) => enabled && valid.has(key))
    .map(([key]) => key);
};

/** Legacy rows stored granular keys (firm.view). Map them back to module keys. */
const granularKeysToModuleKeys = (granularKeys = []) => {
  const catalog = loadOwnerModuleCatalog();
  const lookup = buildPermKeysByModuleKey();
  const modules = new Set();

  for (const key of granularKeys) {
    if (!String(key).includes(".")) {
      if (getAllOwnerModuleKeys().includes(key)) modules.add(key);
      continue;
    }

    let matched = false;
    for (const item of catalog) {
      const expanded = lookup.get(item.module_key) || [];
      if (expanded.includes(key)) {
        modules.add(item.module_key);
        matched = true;
        break;
      }
    }
    if (matched) continue;

    const permModule = String(key).split(".")[0];
    for (const item of catalog) {
      if ((item.perm_modules || []).includes(permModule)) {
        modules.add(item.module_key);
        break;
      }
    }
  }
  return [...modules];
};

module.exports = {
  loadOwnerModuleCatalog,
  getAllOwnerModuleKeys,
  getOwnerModuleMap,
  expandModulesToPermissionKeys,
  getAllModulePermissionKeys,
  emptyOwnerModuleMap,
  ownerModuleMapFromKeys,
  ownerModuleMapToKeys,
  granularKeysToModuleKeys,
};
