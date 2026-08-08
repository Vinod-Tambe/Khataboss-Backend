"use strict";

const express = require("express");
const router = express.Router();
const girviController = require("../controller/girvi.controller");
const authenticateOwner = require("../../../middlewares/auth.middleware");
const requirePermission = require("../../../middlewares/permission.middleware");

const upload = require("../../../middlewares/upload.middleware");

router.post(
  "/upload-item-image",
  authenticateOwner,
  requirePermission(["loan.create", "loan.edit"], { mode: "any" }),
  upload.single("itemImage"),
  (req, res) => girviController.uploadItemImage(req, res)
);

router.post(
  "/",
  authenticateOwner,
  requirePermission("loan.create"),
  (req, res) => girviController.createGirvi(req, res)
);

router.get(
  "/",
  authenticateOwner,
  requirePermission("loan.view"),
  (req, res) => girviController.getGirvis(req, res)
);

router.get(
  "/dropdown/:userId",
  authenticateOwner,
  requirePermission(["loan.view", "loan.deposit", "loan.release"], { mode: "any" }),
  (req, res) => girviController.getGirvisDropdown(req, res)
);

router.get(
  "/:id",
  authenticateOwner,
  requirePermission("loan.view"),
  (req, res) => girviController.getGirviById(req, res)
);

router.put(
  "/:id",
  authenticateOwner,
  requirePermission("loan.edit"),
  (req, res) => girviController.updateGirvi(req, res)
);

router.post(
  "/:id/transfer",
  authenticateOwner,
  requirePermission("loan.transfer"),
  (req, res) => girviController.transferLoan(req, res)
);

module.exports = router;
