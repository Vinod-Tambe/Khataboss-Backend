"use strict";

const express = require("express");
const router = express.Router();
const controller = require("../controller/money_transaction.controller");
const authenticateOwner = require("../../../middlewares/auth.middleware");
const requirePermission = require("../../../middlewares/permission.middleware");

router.get(
  "/",
  authenticateOwner,
  requirePermission(["expense.view", "account.view"], { mode: "any" }),
  (req, res) => controller.list(req, res)
);

router.get(
  "/:uuid",
  authenticateOwner,
  requirePermission(["expense.view", "account.view"], { mode: "any" }),
  (req, res) => controller.getOne(req, res)
);

router.post(
  "/",
  authenticateOwner,
  requirePermission(["expense.create", "account.transfer"], { mode: "any" }),
  (req, res) => controller.create(req, res)
);

router.delete(
  "/:id",
  authenticateOwner,
  requirePermission(["expense.create", "account.transfer"], { mode: "any" }),
  (req, res) => controller.remove(req, res)
);

module.exports = router;
