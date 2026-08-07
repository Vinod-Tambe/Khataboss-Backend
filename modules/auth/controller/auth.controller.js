"use strict";

const authService = require("../services/auth.service");
const imageService = require("../../../utils/image.service");

/**
 * Controller to handle authentication requests.
 */
class AuthController {
  /**
   * Login request handler.
   * @param {import("express").Request} req - Express request object.
   * @param {import("express").Response} res - Express response object.
   */
  async login(req, res) {
    const { login_id, password } = req.body;

    if (!login_id || !password) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "please enter login id and password.",
      });
    }

    try {
      // Capture system information if available
      const systemInfo = {
        ip: req.ip,
        agent: req.get("User-Agent"),
        timestamp: new Date().toISOString(),
      };

      const result = await authService.login(login_id, password, systemInfo);

      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: "login successfully.",
        data: result,
      });
    } catch (error) {
      // console.error("Login Controller Error:", error.message);
      const statusCode = error.statusCode || 401;
      return res.status(statusCode).json({
        success: false,
        statusCode: statusCode,
        message: error.message || "Invalid credentials.",
      });
    }
  }

  /**
   * Send OTP request handler.
   */
  async sendOtp(req, res) {
    const { own_login_id } = req.body;

    if (!own_login_id) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "please enter email or mobile.",
      });
    }

    try {
      const result = await authService.sendOtp(own_login_id);
      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: result.message,
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({
        success: false,
        statusCode: statusCode,
        message: error.message || "Something went wrong.",
      });
    }
  }

  /**
   * Verify OTP and Login request handler.
   */
  async verifyOtp(req, res) {
    const { own_login_id, otp } = req.body;

    if (!own_login_id || !otp) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "please enter email/mobile and otp.",
      });
    }

    try {
      const systemInfo = {
        ip: req.ip,
        agent: req.get("User-Agent"),
        timestamp: new Date().toISOString(),
      };

      const result = await authService.verifyOtpAndLogin(own_login_id, otp, systemInfo);

      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: "login successfully.",
        data: result,
      });
    } catch (error) {
      const statusCode = error.statusCode || 401;
      return res.status(statusCode).json({
        success: false,
        statusCode: statusCode,
        message: error.message || "Invalid OTP or credentials.",
      });
    }
  }

  /**
   * GET /auth/me
   */
  async getMe(req, res) {
    try {
      const owner = await authService.getMe(req.user.own_uuid);
      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: "Profile fetched successfully.",
        data: owner,
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({
        success: false,
        statusCode,
        message: error.message || "Failed to fetch profile.",
      });
    }
  }

  /**
   * PATCH /auth/profile
   */
  async updateProfile(req, res) {
    try {
      const updateData = { ...req.body };

      if (req.file) {
        updateData.own_profile_img = await imageService.moveSingleFile(
          "owner",
          req.user.own_id,
          req.file,
          "own_profile_img"
        );
      }

      const owner = await authService.updateProfile(
        req.user.own_uuid,
        req.user.own_db,
        updateData
      );

      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: "Profile updated successfully.",
        data: owner,
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({
        success: false,
        statusCode,
        message: error.message || "Failed to update profile.",
      });
    }
  }

  /**
   * POST /auth/change-password
   */
  async changePassword(req, res) {
    try {
      const {
        old_password,
        current_password,
        new_password,
        confirm_password,
      } = req.body || {};

      const currentPassword = old_password || current_password;
      const result = await authService.changePassword(
        req.user.own_uuid,
        req.user.own_db,
        currentPassword,
        new_password,
        confirm_password
      );

      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: result.message,
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({
        success: false,
        statusCode,
        message: error.message || "Failed to change password.",
      });
    }
  }
}

module.exports = new AuthController();
