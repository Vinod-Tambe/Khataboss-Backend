"use strict";

const express = require("express");
const router = express.Router();
const moneyLenderController = require("../controller/money_lender.controller");
const upload = require("../../../middlewares/upload.middleware");
const authenticateOwner = require("../../../middlewares/auth.middleware");

// Define fields for uploading multiple image files
const mlUploadFields = [
  { name: "ml_profile_img", maxCount: 1 },
  { name: "ml_adhaar_front_img", maxCount: 1 },
  { name: "ml_adhaar_back_img", maxCount: 1 },
  { name: "ml_pan_img", maxCount: 1 },
];

/**
 * @swagger
 * tags:
 *   name: MoneyLender
 *   description: Money Lender management APIs for tenant databases
 */

router.get("/", authenticateOwner, (req, res) => moneyLenderController.getMoneyLenders(req, res));
router.get("/:uuid", authenticateOwner, (req, res) => moneyLenderController.getMoneyLenderByUuid(req, res));
router.post(
  "/",
  authenticateOwner,
  upload.fields(mlUploadFields),
  (req, res) => moneyLenderController.createMoneyLender(req, res)
);
router.put(
  "/:uuid",
  authenticateOwner,
  upload.fields(mlUploadFields),
  (req, res) => moneyLenderController.updateMoneyLender(req, res)
);
router.delete("/:uuid", authenticateOwner, (req, res) => moneyLenderController.deleteMoneyLender(req, res));

module.exports = router;
