"use strict";

const adminAuthService = require("../services/admin.auth.service");

class AdminAuthController {
  async login(req, res) {
    const { login_id, password } = req.body;

    if (!login_id || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter login ID and password.",
      });
    }

    try {
      const systemInfo = {
        ip: req.ip,
        agent: req.get("User-Agent"),
        timestamp: new Date().toISOString(),
      };

      const result = await adminAuthService.login(login_id, password, systemInfo);

      return res.status(200).json({
        success: true,
        message: "Admin login successful.",
        data: result,
      });
    } catch (error) {
      return res.status(error.statusCode || 401).json({
        success: false,
        message: error.message || "Invalid credentials.",
      });
    }
  }

  async me(req, res) {
    try {
      const profile = await adminAuthService.getProfile(req.admin.admin_uuid);
      return res.status(200).json({
        success: true,
        message: "Admin profile fetched successfully.",
        data: profile,
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Failed to load admin profile.",
      });
    }
  }
}

module.exports = new AdminAuthController();
