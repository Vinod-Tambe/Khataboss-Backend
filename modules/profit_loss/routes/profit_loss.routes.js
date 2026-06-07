"use strict";

const express = require("express");
const router = express.Router();
const authenticateOwner = require("../../../middlewares/auth.middleware");
const controller = require("../controller/profit_loss.controller");

router.get("/", authenticateOwner, (req, res) => controller.get_all_profit_loss_entries(req, res));

module.exports = router;
