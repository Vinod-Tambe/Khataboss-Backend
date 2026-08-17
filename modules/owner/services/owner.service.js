"use strict";

const { getTenantPrisma } = require("../../../utils/tenantPrisma");
const { getMasterPrisma } = require("../../../utils/masterPrisma");
const { hashPassword } = require("../../../common/service/bcrypt.service");

const masterPrisma = getMasterPrisma();

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
    });
  }

  /**
   * Create an owner record in both master and tenant databases.
   * @param {string} dbUrl - Connection URL for the owner's database.
   * @param {object} ownerData - The owner data to insert.
   */
  async createOwner(dbUrl, ownerData) {
    const tenantPrisma = getTenantPrisma(dbUrl);


      // Hash the password
      const hashedPassword = await hashPassword(ownerData.own_password);
      const finalOwnerData = {
        own_db: ownerData.own_db,
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

      // 2. Create in Tenant Database
      console.log(`📝  Saving owner record in Tenant DB: ${ownerData.own_db}...`);
      await tenantPrisma.owner.create({
        data: {
          ...finalOwnerData,
          own_id: masterOwner.own_id, // Ensure ID consistency across DBs
          own_uuid: masterOwner.own_uuid, // Ensure UUID consistency across DBs
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
  async updateOwner(dbUrl, ownUuid, updateData) {
    const tenantPrisma = getTenantPrisma(dbUrl);


      const dataToUpdate = { ...updateData };

      // Hash password if provided
      if (dataToUpdate.own_password) {
        dataToUpdate.own_password = await hashPassword(dataToUpdate.own_password);
      }

      // Remove fields that should not be updated manually via this API
      delete dataToUpdate.own_id;
      delete dataToUpdate.own_uuid;
      delete dataToUpdate.own_product_key;
      delete dataToUpdate.own_db;
      delete dataToUpdate.own_created_at;

      // 1. Update in Master Database
      console.log(`📝  Updating owner ${ownUuid} in Master DB...`);
      const updatedMasterOwner = await masterPrisma.owner.update({
        where: { own_uuid: ownUuid },
        data: dataToUpdate,
      });

      // 2. Update in Tenant Database
      console.log(`📝  Updating owner ${ownUuid} in Tenant DB...`);
      await tenantPrisma.owner.update({
        where: { own_uuid: ownUuid },
        data: dataToUpdate,
      });

      return updatedMasterOwner;
    
  }

  /**
   * Delete (soft delete) an owner record in both master and tenant databases.
   * @param {string} dbUrl - Connection URL for the owner's database.
   * @param {string} ownUuid - The UUID of the owner to delete.
   * @param {string} deletedBy - The user who is deleting the record.
   */
  async deleteOwner(dbUrl, ownUuid, deletedBy = null) {
    const tenantPrisma = getTenantPrisma(dbUrl);


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
      console.log(`🗑️  Soft deleting owner ${ownUuid} in Tenant DB...`);
      return await tenantPrisma.owner.update({
        where: { own_uuid: ownUuid },
        data: deleteData,
      });
    
  }
}

module.exports = new OwnerService();
