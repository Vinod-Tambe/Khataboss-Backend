"use strict";

const { PrismaClient: MasterPrismaClient } = require("../../../prisma/generated/master");
const { PrismaClient: MainPrismaClient } = require("../../../prisma/generated/main");
const { comparePassword } = require("../../../common/service/bcrypt.service");
const { validateStrongPassword } = require("../../../common/service/password.validation");
const jwtService = require("../../../utils/jwt.service");
const emailService = require("../../../common/service/email.service");
const messageDispatchService = require("../../../common/service/message-dispatch.service");
const otpService = require("../../../utils/otp.service");
const ownerService = require("../../owner/services/owner.service");
const staffService = require("../../staff/service/staff.service");
const { BASE_URL } = require("../../../config/db");
const {
  ROLE_OWNER,
  ROLE_STAFF,
  getAllPermissionKeys,
} = require("../../../common/service/permission.helper");

const masterPrisma = new MasterPrismaClient();

const toPublicOwner = (owner) => ({
  own_uuid: owner.own_uuid,
  own_login_id: owner.own_login_id,
  own_first_name: owner.own_first_name,
  own_middle_name: owner.own_middle_name,
  own_last_name: owner.own_last_name,
  own_email: owner.own_email,
  own_mobile_no: owner.own_mobile_no,
  own_phone_no: owner.own_phone_no,
  own_profile_img: owner.own_profile_img,
  own_address: owner.own_address,
  own_village: owner.own_village,
  own_city: owner.own_city,
  own_state: owner.own_state,
  own_pincode: owner.own_pincode,
  own_status: owner.own_status,
  role: ROLE_OWNER,
  permissions: getAllPermissionKeys(),
});

const toPublicStaffUser = (owner, staff, permissionKeys = []) => ({
  own_uuid: owner.own_uuid,
  // Profile UI shows staff login only; owner prefix is attached at login time
  own_login_id: staff.staff_login_id,
  own_db: owner.own_db,
  staff_uuid: staff.staff_uuid,
  staff_id: staff.staff_id,
  staff_login_id: staff.staff_login_id,
  owner_login_id: owner.own_login_id,
  // Full login used at sign-in: ownerLoginId + "+" + staffLoginId
  login_id: `${owner.own_login_id}+${staff.staff_login_id}`,
  own_first_name: staff.staff_first_name,
  own_middle_name: null,
  own_last_name: staff.staff_last_name,
  own_email: staff.staff_email_id,
  own_mobile_no: staff.staff_mobile_no,
  own_phone_no: staff.staff_phone_no,
  own_profile_img: staff.staff_profile_img,
  own_address: staff.staff_curr_address,
  own_village: staff.staff_village,
  own_city: staff.staff_city,
  own_state: staff.staff_state,
  own_pincode: staff.staff_pincode,
  own_status: staff.staff_status,
  role: ROLE_STAFF,
  permissions: permissionKeys,
});

/**
 * Service to handle authentication business logic.
 */
class AuthService {
  parseCompositeLoginId(login_id) {
    const raw = String(login_id || "").trim();
    if (!raw.includes("+")) {
      return { isStaffLogin: false, ownerPart: raw, staffPart: null };
    }
    const idx = raw.indexOf("+");
    const ownerPart = raw.slice(0, idx).trim();
    const staffPart = raw.slice(idx + 1).trim().toLowerCase();
    if (!ownerPart || !staffPart) {
      const error = new Error("please enter login as owner+staff (e.g. admin+dev).");
      error.statusCode = 400;
      throw error;
    }
    return { isStaffLogin: true, ownerPart, staffPart };
  }

