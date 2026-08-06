"use strict";

const express = require("express");
const router = express.Router();
const girviController = require("../controller/girvi.controller");
const authenticateOwner = require("../../../middlewares/auth.middleware");
// If image upload for items is required, we can add upload middleware here. 
// For now, handling just data.

router.post(
  "/",
  authenticateOwner,
  (req, res) => girviController.createGirvi(req, res)
);

router.get(
  "/",
  authenticateOwner,
  (req, res) => girviController.getGirvis(req, res)
);

router.get(
  "/dropdown/:userId",
  authenticateOwner,
  (req, res) => girviController.getGirvisDropdown(req, res)
);

router.get(
  "/:id",
  authenticateOwner,
  (req, res) => girviController.getGirviById(req, res)
);

router.put(
  "/:id",
  authenticateOwner,
  (req, res) => girviController.updateGirvi(req, res)
);

router.post(
  "/:id/transfer",
  authenticateOwner,
  (req, res) => girviController.transferLoan(req, res)
);

module.exports = router;
