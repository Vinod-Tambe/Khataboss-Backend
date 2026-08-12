"use strict";

const express = require("express");
const router = express.Router();
const dashboardController = require("../controller/dashboard.controller");
const authenticateToken = require("../../../middlewares/auth.middleware");

router.get("/user", authenticateToken, (req, res) => dashboardController.getUserDashboard(req, res));
router.get("/home", authenticateToken, (req, res) => dashboardController.getOwnerDashboard(req, res));

module.exports = router;
