"use strict";

const express = require("express");
const router = express.Router();
const controller = require("../controller/profit_loss.controller");
const authenticateOwner = require("../../../middlewares/auth.middleware");
const requirePermission = require("../../../middlewares/permission.middleware");

router.get("/", authenticateOwner, requirePermission("reports.profitLoss"), (req, res) => controller.get_all_profit_loss_entries(req, res));

module.exports = router;
