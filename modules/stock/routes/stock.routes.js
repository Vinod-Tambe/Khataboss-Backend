"use strict";

const express = require("express");
const router = express.Router();
const stockController = require("../controller/stock.controller");
const authenticateOwner = require("../../../middlewares/auth.middleware");
const requirePermission = require("../../../middlewares/permission.middleware");

router.get(
  "/ledger",
  authenticateOwner,
  requirePermission(["stock.view", "loan.view"], { mode: "any" }),
  (req, res) => stockController.getStockLedger(req, res)
);

router.get(
  "/loan-stock-ledger",
  authenticateOwner,
  requirePermission("loan.view"),
  (req, res) => stockController.getLoanStockDailyLedger(req, res)
);

router.get(
  "/transferred-loan-ledger",
  authenticateOwner,
  requirePermission("loan.view"),
  (req, res) => stockController.getTransferredLoanDailyLedger(req, res)
);

router.get(
  "/interest-ledger",
  authenticateOwner,
  requirePermission("loan.view"),
  (req, res) => stockController.getInterestDailyLedger(req, res)
);

router.get(
  "/:uuid",
  authenticateOwner,
  requirePermission(["stock.view", "loan.view"], { mode: "any" }),
  (req, res) => stockController.getStockByUuid(req, res)
);

router.post(
  "/",
  authenticateOwner,
  requirePermission(["stock.view", "loan.view"], { mode: "any" }),
  (req, res) => stockController.createStock(req, res)
);

router.get(
  "/",
  authenticateOwner,
  requirePermission(["stock.view", "loan.view"], { mode: "any" }),
  (req, res) => stockController.getStocks(req, res)
);

module.exports = router;
