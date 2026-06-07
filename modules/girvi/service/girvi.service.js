"use strict";

const { PrismaClient } = require("../../../prisma/generated/main");
const journalService = require("../../journal/service/journal.service");

class GirviService {
  getPrisma(dbUrl) {
    return new PrismaClient({
      datasources: {
        db: {
          url: dbUrl,
        },
      },
    });
  }

  /**
   * Helper to parse account ID and fall back to firm's default account if not selected.
   */
  async resolveAccount(prisma, firmId, customAccId, fallbackNames) {
    let parsedId = customAccId ? parseInt(customAccId) : null;
    if (parsedId && !isNaN(parsedId) && parsedId > 0) {
      return parsedId;
    }
    
    for (const name of fallbackNames) {
      const acc = await prisma.account.findFirst({
        where: {
          acc_firm_id: parseInt(firmId),
          acc_is_deleted: false,
          acc_name: {
            contains: name,
            mode: 'insensitive',
          },
        },
      });
      if (acc) return acc.acc_id;
    }
    return null;
  }

  async createGirvi(dbUrl, girviData, stockItems) {
    const prisma = this.getPrisma(dbUrl);
    try {
      // 1. Resolve Automatic Fields if not provided
      const firmId = girviData.girv_firm_id;
      
      let girv_dr_acc_id = girviData.girv_dr_acc_id;
      if (!girv_dr_acc_id || girv_dr_acc_id === 0) {
        const searchName = girviData.girv_type === "unsecured" ? "Unsecured Loans" : "Secured Loans";
        girv_dr_acc_id = await this.resolveAccount(prisma, firmId, null, [searchName]);
        girviData.girv_dr_acc_id = girv_dr_acc_id;
      }

      girviData.girv_cash_acc_id = await this.resolveAccount(prisma, firmId, girviData.girv_cash_acc_id, ["Cash In Hand", "Cash"]);
      girviData.girv_bank_acc_id = await this.resolveAccount(prisma, firmId, girviData.girv_bank_acc_id, ["Bank Account", "Bank"]);
      girviData.girv_online_acc_id = await this.resolveAccount(prisma, firmId, girviData.girv_online_acc_id, ["Online Account", "Online"]);
      girviData.girv_card_acc_id = await this.resolveAccount(prisma, firmId, girviData.girv_card_acc_id, ["Card Account", "Card", "POS"]);

      // 2. Create Girvi and Stock within transaction
      const newGirvi = await prisma.$transaction(async (tx) => {
        // Create Girvi
        const createdGirvi = await tx.girvi.create({
          data: girviData,
        });

        // Create associated stock items if provided
        if (stockItems && stockItems.length > 0) {
          const stockData = stockItems.map((item) => ({
            ...item,
            st_referance_panel: "girvi",
            st_referance_id: createdGirvi.girv_id,
            st_own_id: createdGirvi.girv_own_id,
            st_firm_id: createdGirvi.girv_firm_id,
            st_user_id: createdGirvi.girv_user_id,
          }));

          await tx.stock.createMany({
            data: stockData,
          });
          
          // Fetch and attach the created stock items to verify they were inserted
          const createdStocks = await tx.stock.findMany({
            where: {
              st_referance_panel: "girvi",
              st_referance_id: createdGirvi.girv_id
            }
          });
          createdGirvi.items = createdStocks;
        }

        return createdGirvi;
      });

      // 3. Create Journal Entry
      const journal_request = {
        journal_date: {
          jrnl_date: newGirvi.girv_start_date,
          jrnl_firm_id: newGirvi.girv_firm_id,
          jrnl_own_id: newGirvi.girv_own_id,
          jrnl_user_id: newGirvi.girv_user_id,
          jrnl_amt: newGirvi.girv_prin_amt,
          jrnl_panel: "Girvi",
          jrnl_other_info: `Add New Girvi | Girvi No - ${newGirvi.girv_id}`,
        },
        joural_trans_data: [
          { jrtr_crdr: "CR", jrtr_date: newGirvi.girv_start_date, jrtr_cr_acc_id: newGirvi.girv_cash_acc_id, jrtr_cr_amt: newGirvi.girv_cash_amt, jrtr_acc_info: newGirvi.girv_cash_info },
          { jrtr_crdr: "CR", jrtr_date: newGirvi.girv_start_date, jrtr_cr_acc_id: newGirvi.girv_bank_acc_id, jrtr_cr_amt: newGirvi.girv_bank_amt, jrtr_acc_info: newGirvi.girv_bank_info },
          { jrtr_crdr: "CR", jrtr_date: newGirvi.girv_start_date, jrtr_cr_acc_id: newGirvi.girv_online_acc_id, jrtr_cr_amt: newGirvi.girv_online_amt, jrtr_acc_info: newGirvi.girv_online_info },
          { jrtr_crdr: "CR", jrtr_date: newGirvi.girv_start_date, jrtr_cr_acc_id: newGirvi.girv_card_acc_id, jrtr_cr_amt: newGirvi.girv_card_amt, jrtr_acc_info: newGirvi.girv_card_info },
          { jrtr_crdr: "DR", jrtr_date: newGirvi.girv_start_date, jrtr_dr_acc_id: newGirvi.girv_dr_acc_id, jrtr_dr_amt: newGirvi.girv_prin_amt, jrtr_acc_info: `Add New Girvi : Girvi No - ${newGirvi.girv_id}` }
        ].filter(t => (t.jrtr_cr_amt && parseFloat(t.jrtr_cr_amt) > 0) || (t.jrtr_dr_amt && parseFloat(t.jrtr_dr_amt) > 0)),
      };

      try {
        await journalService.create_journal_entry(dbUrl, journal_request);
      } catch (journalErr) {
        console.error("❌ Failed to create journal entry for girvi:", journalErr.message);
      }

      return newGirvi;
    } finally {
      await prisma.$disconnect();
    }
  }

  async getGirvis(dbUrl, firmId) {
    const prisma = this.getPrisma(dbUrl);
    try {
      const where = { girv_is_deleted: false };
      if (firmId) {
        where.girv_firm_id = parseInt(firmId);
      }
      return await prisma.girvi.findMany({
        where,
        orderBy: { girv_created_at: "desc" },
      });
    } finally {
      await prisma.$disconnect();
    }
  }
}

module.exports = new GirviService();
