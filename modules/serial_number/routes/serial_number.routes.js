"use strict";

const express = require("express");
const router = express.Router();
const serialNumberController = require("../controller/serial_number.controller");
const authenticateOwner = require("../../../middlewares/auth.middleware");

router.get("/", authenticateOwner, (req, res) => serialNumberController.getConfigs(req, res));
router.put("/:entity_type", authenticateOwner, (req, res) => serialNumberController.updateConfig(req, res));
router.post("/next/:entity_type", authenticateOwner, (req, res) => serialNumberController.generateNextCode(req, res));

module.exports = router;
