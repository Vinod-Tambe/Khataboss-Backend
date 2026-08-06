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

  async getGirvis(dbUrl, firmId, userId, status) {
    const prisma = this.getPrisma(dbUrl);
    try {
      const where = { girv_is_deleted: false };
      if (firmId) {
        where.girv_firm_id = parseInt(firmId);
      }
      if (userId) {
        where.girv_user_id = parseInt(userId);
      }
      if (status && status !== "ALL") {
        where.girv_status = status;
      }
      return await prisma.girvi.findMany({
        where,
        orderBy: { girv_created_at: "desc" },
        include: { firm: true, user: true },
      });
    } finally {
      await prisma.$disconnect();
    }
  }

  async getGirvisDropdown(dbUrl, firmId, userId) {
    const prisma = this.getPrisma(dbUrl);
    try {
      const where = { 
        girv_is_deleted: false,
        girv_user_id: parseInt(userId),
        girv_status: 'ACTIVE'
      };
      if (firmId) {
        where.girv_firm_id = parseInt(firmId);
      }
      return await prisma.girvi.findMany({
        where,
        select: {
          girv_id: true,
          girv_prin_amt: true,
          girv_status: true,
        },
        orderBy: { girv_created_at: "desc" },
      });
    } finally {
      await prisma.$disconnect();
    }
  }

  async getGirviById(dbUrl, girvId) {
    const prisma = this.getPrisma(dbUrl);
    try {
      const girvi = await prisma.girvi.findUnique({
        where: { girv_id: parseInt(girvId) },
        include: {
          firm: true,
          user: true,
        }
      });

      if (!girvi) throw new Error("Girvi not found");

      const items = await prisma.stock.findMany({
        where: {
          st_referance_panel: "girvi",
          st_referance_id: parseInt(girvId),
          st_is_deleted: false,
        }
      });

      const additionalPrincipals = await prisma.additionalPrincipal.findMany({
        where: {
          ap_girv_id: parseInt(girvId)
        },
        orderBy: {
          ap_trans_date: 'asc'
        }
      });

      const deposits = await prisma.girviDeposit.findMany({
        where: {
          dep_girv_id: parseInt(girvId)
        },
        orderBy: {
          dep_trans_date: 'asc'
        }
      });

      const releases = await prisma.girviRelease.findMany({
        where: {
          rel_girv_id: parseInt(girvId)
        },
        orderBy: {
          rel_trans_date: 'asc'
        }
      });

      return { ...girvi, items, additionalPrincipals, deposits, releases };
    } finally {
      await prisma.$disconnect();
    }
  }

  async updateGirvi(dbUrl, girvUuid, girviData, stockItems, allowFinancialUpdate) {
    const prisma = this.getPrisma(dbUrl);
    try {
      // Find existing loan
      const existing = await prisma.girvi.findUnique({
        where: { girv_uuid: girvUuid },
        include: { additionalPrincipals: true, deposits: true, releases: true }
      });
      if (!existing) throw new Error("Loan not found.");

      // Check if transactions exist to enforce financial update block at the service layer as well
      const hasTransactions = existing.additionalPrincipals.length > 0 || existing.deposits.length > 0 || existing.releases.length > 0;
      
      let updateData = {};

      if (hasTransactions || existing.girv_status !== 'ACTIVE') {
        // Only allow non-financial fields
        updateData = {
          girv_packet_no: girviData.girv_packet_no,
          girv_locker_no: girviData.girv_locker_no,
          girv_other_info: girviData.girv_other_info,
          girv_pay_info: girviData.girv_pay_info,
          girv_cash_info: girviData.girv_cash_info,
          girv_bank_info: girviData.girv_bank_info,
          girv_online_info: girviData.girv_online_info,
          girv_card_info: girviData.girv_card_info,
        };
      } else {
        // Allow all updates
        updateData = { ...girviData };
      }

      updateData.girv_updated_at = new Date();

      const updatedGirvi = await prisma.girvi.update({
        where: { girv_uuid: girvUuid },
        data: updateData,
      });

      // Update Stock Items if allowed (only if no transactions or status is active and allowFinancialUpdate is true)
      if (!hasTransactions && existing.girv_status === 'ACTIVE' && stockItems) {
        // Delete old items
        await prisma.stock.deleteMany({
          where: { 
            st_referance_panel: 'girvi',
            st_referance_id: updatedGirvi.girv_id 
          }
        });

        // Insert new ones
        if (stockItems.length > 0) {
          const itemsToInsert = stockItems.map(item => ({
            ...item,
            st_referance_panel: 'girvi',
            st_referance_id: updatedGirvi.girv_id,
            st_firm_id: updatedGirvi.girv_firm_id,
            st_user_id: updatedGirvi.girv_user_id,
            st_own_id: updatedGirvi.girv_own_id,
          }));
          await prisma.stock.createMany({
            data: itemsToInsert,
          });
        }
      }

      return updatedGirvi;
    } finally {
      await prisma.$disconnect();
    }
  }

  async transferLoan(dbUrl, girvUuid, formData, requestUser) {
    const prisma = this.getPrisma(dbUrl);
    const targetFirmId = parseInt(formData.targetFirmId);
    try {
      const existing = await prisma.girvi.findUnique({
        where: { girv_uuid: girvUuid },
        include: { user: true }
      });
      if (!existing) throw new Error("Loan not found.");
      if (existing.girv_status !== 'ACTIVE') throw new Error("Only active loans can be transferred.");

      const targetFirm = await prisma.firm.findUnique({
        where: { firm_id: targetFirmId }
      });
      if (!targetFirm) throw new Error("Target firm not found.");
      if (targetFirm.firm_own_id !== existing.girv_own_id) throw new Error("Target firm must belong to the same owner.");

      // Check if user exists in target firm
      let targetUser = await prisma.user.findFirst({
        where: {
          user_firm_id: targetFirmId,
          user_mobile_no: existing.user.user_mobile_no
        }
      });

      // If user doesn't exist in target firm, duplicate them
      if (!targetUser) {
        const { user_id, user_uuid, user_firm_id, user_add_date, user_created_at, user_updated_at, ...userCloneData } = existing.user;
        targetUser = await prisma.user.create({
          data: {
            ...userCloneData,
            user_firm_id: targetFirmId,
            user_created_by: requestUser.own_login_id || "System Transfer"
          }
        });
      }

      const items = await prisma.stock.findMany({
        where: {
          st_referance_panel: 'girvi',
          st_referance_id: existing.girv_id,
          st_is_deleted: false
        }
      });

      return await prisma.$transaction(async (tx) => {
        // 1. Create the new loan in the target firm
        const { girv_id, girv_uuid, girv_firm_id, girv_user_id, girv_status, girv_created_at, girv_updated_at, user, ...girviCloneData } = existing;
        
        const newGirvi = await tx.girvi.create({
          data: {
            ...girviCloneData,
            girv_firm_id: targetFirmId,
            girv_user_id: targetUser.user_id,
            girv_status: 'ACTIVE',
            girv_created_by: requestUser.own_login_id || "System Transfer",
            girv_start_date: formData.transfer_date || girviCloneData.girv_start_date,
            girv_prin_amt: formData.girv_prin_amt ? parseFloat(formData.girv_prin_amt) : girviCloneData.girv_prin_amt,
            girv_roi: formData.girv_roi ? parseFloat(formData.girv_roi) : girviCloneData.girv_roi,
            girv_interest_method: formData.girv_interest_method || girviCloneData.girv_interest_method,
            girv_packet_no: formData.girv_packet_no || girviCloneData.girv_packet_no,
            girv_locker_no: formData.girv_locker_no || girviCloneData.girv_locker_no,
            girv_cash_acc_id: formData.girv_cash_acc_id ? parseInt(formData.girv_cash_acc_id) : null,
            girv_cash_info: formData.girv_cash_info || null,
            girv_cash_amt: formData.girv_cash_amt ? parseFloat(formData.girv_cash_amt) : 0,
            girv_bank_acc_id: formData.girv_bank_acc_id ? parseInt(formData.girv_bank_acc_id) : null,
            girv_bank_info: formData.girv_bank_info || null,
            girv_bank_amt: formData.girv_bank_amt ? parseFloat(formData.girv_bank_amt) : 0,
            girv_online_acc_id: formData.girv_online_acc_id ? parseInt(formData.girv_online_acc_id) : null,
            girv_online_info: formData.girv_online_info || null,
            girv_online_amt: formData.girv_online_amt ? parseFloat(formData.girv_online_amt) : 0,
            girv_card_acc_id: formData.girv_card_acc_id ? parseInt(formData.girv_card_acc_id) : null,
            girv_card_info: formData.girv_card_info || null,
            girv_card_amt: formData.girv_card_amt ? parseFloat(formData.girv_card_amt) : 0,
            girv_pay_info: formData.girv_pay_info || null,
            girv_other_info: formData.girv_other_info || null,
          }
        });

        // 2. Duplicate stock items
        if (items.length > 0) {
          const itemsToInsert = items.map(item => {
            const { st_id, st_uuid, st_referance_id, st_firm_id, st_user_id, st_created_at, st_updated_at, ...itemCloneData } = item;
            return {
              ...itemCloneData,
              st_referance_id: newGirvi.girv_id,
              st_firm_id: targetFirmId,
              st_user_id: targetUser.user_id,
              st_created_by: requestUser.own_login_id || "System Transfer"
            };
          });
          await tx.stock.createMany({
            data: itemsToInsert
          });
        }

        // 3. Mark old loan as TRANSFERRED
        const oldGirvi = await tx.girvi.update({
          where: { girv_uuid: girvUuid },
          data: {
            girv_status: 'TRANSFERRED',
            girv_transfer_firm_id: targetFirmId,
            girv_transfer_girv_id: newGirvi.girv_id,
            girv_other_info: `Transferred to firm ${targetFirm.firm_name} (ID: ${targetFirmId})` + (existing.girv_other_info ? ` | ${existing.girv_other_info}` : '')
          }
        });

        return newGirvi;
      });
    } finally {
      await prisma.$disconnect();
    }
  }
}

module.exports = new GirviService();
