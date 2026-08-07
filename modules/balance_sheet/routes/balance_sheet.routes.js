"use strict";

const express = require("express");
const router = express.Router();
const controller = require("../controller/balance_sheet.controller");
const authenticateOwner = require("../../../middlewares/auth.middleware");
const requirePermission = require("../../../middlewares/permission.middleware");

router.get("/", authenticateOwner, requirePermission("reports.balanceSheet"), (req, res) => controller.get_all_balance_sheet_entries(req, res));

module.exports = router;
