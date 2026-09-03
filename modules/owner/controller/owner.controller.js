"use strict";

const { BASE_URL, setupOwnerDatabase } = require("../../../config/db");
const { seedPermissions } = require("../../../prisma/seeder/permission-seeder");
const ownerService = require("../services/owner.service");
const imageService = require("../../../utils/image.service");
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

      return res.status(200).json({
        message: "Owner fetched successfully.",
        data: sanitizeOwner(owner),
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

      // 4b. Seed permission catalog (owner has all permissions by role)
      console.log(`🔐  Seeding permissions for: ${dbName}`);
      await seedPermissions(dbUrl);

      // 5. Save owner record in the new database
      console.log(`📝  Saving owner record in database: ${dbName}`);
      const newOwner = await ownerService.createOwner(dbUrl, {
        ...ownerData,
        own_db: dbName,
      });

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
      
      return res.status(201).json({
        message: "Owner created and database initialized successfully.",
        data: sanitizeOwner(newOwner),
      });
    } catch (error) {
      console.error("❌  Error creating owner:", error.message);
      return res.status(500).json({ error: error.message });
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

      // 1. Resolve own_db from Master Database using uuid
      console.log(`🔍  Resolving db name for owner ${uuid} from Master DB...`);
      const ownerRecord = await masterPrisma.owner.findUnique({
        where: { own_uuid: uuid, own_is_deleted: false },
        select: { own_id: true, own_db: true, own_profile_img: true }
      });

      if (!ownerRecord) {
        return res.status(404).json({ error: "Owner not found in Master database." });
      }

      const { own_db } = ownerRecord;
      console.log(`✨  Resolved database: ${own_db}`);

      // Check for duplicates before updating (Master DB)

      // Check for duplicates before updating (Master DB)
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

      // Handle File Upload for profile image
      if (req.file) {
        updateData.own_profile_img = await imageService.replaceSingleFile(
          ownerRecord.own_id,
          "owner",
          ownerRecord.own_id,
          req.file,
          "own_profile_img",
          ownerRecord.own_profile_img
        );
      }

      // Construct dbUrl (assuming the same logic as createOwner)
      // In a real app, this might come from a config or master DB
      const dbUrl = `${BASE_URL}/${own_db}`;

      console.log(`📝  Updating owner ${uuid} in database: ${own_db}`);
      const updatedOwner = await ownerService.updateOwner(dbUrl, uuid, updateData);

      return res.status(200).json({
        message: "Owner updated successfully.",
        data: sanitizeOwner(updatedOwner),
      });
    } catch (error) {
      console.error("❌  Error updating owner:", error.message);
      return res.status(500).json({ error: error.message });
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
  async resetOwnerPassword(req, res) {
    try {
      const { uuid } = req.params;
      const { new_password, confirm_password } = req.body;

      if (!new_password || !confirm_password) {
        return res.status(400).json({ error: "new_password and confirm_password are required." });
      }

      if (new_password !== confirm_password) {
        return res.status(400).json({ error: "Passwords do not match." });
      }

      const ownerRecord = await masterPrisma.owner.findUnique({
        where: { own_uuid: uuid, own_is_deleted: false },
        select: { own_db: true },
      });

      if (!ownerRecord) {
        return res.status(404).json({ error: "Owner not found in Master database." });
      }

      const dbUrl = `${BASE_URL}/${ownerRecord.own_db}`;
      await ownerService.updateOwner(dbUrl, uuid, {
        own_password: new_password,
        own_updated_by: req.admin?.admin_login_id || "Admin",
      });

      return res.status(200).json({
        message: "Owner password reset successfully.",
      });
    } catch (error) {
      console.error("❌  Error resetting owner password:", error.message);
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new OwnerController();
