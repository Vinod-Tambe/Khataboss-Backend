"use strict";

const userService = require("../service/user.service");
const imageService = require("../../../utils/image.service");
const { BASE_URL } = require("../../../config/db");

class UserController {
  getDbUrl(dbName) {
    return `${BASE_URL}/${dbName}`;
  }

  async createUser(req, res) {
    try {
      const dbUrl = this.getDbUrl(req.user.own_db);
      const data = { ...req.body };

      const sanitize = (val) => (val === "" ? null : val);

      // Field Mapping & Type Conversion (using original column names)
      const userData = {
        user_own_id: req.user.own_id,
        user_firm_id: parseInt(data.user_firm_id),
        user_first_name: data.user_first_name,
        user_last_name: data.user_last_name,
        user_father_name: sanitize(data.user_father_name),
        user_mother_name: sanitize(data.user_mother_name),
        user_mobile_no: data.user_mobile_no,
        user_phone_no: sanitize(data.user_phone_no),
        user_email_id: sanitize(data.user_email_id),
        user_gender: data.user_gender,
        user_cast: sanitize(data.user_cast),
        user_marital_status: sanitize(data.user_marital_status),
        user_occupation: sanitize(data.user_occupation),
        user_birth_date: data.user_birth_date ? new Date(data.user_birth_date) : null,
        user_gstin: sanitize(data.user_gstin),
        user_tax_no: sanitize(data.user_tax_no),
        user_pan_no: sanitize(data.user_pan_no),
        user_adhaar_no: sanitize(data.user_adhaar_no),
        user_bank_name: sanitize(data.user_bank_name),
        user_bank_acc_no: sanitize(data.user_bank_acc_no),
        user_ifsc_code: sanitize(data.user_ifsc_code),
        user_per_address: sanitize(data.user_per_address),
        user_curr_address: sanitize(data.user_curr_address),
        user_village: sanitize(data.user_village),
        user_ward_no: sanitize(data.user_ward_no),
        user_tehsil: sanitize(data.user_tehsil),
        user_city: sanitize(data.user_city),
        user_state: sanitize(data.user_state),
        user_country: sanitize(data.user_country),
        user_pincode: sanitize(data.user_pincode),
        user_other_info: sanitize(data.user_other_info),
      };

      // 0. Pre-validate Uniqueness
      const validationError = await userService.checkUniqueFields(dbUrl, userData);
      if (validationError) {
        return res.status(409).json({ error: validationError.error });
      }

      // 1. Create User record
      const newUser = await userService.createUser(dbUrl, userData);

      // 2. Handle File Uploads
      if (req.files && Object.keys(req.files).length > 0) {
        const movedFiles = await imageService.moveFiles("user", newUser.user_id, req.files);

        const updateData = {};
        if (movedFiles.photo) updateData.user_profile_img = movedFiles.photo;
        if (movedFiles.adhaarFront) updateData.user_adhaar_front_img = movedFiles.adhaarFront;
        if (movedFiles.adhaarBack) updateData.user_adhaar_back_img = movedFiles.adhaarBack;
        if (movedFiles.panCard) updateData.user_pan_card_img = movedFiles.panCard;
        if (movedFiles.signature) updateData.user_sign_img = movedFiles.signature;

        if (Object.keys(updateData).length > 0) {
          const updatedUser = await userService.updateUserByUuid(dbUrl, newUser.user_uuid, updateData);
          return res.status(201).json({
            message: "User created successfully.",
            data: updatedUser,
          });
        }
      }

      return res.status(201).json({
        message: "User created successfully.",
        data: newUser,
      });
    } catch (error) {
      console.error("❌ Error creating user:", error.message);
      return res.status(500).json({ error: error.message });
    }
  }

  /**
   * GET /user
   */
  async getUsers(req, res) {
    try {
      const { firmId, search } = req.query;
      const dbUrl = this.getDbUrl(req.user.own_db);
      const users = await userService.getUsers(dbUrl, firmId, search);

      return res.status(200).json({
        message: "Users fetched successfully.",
        data: users,
      });
    } catch (error) {
      console.error("❌ Error fetching users:", error.message);
      return res.status(500).json({ error: error.message });
    }
  }

  /**
   * GET /user/search?q=&firmId=&limit=
   * Fast autocomplete for header search.
   */
  async searchUsers(req, res) {
    try {
      const { q = "", firmId, limit } = req.query;
      const dbUrl = this.getDbUrl(req.user.own_db);
      const users = await userService.searchUsers(dbUrl, firmId, q, limit);

      return res.status(200).json({
        message: "Users search completed.",
        data: users,
      });
    } catch (error) {
      console.error("❌ Error searching users:", error.message);
      return res.status(500).json({ error: error.message });
    }
  }

  /**
   * DELETE /user/:uuid
   */
  async deleteUser(req, res) {
    try {
      const { uuid } = req.params;
      const dbUrl = this.getDbUrl(req.user.own_db);

      await userService.deleteUserByUuid(dbUrl, uuid, req.user.own_login_id || "Admin");

      return res.status(200).json({
        message: "User deleted successfully (soft delete).",
      });
    } catch (error) {
      console.error("❌ Error deleting user:", error.message);
      return res.status(500).json({ error: error.message });
    }
  }

