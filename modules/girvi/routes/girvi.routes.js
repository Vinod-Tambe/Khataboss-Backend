"use strict";

const express = require("express");
const router = express.Router();
const girviController = require("../controller/girvi.controller");
const authenticateOwner = require("../../../middlewares/auth.middleware");
// If image upload for items is required, we can add upload middleware here. 
// For now, handling just data.

router.post(
  "/",
  authenticateOwner,
  (req, res) => girviController.createGirvi(req, res)
);

router.get(
  "/",
  authenticateOwner,
  (req, res) => girviController.getGirvis(req, res)
);

module.exports = router;
