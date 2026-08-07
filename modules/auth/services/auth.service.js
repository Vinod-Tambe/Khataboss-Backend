"use strict";

const { PrismaClient: MasterPrismaClient } = require("../../../prisma/generated/master");
const { comparePassword } = require("../../../common/service/bcrypt.service");
const { validateStrongPassword } = require("../../../common/service/password.validation");
const jwtService = require("../../../utils/jwt.service");
const emailService = require("../../../common/service/email.service");
const otpService = require("../../../utils/otp.service");
const ownerService = require("../../owner/services/owner.service");
const { BASE_URL } = require("../../../config/db");

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
});

/**
 * Service to handle authentication business logic.
 */
class AuthService {
  /**
   * Authenticate an owner using login ID, email, or mobile.
   * @param {string} login_id - User identifier (login_id, email, or mobile).
   * @param {string} password - User password.
   * @param {object} system_info - Information about the login system (IP, device, etc.).
   */
  async login(login_id, password, system_info = {}) {
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
      role: "OWNER",
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

    // 5. Return success data (exclude password and technical/expiry details)
    return {
      token: accessToken,
      refreshToken: refreshToken,
      owner: toPublicOwner(owner),
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

    // 4. Send email with OTP
    const replacements = {
      username: owner.own_first_name,
      otp: otp,
    };

    await emailService.sendEmail(
      owner.own_email,
      "Your One-Time Password (OTP) for Login",
      "otp.html",
      replacements
    );

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

    // 6. Return success data
    return {
      token: accessToken,
      refreshToken: refreshToken,
      owner: toPublicOwner(owner),
    };
  }

  /**
   * Get authenticated owner profile (no password).
   */
  async getMe(ownUuid) {
    const owner = await masterPrisma.owner.findUnique({
      where: { own_uuid: ownUuid, own_is_deleted: false },
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
  async updateProfile(ownUuid, ownDb, updateData = {}) {
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
   * Change password with old password verification.
   */
  async changePassword(ownUuid, ownDb, currentPassword, newPassword, confirmPassword) {
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
      where: { own_uuid: ownUuid, own_is_deleted: false },
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

    const dbUrl = `${BASE_URL}/${ownDb}`;
    // ownerService hashes own_password before saving to master + tenant
    await ownerService.updateOwner(dbUrl, ownUuid, { own_password: newPassword });
    return { message: "Password updated successfully." };
  }
}

module.exports = new AuthService();
