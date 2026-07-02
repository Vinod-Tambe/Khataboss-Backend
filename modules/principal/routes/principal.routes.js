"use strict";

const express = require("express");
const router = express.Router();
const addPrincipalController = require("../controller/principal.controller");
const authenticateOwner = require("../../../middlewares/auth.middleware");

router.post(
  "/",
  authenticateOwner,
  (req, res) => addPrincipalController.addAdditionalPrincipal(req, res)
);

module.exports = router;
