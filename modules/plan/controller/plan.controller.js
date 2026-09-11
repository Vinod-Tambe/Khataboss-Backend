"use strict";

const planService = require("../services/plan.service");
const imageService = require("../../../utils/image.service");

class PlanController {
  async getPlans(req, res) {
    try {
      const activeOnly = req.query.active === "true";
      const data = activeOnly
        ? await planService.getActivePlans()
        : await planService.getPlans();
      return res.status(200).json({ message: "Plans fetched successfully.", data });
    } catch (error) {
      console.error("❌  getPlans:", error.message);
      return res.status(500).json({ error: error.message });
    }
  }

  async getPlanByUuid(req, res) {
    try {
      const plan = await planService.getPlanByUuid(req.params.uuid);
      if (!plan) return res.status(404).json({ error: "Plan not found." });
      return res.status(200).json({ message: "Plan fetched successfully.", data: plan });
    } catch (error) {
      console.error("❌  getPlanByUuid:", error.message);
      return res.status(500).json({ error: error.message });
    }
  }

  async getModuleCatalog(req, res) {
    try {
      const data = planService.getModuleCatalog();
      return res.status(200).json({ message: "Plan module catalog.", data });
    } catch (error) {
      console.error("❌  getModuleCatalog:", error.message);
      return res.status(500).json({ error: error.message });
    }
  }

  async createPlan(req, res) {
    try {
      const adminLoginId = req.admin?.admin_login_id || "Admin";
      const created = await planService.createPlan(req.body, adminLoginId);

      if (req.file) {
        const imageData = await imageService.moveSingleFile(
          planService.getPlanImageOwnerId(),
          "plan",
          created.plan_id,
          req.file,
          "plan_image"
        );
        await planService.updatePlanImage(created.plan_uuid, imageData);
      }

      const plan = await planService.getPlanByUuid(created.plan_uuid);
      return res.status(201).json({
        message: "Plan created successfully.",
        data: plan,
      });
    } catch (error) {
      console.error("❌  createPlan:", error.message);
      return res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async updatePlan(req, res) {
    try {
      const { uuid } = req.params;
      const adminLoginId = req.admin?.admin_login_id || "Admin";
      const existing = await planService.getPlanByUuid(uuid);
      if (!existing) return res.status(404).json({ error: "Plan not found." });

      const updateData = { ...req.body };

      if (req.file) {
        updateData.plan_image = await imageService.replaceSingleFile(
          planService.getPlanImageOwnerId(),
          "plan",
          existing.plan_id,
          req.file,
          "plan_image",
          existing.plan_image
        );
      }

      await planService.updatePlan(uuid, updateData, adminLoginId);
      const plan = await planService.getPlanByUuid(uuid);
      return res.status(200).json({
        message: "Plan updated successfully.",
        data: plan,
      });
    } catch (error) {
      console.error("❌  updatePlan:", error.message);
      return res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async updatePlanStatus(req, res) {
    try {
      const { uuid } = req.params;
      const { plan_status } = req.body;
      if (!["Active", "Inactive"].includes(plan_status)) {
        return res.status(400).json({ error: "plan_status must be Active or Inactive." });
      }
      await planService.updatePlan(
        uuid,
        { plan_status },
        req.admin?.admin_login_id || "Admin"
      );
      const plan = await planService.getPlanByUuid(uuid);
      return res.status(200).json({
        message: `Plan status updated to ${plan_status}.`,
        data: plan,
      });
    } catch (error) {
      console.error("❌  updatePlanStatus:", error.message);
      return res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async deletePlan(req, res) {
    try {
      await planService.deletePlan(req.params.uuid, req.admin?.admin_login_id || "Admin");
      return res.status(200).json({ message: "Plan deleted successfully." });
    } catch (error) {
      console.error("❌  deletePlan:", error.message);
      return res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async applyPlanToOwner(req, res) {
    try {
      const { uuid: planUuid } = req.params;
      const { owner_uuid, own_start_date, own_expiry_date } = req.body;
      if (!owner_uuid) {
        return res.status(400).json({ error: "owner_uuid is required." });
      }
      const result = await planService.applyPlanToOwner(owner_uuid, planUuid, {
        own_start_date,
        own_expiry_date,
      });
      return res.status(200).json({
        message: "Plan applied to owner successfully.",
        data: result,
      });
    } catch (error) {
      console.error("❌  applyPlanToOwner:", error.message);
      return res.status(error.statusCode || 500).json({ error: error.message });
    }
  }
}

module.exports = new PlanController();
