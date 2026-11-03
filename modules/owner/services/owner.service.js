"use strict";

const { getTenantPrisma } = require("../../../utils/tenantPrisma");
const { getMasterPrisma } = require("../../../utils/masterPrisma");
const { hashPassword } = require("../../../common/service/bcrypt.service");
const { isOfflineOwnerRecord } = require("../utils/owner-login-type.helper");

const masterPrisma = getMasterPrisma();

function parseOptionalIntField(value) {
  if (value === undefined || value === null || value === "") return null;
  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) ? null : parsed;
}

/** Fields stored on master Owner only — omit when writing tenant Owner rows. */
function toTenantOwnerWriteData(ownerData) {
  const data = { ...ownerData };
  delete data.own_login_type;
  delete data.own_plan_id;
  return data;
}

/**
 * Service to handle owner record operations in both master and tenant databases.
 */
class OwnerService {
  /**
   * Get a list of all owners from the master database.
   */
  async getOwners() {
    return await masterPrisma.owner.findMany({
      where: { own_is_deleted: false },
      orderBy: { own_created_at: "desc" },
      include: {
        plan: {
          select: {
            plan_uuid: true,
            plan_name: true,
            plan_code: true,
            plan_price: true,
            plan_offer_price: true,
            plan_billing_cycle: true,
            plan_status: true,
          },
        },
      },
    });
  }

  /**
   * Get a single owner by UUID from the master database.
   */
  async getOwnerByUuid(ownUuid) {
    return await masterPrisma.owner.findFirst({
      where: { own_uuid: ownUuid, own_is_deleted: false },
      include: {
        plan: {
          select: {
            plan_uuid: true,
            plan_name: true,
            plan_code: true,
            plan_price: true,
            plan_offer_price: true,
            plan_billing_cycle: true,
            plan_status: true,
            plan_max_firms: true,
            plan_max_staff: true,
          },
        },
      },
    });
  }

  /**
   * Create an owner record in both master and tenant databases.
   * @param {string} dbUrl - Connection URL for the owner's database.
   * @param {object} ownerData - The owner data to insert.
   */
  async createOwner(dbUrl, ownerData, options = {}) {
    const skipTenant = Boolean(options.skipTenant || !dbUrl);

    // Hash the password
    const hashedPassword = await hashPassword(ownerData.own_password);
    const finalOwnerData = {
      own_db: ownerData.own_db,
      own_login_type: ownerData.own_login_type || "Online",
      own_max_firms: parseOptionalIntField(ownerData.own_max_firms),
      own_max_staff: parseOptionalIntField(ownerData.own_max_staff),
      own_start_date: ownerData.own_start_date ?? null,
      own_expiry_date: ownerData.own_expiry_date ?? null,
      own_first_name: ownerData.own_first_name,
      own_middle_name: ownerData.own_middle_name,
      own_last_name: ownerData.own_last_name,
      own_phone_no: ownerData.own_phone_no,
      own_mobile_no: ownerData.own_mobile_no,
      own_email: ownerData.own_email,
      own_login_id: ownerData.own_login_id,
      own_password: hashedPassword,
      own_address: ownerData.own_address,
      own_village: ownerData.own_village,
      own_city: ownerData.own_city,
      own_state: ownerData.own_state,
      own_pincode: ownerData.own_pincode,
      own_created_by: ownerData.own_created_by,
      own_profile_img: ownerData.own_profile_img,
    };

    // 1. Create in Master Database
    console.log("📝  Saving owner record in Master DB...");
    const masterOwner = await masterPrisma.owner.create({
      data: finalOwnerData,
    });

    if (skipTenant) {
      console.log(`ℹ️  Skipping tenant DB record (login type: ${finalOwnerData.own_login_type}).`);
      return masterOwner;
    }

    const tenantPrisma = getTenantPrisma(dbUrl);

    // 2. Create in Tenant Database
    console.log(`📝  Saving owner record in Tenant DB: ${ownerData.own_db}...`);
    await tenantPrisma.owner.create({
      data: {
        ...toTenantOwnerWriteData(finalOwnerData),
        own_id: masterOwner.own_id,
        own_uuid: masterOwner.own_uuid,
      },
    });

    return masterOwner;
  }

  /**
   * Update an owner record in both master and tenant databases.
   * @param {string} dbUrl - Connection URL for the owner's database.
   * @param {string} ownUuid - The UUID of the owner to update.
   * @param {object} updateData - The owner data to update.
   */
  async updateOwner(dbUrl, ownUuid, updateData, options = {}) {
    let skipTenant = options.skipTenant;

    if (skipTenant === undefined) {
      const meta = await masterPrisma.owner.findUnique({
        where: { own_uuid: ownUuid },
        select: { own_login_type: true },
      });
      skipTenant = isOfflineOwnerRecord(meta);
    }

    const tenantPrisma = skipTenant ? null : getTenantPrisma(dbUrl);

    const dataToUpdate = { ...updateData };

      if (Object.prototype.hasOwnProperty.call(dataToUpdate, "own_max_firms")) {
        dataToUpdate.own_max_firms = parseOptionalIntField(dataToUpdate.own_max_firms);
      }
      if (Object.prototype.hasOwnProperty.call(dataToUpdate, "own_max_staff")) {
        dataToUpdate.own_max_staff = parseOptionalIntField(dataToUpdate.own_max_staff);
      }
      if (Object.prototype.hasOwnProperty.call(dataToUpdate, "own_idle_timeout_min")) {
        const n = Number.parseInt(dataToUpdate.own_idle_timeout_min, 10);
        dataToUpdate.own_idle_timeout_min = Number.isFinite(n)
          ? Math.min(60, Math.max(1, n))
          : 2;
      }

      // Hash password if provided
      if (dataToUpdate.own_password) {
        dataToUpdate.own_password = await hashPassword(dataToUpdate.own_password);
      }

      // Remove fields that should not be updated manually via this API
      delete dataToUpdate.own_id;
      delete dataToUpdate.own_uuid;
      delete dataToUpdate.own_product_key;
      delete dataToUpdate.own_db;
      delete dataToUpdate.own_login_type;
      delete dataToUpdate.own_created_at;

      // 1. Update in Master Database
      console.log(`📝  Updating owner ${ownUuid} in Master DB...`);
      const updatedMasterOwner = await masterPrisma.owner.update({
        where: { own_uuid: ownUuid },
        data: dataToUpdate,
      });

      // 2. Update in Tenant Database
      if (!skipTenant && tenantPrisma) {
        console.log(`📝  Updating owner ${ownUuid} in Tenant DB...`);
        await this.patchTenantOwner(dbUrl, ownUuid, dataToUpdate);
      }

      return updatedMasterOwner;
  }

