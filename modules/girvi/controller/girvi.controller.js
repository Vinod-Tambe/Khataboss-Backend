"use strict";

const girviService = require("../service/girvi.service");
const { BASE_URL } = require("../../../config/db");
const { PrismaClient } = require("../../../prisma/generated/main");

class GirviController {
  getDbUrl(dbName) {
    return `${BASE_URL}/${dbName}`;
  }

  async createGirvi(req, res) {
    try {
      const dbUrl = this.getDbUrl(req.user.own_db);
      const data = { ...req.body };

      // Validation
      if (!data.girv_firm_id || !data.girv_user_id || !data.girv_start_date || !data.girv_type || !data.girv_prin_amt || !data.girv_roi) {
        return res.status(400).json({ error: "Missing required fields for loan creation." });
      }

      let interestRecAccId = null;
      if (data.girv_first_int === 'Y') {
        const prisma = new PrismaClient({ datasources: { db: { url: dbUrl } } });
        try {
          let interestRecAcc = await prisma.account.findFirst({
            where: {
              acc_name: "Interest Rec",
              acc_firm_id: parseInt(data.girv_firm_id),
              acc_is_deleted: false
            }
          });

          if (!interestRecAcc) {
            // Auto-create the Interest Rec account for existing firms
            interestRecAcc = await prisma.account.create({
              data: {
                acc_name: "Interest Rec",
                acc_pre_acc: "Indirect Incomes",
                acc_firm_id: parseInt(data.girv_firm_id),
                acc_own_id: req.user.own_id,
                acc_is_system: true,
                acc_balance_type: 'CR',
                acc_opening_date: new Date(),
                acc_cash_balance: "0"
              }
            });
          }
          interestRecAccId = interestRecAcc.acc_id;
        } finally {
          await prisma.$disconnect();
        }
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
        girv_roi_type: data.girv_roi_type || "monthly",
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
          st_created_by: req.user.own_login_id || "Admin",
        }));
      }

      const newGirvi = await girviService.createGirvi(dbUrl, girviData, stockItems);

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
        girv_roi_type: data.girv_roi_type || "monthly",
        girv_type: data.girv_type,
        girv_interest_method: data.girv_interest_method || "simple",
        girv_compound_freq: data.girv_compound_freq || null,
        girv_final_amt: parseFloat(data.girv_prin_amt),

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
          st_created_by: req.user.own_login_id || "Admin",
        }));
      }

      const updatedGirvi = await girviService.updateGirvi(dbUrl, girvUuid, girviData, stockItems, allowFinancialUpdate);

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
      const formData = req.body; // Full form data object

      if (!formData || !formData.targetFirmId) {
        return res.status(400).json({ error: "Target firm ID is required for transfer." });
      }

      const result = await girviService.transferLoan(dbUrl, girvUuid, formData, req.user);

      return res.status(200).json({
        message: "Loan transferred successfully.",
        data: result,
      });
    } catch (error) {
      console.error("❌ Error transferring loan:", error);
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new GirviController();