  async loginAsStaff(ownerLoginId, staffLoginId, password, system_info = {}) {
    const owner = await masterPrisma.owner.findFirst({
      where: {
        own_login_id: ownerLoginId,
        own_is_deleted: false,
      },
    });

    if (!owner) {
      const error = new Error("please enter valid login details.");
      error.statusCode = 404;
      throw error;
    }

    if (owner.own_status !== "Active") {
      const error = new Error("account is inactive.");
      error.statusCode = 403;
      throw error;
    }

    const dbUrl = `${BASE_URL}/${owner.own_db}`;
    const staff = await staffService.getStaffByLoginId(dbUrl, staffLoginId);

    if (!staff) {
      const error = new Error("please enter valid login details.");
      error.statusCode = 404;
      throw error;
    }

    if (staff.staff_status !== "Active") {
      const error = new Error("account is inactive.");
      error.statusCode = 403;
      throw error;
    }

    const isPasswordValid = await comparePassword(password, staff.staff_password);
    if (!isPasswordValid) {
      const error = new Error("incorrect password.");
      error.statusCode = 401;
      throw error;
    }

    const permissionKeys = await staffService.getStaffPermissionKeys(dbUrl, staff.staff_id);

    const payload = {
      own_uuid: owner.own_uuid,
      own_login_id: owner.own_login_id,
      own_email: owner.own_email,
      role: ROLE_STAFF,
      staff_uuid: staff.staff_uuid,
      staff_login_id: staff.staff_login_id,
    };

    const accessToken = jwtService.generateAccessToken(payload);
    const refreshToken = jwtService.generateRefreshToken(payload);

    const tenantPrisma = new MainPrismaClient({
      datasources: { db: { url: dbUrl } },
    });
    try {
      await tenantPrisma.staff.update({
        where: { staff_id: staff.staff_id },
        data: {
          staff_jwt_token: accessToken,
          staff_refresh_token: refreshToken,
          staff_login_status: true,
          staff_last_login_system: system_info,
        },
      });
    } finally {
      await tenantPrisma.$disconnect();
    }

    const user = toPublicStaffUser(owner, staff, permissionKeys);
    return {
      token: accessToken,
      refreshToken,
      owner: user,
      user,
    };
  }

  /**
   * Authenticate an owner using login ID, email, or mobile.
   * Staff login format: ownerLoginId+staffLoginId (e.g. admin+dev).
   * @param {string} login_id - User identifier (login_id, email, mobile, or owner+staff).
   * @param {string} password - User password.
   * @param {object} system_info - Information about the login system (IP, device, etc.).
   */
  async login(login_id, password, system_info = {}) {
    const { isStaffLogin, ownerPart, staffPart } = this.parseCompositeLoginId(login_id);

    if (isStaffLogin) {
      return this.loginAsStaff(ownerPart, staffPart, password, system_info);
    }

    // 1. Find the owner in the master database
    const owner = await masterPrisma.owner.findFirst({
      where: {
        OR: [
          { own_login_id: ownerPart },
          { own_email: ownerPart },
          { own_mobile_no: ownerPart },
        ],
        own_is_deleted: false,
      },
    });

    if (!owner) {
      const error = new Error("please enter valid login details.");
      error.statusCode = 404;
      throw error;
    }

    if (owner.own_status !== "Active") {
      const error = new Error("account is inactive.");
      error.statusCode = 403;
      throw error;
    }

    // 2. Verify the password
    const isPasswordValid = await comparePassword(password, owner.own_password);
    if (!isPasswordValid) {
      const error = new Error("incorrect password.");
      error.statusCode = 401;
      throw error;
    }

    // 3. Generate Tokens
    const payload = {
      own_uuid: owner.own_uuid,
      own_login_id: owner.own_login_id,
      own_email: owner.own_email,
      role: ROLE_OWNER,
    };

    const accessToken = jwtService.generateAccessToken(payload);
    const refreshToken = jwtService.generateRefreshToken(payload);

    // 4. Update owner's session info in the database
    await masterPrisma.owner.update({
      where: { own_id: owner.own_id },
      data: {
        own_jwt_token: accessToken,
        own_refresh_token: refreshToken,
        own_login_status: true,
        own_last_login_system: system_info,
      },
    });

    const publicOwner = toPublicOwner(owner);

    // 5. Return success data (exclude password and technical/expiry details)
    return {
      token: accessToken,
      refreshToken: refreshToken,
      owner: publicOwner,
      user: publicOwner,
    };
  }

