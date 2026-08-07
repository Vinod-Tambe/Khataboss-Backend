"use strict";

const express = require("express");
const router = express.Router();
const accountController = require("../controller/account.controller");
const authenticateOwner = require("../../../middlewares/auth.middleware");
const requirePermission = require("../../../middlewares/permission.middleware");

router.get("/", authenticateOwner, requirePermission("account.view"), (req, res) => accountController.getAccounts(req, res));
router.get("/ledger", authenticateOwner, requirePermission("account.view"), (req, res) => accountController.get_account_ledger(req, res));
router.get("/dropdown", authenticateOwner, (req, res) => accountController.getAccountsDropdown(req, res));
router.get("/totals", authenticateOwner, requirePermission("account.view"), (req, res) => accountController.getAccountTotals(req, res));
router.get("/:uuid", authenticateOwner, requirePermission("account.view"), (req, res) => accountController.getAccountByUuid(req, res));
router.post("/", authenticateOwner, requirePermission("account.create"), (req, res) => accountController.createAccount(req, res));
router.put("/:uuid", authenticateOwner, requirePermission("account.edit"), (req, res) => accountController.updateAccount(req, res));
router.delete("/:uuid", authenticateOwner, requirePermission("account.delete"), (req, res) => accountController.deleteAccount(req, res));

module.exports = router;
