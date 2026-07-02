"use strict";

const { PrismaClient } = require("../../../prisma/generated/main");
const journalService = require("../../journal/service/journal.service");

class AddPrincipalService {
  getPrisma(dbUrl) {
    return new PrismaClient({
      datasources: {
        db: {
          url: dbUrl,
        },
      },
    });
  }

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

  async addAdditionalPrincipal(dbUrl, reqUser, data) {
    const prisma = this.getPrisma(dbUrl);
    try {
      const firmId = parseInt(data.ap_firm_id);
      
      // Resolve accounts
      const ap_cash_acc_id = await this.resolveAccount(prisma, firmId, data.ap_cash_acc_id, ["Cash In Hand", "Cash"]);
      const ap_bank_acc_id = await this.resolveAccount(prisma, firmId, data.ap_bank_acc_id, ["Bank Account", "Bank"]);
      const ap_online_acc_id = await this.resolveAccount(prisma, firmId, data.ap_online_acc_id, ["Online Account", "Online"]);
      const ap_card_acc_id = await this.resolveAccount(prisma, firmId, data.ap_card_acc_id, ["Card Account", "Card", "POS"]);

      const result = await prisma.$transaction(async (tx) => {
        // 1. Fetch the parent Girvi/Loan record
        const girvi = await tx.girvi.findUnique({
          where: { girv_id: parseInt(data.ap_girv_id) }
        });

        if (!girvi) {
          throw new Error("Girvi (Loan) record not found");
        }

        // 2. Insert AdditionalPrincipal record
        const apRecord = await tx.additionalPrincipal.create({
          data: {
            ap_own_id: reqUser.own_id,
            ap_firm_id: firmId,
            ap_user_id: parseInt(data.ap_user_id),
            ap_girv_id: parseInt(data.ap_girv_id),
            ap_staff_id: data.ap_staff_id ? parseInt(data.ap_staff_id) : 0,

            ap_trans_date: data.ap_trans_date,
            ap_prin_amt: parseFloat(data.ap_prin_amt),
            ap_roi: parseFloat(data.ap_roi),
            ap_payable_amt: parseFloat(data.ap_payable_amt),

            ap_cash_amt: data.ap_cash_amt ? parseFloat(data.ap_cash_amt) : 0,
            ap_cash_acc_id: ap_cash_acc_id,
            ap_cash_info: data.ap_cash_info || "",

            ap_bank_amt: data.ap_bank_amt ? parseFloat(data.ap_bank_amt) : 0,
            ap_bank_acc_id: ap_bank_acc_id,
            ap_bank_info: data.ap_bank_info || "",

            ap_online_amt: data.ap_online_amt ? parseFloat(data.ap_online_amt) : 0,
            ap_online_acc_id: ap_online_acc_id,
            ap_online_info: data.ap_online_info || "",

            ap_card_amt: data.ap_card_amt ? parseFloat(data.ap_card_amt) : 0,
            ap_card_acc_id: ap_card_acc_id,
            ap_card_info: data.ap_card_info || "",

            ap_pay_info: data.ap_pay_info || "",
            ap_other_info: data.ap_other_info || "",
            ap_created_by: reqUser.own_login_id || "Admin",
          }
        });

        // 3. Update Parent Girvi Record (increment prin_amt and final_amt)
        const updatedGirvi = await tx.girvi.update({
          where: { girv_id: girvi.girv_id },
          data: {
            girv_prin_amt: { increment: parseFloat(data.ap_prin_amt) },
            girv_final_amt: { increment: parseFloat(data.ap_prin_amt) }
          }
        });

        return { apRecord, updatedGirvi, girvi };
      });

      // 4. Create Journal Entry
      const drAccount = result.girvi.girv_dr_acc_id || await this.resolveAccount(prisma, result.apRecord.ap_firm_id, null, [
        result.girvi.girv_type === "unsecured" ? "Unsecured Loans" : "Secured Loans"
      ]);

      const journal_request = {
        journal_date: {
          jrnl_date: result.apRecord.ap_trans_date,
          jrnl_firm_id: result.apRecord.ap_firm_id,
          jrnl_own_id: result.apRecord.ap_own_id,
          jrnl_user_id: result.apRecord.ap_user_id,
          jrnl_amt: result.apRecord.ap_prin_amt,
          jrnl_panel: "Girvi",
          jrnl_other_info: `Add Additional Principal | Loan No - ${result.apRecord.ap_girv_id} | Add No - ${result.apRecord.ap_id}`,
        },
        joural_trans_data: [
          { jrtr_crdr: "CR", jrtr_date: result.apRecord.ap_trans_date, jrtr_cr_acc_id: result.apRecord.ap_cash_acc_id, jrtr_cr_amt: result.apRecord.ap_cash_amt, jrtr_acc_info: result.apRecord.ap_cash_info },
          { jrtr_crdr: "CR", jrtr_date: result.apRecord.ap_trans_date, jrtr_cr_acc_id: result.apRecord.ap_bank_acc_id, jrtr_cr_amt: result.apRecord.ap_bank_amt, jrtr_acc_info: result.apRecord.ap_bank_info },
          { jrtr_crdr: "CR", jrtr_date: result.apRecord.ap_trans_date, jrtr_cr_acc_id: result.apRecord.ap_online_acc_id, jrtr_cr_amt: result.apRecord.ap_online_amt, jrtr_acc_info: result.apRecord.ap_online_info },
          { jrtr_crdr: "CR", jrtr_date: result.apRecord.ap_trans_date, jrtr_cr_acc_id: result.apRecord.ap_card_acc_id, jrtr_cr_amt: result.apRecord.ap_card_amt, jrtr_acc_info: result.apRecord.ap_card_info },
          { jrtr_crdr: "DR", jrtr_date: result.apRecord.ap_trans_date, jrtr_dr_acc_id: drAccount, jrtr_dr_amt: result.apRecord.ap_prin_amt, jrtr_acc_info: `Add Add. Principal : Loan No - ${result.apRecord.ap_girv_id}` }
        ].filter(t => (t.jrtr_cr_amt && parseFloat(t.jrtr_cr_amt) > 0) || (t.jrtr_dr_amt && parseFloat(t.jrtr_dr_amt) > 0)),
      };

      try {
        await journalService.create_journal_entry(dbUrl, journal_request);
      } catch (journalErr) {
        console.error("❌ Failed to create journal entry for additional principal:", journalErr.message);
      }

      return result;
    } finally {
      await prisma.$disconnect();
    }
  }
}

module.exports = new AddPrincipalService();