  /**
   * Send OTP to an owner via email after finding them by login_id, email, or mobile.
   * @param {string} login_id - User identifier (login_id, email, or mobile).
   */
  async sendOtp(login_id) {
    // 1. Find the owner in the master database
    const owner = await masterPrisma.owner.findFirst({
      where: {
        OR: [
          { own_login_id: login_id },
          { own_email: login_id },
          { own_mobile_no: login_id },
        ],
        own_is_deleted: false,
      },
    });

    if (!owner) {
      const error = new Error("account not found.");
      error.statusCode = 404;
      throw error;
    }

    if (owner.own_status !== "Active") {
      const error = new Error("account is inactive.");
      error.statusCode = 403;
      throw error;
    }

    // 2. Generate OTP and expiry
    const otp = otpService.generateOtp();
    const otpExpiry = otpService.getExpiryDate();

    // 3. Update owner in the master database
    await masterPrisma.owner.update({
      where: { own_id: owner.own_id },
      data: {
        own_otp: otp,
        own_otp_expiry: otpExpiry,
      },
    });

    // 4. Send OTP via seeded templates (email + WhatsApp when connected)
    const dbUrl = `${BASE_URL}/${owner.own_db}`;
    const tenantPrisma = new MainPrismaClient({
      datasources: { db: { url: dbUrl } },
    });
    try {
      const firm = await tenantPrisma.firm.findFirst({
        where: { firm_own_id: owner.own_id, firm_is_deleted: false },
        orderBy: { firm_id: "asc" },
        select: { firm_id: true, firm_name: true },
      });

      if (firm) {
        if (owner.own_email) {
          try {
            await messageDispatchService.dispatchMessage({
              dbUrl,
              ownDb: owner.own_db,
              firmId: firm.firm_id,
              templateKey: "owner_otp_login",
              toEmail: owner.own_email,
              vars: {
                1: owner.own_first_name || owner.own_login_id,
                2: otp,
              },
              sendWhatsApp: false,
              sendEmail: true,
            });
          } catch (emailErr) {
            await emailService.sendEmail(
              owner.own_email,
              "Your One-Time Password (OTP) for Login",
              "otp.html",
              { username: owner.own_first_name, otp },
              { ownId: owner.own_id, dbUrl }
            );
          }
        }
        if (owner.own_mobile_no) {
          messageDispatchService.dispatchSafe({
            dbUrl,
            ownDb: owner.own_db,
            firmId: firm.firm_id,
            templateKey: "owner_otp_login",
            toPhone: owner.own_mobile_no,
            vars: {
              1: owner.own_first_name || owner.own_login_id,
              2: otp,
            },
            sendWhatsApp: true,
            sendEmail: false,
          });
        }
      } else if (owner.own_email) {
        await emailService.sendEmail(
          owner.own_email,
          "Your One-Time Password (OTP) for Login",
          "otp.html",
          { username: owner.own_first_name, otp },
          { ownId: owner.own_id, dbUrl }
        );
      }
    } catch (dispatchErr) {
      console.warn("[auth] OTP template dispatch failed, falling back to otp.html:", dispatchErr.message);
      if (owner.own_email) {
        await emailService.sendEmail(
          owner.own_email,
          "Your One-Time Password (OTP) for Login",
          "otp.html",
          { username: owner.own_first_name, otp },
          { ownId: owner.own_id, dbUrl }
        );
      }
    } finally {
      await tenantPrisma.$disconnect();
    }

    return { message: "otp send your register email" };
  }

