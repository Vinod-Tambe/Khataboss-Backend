"use strict";

const { getMasterPrisma } = require("../../../utils/masterPrisma");
const { getTenantPrisma } = require("../../../utils/tenantPrisma");
const { BASE_URL } = require("../../../config/db");
const {
  loadOwnerModuleCatalog,
  getAllOwnerModuleKeys,
  expandModulesToPermissionKeys,
  getAllModulePermissionKeys,
  emptyOwnerModuleMap,
  ownerModuleMapFromKeys,
  ownerModuleMapToKeys,
  granularKeysToModuleKeys,
} = require("../../../prisma/seeder/owner-module-seeder");

const masterPrisma = getMasterPrisma();

const DEFAULT_MAX_FIRMS = 1;
const DEFAULT_MAX_STAFF = 10;

class OwnerPermissionService {
  getCatalog() {
    return loadOwnerModuleCatalog();
  }

  getDefaultLimits() {
    return {
      own_max_firms: DEFAULT_MAX_FIRMS,
      own_max_staff: DEFAULT_MAX_STAFF,
    };
  }

  async resolveModuleKeys(ownId) {
    const rows = await masterPrisma.ownerPermission.findMany({
      where: { op_own_id: ownId, op_granted: true },
      select: { op_perm_key: true },
    });

    if (rows.length === 0) {
      return getAllOwnerModuleKeys();
    }

    const stored = rows.map((r) => r.op_perm_key);
    const hasGranular = stored.some((k) => String(k).includes("."));
    if (hasGranular) {
      return granularKeysToModuleKeys(stored);
    }
    return stored.filter((k) => getAllOwnerModuleKeys().includes(k));
  }

  /**
   * Module access → all actions inside each module (for owner login + staff cap).
   */
  async resolvePermissionKeys(ownId) {
    const moduleKeys = await this.resolveModuleKeys(ownId);
    return expandModulesToPermissionKeys(moduleKeys);
  }

  async getModuleMap(ownId) {
    const moduleKeys = await this.resolveModuleKeys(ownId);
    return ownerModuleMapFromKeys(moduleKeys);
  }

  async getEntitlements(ownUuid) {
    const owner = await masterPrisma.owner.findFirst({
      where: { own_uuid: ownUuid, own_is_deleted: false },
      select: {
        own_id: true,
        own_uuid: true,
        own_max_firms: true,
        own_max_staff: true,
      },
    });

    if (!owner) return null;

    const moduleKeys = await this.resolveModuleKeys(owner.own_id);
    const modules = ownerModuleMapFromKeys(moduleKeys);
    const permission_keys = expandModulesToPermissionKeys(moduleKeys);

    return {
      own_uuid: owner.own_uuid,
      own_max_firms: owner.own_max_firms,
      own_max_staff: owner.own_max_staff,
      module_keys: moduleKeys,
      modules,
      permission_keys,
    };
  }

  async setModules(ownId, moduleKeys = []) {
    const valid = new Set(getAllOwnerModuleKeys());
    const unique = [...new Set(moduleKeys.filter(Boolean))];
    const invalid = unique.filter((k) => !valid.has(k));
    if (invalid.length > 0) {
      const error = new Error(`Unknown module keys: ${invalid.join(", ")}`);
      error.statusCode = 400;
      throw error;
    }

    await masterPrisma.$transaction(async (tx) => {
      await tx.ownerPermission.deleteMany({ where: { op_own_id: ownId } });
      if (unique.length > 0) {
        await tx.ownerPermission.createMany({
          data: unique.map((moduleKey) => ({
            op_own_id: ownId,
            op_perm_key: moduleKey,
            op_granted: true,
          })),
        });
      }
    });

    return unique;
  }

  async setModulesFromMap(ownId, moduleMap) {
    const keys = ownerModuleMapToKeys(moduleMap);
    return this.setModules(ownId, keys);
  }

  parseModuleInput(body = {}) {
    if (body.modules && typeof body.modules === "object" && !Array.isArray(body.modules)) {
      return ownerModuleMapToKeys(body.modules);
    }
    if (typeof body.modules === "string") {
      try {
        const parsed = JSON.parse(body.modules);
        if (Array.isArray(parsed)) return parsed;
        if (parsed && typeof parsed === "object") return ownerModuleMapToKeys(parsed);
      } catch (_) {
        /* ignore */
      }
    }
    if (Array.isArray(body.module_keys)) return body.module_keys;
    if (typeof body.module_keys === "string") {
      try {
        return JSON.parse(body.module_keys);
      } catch (_) {
        return [];
      }
    }

    // Backward compat: old UI sent permissions action matrix
    if (body.permissions && typeof body.permissions === "object" && !Array.isArray(body.permissions)) {
      const moduleKeys = new Set();
      for (const [module, actions] of Object.entries(body.permissions)) {
        const enabled = Object.values(actions || {}).some(Boolean);
        if (!enabled) continue;
        const catalogItem = loadOwnerModuleCatalog().find((m) =>
          (m.perm_modules || []).includes(module)
        );
        if (catalogItem) moduleKeys.add(catalogItem.module_key);
      }
      return [...moduleKeys];
    }

    return [];
  }

  parseLimits(body = {}) {
    const limits = {};
    if (body.own_max_firms !== undefined && body.own_max_firms !== null && body.own_max_firms !== "") {
      const val = parseInt(body.own_max_firms, 10);
      if (Number.isNaN(val) || val < 0) {
        const error = new Error("own_max_firms must be a non-negative number.");
        error.statusCode = 400;
        throw error;
      }
      limits.own_max_firms = val;
    }
    if (body.own_max_staff !== undefined && body.own_max_staff !== null && body.own_max_staff !== "") {
      const val = parseInt(body.own_max_staff, 10);
      if (Number.isNaN(val) || val < 0) {
        const error = new Error("own_max_staff must be a non-negative number.");
        error.statusCode = 400;
        throw error;
      }
      limits.own_max_staff = val;
    }
    return limits;
  }

