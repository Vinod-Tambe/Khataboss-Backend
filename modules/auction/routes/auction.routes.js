"use strict";

const express = require("express");
const router = express.Router();
const auctionController = require("../controller/auction.controller");
const authenticateOwner = require("../../../middlewares/auth.middleware");
const requirePermission = require("../../../middlewares/permission.middleware");
const upload = require("../../../middlewares/upload.middleware");

router.post("/", authenticateOwner, requirePermission("loan.auction"), upload.single("user_image"), auctionController.addAuction);
router.get("/", authenticateOwner, requirePermission("loan.auction"), auctionController.getAuctionUsers);
router.get("/loans", authenticateOwner, requirePermission("loan.auction"), auctionController.getAuctionLoans);

module.exports = router;
