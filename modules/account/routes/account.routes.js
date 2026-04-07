"use strict";

const express = require("express");
const router = express.Router();
const accountController = require("../controller/account.controller");
const authenticateOwner = require("../../../middlewares/auth.middleware");

/**
 * @swagger
 * tags:
 *   name: Account
 *   description: Account management APIs
 */

router.get("/", authenticateOwner, (req, res) => accountController.getAccounts(req, res));
router.get("/dropdown", authenticateOwner, (req, res) => accountController.getAccountsDropdown(req, res));
router.get("/:uuid", authenticateOwner, (req, res) => accountController.getAccountByUuid(req, res));
router.post("/", authenticateOwner, (req, res) => accountController.createAccount(req, res));
router.put("/:uuid", authenticateOwner, (req, res) => accountController.updateAccount(req, res));
router.delete("/:uuid", authenticateOwner, (req, res) => accountController.deleteAccount(req, res));

module.exports = router;
