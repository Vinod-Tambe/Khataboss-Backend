"use strict";

const { BASE_URL, setupOwnerDatabase } = require("../../../config/db");
const ownerService = require("../services/owner.service");
const imageService = require("../../../utils/image.service");
const { PrismaClient } = require("../../../prisma/generated/master");

const masterPrisma = new PrismaClient();

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
        data: owners,
      });
    } catch (error) {
      console.error("❌  Error fetching owners:", error.message);
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
      const { own_email, own_login_id, own_mobile_no, own_password, own_confirm_password } = ownerData;

      if (!own_email || !own_login_id || !own_mobile_no) {
        return res.status(400).json({ error: "Missing required fields (own_email, own_login_id, own_mobile_no)." });
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

      // 5. Save owner record in the new database
      console.log(`📝  Saving owner record in database: ${dbName}`);
      const newOwner = await ownerService.createOwner(dbUrl, {
        ...ownerData,
        own_db: dbName,
      });

      // 6. Handle File Upload (Move from temp to owner-specific dir)
      if (req.file) {
        const profileImgData = await imageService.moveSingleFile("owner", newOwner.own_uuid, req.file, "own_profile_img");
        await ownerService.updateOwner(dbUrl, newOwner.own_uuid, { own_profile_img: profileImgData });
      }

      console.log(`✅  Owner created successfully: ${newOwner.own_uuid}`);
      
      return res.status(201).json({
        message: "Owner created and database initialized successfully.",
        data: {
          uuid: newOwner.own_uuid,
          db: newOwner.own_db,
          email: newOwner.own_email,
        },
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
        select: { own_db: true }
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
        updateData.own_profile_img = await imageService.moveSingleFile("owner", uuid, req.file, "own_profile_img");
      }

      // Construct dbUrl (assuming the same logic as createOwner)
      // In a real app, this might come from a config or master DB
      const dbUrl = `${BASE_URL}/${own_db}`;

      console.log(`📝  Updating owner ${uuid} in database: ${own_db}`);
      const updatedOwner = await ownerService.updateOwner(dbUrl, uuid, updateData);

      return res.status(200).json({
        message: "Owner updated successfully.",
        data: {
          uuid: updatedOwner.own_uuid,
          email: updatedOwner.own_email,
        },
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
        select: { own_db: true }
      });

      if (!ownerRecord) {
        return res.status(404).json({ error: "Owner not found in Master database." });
      }

      const { own_db } = ownerRecord;
      console.log(`🗑️  Deleting owner ${uuid} from database: ${own_db}`);

      const dbUrl = `${BASE_URL}/${own_db}`;

      await ownerService.deleteOwner(dbUrl, uuid, "Admin"); // Hardcoded "Admin" for now

      return res.status(200).json({
        message: "Owner deleted successfully (soft delete).",
      });
    } catch (error) {
      console.error("❌  Error deleting owner:", error.message);
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new OwnerController();
