"use strict";

const jwtService = require("../utils/jwt.service");
const { PrismaClient: MasterPrismaClient } = require("../prisma/generated/master");
const { getTenantPrisma } = require("../utils/tenantPrisma");
const { BASE_URL } = require("../config/db");
const {
  ROLE_OWNER,
  ROLE_STAFF,
  getAllPermissionKeys,
} = require("../common/service/permission.helper");

const masterPrisma = new MasterPrismaClient();

/**
 * Authenticate owner or staff JWT.
 * Staff tokens carry role STAFF + staff_uuid; owner tokens carry role OWNER (default).
 */
const authenticateOwner = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Access denied. No token provided." });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwtService.verifyToken(token);

    if (!decoded || !decoded.own_uuid) {
      return res.status(401).json({ error: "Invalid or expired token." });
    }

    const owner = await masterPrisma.owner.findUnique({
      where: { own_uuid: decoded.own_uuid, own_is_deleted: false },
      select: {
        own_id: true,
        own_uuid: true,
        own_login_id: true,
        own_first_name: true,
        own_middle_name: true,
        own_last_name: true,
        own_email: true,
        own_mobile_no: true,
        own_phone_no: true,
        own_profile_img: true,
        own_address: true,
        own_village: true,
        own_city: true,
        own_state: true,
        own_pincode: true,
        own_db: true,
        own_status: true,
      },
    });

    if (!owner) {
      return res.status(404).json({ error: "Owner account not found." });
    }

    if (owner.own_status !== "Active") {
      return res.status(403).json({ error: "Owner account is inactive. Please contact support." });
    }

    const role = decoded.role === ROLE_STAFF ? ROLE_STAFF : ROLE_OWNER;

    if (role === ROLE_OWNER) {
      req.user = {
        role: ROLE_OWNER,
        own_id: owner.own_id,
        own_uuid: owner.own_uuid,
        own_login_id: owner.own_login_id,
        own_email: owner.own_email,
        own_db: owner.own_db,
        ownerProfile: owner,
        permissions: getAllPermissionKeys(),
      };
      return next();
    }

    if (!decoded.staff_uuid) {
      return res.status(401).json({ error: "Invalid staff token." });
    }

    const tenantPrisma = getTenantPrisma(`${BASE_URL}/${owner.own_db}`);

    const staff = await tenantPrisma.staff.findFirst({
      where: {
        staff_uuid: decoded.staff_uuid,
        staff_is_deleted: false,
      },
      select: {
        staff_id: true,
        staff_uuid: true,
        staff_login_id: true,
        staff_first_name: true,
        staff_last_name: true,
        staff_email_id: true,
        staff_mobile_no: true,
        staff_phone_no: true,
        staff_profile_img: true,
        staff_curr_address: true,
        staff_village: true,
        staff_city: true,
        staff_state: true,
        staff_pincode: true,
        staff_status: true,
        permissions: {
          where: { sp_granted: true },
          select: {
            permission: { select: { perm_key: true } },
          },
        },
      },
    });

    if (!staff) {
      return res.status(404).json({ error: "Staff account not found." });
    }

    if (staff.staff_status !== "Active") {
      return res.status(403).json({ error: "Staff account is inactive." });
    }

    const { permissions: staffPermRows, ...staffProfile } = staff;

    req.user = {
      role: ROLE_STAFF,
      own_id: owner.own_id,
      own_uuid: owner.own_uuid,
      own_login_id: owner.own_login_id,
      own_email: owner.own_email,
      own_db: owner.own_db,
      staff_id: staff.staff_id,
      staff_uuid: staff.staff_uuid,
      staff_login_id: staff.staff_login_id,
      staff_email: staff.staff_email_id,
      staffProfile,
      permissions: staffPermRows.map((p) => p.permission.perm_key),
    };

    return next();
  } catch (error) {
    console.error("❌  Authentication Error:", error.message);
    return res.status(500).json({ error: "Internal Server Error during authentication." });
  }
};

module.exports = authenticateOwner;
