"use strict";

const staffService = require("../service/staff.service");
const imageService = require("../../../utils/image.service");
const { BASE_URL } = require("../../../config/db");
const { validateStrongPassword } = require("../../../common/service/password.validation");
const { permissionMatrixToKeys } = require("../../../prisma/seeder/permission-seeder");

class StaffController {
  getDbUrl(dbName) {
    return `${BASE_URL}/${dbName}`;
  }

  sanitize(val) {
    return val === "" || val === undefined ? null : val;
  }

  mapStaffBody(data, ownId) {
    return {
      staff_own_id: ownId,
      staff_first_name: data.staff_first_name || data.firstName,
      staff_last_name: data.staff_last_name || data.lastName,
      staff_father_name: this.sanitize(data.staff_father_name || data.fatherName),
      staff_mother_name: this.sanitize(data.staff_mother_name || data.motherName),
      staff_mobile_no: data.staff_mobile_no || data.mobileNo,
      staff_phone_no: this.sanitize(data.staff_phone_no || data.phoneNo),
      staff_email_id: this.sanitize(data.staff_email_id || data.emailId),
      staff_gender: this.sanitize(data.staff_gender || data.gender),
      staff_cast: this.sanitize(data.staff_cast || data.cast),
      staff_marital_status: this.sanitize(data.staff_marital_status || data.maritalStatus),
      staff_occupation: this.sanitize(data.staff_occupation || data.occupation || data.Occupation),
      staff_birth_date:
        data.staff_birth_date || data.dateOfBirth
          ? new Date(data.staff_birth_date || data.dateOfBirth)
          : null,
      staff_gstin: this.sanitize(data.staff_gstin || data.gstin),
      staff_tax_no: this.sanitize(data.staff_tax_no || data.taxNo),
      staff_pan_no: this.sanitize(data.staff_pan_no || data.panNo),
      staff_adhaar_no: this.sanitize(data.staff_adhaar_no || data.adhaarNo),
      staff_login_id: (data.staff_login_id || data.loginId || "").trim().toLowerCase(),
      staff_password: data.staff_password || data.password,
      staff_status: data.staff_status || (data.status === false || data.status === "Inactive" ? "Inactive" : "Active"),
      staff_per_address: this.sanitize(data.staff_per_address || data.permanentAddress),
      staff_curr_address: this.sanitize(data.staff_curr_address || data.currentAddress),
      staff_village: this.sanitize(data.staff_village || data.village),
      staff_ward_no: this.sanitize(data.staff_ward_no || data.wardNumber),
      staff_tehsil: this.sanitize(data.staff_tehsil || data.tehsil),
      staff_city: this.sanitize(data.staff_city || data.city),
      staff_state: this.sanitize(data.staff_state || data.state),
      staff_country: this.sanitize(data.staff_country || data.country),
      staff_pincode: this.sanitize(data.staff_pincode || data.pincode),
      staff_bank_name: this.sanitize(data.staff_bank_name || data.bankName),
      staff_bank_acc_no: this.sanitize(data.staff_bank_acc_no || data.bankAccNo),
      staff_ifsc_code: this.sanitize(data.staff_ifsc_code || data.ifscCode),
      staff_other_info: this.sanitize(data.staff_other_info || data.otherInformation),
    };
  }

  parsePermissionInput(body) {
    if (body.permissions && typeof body.permissions === "object" && !Array.isArray(body.permissions)) {
      return permissionMatrixToKeys(body.permissions);
    }
    if (typeof body.permissions === "string") {
      try {
        const parsed = JSON.parse(body.permissions);
        if (Array.isArray(parsed)) return parsed;
        if (parsed && typeof parsed === "object") return permissionMatrixToKeys(parsed);
      } catch (_) {
        /* ignore */
      }
    }
    if (Array.isArray(body.permission_keys)) return body.permission_keys;
    if (typeof body.permission_keys === "string") {
      try {
        return JSON.parse(body.permission_keys);
      } catch (_) {
        return [];
      }
    }
    return [];
  }