  /**
   * Verify OTP and log in an owner.
   * @param {string} login_id - User identifier (login_id, email, or mobile).
   * @param {string} otp - The OTP received by the user.
   * @param {object} system_info - Information about the login system (IP, device, etc.).
   */
  async verifyOtpAndLogin(login_id, otp, system_info = {}) {
    // 1. Find the owner in the master database
    const owner = await masterPrisma.owner.findFirst({
      where: {
        OR: [
          { own_login_id: login_id },
          { own_email: login_id },
          { own_mobile_no: login_id },
        ],
        own_is_deleted: false,
      },
    });

    if (!owner) {
      const error = new Error("account not found.");
      error.statusCode = 404;
      throw error;
    }

    // 2. Verify OTP
    if (!owner.own_otp || owner.own_otp !== otp) {
      const error = new Error("please enter valid otp.");
      error.statusCode = 401;
      throw error;
    }

    // 3. Check Expiry
    if (otpService.isExpired(owner.own_otp_expiry)) {
      const error = new Error("otp expired.");
      error.statusCode = 401;
      throw error;
    }

    // 4. Generate Tokens
    const payload = {
      own_uuid: owner.own_uuid,
      own_login_id: owner.own_login_id,
      own_email: owner.own_email,
      role: "OWNER",
    };

    const accessToken = jwtService.generateAccessToken(payload);
    const refreshToken = jwtService.generateRefreshToken(payload);

    // 5. Update owner info and CLEAR OTP
    await masterPrisma.owner.update({
      where: { own_id: owner.own_id },
      data: {
        own_jwt_token: accessToken,
        own_refresh_token: refreshToken,
        own_login_status: true,
        own_last_login_system: system_info,
        own_otp: null,
        own_otp_expiry: null,
      },
    });

    const publicOwner = toPublicOwner(owner);

    // 6. Return success data
    return {
      token: accessToken,
      refreshToken: refreshToken,
      owner: publicOwner,
      user: publicOwner,
    };
  }

  /**
   * Get authenticated owner/staff profile (no password).
   * Staff refresh reuses middleware profile + permissions (no 2nd tenant query).
   * @param {object} authUser - req.user from middleware
   */
  async getMe(authUser) {
    const ownUuid = authUser.own_uuid;

    if (authUser.role === ROLE_STAFF && authUser.staff_uuid) {
      // Zero extra DB when middleware already attached staffProfile + permissions
      if (authUser.staffProfile && Array.isArray(authUser.permissions)) {
        return toPublicStaffUser(
          {
            own_uuid: authUser.own_uuid,
            own_login_id: authUser.own_login_id,
            own_db: authUser.own_db,
          },
          authUser.staffProfile,
          authUser.permissions
        );
      }

      const owner = await masterPrisma.owner.findUnique({
        where: { own_uuid: ownUuid, own_is_deleted: false },
        select: {
          own_uuid: true,
          own_login_id: true,
          own_db: true,
        },
      });
      if (!owner) {
        const error = new Error("Owner account not found.");
        error.statusCode = 404;
        throw error;
      }

      const dbUrl = `${BASE_URL}/${owner.own_db}`;
      const staff = await staffService.getStaffByUuid(dbUrl, authUser.staff_uuid);
      if (!staff) {
        const error = new Error("Staff account not found.");
        error.statusCode = 404;
        throw error;
      }
      const keys = Array.isArray(authUser.permissions)
        ? authUser.permissions
        : await staffService.getStaffPermissionKeys(dbUrl, staff.staff_id);
      return toPublicStaffUser(owner, staff, keys);
    }

    if (authUser.ownerProfile) {
      return toPublicOwner(authUser.ownerProfile);
    }

    const owner = await masterPrisma.owner.findUnique({
      where: { own_uuid: ownUuid, own_is_deleted: false },
      select: {
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
        own_status: true,
      },
    });
    if (!owner) {
      const error = new Error("Owner account not found.");
      error.statusCode = 404;
      throw error;
    }

    return toPublicOwner(owner);
  }

