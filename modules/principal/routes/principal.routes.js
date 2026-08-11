"use strict";

const express = require("express");
const router = express.Router();
const principalController = require("../controller/principal.controller");
const authenticateOwner = require("../../../middlewares/auth.middleware");
const requirePermission = require("../../../middlewares/permission.middleware");

router.post(
  "/",
  authenticateOwner,
  requirePermission("loan.addPrincipal"),
  (req, res) => principalController.addAdditionalPrincipal(req, res)
);

router.delete(
  "/:ap_id",
  authenticateOwner,
  requirePermission("loan.addPrincipal"),
  (req, res) => principalController.deleteAdditionalPrincipal(req, res)
);

module.exports = router;
