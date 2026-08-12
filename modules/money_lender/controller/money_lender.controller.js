"use strict";

const moneyLenderService = require("../service/money_lender.service");
const imageService = require("../../../utils/image.service");
const {
  stripArrayFileFields,
  applyOtherImagesUpdate,
} = require("../../../utils/otherImages.helper");
const { BASE_URL } = require("../../../config/db");

class MoneyLenderController {
  getDbUrl(dbName) {
    return `${BASE_URL}/${dbName}`;
  }

  async createMoneyLender(req, res) {
    try {
      const dbUrl = this.getDbUrl(req.user.own_db);
      const data = { ...req.body };

      data.ml_own_id = req.user.own_id;

      const validationError = await moneyLenderService.checkUniqueFields(dbUrl, data);
      if (validationError) {
        return res.status(409).json({ error: validationError.error });
      }

      const newMl = await moneyLenderService.createMoneyLender(dbUrl, data);

      const hasFiles =
        (req.files && Object.keys(req.files).length > 0) ||
        data.other_images_remove ||
        data.other_images_meta ||
        data.other_images_update;

      if (hasFiles) {
        const movedFiles = await imageService.moveFiles(
          "moneyLender",
          newMl.ml_id,
          stripArrayFileFields(req.files)
        );

        const updateData = {};
        if (movedFiles.photo) updateData.ml_profile_img = movedFiles.photo;
        if (movedFiles.ml_profile_img) updateData.ml_profile_img = movedFiles.ml_profile_img;

        const otherImages = await applyOtherImagesUpdate({
          moduleName: "moneyLender",
          entityId: newMl.ml_id,
          existingJson: [],
          reqFiles: req.files,
          removePathsJson: data.other_images_remove,
          metaJson: data.other_images_meta,
          updateMetaJson: data.other_images_update,
        });
        if (otherImages.length) updateData.ml_other_images = otherImages;

        if (Object.keys(updateData).length > 0) {
          const updatedMl = await moneyLenderService.updateMoneyLender(dbUrl, newMl.ml_uuid, updateData);
          return res.status(201).json({
            success: true,
            message: "Money Lender created successfully with images.",
            data: updatedMl,
          });
        }
      }

      return res.status(201).json({
        success: true,
        message: "Money Lender created successfully.",
        data: newMl,
      });
    } catch (error) {
      console.error("Create Money Lender Error:", error);
      res.status(500).json({ error: error.message });
    }
  }

  async getMoneyLenders(req, res) {
    try {
      const dbUrl = this.getDbUrl(req.user.own_db);
      const mlist = await moneyLenderService.getMoneyLenders(dbUrl);
      res.status(200).json({ success: true, data: mlist });
    } catch (error) {
      console.error("Get Money Lenders Error:", error);
      res.status(500).json({ error: error.message });
    }
  }

  async getMoneyLenderByUuid(req, res) {
    try {
      const dbUrl = this.getDbUrl(req.user.own_db);
      const { uuid } = req.params;
      const ml = await moneyLenderService.getMoneyLenderByUuid(dbUrl, uuid);

      if (!ml) {
        return res.status(404).json({ error: "Money Lender not found." });
      }

      res.status(200).json({ success: true, data: ml });
    } catch (error) {
      console.error("Get Money Lender By UUID Error:", error);
      res.status(500).json({ error: error.message });
    }
  }

  async updateMoneyLender(req, res) {
    try {
      const dbUrl = this.getDbUrl(req.user.own_db);
      const { uuid } = req.params;
      const data = { ...req.body };

      const ml = await moneyLenderService.getMoneyLenderByUuid(dbUrl, uuid);
      if (!ml) {
        return res.status(404).json({ error: "Money Lender not found." });
      }

      const validationError = await moneyLenderService.checkUniqueFields(dbUrl, data, uuid);
      if (validationError) {
        return res.status(409).json({ error: validationError.error });
      }

      if (req.files && Object.keys(req.files).length > 0) {
        const movedFiles = await imageService.moveFiles(
          "moneyLender",
          ml.ml_id,
          stripArrayFileFields(req.files)
        );
        if (movedFiles.photo) data.ml_profile_img = movedFiles.photo;
        if (movedFiles.ml_profile_img) data.ml_profile_img = movedFiles.ml_profile_img;
      }

      if (
        (req.files && req.files.other_images) ||
        data.other_images_remove ||
        data.other_images_meta ||
        data.other_images_update
      ) {
        data.ml_other_images = await applyOtherImagesUpdate({
          moduleName: "moneyLender",
          entityId: ml.ml_id,
          existingJson: ml.ml_other_images,
          reqFiles: req.files,
          removePathsJson: data.other_images_remove,
          metaJson: data.other_images_meta,
          updateMetaJson: data.other_images_update,
        });
      }

      const updatedMl = await moneyLenderService.updateMoneyLender(dbUrl, uuid, data);
      res.status(200).json({
        success: true,
        message: "Money Lender updated successfully.",
        data: updatedMl,
      });
    } catch (error) {
      console.error("Update Money Lender Error:", error);
      res.status(500).json({ error: error.message });
    }
  }

  async deleteMoneyLender(req, res) {
    try {
      const dbUrl = this.getDbUrl(req.user.own_db);
      const { uuid } = req.params;
      await moneyLenderService.deleteMoneyLender(dbUrl, uuid);
      res.status(200).json({ success: true, message: "Money Lender deleted successfully." });
    } catch (error) {
      console.error("Delete Money Lender Error:", error);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new MoneyLenderController();
