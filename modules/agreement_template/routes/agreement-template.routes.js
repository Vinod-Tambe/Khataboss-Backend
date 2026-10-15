"use strict";

const express = require("express");
const router = express.Router();
const agreementTemplateController = require("../controller/agreement-template.controller");
const authenticateOwner = require("../../../middlewares/auth.middleware");
const requirePermission = require("../../../middlewares/permission.middleware");

router.get(
  "/templates",
  authenticateOwner,
  requirePermission(["agreementBuilder.view", "agreementBuilder.edit"], { mode: "any" }),
  (req, res) => agreementTemplateController.listTemplates(req, res)
);

router.get(
  "/template",
  authenticateOwner,
  requirePermission(
    [
      "agreementBuilder.view",
      "agreementBuilder.edit",
      "loan.agreement",
      "loan.view",
      "finance.agreement",
      "finance.view",
    ],
    { mode: "any" }
  ),
  (req, res) => agreementTemplateController.getTemplate(req, res)
);

router.put(
  "/templates/:uuid",
  authenticateOwner,
  requirePermission("agreementBuilder.edit"),
  (req, res) => agreementTemplateController.updateTemplate(req, res)
);

module.exports = router;
