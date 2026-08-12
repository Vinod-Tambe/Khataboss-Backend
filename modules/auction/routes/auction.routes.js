"use strict";

const express = require("express");
const auctionController = require("../controller/auction.controller");
const authenticateOwner = require("../../../middlewares/auth.middleware");
const requirePermission = require("../../../middlewares/permission.middleware");
const upload = require("../../../middlewares/upload.middleware");

const router = express.Router();

router.post(
  "/",
  authenticateOwner,
  requirePermission("loan.auction"),
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "other_images", maxCount: 10 },
  ]),
  auctionController.addAuction
);
router.get("/", authenticateOwner, requirePermission("loan.auction"), auctionController.getAuctionUsers);
router.get("/loans", authenticateOwner, requirePermission("loan.auction"), auctionController.getAuctionLoans);

module.exports = router;
