"use strict";

const express = require("express");
const router = express.Router();
const stockController = require("../controller/stock.controller");
const authenticateOwner = require("../../../middlewares/auth.middleware");
const requirePermission = require("../../../middlewares/permission.middleware");

router.get(
  "/ledger",
  authenticateOwner,
  requirePermission("loan.view"),
  (req, res) => stockController.getStockLedger(req, res)
);

router.post(
  "/",
  authenticateOwner,
  (req, res) => stockController.createStock(req, res)
);

router.get(
  "/",
  authenticateOwner,
  (req, res) => stockController.getStocks(req, res)
);

module.exports = router;
