"use strict";

const express = require("express");
const router = express.Router();
const financeController = require("../controller/finance.controller");
const authenticateOwner = require("../../../middlewares/auth.middleware");
const requirePermission = require("../../../middlewares/permission.middleware");

router.get("/", authenticateOwner, requirePermission("finance.view"), (req, res) => financeController.getFinances(req, res));
router.get("/dropdown/:userId", authenticateOwner, requirePermission(["finance.view", "finance.payment"], { mode: "any" }), (req, res) => financeController.getFinancesDropdown(req, res));
router.get("/transactions", authenticateOwner, requirePermission(["finance.view", "finance.history"], { mode: "any" }), (req, res) => financeController.getTransactions(req, res));
router.post("/", authenticateOwner, requirePermission("finance.create"), (req, res) => financeController.createFinance(req, res));
router.put("/:id", authenticateOwner, requirePermission("finance.edit"), (req, res) => financeController.updateFinance(req, res));
router.get("/:id", authenticateOwner, requirePermission("finance.view"), (req, res) => financeController.getFinanceDetails(req, res));
router.post("/payment", authenticateOwner, requirePermission("finance.payment"), (req, res) => financeController.createPayment(req, res));
router.delete("/:id", authenticateOwner, requirePermission("finance.delete"), (req, res) => financeController.deleteFinance(req, res));

module.exports = router;
