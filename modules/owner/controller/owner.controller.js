"use strict";

const { BASE_URL, setupOwnerDatabase } = require("../../../config/db");
const { seedPermissions } = require("../../../prisma/seeder/permission-seeder");
const ownerService = require("../services/owner.service");
const ownerPermissionService = require("../services/owner-permission.service");
const planService = require("../../plan/services/plan.service");
const imageService = require("../../../utils/image.service");
const { resolveOwnerSubscriptionDates } = require("../../../utils/owner-subscription-dates");
const { getMasterPrisma } = require("../../../utils/masterPrisma");

const masterPrisma = getMasterPrisma();

const sanitizeOwner = (owner) => {
  if (!owner) return owner;
  const {
    own_password,
    own_refresh_token,
    own_jwt_token,
    own_otp,
    own_otp_expiry,
    ...safe
  } = owner;
  return safe;
};

const sanitizeOwners = (owners) => (Array.isArray(owners) ? owners.map(sanitizeOwner) : []);

/**
 * Controller to handle owner creation logic.
 */
class OwnerController {
  /**
   * GET /owner
   * Fetch a list of all owners from the master database.
   */
  async getOwners(req, res) {
    try {
      console.log("🔍  Fetching list of all owners from Master DB...");
      const owners = await ownerService.getOwners();

      return res.status(200).json({
        message: "Owners fetched successfully.",
        data: sanitizeOwners(owners),
      });
    } catch (error) {
      console.error("❌  Error fetching owners:", error.message);
      return res.status(500).json({ error: error.message });
    }
  }

  /**
   * GET /owner/:uuid
   * Fetch a single owner by UUID from the master database.
   */
  async getOwnerByUuid(req, res) {
    try {
      const { uuid } = req.params;
      const owner = await ownerService.getOwnerByUuid(uuid);

      if (!owner) {
        return res.status(404).json({ error: "Owner not found." });
      }

      const entitlements = await ownerPermissionService.getEntitlements(uuid);

      return res.status(200).json({
        message: "Owner fetched successfully.",
        data: {
          ...sanitizeOwner(owner),
          entitlements,
        },
      });
    } catch (error) {
      console.error("❌  Error fetching owner:", error.message);
      return res.status(500).json({ error: error.message });
    }
  }

