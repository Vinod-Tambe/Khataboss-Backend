"use strict";

const express = require("express");
const releaseController = require("../controller/release.controller");
const authenticateOwner = require("../../../middlewares/auth.middleware");
const requirePermission = require("../../../middlewares/permission.middleware");

const router = express.Router();

router.use(authenticateOwner);

router.post("/", requirePermission("loan.release"), (req, res) => releaseController.addRelease(req, res));
router.delete("/:rel_id", requirePermission("loan.release"), (req, res) => releaseController.deleteRelease(req, res));

module.exports = router;
