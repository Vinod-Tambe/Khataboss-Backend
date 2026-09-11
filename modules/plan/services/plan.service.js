"use strict";

const { getMasterPrisma } = require("../../../utils/masterPrisma");
const {
  loadOwnerModuleCatalog,
  emptyOwnerModuleMap,
  ownerModuleMapToKeys,
} = require("../../../prisma/seeder/owner-module-seeder");
const ownerPermissionService = require("../../owner/services/owner-permission.service");
const {
  resolveOwnerSubscriptionDates,
} = require("../../../utils/owner-subscription-dates");

const masterPrisma = getMasterPrisma();

const PLAN_IMAGE_OWNER_ID = 0;

class PlanService {
  parseModules(input) {
    if (!input) return emptyOwnerModuleMap();
    if (typeof input === "string") {
      try {
        input = JSON.parse(input);
      } catch {
        return emptyOwnerModuleMap();
      }
    }
    if (Array.isArray(input)) {
      const map = emptyOwnerModuleMap();
      for (const key of input) {
        if (map[key] !== undefined) map[key] = true;
      }
      return map;
    }
    if (typeof input === "object") {
      const base = emptyOwnerModuleMap();
      for (const key of Object.keys(base)) {
        if (input[key] !== undefined) base[key] = !!input[key];
      }
      return base;
    }
    return emptyOwnerModuleMap();
  }

