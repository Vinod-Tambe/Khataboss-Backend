"use strict";

const girviService = require("../service/girvi.service");
const { BASE_URL } = require("../../../config/db");
const { PrismaClient } = require("../../../prisma/generated/main");
const { normalizeRoiType } = require("../../../utils/loanInterest");
const {
  logActivity,
  MODULE,
  ACTION,
  descriptions,
} = require("../../../common/service/activityLog.service");
const { formatLoanNo } = require("../../../utils/journalNarration");

const resolveInterestRecAccount = async (dbUrl, firmId, ownId) => {
  const prisma = new PrismaClient({ datasources: { db: { url: dbUrl } } });
  try {
    let interestRecAcc = await prisma.account.findFirst({
      where: {
        acc_name: "Interest Rec",
        acc_firm_id: parseInt(firmId, 10),
        acc_is_deleted: false,
      },
    });

    if (!interestRecAcc) {
      interestRecAcc = await prisma.account.create({
        data: {
          acc_name: "Interest Rec",
          acc_pre_acc: "Indirect Incomes",
          acc_firm_id: parseInt(firmId, 10),
          acc_own_id: ownId,
          acc_is_system: true,
          acc_balance_type: "CR",
          acc_opening_date: new Date(),
          acc_cash_balance: "0",
        },
      });
    }
    return interestRecAcc.acc_id;
  } finally {
    await prisma.$disconnect();
  }
};

const parseStImage = (stImage) => {
  if (!stImage) return null;
  let parsed = stImage;
  if (typeof stImage === 'string') {
    if (stImage.startsWith('{')) {
      try { parsed = JSON.parse(stImage); } catch (e) { }
    } else {
      parsed = { path: stImage };
    }
  }
  if (typeof parsed === 'object' && parsed !== null && parsed.path) {
    const norm = String(parsed.path).replace(/\\/g, '/');
    const rel = norm.includes('/uploads/') ? 'uploads/' + norm.split('/uploads/').pop() : norm;
    return { ...parsed, path: rel };
  }
  return parsed;
};

class GirviController {
  getDbUrl(dbName) {
    return `${BASE_URL}/${dbName}`;
  }

  async uploadItemImage(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No image file provided." });
      }

      const normPath = req.file.path.replace(/\\/g, "/");
      const relativePath = normPath.includes("/uploads/")
        ? "uploads/" + normPath.split("/uploads/").pop()
        : `uploads/temp/${req.file.filename}`;

      const fileData = {
        path: relativePath,
        filename: req.file.filename,
        mimetype: req.file.mimetype,
        size: req.file.size
      };

