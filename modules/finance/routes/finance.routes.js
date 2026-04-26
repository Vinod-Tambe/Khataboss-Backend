"use strict";

const express = require("express");
const router = express.Router();
const financeController = require("../controller/finance.controller");
const authenticateOwner = require("../../../middlewares/auth.middleware");

/**
 * Route definitions for Finance
 */

router.get("/", authenticateOwner, (req, res) => financeController.getFinances(req, res));
router.post("/", authenticateOwner, (req, res) => financeController.createFinance(req, res));
router.get("/:id", authenticateOwner, (req, res) => financeController.getFinanceDetails(req, res));
router.post("/payment", authenticateOwner, (req, res) => financeController.createPayment(req, res));

router.delete("/:id", authenticateOwner, (req, res) => financeController.deleteFinance(req, res));

module.exports = router;