  /**
   * Delete (soft delete) an owner record in both master and tenant databases.
   * @param {string} dbUrl - Connection URL for the owner's database.
   * @param {string} ownUuid - The UUID of the owner to delete.
   * @param {string} deletedBy - The user who is deleting the record.
   */
  async deleteOwner(dbUrl, ownUuid, deletedBy = null, options = {}) {
    let skipTenant = options.skipTenant;

    if (skipTenant === undefined) {
      const meta = await masterPrisma.owner.findUnique({
        where: { own_uuid: ownUuid },
        select: { own_login_type: true },
      });
      skipTenant = isOfflineOwnerRecord(meta);
    }

    const tenantPrisma = skipTenant ? null : getTenantPrisma(dbUrl);

    const deleteData = {
        own_is_deleted: true,
        own_deleted_at: new Date(),
        own_deleted_by: deletedBy,
        own_status: "Inactive",
      };

      // 1. Soft delete in Master Database
      console.log(`🗑️  Soft deleting owner ${ownUuid} in Master DB...`);
      await masterPrisma.owner.update({
        where: { own_uuid: ownUuid },
        data: deleteData,
      });

      // 2. Soft delete in Tenant Database
      if (!skipTenant && tenantPrisma) {
        console.log(`🗑️  Soft deleting owner ${ownUuid} in Tenant DB...`);
        return await tenantPrisma.owner.update({
          where: { own_uuid: ownUuid },
          data: deleteData,
        });
      }

      return masterPrisma.owner.findUnique({ where: { own_uuid: ownUuid } });
  }

  /**
   * Update tenant Owner row; create from master first if missing (online owners only).
   */
  async patchTenantOwner(dbUrl, ownUuid, patchData) {
    if (!dbUrl || !ownUuid || !patchData || Object.keys(patchData).length === 0) {
      return null;
    }

    const data = toTenantOwnerWriteData(patchData);
    const tenantPrisma = getTenantPrisma(dbUrl);

    const existing = await tenantPrisma.owner.findFirst({
      where: { own_uuid: ownUuid },
      select: { own_id: true },
    });

    if (!existing) {
      const masterOwner = await masterPrisma.owner.findFirst({
        where: { own_uuid: ownUuid, own_is_deleted: false },
      });
      if (!masterOwner || isOfflineOwnerRecord(masterOwner)) {
        return null;
      }
      console.warn(
        `⚠️  Tenant owner row missing for ${ownUuid}; mirroring from master before update.`
      );
      await this.ensureTenantOwnerFromMaster(dbUrl, masterOwner);
    }

    return tenantPrisma.owner.update({
      where: { own_uuid: ownUuid },
      data,
    });
  }

  /**
   * Mirror master owner row into tenant DB (password already hashed on master).
   */
  async ensureTenantOwnerFromMaster(dbUrl, masterOwner) {
    const tenantPrisma = getTenantPrisma(dbUrl);

    const existing = await tenantPrisma.owner.findFirst({
      where: { own_uuid: masterOwner.own_uuid },
    });
    if (existing) return existing;

    return tenantPrisma.owner.create({
      data: {
        own_id: masterOwner.own_id,
        own_uuid: masterOwner.own_uuid,
        own_db: masterOwner.own_db,
        own_first_name: masterOwner.own_first_name,
        own_middle_name: masterOwner.own_middle_name,
        own_last_name: masterOwner.own_last_name,
        own_phone_no: masterOwner.own_phone_no,
        own_mobile_no: masterOwner.own_mobile_no,
        own_email: masterOwner.own_email,
        own_login_id: masterOwner.own_login_id,
        own_password: masterOwner.own_password,
        own_status: masterOwner.own_status,
        own_profile_img: masterOwner.own_profile_img,
        own_address: masterOwner.own_address,
        own_village: masterOwner.own_village,
        own_city: masterOwner.own_city,
        own_state: masterOwner.own_state,
        own_pincode: masterOwner.own_pincode,
        own_max_firms: masterOwner.own_max_firms,
        own_max_staff: masterOwner.own_max_staff,
        own_start_date: masterOwner.own_start_date,
        own_expiry_date: masterOwner.own_expiry_date,
        own_idle_timeout_min: masterOwner.own_idle_timeout_min ?? 2,
      },
    });
  }
}

module.exports = new OwnerService();
