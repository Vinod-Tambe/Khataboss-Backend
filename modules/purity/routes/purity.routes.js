"use strict";

const express = require("express");
const purityController = require("../controller/purity.controller");
const authenticateOwner = require("../../../middlewares/auth.middleware");

const router = express.Router();

router.post("/", authenticateOwner, (req, res) => purityController.createPurity(req, res));
router.put("/:uuid", authenticateOwner, (req, res) => purityController.updatePurity(req, res));
router.get("/", authenticateOwner, (req, res) => purityController.getPurities(req, res));
router.delete("/:uuid", authenticateOwner, (req, res) => purityController.deletePurity(req, res));

module.exports = router;
