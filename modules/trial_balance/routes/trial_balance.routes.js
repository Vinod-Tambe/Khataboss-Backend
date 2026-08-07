"use strict";

const express = require("express");
const router = express.Router();
const controller = require("../controller/trial_balance.controller");
const authenticateOwner = require("../../../middlewares/auth.middleware");
const requirePermission = require("../../../middlewares/permission.middleware");

router.get("/", authenticateOwner, requirePermission("reports.trialBalance"), (req, res) => controller.get_all_trial_balance_entries(req, res));

module.exports = router;
