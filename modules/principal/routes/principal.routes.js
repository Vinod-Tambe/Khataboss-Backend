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

module.exports = router;