  parseFeatures(input) {
    if (!input) return [];
    if (Array.isArray(input)) return input.filter(Boolean).map(String);
    if (typeof input === "string") {
      try {
        const parsed = JSON.parse(input);
        return Array.isArray(parsed) ? parsed.filter(Boolean).map(String) : [];
      } catch {
        return input
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean);
      }
    }
    return [];
  }

  normalizePlanCode(code, name = "") {
    const raw = String(code || name || "")
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");
    return raw || `PLAN_${Date.now()}`;
  }

  mapCreateData(body = {}, adminLoginId = "Admin") {
    const modules = this.parseModules(body.plan_modules || body.modules);
    const price = parseFloat(body.plan_price);
    if (Number.isNaN(price) || price < 0) {
      const error = new Error("plan_price must be a valid non-negative number.");
      error.statusCode = 400;
      throw error;
    }

    let offerPrice = null;
    if (body.plan_offer_price !== undefined && body.plan_offer_price !== null && body.plan_offer_price !== "") {
      offerPrice = parseFloat(body.plan_offer_price);
      if (Number.isNaN(offerPrice) || offerPrice < 0) {
        const error = new Error("plan_offer_price must be a valid non-negative number.");
        error.statusCode = 400;
        throw error;
      }
    }

    const maxFirms = parseInt(body.plan_max_firms ?? 1, 10);
    const maxStaff = parseInt(body.plan_max_staff ?? 10, 10);
    if (Number.isNaN(maxFirms) || maxFirms < 0 || Number.isNaN(maxStaff) || maxStaff < 0) {
      const error = new Error("plan_max_firms and plan_max_staff must be non-negative numbers.");
      error.statusCode = 400;
      throw error;
    }

    if (!body.plan_name) {
      const error = new Error("plan_name is required.");
      error.statusCode = 400;
      throw error;
    }

    return {
      plan_name: String(body.plan_name).trim(),
      plan_code: this.normalizePlanCode(body.plan_code, body.plan_name),
      plan_description: body.plan_description ? String(body.plan_description).trim() : null,
      plan_price: price,
      plan_offer_price: offerPrice,
      plan_currency: (body.plan_currency || "INR").trim().toUpperCase(),
      plan_billing_cycle: body.plan_billing_cycle || "Yearly",
      plan_duration_days:
        body.plan_duration_days !== undefined && body.plan_duration_days !== null && body.plan_duration_days !== ""
          ? parseInt(body.plan_duration_days, 10)
          : null,
      plan_max_firms: maxFirms,
      plan_max_staff: maxStaff,
      plan_modules: modules,
      plan_features: this.parseFeatures(body.plan_features),
      plan_is_popular: body.plan_is_popular === true || body.plan_is_popular === "true",
      plan_sort_order: parseInt(body.plan_sort_order ?? 0, 10) || 0,
      plan_status: body.plan_status === "Inactive" ? "Inactive" : "Active",
      plan_created_by: adminLoginId,
      plan_updated_by: adminLoginId,
    };
  }

  mapUpdateData(body = {}, adminLoginId = "Admin") {
    const data = {};
    if (body.plan_name !== undefined) data.plan_name = String(body.plan_name).trim();
    if (body.plan_code !== undefined) data.plan_code = this.normalizePlanCode(body.plan_code, body.plan_name);
    if (body.plan_description !== undefined) {
      data.plan_description = body.plan_description ? String(body.plan_description).trim() : null;
    }
    if (body.plan_price !== undefined) {
      const price = parseFloat(body.plan_price);
      if (Number.isNaN(price) || price < 0) {
        const error = new Error("plan_price must be a valid non-negative number.");
        error.statusCode = 400;
        throw error;
      }
      data.plan_price = price;
    }
    if (body.plan_offer_price !== undefined) {
      if (body.plan_offer_price === null || body.plan_offer_price === "") {
        data.plan_offer_price = null;
      } else {
        const offer = parseFloat(body.plan_offer_price);
        if (Number.isNaN(offer) || offer < 0) {
          const error = new Error("plan_offer_price must be a valid non-negative number.");
          error.statusCode = 400;
          throw error;
        }
        data.plan_offer_price = offer;
      }
    }
    if (body.plan_currency !== undefined) data.plan_currency = String(body.plan_currency).trim().toUpperCase();
    if (body.plan_billing_cycle !== undefined) data.plan_billing_cycle = body.plan_billing_cycle;
    if (body.plan_duration_days !== undefined) {
      data.plan_duration_days =
        body.plan_duration_days === null || body.plan_duration_days === ""
          ? null
          : parseInt(body.plan_duration_days, 10);
    }
    if (body.plan_max_firms !== undefined) data.plan_max_firms = parseInt(body.plan_max_firms, 10);
    if (body.plan_max_staff !== undefined) data.plan_max_staff = parseInt(body.plan_max_staff, 10);
    if (body.plan_modules !== undefined || body.modules !== undefined) {
      data.plan_modules = this.parseModules(body.plan_modules || body.modules);
    }
    if (body.plan_features !== undefined) data.plan_features = this.parseFeatures(body.plan_features);
    if (body.plan_is_popular !== undefined) {
      data.plan_is_popular = body.plan_is_popular === true || body.plan_is_popular === "true";
    }
    if (body.plan_sort_order !== undefined) data.plan_sort_order = parseInt(body.plan_sort_order, 10) || 0;
    if (body.plan_status !== undefined) data.plan_status = body.plan_status === "Inactive" ? "Inactive" : "Active";
    if (body.plan_image !== undefined) data.plan_image = body.plan_image;
    data.plan_updated_by = adminLoginId;
    return data;
  }

  serializePlan(plan) {
    if (!plan) return plan;
    const modules =
      typeof plan.plan_modules === "object" && plan.plan_modules !== null
        ? plan.plan_modules
        : emptyOwnerModuleMap();
    const module_keys = ownerModuleMapToKeys(modules);
    const catalog = loadOwnerModuleCatalog();
    const module_labels = catalog
      .filter((m) => modules[m.module_key])
      .map((m) => m.module_label);

    return {
      ...plan,
      plan_price: plan.plan_price != null ? Number(plan.plan_price) : 0,
      plan_offer_price: plan.plan_offer_price != null ? Number(plan.plan_offer_price) : null,
      modules,
      module_keys,
      module_labels,
      owner_count: plan._count?.owners ?? plan.owner_count ?? undefined,
    };
  }

  async getPlans({ includeInactive = true } = {}) {
    const plans = await masterPrisma.plan.findMany({
      where: {
        plan_is_deleted: false,
        ...(includeInactive ? {} : { plan_status: "Active" }),
      },
      orderBy: [{ plan_sort_order: "asc" }, { plan_id: "asc" }],
      include: {
        _count: { select: { owners: { where: { own_is_deleted: false } } } },
      },
    });
    return plans.map((p) => this.serializePlan(p));
  }

  async getActivePlans() {
    return this.getPlans({ includeInactive: false });
  }

  async getPlanByUuid(planUuid) {
    const plan = await masterPrisma.plan.findFirst({
      where: { plan_uuid: planUuid, plan_is_deleted: false },
      include: {
        _count: { select: { owners: { where: { own_is_deleted: false } } } },
      },
    });
    return plan ? this.serializePlan(plan) : null;
  }

  async createPlan(body, adminLoginId = "Admin") {
    const data = this.mapCreateData(body, adminLoginId);

    const duplicate = await masterPrisma.plan.findFirst({
      where: {
        OR: [{ plan_code: data.plan_code }, { plan_name: data.plan_name }],
        plan_is_deleted: false,
      },
    });
    if (duplicate) {
      const field = duplicate.plan_code === data.plan_code ? "plan_code" : "plan_name";
      const error = new Error(`Plan ${field} already exists.`);
      error.statusCode = 409;
      throw error;
    }

    return masterPrisma.plan.create({ data });
  }

  async updatePlan(planUuid, body, adminLoginId = "Admin") {
    const existing = await masterPrisma.plan.findFirst({
      where: { plan_uuid: planUuid, plan_is_deleted: false },
    });
    if (!existing) {
      const error = new Error("Plan not found.");
      error.statusCode = 404;
      throw error;
    }

    const data = this.mapUpdateData(body, adminLoginId);

    if (data.plan_code || data.plan_name) {
      const or = [];
      if (data.plan_code) or.push({ plan_code: data.plan_code });
      if (data.plan_name) or.push({ plan_name: data.plan_name });
      const duplicate = await masterPrisma.plan.findFirst({
        where: {
          OR: or,
          NOT: { plan_uuid: planUuid },
          plan_is_deleted: false,
        },
      });
      if (duplicate) {
        const error = new Error("Plan name or code already exists.");
        error.statusCode = 409;
        throw error;
      }
    }

    return masterPrisma.plan.update({
      where: { plan_id: existing.plan_id },
      data,
    });
  }

  async updatePlanImage(planUuid, imageJson) {
    const existing = await masterPrisma.plan.findFirst({
      where: { plan_uuid: planUuid, plan_is_deleted: false },
      select: { plan_id: true },
    });
    if (!existing) {
      const error = new Error("Plan not found.");
      error.statusCode = 404;
      throw error;
    }
    return masterPrisma.plan.update({
      where: { plan_id: existing.plan_id },
      data: { plan_image: imageJson },
    });
  }

  async deletePlan(planUuid, deletedBy = "Admin") {
    const existing = await masterPrisma.plan.findFirst({
      where: { plan_uuid: planUuid, plan_is_deleted: false },
      select: { plan_id: true },
    });
    if (!existing) {
      const error = new Error("Plan not found.");
      error.statusCode = 404;
      throw error;
    }

    await masterPrisma.owner.updateMany({
      where: { own_plan_id: existing.plan_id },
      data: { own_plan_id: null },
    });

    return masterPrisma.plan.update({
      where: { plan_id: existing.plan_id },
      data: {
        plan_is_deleted: true,
        plan_deleted_at: new Date(),
        plan_deleted_by: deletedBy,
        plan_status: "Inactive",
      },
    });
  }

  getModuleCatalog() {
    return loadOwnerModuleCatalog();
  }

  getPlanImageOwnerId() {
    return PLAN_IMAGE_OWNER_ID;
  }

  async applyPlanToOwner(
    ownUuid,
    planUuid,
    { syncTenantLimits = true, own_start_date, own_expiry_date } = {}
  ) {
    const plan = await this.getPlanByUuid(planUuid);
    if (!plan) {
      const error = new Error("Plan not found.");
      error.statusCode = 404;
      throw error;
    }
    if (plan.plan_status !== "Active") {
      const error = new Error("Selected plan is not active.");
      error.statusCode = 400;
      throw error;
    }

    const owner = await masterPrisma.owner.findFirst({
      where: { own_uuid: ownUuid, own_is_deleted: false },
      select: {
        own_id: true,
        own_uuid: true,
        own_db: true,
        own_start_date: true,
        own_expiry_date: true,
      },
    });
    if (!owner) {
      const error = new Error("Owner not found.");
      error.statusCode = 404;
      throw error;
    }

    const subscriptionDates = resolveOwnerSubscriptionDates(
      {
        own_start_date: own_start_date ?? owner.own_start_date,
        own_expiry_date: own_expiry_date,
      },
      { existing: owner, plan }
    );

    await masterPrisma.owner.update({
      where: { own_id: owner.own_id },
      data: {
        own_plan_id: plan.plan_id,
        own_max_firms: plan.plan_max_firms,
        own_max_staff: plan.plan_max_staff,
        own_start_date: subscriptionDates.own_start_date,
        own_expiry_date: subscriptionDates.own_expiry_date,
      },
    });

    const moduleKeys = ownerModuleMapToKeys(plan.modules || plan.plan_modules || {});
    await ownerPermissionService.setModules(owner.own_id, moduleKeys);

    if (syncTenantLimits && owner.own_db) {
      const { BASE_URL } = require("../../../config/db");
      const { getTenantPrisma } = require("../../../utils/tenantPrisma");
      const tenantPrisma = getTenantPrisma(`${BASE_URL}/${owner.own_db}`);
      await tenantPrisma.owner.update({
        where: { own_uuid: owner.own_uuid },
        data: {
          own_max_firms: plan.plan_max_firms,
          own_max_staff: plan.plan_max_staff,
          own_start_date: subscriptionDates.own_start_date,
          own_expiry_date: subscriptionDates.own_expiry_date,
        },
      });
    }

    return {
      plan: this.serializePlan(plan),
      entitlements: await ownerPermissionService.getEntitlements(ownUuid),
    };
  }
}

module.exports = new PlanService();
