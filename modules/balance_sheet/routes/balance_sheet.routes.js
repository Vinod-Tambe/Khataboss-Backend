"use strict";

const express = require("express");
const router = express.Router();
const authenticateOwner = require("../../../middlewares/auth.middleware");
const controller = require("../controller/balance_sheet.controller");

router.get("/", authenticateOwner, (req, res) => controller.get_all_balance_sheet_entries(req, res));

module.exports = router;
