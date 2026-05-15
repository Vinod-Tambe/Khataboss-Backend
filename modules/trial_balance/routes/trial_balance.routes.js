"use strict";

const express = require("express");
const router = express.Router();
const authenticateOwner = require("../../../middlewares/auth.middleware");
const controller = require("../controller/trial_balance.controller");

router.get("/", authenticateOwner, (req, res) => controller.get_all_trial_balance_entries(req, res));

module.exports = router;
