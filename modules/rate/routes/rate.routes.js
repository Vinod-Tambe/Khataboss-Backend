"use strict";

const express = require("express");
const rateController = require("../controller/rate.controller");
const authenticateOwner = require("../../../middlewares/auth.middleware");

const router = express.Router();

router.post("/", authenticateOwner, (req, res) => rateController.createRate(req, res));
router.put("/:uuid", authenticateOwner, (req, res) => rateController.updateRate(req, res));
router.get("/", authenticateOwner, (req, res) => rateController.getRates(req, res));
router.delete("/:uuid", authenticateOwner, (req, res) => rateController.deleteRate(req, res));

module.exports = router;
