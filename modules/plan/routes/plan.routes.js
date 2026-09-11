"use strict";

const express = require("express");
const router = express.Router();
const planController = require("../controller/plan.controller");
const upload = require("../../../middlewares/upload.middleware");
const authenticateAdmin = require("../../../middlewares/admin.middleware");

router.use(authenticateAdmin);

router.get("/modules/catalog", planController.getModuleCatalog);
router.get("/", planController.getPlans);
router.get("/:uuid", planController.getPlanByUuid);
router.post("/", upload.single("plan_image"), planController.createPlan);
router.patch("/:uuid/status", planController.updatePlanStatus);
router.post("/:uuid/apply", planController.applyPlanToOwner);
router.patch("/:uuid", upload.single("plan_image"), planController.updatePlan);
router.delete("/:uuid", planController.deletePlan);

module.exports = router;
