"use strict";

const { getMasterPrisma } = require("../../../utils/masterPrisma");
const {
  comparePassword,
  hashPassword,
} = require("../../../common/service/bcrypt.service");
const { validateStrongPassword } = require("../../../common/service/password.validation");
const jwtService = require("../../../utils/jwt.service");
const { ROLE_SUPER_ADMIN } = require("../../../common/service/permission.helper");

const masterPrisma = getMasterPrisma();

const DEFAULT_COMPANY_NAME = "KhataBoss";

const toPublicAdmin = (admin) => ({
  admin_uuid: admin.admin_uuid,
  admin_login_id: admin.admin_login_id,
  admin_email: admin.admin_email,
  admin_first_name: admin.admin_first_name,
  admin_middle_name: admin.admin_middle_name,
  admin_last_name: admin.admin_last_name,
  admin_mobile_no: admin.admin_mobile_no,
  admin_phone_no: admin.admin_phone_no,
  admin_company_name: admin.admin_company_name || "",
  role: ROLE_SUPER_ADMIN,
});

const formatDisplayName = (admin) =>
  [admin?.admin_first_name, admin?.admin_last_name].filter(Boolean).join(" ").trim();

const toBranding = (admin) => ({
  company_name: admin?.admin_company_name?.trim() || DEFAULT_COMPANY_NAME,
  display_name: formatDisplayName(admin) || DEFAULT_COMPANY_NAME,
  help_phone: admin?.admin_mobile_no || admin?.admin_phone_no || "",
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

  async updateProfile(adminUuid, updateData = {}) {
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

    const data = { admin_updated_by: admin.admin_login_id };

    if (updateData.admin_first_name !== undefined) {
      const value = String(updateData.admin_first_name).trim();
      if (!value) {
        const error = new Error("First name is required.");
        error.statusCode = 400;
        throw error;
      }
      data.admin_first_name = value;
    }

    if (updateData.admin_middle_name !== undefined) {
      data.admin_middle_name = String(updateData.admin_middle_name).trim() || null;
    }

    if (updateData.admin_last_name !== undefined) {
      const value = String(updateData.admin_last_name).trim();
      if (!value) {
        const error = new Error("Last name is required.");
        error.statusCode = 400;
        throw error;
      }
      data.admin_last_name = value;
    }

    if (updateData.admin_mobile_no !== undefined) {
      data.admin_mobile_no = String(updateData.admin_mobile_no).trim() || null;
    }

    if (updateData.admin_phone_no !== undefined) {
      data.admin_phone_no = String(updateData.admin_phone_no).trim() || null;
    }

    if (updateData.admin_company_name !== undefined) {
      data.admin_company_name = String(updateData.admin_company_name).trim() || null;
    }

    if (updateData.admin_login_id !== undefined) {
      const loginId = String(updateData.admin_login_id).trim().toLowerCase();
      if (!loginId) {
        const error = new Error("Login ID is required.");
        error.statusCode = 400;
        throw error;
      }

      if (loginId !== admin.admin_login_id) {
        const duplicateLogin = await masterPrisma.admin.findFirst({
          where: {
            admin_login_id: loginId,
            admin_is_deleted: false,
            NOT: { admin_id: admin.admin_id },
          },
        });

        if (duplicateLogin) {
          const error = new Error("Login ID is already in use.");
          error.statusCode = 409;
          throw error;
        }

        data.admin_login_id = loginId;
      }
    }

    const newPassword = updateData.new_password ?? updateData.admin_password;
    const currentPassword = updateData.current_password ?? updateData.admin_current_password;
    const confirmPassword = updateData.confirm_password ?? updateData.admin_confirm_password;

    if (newPassword !== undefined && String(newPassword).trim() !== "") {
      if (!currentPassword) {
        const error = new Error("Current password is required to set a new password.");
        error.statusCode = 400;
        throw error;
      }

      if (!confirmPassword) {
        const error = new Error("Confirm password is required.");
        error.statusCode = 400;
        throw error;
      }

      if (String(newPassword) !== String(confirmPassword)) {
        const error = new Error("New password and confirm password do not match.");
        error.statusCode = 400;
        throw error;
      }

      const isCurrentValid = await comparePassword(currentPassword, admin.admin_password);
      if (!isCurrentValid) {
        const error = new Error("Current password is incorrect.");
        error.statusCode = 401;
        throw error;
      }

      const strength = validateStrongPassword(newPassword, {
        oldPassword: currentPassword,
      });
      if (!strength.ok) {
        const error = new Error(strength.message);
        error.statusCode = 400;
        throw error;
      }

      data.admin_password = await hashPassword(newPassword);
    }

    const updated = await masterPrisma.admin.update({
      where: { admin_id: admin.admin_id },
      data,
    });

    return toPublicAdmin(updated);
  }

  async getBranding() {
    const admin = await masterPrisma.admin.findFirst({
      where: { admin_is_deleted: false },
      orderBy: { admin_id: "asc" },
    });

    return toBranding(admin);
  }
}

module.exports = new AdminAuthService();
