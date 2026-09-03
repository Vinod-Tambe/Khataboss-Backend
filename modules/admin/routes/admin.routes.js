"use strict";

const express = require("express");
const adminAuthController = require("../controller/admin.auth.controller");
const adminDashboardController = require("../controller/admin.dashboard.controller");
const authenticateAdmin = require("../../../middlewares/admin.middleware");

const router = express.Router();

router.post("/auth/login", adminAuthController.login.bind(adminAuthController));
router.get("/auth/me", authenticateAdmin, adminAuthController.me.bind(adminAuthController));
router.get("/dashboard", authenticateAdmin, adminDashboardController.getStats.bind(adminDashboardController));

module.exports = router;
