"use strict";

const jwtService = require("../utils/jwt.service");
const { getMasterPrisma } = require("../utils/masterPrisma");
const { ROLE_SUPER_ADMIN } = require("../common/service/permission.helper");

const masterPrisma = getMasterPrisma();

const authenticateAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Access denied. No token provided." });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwtService.verifyToken(token);

    if (!decoded || decoded.role !== ROLE_SUPER_ADMIN || !decoded.admin_uuid) {
      return res.status(401).json({ error: "Invalid or expired admin token." });
    }

    const admin = await masterPrisma.admin.findFirst({
      where: {
        admin_uuid: decoded.admin_uuid,
        admin_is_deleted: false,
      },
      select: {
        admin_id: true,
        admin_uuid: true,
        admin_login_id: true,
        admin_email: true,
        admin_first_name: true,
        admin_middle_name: true,
        admin_last_name: true,
        admin_mobile_no: true,
        admin_phone_no: true,
      },
    });

    if (!admin) {
      return res.status(404).json({ error: "Admin account not found." });
    }

    req.admin = {
      role: ROLE_SUPER_ADMIN,
      ...admin,
    };

    return next();
  } catch (error) {
    console.error("Admin authentication error:", error.message);
    return res.status(500).json({ error: "Internal Server Error during authentication." });
  }
};

module.exports = authenticateAdmin;
