"use strict";

const express = require("express");
const auctionController = require("../controller/auction.controller");
const upload = require("../../../middlewares/upload.middleware");
const authenticateOwner = require("../../../middlewares/auth.middleware");

const router = express.Router();

router.post("/", authenticateOwner, upload.single("user_image"), auctionController.addAuction);
router.get("/", authenticateOwner, auctionController.getAuctionUsers);
router.get("/loans", authenticateOwner, auctionController.getAuctionLoans);

module.exports = router;