  /**
   * GET /user/:uuid
   */
  async getUserByUuid(req, res) {
    try {
      const { uuid } = req.params;
      const dbUrl = this.getDbUrl(req.user.own_db);
      const user = await userService.getUserByUuid(dbUrl, uuid);

      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }

      return res.status(200).json({
        message: "User fetched successfully.",
        data: user,
      });
    } catch (error) {
      console.error("❌ Error fetching user:", error.message);
      return res.status(500).json({ error: error.message });
    }
  }

  /**
   * PUT /user/:uuid
   */
  async updateUser(req, res) {
    try {
      const { uuid } = req.params;
      const dbUrl = this.getDbUrl(req.user.own_db);
      const data = { ...req.body };

      const sanitize = (val) => (val === "" || val === "null" ? null : val);

      // Fetch existing user to get firm id if not provided
      const existingUser = await userService.getUserByUuid(dbUrl, uuid);
      if (!existingUser) {
        return res.status(404).json({ error: "User not found." });
      }

      // Field Mapping & Type Conversion
      const updateData = {};
      if (data.user_firm_id) updateData.user_firm_id = parseInt(data.user_firm_id);
      if (data.user_first_name) updateData.user_first_name = data.user_first_name;
      if (data.user_last_name) updateData.user_last_name = data.user_last_name;
      if (data.user_father_name !== undefined) updateData.user_father_name = sanitize(data.user_father_name);
      if (data.user_mother_name !== undefined) updateData.user_mother_name = sanitize(data.user_mother_name);
      if (data.user_mobile_no) updateData.user_mobile_no = data.user_mobile_no;
      if (data.user_phone_no !== undefined) updateData.user_phone_no = sanitize(data.user_phone_no);
      if (data.user_email_id !== undefined) updateData.user_email_id = sanitize(data.user_email_id);
      if (data.user_gender) updateData.user_gender = data.user_gender;
      if (data.user_cast !== undefined) updateData.user_cast = sanitize(data.user_cast);
      if (data.user_marital_status !== undefined) updateData.user_marital_status = sanitize(data.user_marital_status);
      if (data.user_occupation !== undefined) updateData.user_occupation = sanitize(data.user_occupation);
      if (data.user_birth_date) updateData.user_birth_date = new Date(data.user_birth_date);
      if (data.user_gstin !== undefined) updateData.user_gstin = sanitize(data.user_gstin);
      if (data.user_tax_no !== undefined) updateData.user_tax_no = sanitize(data.user_tax_no);
      if (data.user_pan_no !== undefined) updateData.user_pan_no = sanitize(data.user_pan_no);
      if (data.user_adhaar_no !== undefined) updateData.user_adhaar_no = sanitize(data.user_adhaar_no);
      if (data.user_bank_name !== undefined) updateData.user_bank_name = sanitize(data.user_bank_name);
      if (data.user_bank_acc_no !== undefined) updateData.user_bank_acc_no = sanitize(data.user_bank_acc_no);
      if (data.user_ifsc_code !== undefined) updateData.user_ifsc_code = sanitize(data.user_ifsc_code);
      if (data.user_per_address !== undefined) updateData.user_per_address = sanitize(data.user_per_address);
      if (data.user_curr_address !== undefined) updateData.user_curr_address = sanitize(data.user_curr_address);
      if (data.user_village !== undefined) updateData.user_village = sanitize(data.user_village);
      if (data.user_ward_no !== undefined) updateData.user_ward_no = sanitize(data.user_ward_no);
      if (data.user_tehsil !== undefined) updateData.user_tehsil = sanitize(data.user_tehsil);
      if (data.user_city !== undefined) updateData.user_city = sanitize(data.user_city);
      if (data.user_state !== undefined) updateData.user_state = sanitize(data.user_state);
      if (data.user_country !== undefined) updateData.user_country = sanitize(data.user_country);
      if (data.user_pincode !== undefined) updateData.user_pincode = sanitize(data.user_pincode);
      if (data.user_other_info !== undefined) updateData.user_other_info = sanitize(data.user_other_info);

      updateData.user_updated_by = req.user.own_login_id || "Admin";

      // 0. Pre-validate Uniqueness for update
      const validationData = {
        user_firm_id: updateData.user_firm_id || existingUser.user_firm_id,
        user_first_name: updateData.user_first_name || existingUser.user_first_name,
        user_last_name: updateData.user_last_name || existingUser.user_last_name,
        user_father_name: updateData.user_father_name !== undefined ? updateData.user_father_name : existingUser.user_father_name,
        user_mobile_no: updateData.user_mobile_no || existingUser.user_mobile_no,
      };

      const validationError = await userService.checkUniqueFields(dbUrl, validationData, uuid);
      if (validationError) {
        return res.status(409).json({ error: validationError.error });
      }

      // Handle File Uploads for update
      if (req.files && Object.keys(req.files).length > 0) {
        const imageService = require("../../../utils/image.service");
        const movedFiles = await imageService.moveFiles("user", existingUser.user_id, req.files);

        if (movedFiles.photo) updateData.user_profile_img = movedFiles.photo;
        if (movedFiles.adhaarFront) updateData.user_adhaar_front_img = movedFiles.adhaarFront;
        if (movedFiles.adhaarBack) updateData.user_adhaar_back_img = movedFiles.adhaarBack;
        if (movedFiles.panCard) updateData.user_pan_card_img = movedFiles.panCard;
        if (movedFiles.signature) updateData.user_sign_img = movedFiles.signature;
      }

      const updatedUser = await userService.updateUserByUuid(dbUrl, uuid, updateData);

      return res.status(200).json({
        message: "User updated successfully.",
        data: updatedUser,
      });
    } catch (error) {
      console.error("❌ Error updating user:", error.message);
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new UserController();