  /**
   * Update authenticated owner profile (master + tenant).
   */
  async updateOwnerProfile(ownUuid, ownDb, updateData = {}) {
    const allowed = [
      "own_first_name",
      "own_middle_name",
      "own_last_name",
      "own_email",
      "own_mobile_no",
      "own_phone_no",
      "own_address",
      "own_village",
      "own_city",
      "own_state",
      "own_pincode",
      "own_profile_img",
    ];

    const dataToUpdate = {};
    for (const key of allowed) {
      if (updateData[key] !== undefined) {
        dataToUpdate[key] = updateData[key];
      }
    }

    if (Object.keys(dataToUpdate).length === 0) {
      const error = new Error("No valid profile fields to update.");
      error.statusCode = 400;
      throw error;
    }

    if (dataToUpdate.own_email || dataToUpdate.own_mobile_no) {
      const orConditions = [];
      if (dataToUpdate.own_email) orConditions.push({ own_email: dataToUpdate.own_email });
      if (dataToUpdate.own_mobile_no) orConditions.push({ own_mobile_no: dataToUpdate.own_mobile_no });

      const duplicate = await masterPrisma.owner.findFirst({
        where: {
          OR: orConditions,
          NOT: { own_uuid: ownUuid },
          own_is_deleted: false,
        },
      });
      if (duplicate) {
        let conflictField = "Details";
        if (dataToUpdate.own_email && duplicate.own_email === dataToUpdate.own_email) {
          conflictField = "Email";
        } else if (dataToUpdate.own_mobile_no && duplicate.own_mobile_no === dataToUpdate.own_mobile_no) {
          conflictField = "Mobile Number";
        }
        const error = new Error(`${conflictField} already exists in another record.`);
        error.statusCode = 409;
        throw error;
      }
    }

    const dbUrl = `${BASE_URL}/${ownDb}`;
    const updated = await ownerService.updateOwner(dbUrl, ownUuid, dataToUpdate);
    return toPublicOwner(updated);
  }

  /**
   * Update authenticated staff's own profile (tenant staff row only).
   */
  async updateStaffProfile(authUser, updateData = {}) {
    const owner = await masterPrisma.owner.findUnique({
      where: { own_uuid: authUser.own_uuid, own_is_deleted: false },
    });
    if (!owner) {
      const error = new Error("Owner account not found.");
      error.statusCode = 404;
      throw error;
    }

    const dbUrl = `${BASE_URL}/${owner.own_db}`;
    const staff = await staffService.getStaffByUuid(dbUrl, authUser.staff_uuid);
    if (!staff) {
      const error = new Error("Staff account not found.");
      error.statusCode = 404;
      throw error;
    }

    const mapped = {};
    if (updateData.own_first_name !== undefined) mapped.staff_first_name = updateData.own_first_name;
    if (updateData.own_last_name !== undefined) mapped.staff_last_name = updateData.own_last_name;
    if (updateData.own_email !== undefined) mapped.staff_email_id = updateData.own_email;
    if (updateData.own_mobile_no !== undefined) mapped.staff_mobile_no = updateData.own_mobile_no;
    if (updateData.own_phone_no !== undefined) mapped.staff_phone_no = updateData.own_phone_no;
    if (updateData.own_address !== undefined) mapped.staff_curr_address = updateData.own_address;
    if (updateData.own_village !== undefined) mapped.staff_village = updateData.own_village;
    if (updateData.own_city !== undefined) mapped.staff_city = updateData.own_city;
    if (updateData.own_state !== undefined) mapped.staff_state = updateData.own_state;
    if (updateData.own_pincode !== undefined) mapped.staff_pincode = updateData.own_pincode;
    if (updateData.own_profile_img !== undefined) mapped.staff_profile_img = updateData.own_profile_img;

    if (Object.keys(mapped).length === 0) {
      const error = new Error("No valid profile fields to update.");
      error.statusCode = 400;
      throw error;
    }

    const uniqueError = await staffService.checkUniqueFields(
      dbUrl,
      {
        staff_mobile_no: mapped.staff_mobile_no,
        staff_email_id: mapped.staff_email_id,
      },
      staff.staff_uuid
    );
    if (uniqueError) {
      const error = new Error(uniqueError.error);
      error.statusCode = 409;
      throw error;
    }

    const updated = await staffService.updateStaff(dbUrl, staff.staff_uuid, mapped);
    const keys = await staffService.getStaffPermissionKeys(dbUrl, updated.staff_id);
    return toPublicStaffUser(owner, updated, keys);
  }

