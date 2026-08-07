"use strict";

const express = require("express");
const router = express.Router();
const rateController = require("../controller/rate.controller");
const authenticateOwner = require("../../../middlewares/auth.middleware");
const requirePermission = require("../../../middlewares/permission.middleware");

router.post("/", authenticateOwner, requirePermission("settings.manage"), (req, res) => rateController.createRate(req, res));
router.put("/:uuid", authenticateOwner, requirePermission("settings.manage"), (req, res) => rateController.updateRate(req, res));
router.get(
  "/",
  authenticateOwner,
  requirePermission(["settings.manage", "loan.view", "loan.create", "loan.edit"], { mode: "any" }),
  (req, res) => rateController.getRates(req, res)
);
router.delete("/:uuid", authenticateOwner, requirePermission("settings.manage"), (req, res) => rateController.deleteRate(req, res));

module.exports = router;