  async createStaff(req, res) {
    try {
      const dbUrl = this.getDbUrl(req.user.own_db);
      const staffData = this.mapStaffBody(req.body, req.user.own_id);

      if (!staffData.staff_first_name || !staffData.staff_last_name) {
        return res.status(400).json({ error: "First name and last name are required." });
      }
      if (!staffData.staff_mobile_no) {
        return res.status(400).json({ error: "Mobile number is required." });
      }
      if (!staffData.staff_login_id) {
        return res.status(400).json({ error: "Staff login ID is required." });
      }
      if (staffData.staff_login_id.includes("+")) {
        return res.status(400).json({
          error: "Enter staff login ID only (without owner prefix). Full login will be owner+staff.",
        });
      }
      if (!staffData.staff_password) {
        return res.status(400).json({ error: "Password is required." });
      }
      const confirmPassword = req.body.confirm_password || req.body.confirmPassword;
      if (confirmPassword && staffData.staff_password !== confirmPassword) {
        return res.status(400).json({ error: "Password and confirm password do not match." });
      }

      const strength = validateStrongPassword(staffData.staff_password, {
        oldPassword: null,
        owner: {
          own_login_id: staffData.staff_login_id,
          own_first_name: staffData.staff_first_name,
          own_last_name: staffData.staff_last_name,
          own_email: staffData.staff_email_id,
          own_mobile_no: staffData.staff_mobile_no,
        },
      });
      if (!strength.ok) {
        return res.status(400).json({ error: strength.message });
      }

      const uniqueError = await staffService.checkUniqueFields(dbUrl, staffData);
      if (uniqueError) {
        return res.status(409).json(uniqueError);
      }

      const permissionKeys = this.parsePermissionInput(req.body);
      const created = await staffService.createStaff(dbUrl, staffData, permissionKeys);

      if (req.files && Object.keys(req.files).length > 0) {
        const movedFiles = await imageService.moveFiles("staff", created.staff_id, req.files);
        const updateData = {};
        if (movedFiles.photo) updateData.staff_profile_img = movedFiles.photo;
        if (movedFiles.adhaarFront) updateData.staff_adhaar_front_img = movedFiles.adhaarFront;
        if (movedFiles.adhaarBack) updateData.staff_adhaar_back_img = movedFiles.adhaarBack;
        if (movedFiles.panCard) updateData.staff_pan_card_img = movedFiles.panCard;
        if (movedFiles.signature) updateData.staff_sign_img = movedFiles.signature;

        if (Object.keys(updateData).length > 0) {
          const updated = await staffService.updateStaff(dbUrl, created.staff_uuid, updateData);
          return res.status(201).json({
            message: "Staff created successfully.",
            data: staffService.toPublicStaff(updated, req.user.own_login_id),
          });
        }
      }

      return res.status(201).json({
        message: "Staff created successfully.",
        data: staffService.toPublicStaff(created, req.user.own_login_id),
      });
    } catch (error) {
      console.error("❌  createStaff:", error.message);
      return res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async getStaffList(req, res) {
    try {
      const dbUrl = this.getDbUrl(req.user.own_db);
      const list = await staffService.getStaffList(dbUrl, { search: req.query.search || "" });
      const data = list.map((s) => staffService.toPublicStaff(s, req.user.own_login_id));
      return res.status(200).json({ message: "Staff list fetched.", data });
    } catch (error) {
      console.error("❌  getStaffList:", error.message);
      return res.status(500).json({ error: error.message });
    }
  }

  async getStaffByUuid(req, res) {
    try {
      const dbUrl = this.getDbUrl(req.user.own_db);
      const staff = await staffService.getStaffByUuid(dbUrl, req.params.uuid);
      if (!staff) {
        return res.status(404).json({ error: "Staff not found." });
      }
      const perms = await staffService.getStaffPermissionMatrix(dbUrl, staff.staff_id);
      return res.status(200).json({
        message: "Staff fetched.",
        data: {
          ...staffService.toPublicStaff(staff, req.user.own_login_id),
          permissions: perms.matrix,
          permission_keys: perms.keys,
        },
      });
    } catch (error) {
      console.error("❌  getStaffByUuid:", error.message);
      return res.status(500).json({ error: error.message });
    }
  }

  async updateStaff(req, res) {
    try {
      const dbUrl = this.getDbUrl(req.user.own_db);
      const existing = await staffService.getStaffByUuid(dbUrl, req.params.uuid);
      if (!existing) {
        return res.status(404).json({ error: "Staff not found." });
      }

      const mapped = this.mapStaffBody(req.body, req.user.own_id);
      delete mapped.staff_own_id;
      delete mapped.staff_password; // password via dedicated endpoint

      // Keep login id if not provided
      if (!mapped.staff_login_id) delete mapped.staff_login_id;

      if (mapped.staff_login_id && mapped.staff_login_id.includes("+")) {
        return res.status(400).json({
          error: "Enter staff login ID only (without owner prefix).",
        });
      }

      const uniqueError = await staffService.checkUniqueFields(dbUrl, mapped, req.params.uuid);
      if (uniqueError) {
        return res.status(409).json(uniqueError);
      }

      let updated = await staffService.updateStaff(dbUrl, req.params.uuid, mapped);

      if (req.files && Object.keys(req.files).length > 0) {
        const movedFiles = await imageService.moveFiles("staff", existing.staff_id, req.files);
        const fileData = {};
        if (movedFiles.photo) fileData.staff_profile_img = movedFiles.photo;
        if (movedFiles.adhaarFront) fileData.staff_adhaar_front_img = movedFiles.adhaarFront;
        if (movedFiles.adhaarBack) fileData.staff_adhaar_back_img = movedFiles.adhaarBack;
        if (movedFiles.panCard) fileData.staff_pan_card_img = movedFiles.panCard;
        if (movedFiles.signature) fileData.staff_sign_img = movedFiles.signature;
        if (Object.keys(fileData).length > 0) {
          updated = await staffService.updateStaff(dbUrl, req.params.uuid, fileData);
        }
      }

      return res.status(200).json({
        message: "Staff updated successfully.",
        data: staffService.toPublicStaff(updated, req.user.own_login_id),
      });
    } catch (error) {
      console.error("❌  updateStaff:", error.message);
      return res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async updateStaffPassword(req, res) {
    try {
      const dbUrl = this.getDbUrl(req.user.own_db);
      const existing = await staffService.getStaffByUuid(dbUrl, req.params.uuid);
      if (!existing) {
        return res.status(404).json({ error: "Staff not found." });
      }

      const loginId = (req.body.staff_login_id || req.body.loginId || existing.staff_login_id || "")
        .trim()
        .toLowerCase();
      const password = req.body.staff_password || req.body.password || req.body.new_password;
      const confirm = req.body.confirm_password || req.body.confirmPassword;

      if (!loginId) {
        return res.status(400).json({ error: "Login ID is required." });
      }
      if (loginId.includes("+")) {
        return res.status(400).json({ error: "Enter staff login ID only (without owner prefix)." });
      }
      if (!password) {
        return res.status(400).json({ error: "Password is required." });
      }
      if (confirm && password !== confirm) {
        return res.status(400).json({ error: "Password and confirm password do not match." });
      }

      const strength = validateStrongPassword(password, {
        oldPassword: null,
        owner: {
          own_login_id: loginId,
          own_first_name: existing.staff_first_name,
          own_last_name: existing.staff_last_name,
          own_email: existing.staff_email_id,
          own_mobile_no: existing.staff_mobile_no,
        },
      });
      if (!strength.ok) {
        return res.status(400).json({ error: strength.message });
      }

      const uniqueError = await staffService.checkUniqueFields(
        dbUrl,
        { staff_login_id: loginId },
        req.params.uuid
      );
      if (uniqueError) {
        return res.status(409).json(uniqueError);
      }

      const updated = await staffService.updateStaff(dbUrl, req.params.uuid, {
        staff_login_id: loginId,
        staff_password: password,
      });

      return res.status(200).json({
        message: "Staff login credentials updated.",
        data: staffService.toPublicStaff(updated, req.user.own_login_id),
      });
    } catch (error) {
      console.error("❌  updateStaffPassword:", error.message);
      return res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async updateStaffPermissions(req, res) {
    try {
      const dbUrl = this.getDbUrl(req.user.own_db);
      const existing = await staffService.getStaffByUuid(dbUrl, req.params.uuid);
      if (!existing) {
        return res.status(404).json({ error: "Staff not found." });
      }

      const keys = this.parsePermissionInput(req.body);
      await staffService.setStaffPermissions(dbUrl, existing.staff_id, keys);
      const perms = await staffService.getStaffPermissionMatrix(dbUrl, existing.staff_id);

      return res.status(200).json({
        message: "Staff permissions updated.",
        data: {
          permission_keys: perms.keys,
          permissions: perms.matrix,
        },
      });
    } catch (error) {
      console.error("❌  updateStaffPermissions:", error.message);
      return res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async deleteStaff(req, res) {
    try {
      const dbUrl = this.getDbUrl(req.user.own_db);
      const existing = await staffService.getStaffByUuid(dbUrl, req.params.uuid);
      if (!existing) {
        return res.status(404).json({ error: "Staff not found." });
      }

      await staffService.softDeleteStaff(dbUrl, req.params.uuid, req.user.own_login_id);
      return res.status(200).json({ message: "Staff deleted successfully." });
    } catch (error) {
      console.error("❌  deleteStaff:", error.message);
      return res.status(500).json({ error: error.message });
    }
  }

  async getPermissionCatalog(req, res) {
    try {
      const dbUrl = this.getDbUrl(req.user.own_db);
      const data = await staffService.getPermissionCatalog(dbUrl);
      return res.status(200).json({ message: "Permission catalog.", data });
    } catch (error) {
      console.error("❌  getPermissionCatalog:", error.message);
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new StaffController();
