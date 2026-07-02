"use strict";

const express = require("express");
const router = express.Router();
const depositController = require("../controller/deposit.controller");
const authenticateOwner = require("../../../middlewares/auth.middleware");

router.post(
  "/",
  authenticateOwner,
  (req, res) => depositController.addDeposit(req, res)
);

module.exports = router;
