"use strict";

const express = require("express");
const router = express.Router();
const purityController = require("../controller/purity.controller");
const authenticateOwner = require("../../../middlewares/auth.middleware");
const requirePermission = require("../../../middlewares/permission.middleware");

router.post("/", authenticateOwner, requirePermission("settings.manage"), (req, res) => purityController.createPurity(req, res));
router.put("/:uuid", authenticateOwner, requirePermission("settings.manage"), (req, res) => purityController.updatePurity(req, res));
router.get(
  "/",
  authenticateOwner,
  requirePermission(["settings.manage", "loan.view", "loan.create", "loan.edit"], { mode: "any" }),
  (req, res) => purityController.getPurities(req, res)
);
router.delete("/:uuid", authenticateOwner, requirePermission("settings.manage"), (req, res) => purityController.deletePurity(req, res));

module.exports = router;
