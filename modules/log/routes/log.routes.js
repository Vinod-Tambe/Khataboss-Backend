"use strict";

const express = require("express");
const router = express.Router();
const logController = require("../controller/log.controller");
const authenticateOwner = require("../../../middlewares/auth.middleware");
const requirePermission = require("../../../middlewares/permission.middleware");

router.get(
  "/",
  authenticateOwner,
  requirePermission(["reports.logs", "loan.loanLogs"], { mode: "any" }),
  (req, res) => logController.getLogs(req, res)
);

module.exports = router;
