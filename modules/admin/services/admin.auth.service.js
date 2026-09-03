"use strict";

const { getMasterPrisma } = require("../../../utils/masterPrisma");
const { comparePassword } = require("../../../common/service/bcrypt.service");
const jwtService = require("../../../utils/jwt.service");
const { ROLE_SUPER_ADMIN } = require("../../../common/service/permission.helper");

const masterPrisma = getMasterPrisma();

const toPublicAdmin = (admin) => ({
  admin_uuid: admin.admin_uuid,
  admin_login_id: admin.admin_login_id,
  admin_email: admin.admin_email,
  admin_first_name: admin.admin_first_name,
  admin_middle_name: admin.admin_middle_name,
  admin_last_name: admin.admin_last_name,
  admin_mobile_no: admin.admin_mobile_no,
  admin_phone_no: admin.admin_phone_no,
  role: ROLE_SUPER_ADMIN,
});

class AdminAuthService {
  async login(login_id, password, system_info = {}) {
    const identifier = String(login_id || "").trim();

    const admin = await masterPrisma.admin.findFirst({
      where: {
        admin_is_deleted: false,
        OR: [
          { admin_login_id: identifier },
          { admin_email: identifier },
          { admin_mobile_no: identifier },
        ],
      },
    });

    if (!admin) {
      const error = new Error("Invalid admin login details.");
      error.statusCode = 401;
      throw error;
    }

    const isPasswordValid = await comparePassword(password, admin.admin_password);
    if (!isPasswordValid) {
      const error = new Error("Incorrect password.");
      error.statusCode = 401;
      throw error;
    }

    const payload = {
      role: ROLE_SUPER_ADMIN,
      admin_uuid: admin.admin_uuid,
      admin_login_id: admin.admin_login_id,
      admin_email: admin.admin_email,
    };

    const token = jwtService.generateAccessToken(payload);
    const refreshToken = jwtService.generateRefreshToken(payload);

    await masterPrisma.admin.update({
      where: { admin_id: admin.admin_id },
      data: {
        admin_jwt_token: token,
        admin_refresh_token: refreshToken,
        admin_login_status: true,
        admin_last_login_system: system_info,
      },
    });

    const publicAdmin = toPublicAdmin(admin);

    return {
      token,
      refreshToken,
      admin: publicAdmin,
      user: publicAdmin,
    };
  }

  async getProfile(adminUuid) {
    const admin = await masterPrisma.admin.findFirst({
      where: {
        admin_uuid: adminUuid,
        admin_is_deleted: false,
      },
    });

    if (!admin) {
      const error = new Error("Admin account not found.");
      error.statusCode = 404;
      throw error;
    }

    return toPublicAdmin(admin);
  }
}

module.exports = new AdminAuthService();