  async syncLimitsToTenant(dbUrl, ownUuid, limits) {
    if (!limits || Object.keys(limits).length === 0) return;
    const tenantPrisma = getTenantPrisma(dbUrl);
    await tenantPrisma.owner.update({
      where: { own_uuid: ownUuid },
      data: limits,
    });
  }

  async updateEntitlements(ownUuid, body = {}) {
    const owner = await masterPrisma.owner.findFirst({
      where: { own_uuid: ownUuid, own_is_deleted: false },
      select: { own_id: true, own_uuid: true, own_db: true },
    });

    if (!owner) {
      const error = new Error("Owner not found.");
      error.statusCode = 404;
      throw error;
    }

    const limits = this.parseLimits(body);
    const hasModulePayload =
      body.modules !== undefined ||
      body.module_keys !== undefined ||
      body.permissions !== undefined;
    const hasPayload =
      hasModulePayload ||
      limits.own_max_firms !== undefined ||
      limits.own_max_staff !== undefined;

    if (!hasPayload) {
      const error = new Error("Provide modules and/or own_max_firms / own_max_staff.");
      error.statusCode = 400;
      throw error;
    }

    if (hasModulePayload) {
      const moduleKeys = this.parseModuleInput(body);
      await this.setModules(owner.own_id, moduleKeys);
    }

    if (Object.keys(limits).length > 0) {
      await masterPrisma.owner.update({
        where: { own_id: owner.own_id },
        data: limits,
      });
      await this.syncLimitsToTenant(`${BASE_URL}/${owner.own_db}`, owner.own_uuid, limits);
    }

    return this.getEntitlements(ownUuid);
  }

  async seedDefaultEntitlements(ownId, ownUuid, dbUrl, overrides = {}) {
    const defaults = this.getDefaultLimits();
    const limits = {
      own_max_firms: overrides.own_max_firms ?? defaults.own_max_firms,
      own_max_staff: overrides.own_max_staff ?? defaults.own_max_staff,
    };

    const parsedModules = this.parseModuleInput(overrides);
    const moduleKeys =
      parsedModules.length > 0 ? parsedModules : getAllOwnerModuleKeys();

    await masterPrisma.owner.update({
      where: { own_id: ownId },
      data: limits,
    });

    const tenantPrisma = getTenantPrisma(dbUrl);
    await tenantPrisma.owner.update({
      where: { own_uuid: ownUuid },
      data: limits,
    });

    await this.setModules(ownId, moduleKeys);

    return {
      limits,
      module_keys: moduleKeys,
      permission_keys: expandModulesToPermissionKeys(moduleKeys),
    };
  }

  async assertFirmLimit(dbUrl, ownId, ownUuid) {
    const owner = await masterPrisma.owner.findFirst({
      where: { own_uuid: ownUuid, own_is_deleted: false },
      select: { own_max_firms: true },
    });

    const maxFirms = owner?.own_max_firms;
    if (maxFirms == null) return;

    const tenantPrisma = getTenantPrisma(dbUrl);
    const currentCount = await tenantPrisma.firm.count({
      where: { firm_own_id: ownId, firm_is_deleted: false },
    });

    if (currentCount >= maxFirms) {
      const error = new Error(
        `Firm limit reached. Your plan allows a maximum of ${maxFirms} firm(s). Contact super-admin to increase the limit.`
      );
      error.statusCode = 403;
      throw error;
    }
  }

  async assertStaffLimit(dbUrl, ownUuid) {
    const owner = await masterPrisma.owner.findFirst({
      where: { own_uuid: ownUuid, own_is_deleted: false },
      select: { own_max_staff: true },
    });

    const maxStaff = owner?.own_max_staff;
    if (maxStaff == null) return;

    const tenantPrisma = getTenantPrisma(dbUrl);
    const currentCount = await tenantPrisma.staff.count({
      where: { staff_is_deleted: false },
    });

    if (currentCount >= maxStaff) {
      const error = new Error(
        `Staff limit reached. Your plan allows a maximum of ${maxStaff} staff member(s). Contact super-admin to increase the limit.`
      );
      error.statusCode = 403;
      throw error;
    }
  }

  async filterStaffPermissionKeys(ownId, permissionKeys = []) {
    const allowed = new Set(await this.resolvePermissionKeys(ownId));
    const unique = [...new Set(permissionKeys.filter(Boolean))];
    const rejected = unique.filter((k) => !allowed.has(k));
    if (rejected.length > 0) {
      const error = new Error(
        `Cannot assign permissions not granted to this owner: ${rejected.join(", ")}`
      );
      error.statusCode = 403;
      throw error;
    }
    return unique;
  }

  async getUsageStats(dbUrl, ownId, ownUuid) {
    const owner = await masterPrisma.owner.findFirst({
      where: { own_uuid: ownUuid, own_is_deleted: false },
      select: { own_max_firms: true, own_max_staff: true },
    });

    const tenantPrisma = getTenantPrisma(dbUrl);
    const [firmCount, staffCount] = await Promise.all([
      tenantPrisma.firm.count({ where: { firm_own_id: ownId, firm_is_deleted: false } }),
      tenantPrisma.staff.count({ where: { staff_is_deleted: false } }),
    ]);

    return {
      firms: { used: firmCount, limit: owner?.own_max_firms ?? null },
      staff: { used: staffCount, limit: owner?.own_max_staff ?? null },
    };
  }
}

module.exports = new OwnerPermissionService();