      return res.status(200).json({
        message: "Image uploaded successfully.",
        data: fileData
      });
    } catch (error) {
      console.error("❌ Error uploading item image:", error.message);
      return res.status(500).json({ error: error.message });
    }
  }

  async createGirvi(req, res) {
    try {
      const dbUrl = this.getDbUrl(req.user.own_db);
      const data = { ...req.body };

      // Validation
      if (!data.girv_firm_id || !data.girv_user_id || !data.girv_start_date || !data.girv_type || !data.girv_prin_amt || !data.girv_roi) {
        return res.status(400).json({ error: "Missing required fields for loan creation." });
      }

      if (data.girv_first_int === "Y" && !data.girv_first_int_dr_acc_id) {
        return res.status(400).json({
          error: "Interest Payment Account (DR) is required for First Month Interest.",
        });
      }

      let interestRecAccId = null;
      if (data.girv_first_int === "Y") {
        interestRecAccId = await resolveInterestRecAccount(
          dbUrl,
          data.girv_firm_id,
          req.user.own_id
        );
      }

      // Map to DB columns for Girvi
      const girviData = {
        girv_own_id: req.user.own_id,
        girv_firm_id: parseInt(data.girv_firm_id),
        girv_user_id: parseInt(data.girv_user_id),
        girv_start_date: data.girv_start_date,
        girv_add_date: new Date().toISOString().split('T')[0],
        girv_loan_no: data.girv_loan_no || null,
        girv_prin_amt: parseFloat(data.girv_prin_amt),
        girv_process_per: data.girv_process_per ? parseFloat(data.girv_process_per) : 0,
        girv_process_amt: data.girv_process_amt ? parseFloat(data.girv_process_amt) : 0,
        girv_packet_no: data.girv_packet_no || null,
        girv_locker_no: data.girv_locker_no || null,
        girv_charge_per: data.girv_charge_per ? parseFloat(data.girv_charge_per) : 0,
        girv_charge_amt: data.girv_charge_amt ? parseFloat(data.girv_charge_amt) : 0,
        girv_roi: parseFloat(data.girv_roi),
        girv_roi_type: normalizeRoiType(data.girv_roi_type),
        girv_type: data.girv_type, // 'secured' or 'unsecured'
        girv_interest_method: data.girv_interest_method || "simple",
        girv_compound_freq: data.girv_compound_freq || null,
        girv_final_amt: parseFloat(data.girv_prin_amt),

        girv_first_int: data.girv_first_int || "N",
        girv_first_int_cr_acc_id: (data.girv_first_int === 'Y') ? interestRecAccId : null,
        girv_first_int_dr_acc_id: (data.girv_first_int === 'Y' && data.girv_first_int_dr_acc_id) ? parseInt(data.girv_first_int_dr_acc_id) : null,

        girv_cash_amt: data.girv_cash_amt ? parseFloat(data.girv_cash_amt) : 0,
        girv_bank_amt: data.girv_bank_amt ? parseFloat(data.girv_bank_amt) : 0,
        girv_online_amt: data.girv_online_amt ? parseFloat(data.girv_online_amt) : 0,
        girv_card_amt: data.girv_card_amt ? parseFloat(data.girv_card_amt) : 0,

        girv_cash_acc_id: data.girv_cash_acc_id ? parseInt(data.girv_cash_acc_id) : null,
        girv_bank_acc_id: data.girv_bank_acc_id ? parseInt(data.girv_bank_acc_id) : null,
        girv_online_acc_id: data.girv_online_acc_id ? parseInt(data.girv_online_acc_id) : null,
        girv_card_acc_id: data.girv_card_acc_id ? parseInt(data.girv_card_acc_id) : null,

        girv_cash_info: data.girv_cash_info || "",
        girv_bank_info: data.girv_bank_info || "",
        girv_online_info: data.girv_online_info || "",
        girv_card_info: data.girv_card_info || "",

        girv_dr_acc_id: data.girv_dr_acc_id ? parseInt(data.girv_dr_acc_id) : null,
        girv_other_info: data.girv_other_info || "",
        girv_pay_info: data.girv_pay_info || "",

        girv_created_by: req.user.own_login_id || "Admin",
      };

      // Extract and map Stock items if type is secured
      let itemsArray = data.items;
      if (typeof data.items === 'string') {
        try {
          itemsArray = JSON.parse(data.items);
        } catch (e) {
          itemsArray = [];
        }
      }

      let stockItems = [];
      if (data.girv_type === "secured" && itemsArray && Array.isArray(itemsArray)) {
        stockItems = itemsArray.map((item) => ({
          st_metal_type: item.st_metal_type ? item.st_metal_type.toLowerCase() : "gold",
          st_item_name: item.st_item_name,
          st_quantity: parseInt(item.st_quantity) || 1,
          st_rate: parseFloat(item.st_rate) || 0,
          st_gs_weight: parseFloat(item.st_gs_weight) || 0,
          st_gs_type: item.st_gs_type || "GM",
          st_nt_weight: parseFloat(item.st_nt_weight) || 0,
          st_nt_type: item.st_nt_type || "GM",
          st_purity: parseFloat(item.st_purity) || 100,
          st_fine_weight: parseFloat(item.st_fine_weight) || 0,
          st_valuation: parseFloat(item.st_valuation) || 0,
          st_final_valuation: parseFloat(item.st_valuation) || 0,
          st_image: parseStImage(item.st_image),
          st_created_by: req.user.own_login_id || "Admin",
        }));
      }

      const newGirvi = await girviService.createGirvi(dbUrl, girviData, stockItems);

      logActivity(dbUrl, req.user, {
        firmId: newGirvi.girv_firm_id,
        module: MODULE.LOAN,
        action: ACTION.CREATE,
        subject: "Loan Added",
        description: (at) => descriptions.loanCreated(newGirvi, at),
        entityType: "girvi",
        entityId: newGirvi.girv_id,
        refNo: formatLoanNo(newGirvi),
        amount: newGirvi.girv_prin_amt,
      });

      return res.status(201).json({
        message: "Loan created successfully.",
        data: newGirvi,
      });
    } catch (error) {
      console.error("❌ Error creating girvi loan:", error);
      return res.status(500).json({ error: error.message });
    }
  }

  async getGirvis(req, res) {
    try {
      const { firmId, userId, status } = req.query;
      const dbUrl = this.getDbUrl(req.user.own_db);
      const girvis = await girviService.getGirvis(dbUrl, firmId, userId, status);

      return res.status(200).json({
        message: "Loans fetched successfully.",
        data: girvis,
      });
    } catch (error) {
      console.error("❌ Error fetching girvis:", error.message);
      return res.status(500).json({ error: error.message });
    }
  }

  async getGirvisDropdown(req, res) {
    try {
      const { userId } = req.params;
      const { firmId } = req.query;
      const dbUrl = this.getDbUrl(req.user.own_db);
      const girvis = await girviService.getGirvisDropdown(dbUrl, firmId, userId);

      return res.status(200).json({
        message: "Loans dropdown fetched successfully.",
        data: girvis,
      });
    } catch (error) {
      console.error("❌ Error fetching girvis dropdown:", error.message);
      return res.status(500).json({ error: error.message });
    }
  }

  async getGirviById(req, res) {
    try {
      const dbUrl = this.getDbUrl(req.user.own_db);
      const girvi = await girviService.getGirviById(dbUrl, req.params.id);

      return res.status(200).json({
        message: "Loan fetched successfully.",
        data: girvi,
      });
    } catch (error) {
      console.error("❌ Error fetching girvi details:", error.message);
      return res.status(500).json({ error: error.message });
    }
  }

  async updateGirvi(req, res) {
    try {
      const dbUrl = this.getDbUrl(req.user.own_db);
      const girvUuid = req.params.id; // actually the uuid is passed
      const data = { ...req.body };

      let allowFinancialUpdate = true; // Service will double check based on transactions

      if (data.girv_first_int === "Y" && !data.girv_first_int_dr_acc_id) {
        return res.status(400).json({
          error: "Interest Payment Account (DR) is required for First Month Interest.",
        });
      }

      let interestRecAccId = null;
      if (data.girv_first_int === "Y") {
        interestRecAccId = await resolveInterestRecAccount(
          dbUrl,
          data.girv_firm_id,
          req.user.own_id
        );
      }

      const girviData = {
        girv_firm_id: parseInt(data.girv_firm_id),
        girv_user_id: parseInt(data.girv_user_id),
        girv_start_date: data.girv_start_date,
        girv_loan_no: data.girv_loan_no || null,
        girv_prin_amt: parseFloat(data.girv_prin_amt),
        girv_process_per: data.girv_process_per ? parseFloat(data.girv_process_per) : 0,
        girv_process_amt: data.girv_process_amt ? parseFloat(data.girv_process_amt) : 0,
        girv_packet_no: data.girv_packet_no || null,
        girv_locker_no: data.girv_locker_no || null,
        girv_charge_per: data.girv_charge_per ? parseFloat(data.girv_charge_per) : 0,
        girv_charge_amt: data.girv_charge_amt ? parseFloat(data.girv_charge_amt) : 0,
        girv_roi: parseFloat(data.girv_roi),
        girv_roi_type: normalizeRoiType(data.girv_roi_type),
        girv_type: data.girv_type,
        girv_interest_method: data.girv_interest_method || "simple",
        girv_compound_freq: data.girv_compound_freq || null,
        girv_final_amt: parseFloat(data.girv_prin_amt),

        girv_first_int: data.girv_first_int || "N",
        girv_first_int_cr_acc_id: data.girv_first_int === "Y" ? interestRecAccId : null,
        girv_first_int_dr_acc_id:
          data.girv_first_int === "Y" && data.girv_first_int_dr_acc_id
            ? parseInt(data.girv_first_int_dr_acc_id, 10)
            : null,

        girv_cash_amt: data.girv_cash_amt ? parseFloat(data.girv_cash_amt) : 0,
        girv_bank_amt: data.girv_bank_amt ? parseFloat(data.girv_bank_amt) : 0,
        girv_online_amt: data.girv_online_amt ? parseFloat(data.girv_online_amt) : 0,
        girv_card_amt: data.girv_card_amt ? parseFloat(data.girv_card_amt) : 0,

        girv_cash_acc_id: data.girv_cash_acc_id ? parseInt(data.girv_cash_acc_id) : null,
        girv_bank_acc_id: data.girv_bank_acc_id ? parseInt(data.girv_bank_acc_id) : null,
        girv_online_acc_id: data.girv_online_acc_id ? parseInt(data.girv_online_acc_id) : null,
        girv_card_acc_id: data.girv_card_acc_id ? parseInt(data.girv_card_acc_id) : null,

        girv_cash_info: data.girv_cash_info || "",
        girv_bank_info: data.girv_bank_info || "",
        girv_online_info: data.girv_online_info || "",
        girv_card_info: data.girv_card_info || "",

        girv_dr_acc_id: data.girv_dr_acc_id ? parseInt(data.girv_dr_acc_id) : null,
        girv_other_info: data.girv_other_info || "",
        girv_pay_info: data.girv_pay_info || "",
        girv_updated_by: req.user.own_login_id || "Admin",
      };

      let itemsArray = data.items;
      if (typeof data.items === 'string') {
        try { itemsArray = JSON.parse(data.items); } catch (e) { itemsArray = []; }
      }

      let stockItems = [];
      if (data.girv_type === "secured" && itemsArray && Array.isArray(itemsArray)) {
        stockItems = itemsArray.map((item) => ({
          st_metal_type: item.st_metal_type ? item.st_metal_type.toLowerCase() : "gold",
          st_item_name: item.st_item_name,
          st_quantity: parseInt(item.st_quantity) || 1,
          st_rate: parseFloat(item.st_rate) || 0,
          st_gs_weight: parseFloat(item.st_gs_weight) || 0,
          st_gs_type: item.st_gs_type || "GM",
          st_nt_weight: parseFloat(item.st_nt_weight) || 0,
          st_nt_type: item.st_nt_type || "GM",
          st_purity: parseFloat(item.st_purity) || 100,
          st_fine_weight: parseFloat(item.st_fine_weight) || 0,
          st_valuation: parseFloat(item.st_valuation) || 0,
          st_final_valuation: parseFloat(item.st_valuation) || 0,
          st_image: parseStImage(item.st_image),
          st_created_by: req.user.own_login_id || "Admin",
        }));
      }

      const updatedGirvi = await girviService.updateGirvi(dbUrl, girvUuid, girviData, stockItems, allowFinancialUpdate);

      logActivity(dbUrl, req.user, {
        firmId: updatedGirvi.girv_firm_id,
        module: MODULE.LOAN,
        action: ACTION.UPDATE,
        subject: "Loan Updated",
        description: (at) => descriptions.loanUpdated(updatedGirvi, at),
        entityType: "girvi",
        entityId: updatedGirvi.girv_id,
        refNo: formatLoanNo(updatedGirvi),
        amount: updatedGirvi.girv_prin_amt,
      });

      return res.status(200).json({
        message: "Loan updated successfully.",
        data: updatedGirvi,
      });
    } catch (error) {
      console.error("❌ Error updating girvi loan:", error);
      return res.status(500).json({ error: error.message });
    }
  }

  async transferLoan(req, res) {
    try {
      const dbUrl = this.getDbUrl(req.user.own_db);
      const girvUuid = req.params.id; // UUID of the original loan
      const formData = req.body || {};
      const transferTo = String(formData.transfer_to || "firm").toLowerCase();

      if (!formData.targetFirmId) {
        return res.status(400).json({ error: "Target firm ID is required for transfer." });
      }

      if (transferTo === "money_lender" && !formData.targetMoneyLenderId) {
        return res.status(400).json({ error: "Target money lender ID is required for money lender transfer." });
      }

      const result = await girviService.transferLoan(dbUrl, girvUuid, formData, req.user);

      const sourceGirvi = {
        girv_id: result.girv_transfer_from_girv_id,
        girv_unique_code: null,
        girv_loan_no: null,
      };

      if (result.girv_transfer_from_girv_id) {
        logActivity(dbUrl, req.user, {
          firmId: result.girv_transfer_from_firm_id,
          module: MODULE.LOAN,
          action: ACTION.TRANSFER,
          subject: "Loan Transfer Out",
          description: (at) => descriptions.loanTransferOut(sourceGirvi, result, at),
          entityType: "girvi",
          entityId: result.girv_transfer_from_girv_id,
          refNo: formatLoanNo({ girv_id: result.girv_transfer_from_girv_id }),
          amount: result.girv_prin_amt,
        });
      }

      logActivity(dbUrl, req.user, {
        firmId: result.girv_firm_id,
        module: MODULE.LOAN,
        action: ACTION.TRANSFER,
        subject: "Loan Transfer In",
        description: (at) => descriptions.loanTransferIn(result, sourceGirvi, at),
        entityType: "girvi",
        entityId: result.girv_id,
        refNo: formatLoanNo(result),
        amount: result.girv_prin_amt,
      });

      return res.status(200).json({
        message:
          transferTo === "money_lender"
            ? "Loan transferred to money lender successfully."
            : "Loan transferred successfully.",
        data: result,
      });
    } catch (error) {
      console.error("❌ Error transferring loan:", error);
      return res.status(500).json({ error: error.message });
    }
  }

  async deleteGirvi(req, res) {
    try {
      const dbUrl = this.getDbUrl(req.user.own_db);
      const girvId = req.params.id;

      if (!girvId) {
        return res.status(400).json({ error: "Loan ID is required." });
      }

      const deleted = await girviService.deleteGirvi(dbUrl, req.user, girvId);

      logActivity(dbUrl, req.user, {
        firmId: deleted.girv_firm_id,
        module: MODULE.LOAN,
        action: ACTION.DELETE,
        subject: "Loan Deleted",
        description: (at) => descriptions.loanDeleted(deleted, at),
        entityType: "girvi",
        entityId: deleted.girv_id,
        refNo: formatLoanNo(deleted),
        amount: deleted.girv_prin_amt,
      });

      return res.status(200).json({
        message: "Loan deleted successfully.",
        data: deleted,
      });
    } catch (error) {
      console.error("❌ Error deleting girvi loan:", error.message);
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new GirviController();
