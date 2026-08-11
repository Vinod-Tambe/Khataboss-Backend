"use strict";

const stockService = require("../service/stock.service");
const { BASE_URL } = require("../../../config/db");
const {
  logActivity,
  MODULE,
  ACTION,
  descriptions,
} = require("../../../common/service/activityLog.service");

class StockController {
  getDbUrl(dbName) {
    return `${BASE_URL}/${dbName}`;
  }

  async getStocks(req, res) {
    try {
      const { firmId } = req.query;
      const dbUrl = this.getDbUrl(req.user.own_db);
      const stocks = await stockService.getStocks(dbUrl, firmId);

      return res.status(200).json({
        message: "Stocks fetched successfully.",
        data: stocks,
      });
    } catch (error) {
      console.error("❌ Error fetching stocks:", error.message);
      return res.status(500).json({ error: error.message });
    }
  }

  async createStock(req, res) {
    try {
      const dbUrl = this.getDbUrl(req.user.own_db);
      const data = { ...req.body };

      if (!data.st_firm_id || !data.st_user_id || !data.st_metal_type || !data.st_item_name || !data.st_quantity) {
        return res.status(400).json({ error: "Missing required fields for stock creation." });
      }

      const stockData = {
        st_own_id: req.user.own_id,
        st_firm_id: parseInt(data.st_firm_id),
        st_user_id: parseInt(data.st_user_id),
        st_referance_panel: data.st_referance_panel || "",
        st_referance_id: data.st_referance_id ? parseInt(data.st_referance_id) : null,
        st_metal_type: data.st_metal_type.toLowerCase(),
        st_item_name: data.st_item_name,
        st_quantity: parseInt(data.st_quantity) || 1,
        st_rate: parseFloat(data.st_rate) || 0,
        st_gs_weight: parseFloat(data.st_gs_weight) || 0,
        st_gs_type: data.st_gs_type || "GM",
        st_nt_weight: parseFloat(data.st_nt_weight) || 0,
        st_nt_type: data.st_nt_type || "GM",
        st_purity: parseFloat(data.st_purity) || 100,
        st_fine_weight: parseFloat(data.st_fine_weight) || 0,
        st_valuation: parseFloat(data.st_valuation) || 0,
        st_final_valuation: parseFloat(data.st_valuation) || 0,
        st_created_by: req.user.own_login_id || "Admin",
      };

      const newStock = await stockService.createStock(dbUrl, stockData);

      logActivity(dbUrl, req.user, {
        firmId: newStock.st_firm_id,
        module: MODULE.STOCK,
        action: ACTION.CREATE,
        subject: "Stock Inventory",
        description: (at) => descriptions.stockCreated(newStock, at),
        entityType: "stock",
        entityId: newStock.st_id,
        amount: newStock.st_valuation,
      });

      return res.status(201).json({
        message: "Stock created successfully.",
        data: newStock,
      });
    } catch (error) {
      console.error("❌ Error creating stock:", error.message);
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new StockController();
