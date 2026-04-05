"use strict";

const jwtService = require("../utils/jwt.service");
const { PrismaClient: MasterPrismaClient } = require("../prisma/generated/master");

const masterPrisma = new MasterPrismaClient();

/**
 * Middleware to authenticate an owner.
 * Extracts JWT from the Authorization header and validates the owner in the Master DB.
 */
const authenticateOwner = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Access denied. No token provided." });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwtService.verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ error: "Invalid or expired token." });
    }

    // Resolve owner record from Master Database
    const owner = await masterPrisma.owner.findUnique({
      where: { own_uuid: decoded.own_uuid, own_is_deleted: false },
    });

    if (!owner) {
      return res.status(404).json({ error: "Owner account not found." });
    }

    if (owner.own_status !== "Active") {
      return res.status(403).json({ error: "Owner account is inactive. Please contact support." });
    }

    // Attach owner info to req.user for further use in controllers
    req.user = {
      own_id: owner.own_id,
      own_uuid: owner.own_uuid,
      own_login_id: owner.own_login_id,
      own_email: owner.own_email,
      own_db: owner.own_db,
    };

    next();
  } catch (error) {
    console.error("❌  Authentication Error:", error.message);
    return res.status(500).json({ error: "Internal Server Error during authentication." });
  }
};

module.exports = authenticateOwner;
