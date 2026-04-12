"use strict";

const express = require("express");
const router = express.Router();
const journalController = require("../controller/journal.controller");
const authenticateOwner = require("../../../middlewares/auth.middleware");

/**
 * Route definitions for Journal
 */

router.post("/", authenticateOwner, (req, res) => journalController.createJournal(req, res));

router.delete("/:id", authenticateOwner, (req, res) => journalController.deleteJournal(req, res));

module.exports = router;
