"use strict";

const express = require("express");
const router = express.Router();
const formTemplateController = require("../controller/form-template.controller");
const authenticateOwner = require("../../../middlewares/auth.middleware");
const requirePermission = require("../../../middlewares/permission.middleware");

router.get(
  "/templates",
  authenticateOwner,
  requirePermission(["formBuilder.view", "formBuilder.edit"], { mode: "any" }),
  (req, res) => formTemplateController.listTemplates(req, res)
);

router.get(
  "/template",
  authenticateOwner,
  requirePermission(
    ["formBuilder.view", "formBuilder.edit", "loan.form8", "loan.view"],
    { mode: "any" }
  ),
  (req, res) => formTemplateController.getTemplate(req, res)
);

router.put(
  "/templates/:uuid",
  authenticateOwner,
  requirePermission("formBuilder.edit"),
  (req, res) => formTemplateController.updateTemplate(req, res)
);

module.exports = router;
