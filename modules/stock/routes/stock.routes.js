"use strict";

const express = require("express");
const router = express.Router();
const stockController = require("../controller/stock.controller");
const authenticateOwner = require("../../../middlewares/auth.middleware");

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
