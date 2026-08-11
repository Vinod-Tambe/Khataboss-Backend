"use strict";

const express = require("express");
const router = express.Router();
const depositController = require("../controller/deposit.controller");
const authenticateOwner = require("../../../middlewares/auth.middleware");
const requirePermission = require("../../../middlewares/permission.middleware");

router.post(
  "/",
  authenticateOwner,
  requirePermission("loan.deposit"),
  (req, res) => depositController.addDeposit(req, res)
);

router.delete(
  "/:dep_id",
  authenticateOwner,
  requirePermission("loan.deposit"),
  (req, res) => depositController.deleteDeposit(req, res)
);

module.exports = router;
