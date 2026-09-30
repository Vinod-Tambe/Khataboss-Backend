"use strict";

const express = require("express");
const adminAuthController = require("../controller/admin.auth.controller");
const adminDashboardController = require("../controller/admin.dashboard.controller");
const announcementController = require("../../announcement/controller/announcement.controller");
const authenticateAdmin = require("../../../middlewares/admin.middleware");

const router = express.Router();

router.post("/auth/login", adminAuthController.login.bind(adminAuthController));
router.get("/branding", adminAuthController.branding.bind(adminAuthController));
router.get("/auth/me", authenticateAdmin, adminAuthController.me.bind(adminAuthController));
router.patch("/auth/profile", authenticateAdmin, adminAuthController.updateProfile.bind(adminAuthController));
router.get("/dashboard", authenticateAdmin, adminDashboardController.getStats.bind(adminDashboardController));

router.post(
  "/announcement/templates/seed",
  authenticateAdmin,
  announcementController.seedTemplates.bind(announcementController)
);

module.exports = router;