  /**
   * Route profile update to owner or staff based on role.
   */
  async updateProfile(authUser, updateData = {}) {
    if (authUser.role === ROLE_STAFF) {
      return this.updateStaffProfile(authUser, updateData);
    }
    return this.updateOwnerProfile(authUser.own_uuid, authUser.own_db, updateData);
  }

  /**
   * Change staff password with old password verification.
   */
  async changeStaffPassword(authUser, currentPassword, newPassword, confirmPassword) {
    if (!currentPassword || !newPassword || !confirmPassword) {
      const error = new Error("Old password, new password and confirm password are required.");
      error.statusCode = 400;
      throw error;
    }
    if (newPassword !== confirmPassword) {
      const error = new Error("New password and confirm password do not match.");
      error.statusCode = 400;
      throw error;
    }

    const owner = await masterPrisma.owner.findUnique({
      where: { own_uuid: authUser.own_uuid, own_is_deleted: false },
    });
    if (!owner) {
      const error = new Error("Owner account not found.");
      error.statusCode = 404;
      throw error;
    }

    const dbUrl = `${BASE_URL}/${owner.own_db}`;
    const staff = await staffService.getStaffByUuid(dbUrl, authUser.staff_uuid);
    if (!staff) {
      const error = new Error("Staff account not found.");
      error.statusCode = 404;
      throw error;
    }

    const strength = validateStrongPassword(newPassword, {
      oldPassword: currentPassword,
      owner: {
        own_first_name: staff.staff_first_name,
        own_last_name: staff.staff_last_name,
        own_login_id: staff.staff_login_id,
        own_email: staff.staff_email_id,
        own_mobile_no: staff.staff_mobile_no,
      },
    });
    if (!strength.ok) {
      const error = new Error(strength.message);
      error.statusCode = 400;
      throw error;
    }

    const isValid = await comparePassword(currentPassword, staff.staff_password);
    if (!isValid) {
      const error = new Error("Old password is incorrect.");
      error.statusCode = 401;
      throw error;
    }

    await staffService.updateStaff(dbUrl, staff.staff_uuid, {
      staff_password: newPassword,
    });
    return { message: "Password updated successfully." };
  }

  /**
   * Change password with old password verification (owner or staff).
   */
  async changePassword(authUser, currentPassword, newPassword, confirmPassword) {
    if (authUser.role === ROLE_STAFF) {
      return this.changeStaffPassword(
        authUser,
        currentPassword,
        newPassword,
        confirmPassword
      );
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
      const error = new Error("Old password, new password and confirm password are required.");
      error.statusCode = 400;
      throw error;
    }
    if (newPassword !== confirmPassword) {
      const error = new Error("New password and confirm password do not match.");
      error.statusCode = 400;
      throw error;
    }

    const owner = await masterPrisma.owner.findUnique({
      where: { own_uuid: authUser.own_uuid, own_is_deleted: false },
    });
    if (!owner) {
      const error = new Error("Owner account not found.");
      error.statusCode = 404;
      throw error;
    }

    const strength = validateStrongPassword(newPassword, {
      oldPassword: currentPassword,
      owner,
    });
    if (!strength.ok) {
      const error = new Error(strength.message);
      error.statusCode = 400;
      throw error;
    }

    const isValid = await comparePassword(currentPassword, owner.own_password);
    if (!isValid) {
      const error = new Error("Old password is incorrect.");
      error.statusCode = 401;
      throw error;
    }

    const dbUrl = `${BASE_URL}/${authUser.own_db}`;
    await ownerService.updateOwner(dbUrl, authUser.own_uuid, { own_password: newPassword });
    return { message: "Password updated successfully." };
  }
}

module.exports = new AuthService();
