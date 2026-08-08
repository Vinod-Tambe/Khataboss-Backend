"use strict";

const express = require("express");
const router = express.Router();
const journalBookController = require("../controller/journalBook.controller");
const authenticateOwner = require("../../../middlewares/auth.middleware");

router.get("/", authenticateOwner, (req, res) => journalBookController.getAllJournals(req, res));

module.exports = router;
