"use strict";

const { PrismaClient: MasterPrismaClient } = require("../../../prisma/generated/master");
const { comparePassword } = require("../../../common/service/bcrypt.service");
const jwtService = require("../../../utils/jwt.service");
const emailService = require("../../../common/service/email.service");
const otpService = require("../../../utils/otp.service");

const masterPrisma = new MasterPrismaClient();

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
      owner: {
        own_uuid: owner.own_uuid,
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
      },
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
      owner: {
        own_uuid: owner.own_uuid,
        own_first_name: owner.own_first_name,
        own_middle_name: owner.own_middle_name,
        own_last_name: owner.own_last_name,
        own_email: owner.own_email,
        own_mobile_no: owner.own_mobile_no,
        own_profile_img: owner.own_profile_img,
      },
    };
  }
}

module.exports = new AuthService();
