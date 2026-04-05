"use strict";

const authService = require("../services/auth.service");

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
        message: "Login ID and password are required.",
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
        message: "Login successfully.",
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
        message: "own_login_id is required.",
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
        message: "own_login_id and otp are required.",
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
        message: "Logged in successfully.",
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
}

module.exports = new AuthController();
