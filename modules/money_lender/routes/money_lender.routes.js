"use strict";

const express = require("express");
const router = express.Router();
const moneyLenderController = require("../controller/money_lender.controller");
const upload = require("../../../middlewares/upload.middleware");
const authenticateOwner = require("../../../middlewares/auth.middleware");
const requirePermission = require("../../../middlewares/permission.middleware");

const mlUploadFields = [
  { name: "ml_profile_img", maxCount: 1 },
  { name: "ml_adhaar_front_img", maxCount: 1 },
  { name: "ml_adhaar_back_img", maxCount: 1 },
  { name: "ml_pan_img", maxCount: 1 },
];

router.get("/", authenticateOwner, requirePermission("moneyLender.view"), (req, res) => moneyLenderController.getMoneyLenders(req, res));
router.get("/:uuid", authenticateOwner, requirePermission("moneyLender.view"), (req, res) => moneyLenderController.getMoneyLenderByUuid(req, res));
router.post(
  "/",
  authenticateOwner,
  requirePermission("moneyLender.create"),
  upload.fields(mlUploadFields),
  (req, res) => moneyLenderController.createMoneyLender(req, res)
);
router.put(
  "/:uuid",
  authenticateOwner,
  requirePermission("moneyLender.edit"),
  upload.fields(mlUploadFields),
  (req, res) => moneyLenderController.updateMoneyLender(req, res)
);
router.delete("/:uuid", authenticateOwner, requirePermission("moneyLender.delete"), (req, res) => moneyLenderController.deleteMoneyLender(req, res));

module.exports = router;
