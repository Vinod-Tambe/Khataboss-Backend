"use strict";

const express = require("express");
const router = express.Router();
const daybookController = require("../controller/daybook.controller");
const authenticateOwner = require("../../../middlewares/auth.middleware");
const requirePermission = require("../../../middlewares/permission.middleware");

router.get("/", authenticateOwner, requirePermission("reports.daybook"), (req, res) => daybookController.get_all_daybook_entries(req, res));

module.exports = router;