  /**
   * POST /owner
   * Create a new database, migrate schema, and record owner data.
   */
  async createOwner(req, res) {
    try {
      const ownerData = req.body;

      // 1. Basic Validation
      const { own_email, own_login_id, own_mobile_no, own_password, own_confirm_password, own_first_name, own_last_name } = ownerData;

      if (!own_email || !own_login_id || !own_mobile_no || !own_first_name || !own_last_name) {
        return res.status(400).json({ error: "Missing required fields (own_email, own_login_id, own_mobile_no, own_first_name, own_last_name)." });
      }

      if (!own_password || !own_confirm_password) {
        return res.status(400).json({ error: "Password and confirm password are required." });
      }

      if (own_password !== own_confirm_password) {
        return res.status(400).json({ error: "Passwords do not match." });
      }

      // 2. Pre-creation Duplicate Check (Master DB)
      console.log("🔍  Checking for duplicate owner in Master DB...");
      const existingOwner = await masterPrisma.owner.findFirst({
        where: {
          OR: [
            { own_email: own_email },
            { own_login_id: own_login_id },
            { own_mobile_no: own_mobile_no }
          ],
          own_is_deleted: false
        }
      });

      if (existingOwner) {
        let conflictField = "";
        if (existingOwner.own_email === own_email) conflictField = "Email";
        else if (existingOwner.own_login_id === own_login_id) conflictField = "Login ID";
        else if (existingOwner.own_mobile_no === own_mobile_no) conflictField = "Mobile Number";

        return res.status(409).json({ 
          error: `${conflictField} already exists in the system. Please use unique details.` 
        });
      }

      // 2. Dynamic Database Name Generation from DbSeries
      const SERIES_NAME = "kboss";
      let dbName = "";

      try {
        console.log(`🔍  Fetching DbSeries for name: ${SERIES_NAME}`);
        const series = await masterPrisma.dbSeries.findUnique({
          where: { series_name: SERIES_NAME },
        });

        if (!series) {
          throw new Error(`Series "${SERIES_NAME}" not found in master database.`);
        }

        const nextNumber = series.last_number + 1;
        dbName = `${SERIES_NAME}${nextNumber}`;

        // Update last_number in master DB
        await masterPrisma.dbSeries.update({
          where: { series_name: SERIES_NAME },
          data: { last_number: nextNumber },
        });

        console.log(`✨  Generated database name: ${dbName}`);
      } catch (dbError) {
        console.error("❌  Error generating database name:", dbError.message);
        return res.status(500).json({ error: "Failed to generate database name." });
      }

      // 4. Setup the dynamic database and migrate schema
      console.log(`🚀  Starting database setup for: ${dbName}`);
      const dbUrl = await setupOwnerDatabase(dbName);

      // 4b. Seed permission catalog for staff RBAC in tenant DB
      console.log(`🔐  Seeding permissions for: ${dbName}`);
      await seedPermissions(dbUrl);

      let selectedPlan = null;
      if (ownerData.plan_uuid) {
        selectedPlan = await planService.getPlanByUuid(ownerData.plan_uuid);
        if (!selectedPlan) {
          return res.status(404).json({ error: "Selected plan not found." });
        }
      }

      const subscriptionDates = resolveOwnerSubscriptionDates(ownerData, { plan: selectedPlan });

      // 5. Save owner record in the new database
      console.log(`📝  Saving owner record in database: ${dbName}`);
      const newOwner = await ownerService.createOwner(dbUrl, {
        ...ownerData,
        own_db: dbName,
        ...subscriptionDates,
        own_created_by: req.admin?.admin_login_id || "Admin",
      });

      // 5b. Apply subscription plan or seed default entitlements
      if (ownerData.plan_uuid) {
        await planService.applyPlanToOwner(newOwner.own_uuid, ownerData.plan_uuid, {
          own_start_date: subscriptionDates.own_start_date,
          own_expiry_date: subscriptionDates.own_expiry_date,
        });
      } else {
        const limits = ownerPermissionService.parseLimits(ownerData);
        await ownerPermissionService.seedDefaultEntitlements(newOwner.own_id, newOwner.own_uuid, dbUrl, {
          own_max_firms: limits.own_max_firms,
          own_max_staff: limits.own_max_staff,
          modules: ownerData.modules,
          module_keys: ownerData.module_keys,
        });
      }

      // 6. Handle File Upload (Move from temp to owner-specific dir)
      if (req.file) {
        const profileImgData = await imageService.moveSingleFile(
          newOwner.own_id,
          "owner",
          newOwner.own_id,
          req.file,
          "own_profile_img"
        );
        await ownerService.updateOwner(dbUrl, newOwner.own_uuid, { own_profile_img: profileImgData });
      }

      console.log(`✅  Owner created successfully: ${newOwner.own_uuid}`);
      
      const entitlements = await ownerPermissionService.getEntitlements(newOwner.own_uuid);

      return res.status(201).json({
        message: "Owner created and database initialized successfully.",
        data: {
          ...sanitizeOwner(newOwner),
          entitlements,
        },
      });
    } catch (error) {
      console.error("❌  Error creating owner:", error.message);
      return res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  /**
   * PATCH /owner/:uuid
   * Update owner details in their specific database.
   */
  async updateOwner(req, res) {
    try {
      const { uuid } = req.params;
      const updateData = req.body;

      console.log(`🔍  Resolving db name for owner ${uuid} from Master DB...`);
      const ownerRecordFull = await masterPrisma.owner.findUnique({
        where: { own_uuid: uuid, own_is_deleted: false },
        select: {
          own_id: true,
          own_db: true,
          own_profile_img: true,
          own_start_date: true,
          own_expiry_date: true,
        },
      });

      if (!ownerRecordFull) {
        return res.status(404).json({ error: "Owner not found in Master database." });
      }

      const { own_db, own_profile_img: existingProfileImg } = ownerRecordFull;
      console.log(`✨  Resolved database: ${own_db}`);

      const { own_email, own_login_id, own_mobile_no } = updateData;
      if (own_email || own_login_id || own_mobile_no) {
        const orConditions = [];
        if (own_email) orConditions.push({ own_email });
        if (own_login_id) orConditions.push({ own_login_id });
        if (own_mobile_no) orConditions.push({ own_mobile_no });

        const duplicateOwner = await masterPrisma.owner.findFirst({
          where: {
            OR: orConditions,
            NOT: { own_uuid: uuid },
            own_is_deleted: false,
          },
        });

        if (duplicateOwner) {
          let conflictField = "";
          if (own_email && duplicateOwner.own_email === own_email) conflictField = "Email";
          else if (own_login_id && duplicateOwner.own_login_id === own_login_id) conflictField = "Login ID";
          else if (own_mobile_no && duplicateOwner.own_mobile_no === own_mobile_no) conflictField = "Mobile Number";

          return res.status(409).json({ 
            error: `${conflictField} already exists in another record.` 
          });
        }
      }

      if (updateData.plan_uuid) {
        await planService.applyPlanToOwner(uuid, updateData.plan_uuid, {
          own_start_date: updateData.own_start_date,
          own_expiry_date: updateData.own_expiry_date,
        });
        delete updateData.plan_uuid;
      }

      if (updateData.own_start_date !== undefined || updateData.own_expiry_date !== undefined) {
        const subscriptionDates = resolveOwnerSubscriptionDates(updateData, {
          existing: ownerRecordFull,
        });
        updateData.own_start_date = subscriptionDates.own_start_date;
        updateData.own_expiry_date = subscriptionDates.own_expiry_date;
      }

      // Handle File Upload for profile image
      if (req.file) {
        updateData.own_profile_img = await imageService.replaceSingleFile(
          ownerRecordFull.own_id,
          "owner",
          ownerRecordFull.own_id,
          req.file,
          "own_profile_img",
          existingProfileImg
        );
      }

      // Construct dbUrl (assuming the same logic as createOwner)
      // In a real app, this might come from a config or master DB
      const dbUrl = `${BASE_URL}/${own_db}`;

      console.log(`📝  Updating owner ${uuid} in database: ${own_db}`);
      const updatedOwner = Object.keys(updateData).length
        ? await ownerService.updateOwner(dbUrl, uuid, updateData)
        : await ownerService.getOwnerByUuid(uuid);

      const entitlements = await ownerPermissionService.getEntitlements(uuid);

      return res.status(200).json({
        message: "Owner updated successfully.",
        data: {
          ...sanitizeOwner(updatedOwner),
          entitlements,
        },
      });
    } catch (error) {
      console.error("❌  Error updating owner:", error.message);
      return res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  /**
   * DELETE /owner/:uuid
   * Soft delete owner in their specific database.
   */
  async deleteOwner(req, res) {
    try {
      const { uuid } = req.params;

      // 1. Resolve own_db from Master Database using uuid
      console.log(`🔍  Resolving db name for owner ${uuid} from Master DB...`);
      const ownerRecord = await masterPrisma.owner.findUnique({
        where: { own_uuid: uuid, own_is_deleted: false },
        select: { own_id: true, own_db: true }
      });

      if (!ownerRecord) {
        return res.status(404).json({ error: "Owner not found in Master database." });
      }

      const { own_db } = ownerRecord;
      console.log(`🗑️  Deleting owner ${uuid} from database: ${own_db}`);

      const dbUrl = `${BASE_URL}/${own_db}`;

      await ownerService.deleteOwner(dbUrl, uuid, req.admin?.admin_login_id || "Admin");

      return res.status(200).json({
        message: "Owner deleted successfully (soft delete).",
      });
    } catch (error) {
      console.error("❌  Error deleting owner:", error.message);
      return res.status(500).json({ error: error.message });
    }
  }

  /**
   * PATCH /owner/:uuid/status
   */
  async updateOwnerStatus(req, res) {
    try {
      const { uuid } = req.params;
      const { own_status } = req.body;

      if (!["Active", "Inactive"].includes(own_status)) {
        return res.status(400).json({ error: "own_status must be Active or Inactive." });
      }

      const ownerRecord = await masterPrisma.owner.findUnique({
        where: { own_uuid: uuid, own_is_deleted: false },
        select: { own_db: true },
      });

      if (!ownerRecord) {
        return res.status(404).json({ error: "Owner not found in Master database." });
      }

      const dbUrl = `${BASE_URL}/${ownerRecord.own_db}`;
      const updatedOwner = await ownerService.updateOwner(dbUrl, uuid, {
        own_status,
        own_updated_by: req.admin?.admin_login_id || "Admin",
      });

      return res.status(200).json({
        message: `Owner status updated to ${own_status}.`,
        data: sanitizeOwner(updatedOwner),
      });
    } catch (error) {
      console.error("❌  Error updating owner status:", error.message);
      return res.status(500).json({ error: error.message });
    }
  }

  /**
   * POST /owner/:uuid/reset-password
   */
  /**
   * GET /owner/permissions/catalog
   * Module catalog for super-admin (firm, staff, customer, finance, loan, customization).
   */
  async getPermissionCatalog(req, res) {
    try {
      const data = ownerPermissionService.getCatalog();
      return res.status(200).json({
        message: "Owner permission catalog fetched.",
        data,
      });
    } catch (error) {
      console.error("❌  Error fetching owner permission catalog:", error.message);
      return res.status(500).json({ error: error.message });
    }
  }

  /**
   * GET /owner/:uuid/permissions
   */
  async getOwnerPermissions(req, res) {
    try {
      const entitlements = await ownerPermissionService.getEntitlements(req.params.uuid);
      if (!entitlements) {
        return res.status(404).json({ error: "Owner not found." });
      }
      return res.status(200).json({
        message: "Owner entitlements fetched.",
        data: entitlements,
      });
    } catch (error) {
      console.error("❌  Error fetching owner permissions:", error.message);
      return res.status(500).json({ error: error.message });
    }
  }

  /**
   * PATCH /owner/:uuid/permissions
   * Set module permissions + firm/staff limits for an owner.
   */
  async updateOwnerPermissions(req, res) {
    try {
      const entitlements = await ownerPermissionService.updateEntitlements(
        req.params.uuid,
        req.body
      );
      return res.status(200).json({
        message: "Owner entitlements updated.",
        data: entitlements,
      });
    } catch (error) {
      console.error("❌  Error updating owner permissions:", error.message);
      return res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async resetOwnerPassword(req, res) {
    try {
      const { uuid } = req.params;
      const { new_password, confirm_password, own_login_id } = req.body;

      const ownerRecord = await masterPrisma.owner.findUnique({
        where: { own_uuid: uuid, own_is_deleted: false },
        select: {
          own_id: true,
          own_db: true,
          own_login_id: true,
          own_email: true,
          own_mobile_no: true,
        },
      });

      if (!ownerRecord) {
        return res.status(404).json({ error: "Owner not found in Master database." });
      }

      const updateData = {
        own_updated_by: req.admin?.admin_login_id || "Admin",
      };
      let loginUpdated = false;
      let passwordUpdated = false;

      if (own_login_id !== undefined) {
        const loginId = String(own_login_id).trim();
        if (!loginId) {
          return res.status(400).json({ error: "Login ID is required." });
        }

        if (loginId !== ownerRecord.own_login_id) {
          const duplicateOwner = await masterPrisma.owner.findFirst({
            where: {
              OR: [{ own_login_id: loginId }],
              NOT: { own_uuid: uuid },
              own_is_deleted: false,
            },
          });

          if (duplicateOwner) {
            return res.status(409).json({ error: "Login ID already exists in another record." });
          }

          updateData.own_login_id = loginId;
          loginUpdated = true;
        }
      }

      const hasPasswordInput = new_password || confirm_password;
      if (hasPasswordInput) {
        if (!new_password || !confirm_password) {
          return res.status(400).json({ error: "new_password and confirm_password are required." });
        }

        if (new_password !== confirm_password) {
          return res.status(400).json({ error: "Passwords do not match." });
        }

        updateData.own_password = new_password;
        passwordUpdated = true;
      }

      if (!loginUpdated && !passwordUpdated) {
        return res.status(400).json({ error: "No login ID or password changes to save." });
      }

      const dbUrl = `${BASE_URL}/${ownerRecord.own_db}`;
      const updatedOwner = await ownerService.updateOwner(dbUrl, uuid, updateData);

      let message = "Owner account updated successfully.";
      if (loginUpdated && passwordUpdated) {
        message = "Owner login ID and password updated successfully.";
      } else if (loginUpdated) {
        message = "Owner login ID updated successfully.";
      } else if (passwordUpdated) {
        message = "Owner password reset successfully.";
      }

      return res.status(200).json({
        message,
        data: sanitizeOwner(updatedOwner),
      });
    } catch (error) {
      console.error("❌  Error resetting owner password:", error.message);
      return res.status(error.statusCode || 500).json({ error: error.message });
    }
  }
}

module.exports = new OwnerController();
