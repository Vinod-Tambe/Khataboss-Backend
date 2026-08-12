"use strict";

const { PrismaClient } = require("../../../prisma/generated/main");
const journalService = require("../../journal/service/journal.service");
const serialNumberService = require("../../../common/service/serialNumber.service");
const {
  auctionVoucher,
  loanLine,
} = require("../../../utils/journalNarration");
const { assertActiveLoan } = require("../../../utils/loanValidation");

class AuctionService {
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

  async addAuction(dbUrl, reqUser, data) {
    const prisma = this.getPrisma(dbUrl);
    try {
      const firmId = parseInt(data.auc_firm_id);

      // Validate unique identity fields
      const searchConditions = [];
      if (data.auc_user_mobile) searchConditions.push({ au_mobile: data.auc_user_mobile });
      if (data.auc_user_email) searchConditions.push({ au_email: data.auc_user_email });
      if (data.auc_user_aadhaar) searchConditions.push({ au_aadhaar: data.auc_user_aadhaar });
      if (data.auc_user_pan) searchConditions.push({ au_pan: data.auc_user_pan });
      
      // If no unique identifiers are provided but we have a name, search by name to prevent simple duplicates
      if (searchConditions.length === 0 && data.auc_user_full_name) {
        searchConditions.push({ au_full_name: data.auc_user_full_name });
      }

      let auctionUserId = null;

      if (searchConditions.length > 0) {
        const existingUsers = await prisma.auctionUser.findMany({
          where: {
            au_firm_id: firmId,
            OR: searchConditions
          }
        });

        if (existingUsers.length > 0) {
          // Find if any of the returned users is an EXACT match for the provided identifying details
          const exactMatch = existingUsers.find(existing => 
            (existing.au_full_name || "") === (data.auc_user_full_name || "") &&
            (existing.au_mobile || "") === (data.auc_user_mobile || "") &&
            (existing.au_email || "") === (data.auc_user_email || "") &&
            (existing.au_aadhaar || "") === (data.auc_user_aadhaar || "") &&
            (existing.au_pan || "") === (data.auc_user_pan || "")
          );
          
          if (exactMatch) {
            auctionUserId = exactMatch.au_id;
          } else {
            throw new Error("Auction user already available with mismatched details.");
          }
        }
      }
      
      // If no existing user, create a new one
      if (!auctionUserId) {
        const auUniqueCode = await serialNumberService.getNextSerialNumber(prisma, "AUCTION_USER");
        const newUser = await prisma.auctionUser.create({
          data: {
            au_unique_code: auUniqueCode,
            au_firm_id: firmId,
            au_full_name: data.auc_user_full_name || "",
            au_mobile: data.auc_user_mobile || "",
            au_email: data.auc_user_email || "",
            au_aadhaar: data.auc_user_aadhaar || "",
            au_gender: data.auc_user_gender || "",
            au_pan: data.auc_user_pan || "",
            au_address: data.auc_user_address || "",
            au_state: data.auc_user_state || "",
            au_city: data.auc_user_city || "",
            au_country: data.auc_user_country || "",
            au_village: data.auc_user_village || "",
            au_pincode: data.auc_user_pincode || "",
          }
        });
        auctionUserId = newUser.au_id;
      }

      // Resolve payment accounts
      const auc_cash_acc_id = await this.resolveAccount(prisma, firmId, data.auc_cash_acc_id, ["Cash In Hand", "Cash"]);
      const auc_bank_acc_id = await this.resolveAccount(prisma, firmId, data.auc_bank_acc_id, ["Bank Account", "Bank"]);
      const auc_online_acc_id = await this.resolveAccount(prisma, firmId, data.auc_online_acc_id, ["Online Account", "Online"]);
      const auc_card_acc_id = await this.resolveAccount(prisma, firmId, data.auc_card_acc_id, ["Card Account", "Card", "POS"]);

      // Fetch original loan to get its accounts / customer
      const originalGirvi = await prisma.girvi.findUnique({
        where: { girv_id: parseInt(data.auc_girv_id) },
      });
      if (!originalGirvi) {
        throw new Error("Original loan not found for auction.");
      }
      assertActiveLoan(originalGirvi, "be auctioned");

      const loanDrAccId =
        originalGirvi.girv_dr_acc_id ||
        (await this.resolveAccount(prisma, firmId, null, [
          originalGirvi.girv_type === "unsecured" ? "Unsecured Loans" : "Secured Loans",
          "Loans & Advances",
        ]));
      const interestAccId = await this.resolveAccount(prisma, firmId, null, [
        "Interest Rec",
        "Interest Account",
        "Interest Income",
        "Indirect Incomes",
      ]);

      const auctionDate = data.auc_date || new Date().toISOString().split("T")[0];
      const prinAmt = parseFloat(data.auc_prin_amt) || 0;
      const intAmt = parseFloat(data.auc_int_amt) || 0;
      const payableAmt = parseFloat(data.auc_payable_amt) || 0;

      // Create Auction Loan (Transaction) Record
      const newAuctionLoan = await prisma.auctionLoan.create({
        data: {
          al_date: auctionDate,
          al_girv_id: parseInt(data.auc_girv_id),
          al_firm_id: firmId,
          al_buyer_id: auctionUserId,

          al_prin_amt: prinAmt,
          al_int_amt: intAmt,
          al_dep_amt: parseFloat(data.auc_dep_amt) || 0,
          al_payable_amt: payableAmt,

          al_cash_acc_id: auc_cash_acc_id,
          al_cash_info: data.auc_cash_info || "",
          al_cash_amt: parseFloat(data.auc_cash_amt) || 0,

          al_bank_acc_id: auc_bank_acc_id,
          al_bank_info: data.auc_bank_info || "",
          al_bank_amt: parseFloat(data.auc_bank_amt) || 0,

          al_online_acc_id: auc_online_acc_id,
          al_online_info: data.auc_online_info || "",
          al_online_amt: parseFloat(data.auc_online_amt) || 0,

          al_card_acc_id: auc_card_acc_id,
          al_card_info: data.auc_card_info || "",
          al_card_amt: parseFloat(data.auc_card_amt) || 0,

          al_pay_info: data.auc_pay_info || "",
          al_other_info: data.auc_other_info || "",
        }
      });

      const paymentTotal =
        (parseFloat(newAuctionLoan.al_cash_amt) || 0) +
        (parseFloat(newAuctionLoan.al_bank_amt) || 0) +
        (parseFloat(newAuctionLoan.al_online_amt) || 0) +
        (parseFloat(newAuctionLoan.al_card_amt) || 0);
      const creditCore = prinAmt + intAmt;
      const balanceDiff = parseFloat((paymentTotal - creditCore).toFixed(2));
      const extraAccId = await this.resolveAccount(prisma, firmId, null, [
        "Interest Rec",
        "Extra Income",
        "Indirect Incomes",
      ]);
      const discAccId = await this.resolveAccount(prisma, firmId, null, [
        "Indirect Expenses",
        "Discount Account",
        "Expenses (Indirect)",
      ]);

      // Journal: DR cash · CR loan prin · CR Interest Rec (+ balance line if needed)
      // jrnl_user_id must be loan customer (User FK), not auction buyer
      const journal_request = {
        journal_date: {
          jrnl_firm_id: firmId,
          jrnl_own_id: reqUser.own_id,
          jrnl_user_id: originalGirvi.girv_user_id,
          jrnl_date: auctionDate,
          jrnl_amt: paymentTotal || payableAmt,
          jrnl_panel: "Auction",
          jrnl_other_info: auctionVoucher(originalGirvi, auctionDate),
        },
        joural_trans_data: [
          {
            jrtr_crdr: "DR",
            jrtr_date: auctionDate,
            jrtr_dr_acc_id: newAuctionLoan.al_cash_acc_id,
            jrtr_dr_amt: newAuctionLoan.al_cash_amt,
            jrtr_acc_info: newAuctionLoan.al_cash_info,
          },
          {
            jrtr_crdr: "DR",
            jrtr_date: auctionDate,
            jrtr_dr_acc_id: newAuctionLoan.al_bank_acc_id,
            jrtr_dr_amt: newAuctionLoan.al_bank_amt,
            jrtr_acc_info: newAuctionLoan.al_bank_info,
          },
          {
            jrtr_crdr: "DR",
            jrtr_date: auctionDate,
            jrtr_dr_acc_id: newAuctionLoan.al_online_acc_id,
            jrtr_dr_amt: newAuctionLoan.al_online_amt,
            jrtr_acc_info: newAuctionLoan.al_online_info,
          },
          {
            jrtr_crdr: "DR",
            jrtr_date: auctionDate,
            jrtr_dr_acc_id: newAuctionLoan.al_card_acc_id,
            jrtr_dr_amt: newAuctionLoan.al_card_amt,
            jrtr_acc_info: newAuctionLoan.al_card_info,
          },
          {
            jrtr_crdr: "CR",
            jrtr_date: auctionDate,
            jrtr_cr_acc_id: loanDrAccId,
            jrtr_cr_amt: prinAmt,
            jrtr_acc_info: loanLine("Auction Principal", originalGirvi),
          },
          {
            jrtr_crdr: "CR",
            jrtr_date: auctionDate,
            jrtr_cr_acc_id: interestAccId,
            jrtr_cr_amt: intAmt,
            jrtr_acc_info: loanLine("Auction Interest", originalGirvi),
          },
          // Extra received beyond prin+int
          ...(balanceDiff > 0.009
            ? [
                {
                  jrtr_crdr: "CR",
                  jrtr_date: auctionDate,
                  jrtr_cr_acc_id: extraAccId,
                  jrtr_cr_amt: balanceDiff,
                  jrtr_acc_info: loanLine("Auction Extra", originalGirvi),
                },
              ]
            : []),
          // Shortfall / discount
          ...(balanceDiff < -0.009
            ? [
                {
                  jrtr_crdr: "DR",
                  jrtr_date: auctionDate,
                  jrtr_dr_acc_id: discAccId,
                  jrtr_dr_amt: Math.abs(balanceDiff),
                  jrtr_acc_info: loanLine("Auction Discount", originalGirvi),
                },
              ]
            : []),
        ].filter(
          (t) =>
            (t.jrtr_cr_amt && parseFloat(t.jrtr_cr_amt) > 0) ||
            (t.jrtr_dr_amt && parseFloat(t.jrtr_dr_amt) > 0)
        ),
      };

      if (!journal_request.joural_trans_data.length) {
        try {
          await prisma.auctionLoan.delete({ where: { al_id: newAuctionLoan.al_id } });
        } catch (cleanupErr) {
          console.error("❌ Failed to rollback auction after empty journal:", cleanupErr.message);
        }
        throw new Error(
          "Auction account entry has no valid journal lines. Check auction amount and accounts."
        );
      }

      try {
        await journalService.create_journal_entry(dbUrl, journal_request);
      } catch (journalErr) {
        console.error("❌ Failed to create auction journal:", journalErr.message);
        try {
          await prisma.auctionLoan.delete({ where: { al_id: newAuctionLoan.al_id } });
        } catch (cleanupErr) {
          console.error("❌ Failed to rollback auction after journal error:", cleanupErr.message);
        }
        throw new Error(
          `Auction account entry failed and was rolled back: ${journalErr.message}`
        );
      }

      // Clear principal and mark loan AUCTION (only after journal succeeds)
      await prisma.girvi.update({
        where: { girv_id: parseInt(data.auc_girv_id) },
        data: {
          girv_status: "AUCTION",
          girv_prin_amt: 0,
          girv_final_amt: 0,
        },
      });

      return { newAuctionLoan, auctionUserId };
    } finally {
      await prisma.$disconnect();
    }
  }

  async getAuctionUsers(dbUrl, reqUser, firmId, search) {
    const prisma = this.getPrisma(dbUrl);
    try {
      const whereClause = {};
      
      if (firmId && firmId !== "all") {
        whereClause.au_firm_id = parseInt(firmId);
      }

      if (search) {
        whereClause.OR = [
          { au_full_name: { contains: search, mode: "insensitive" } },
          { au_mobile: { contains: search, mode: "insensitive" } },
          { au_email: { contains: search, mode: "insensitive" } },
        ];
      }

      const users = await prisma.auctionUser.findMany({
        where: whereClause,
        orderBy: { au_id: "desc" }
      });
      
      return users;
    } finally {
      await prisma.$disconnect();
    }
  }

  async getAuctionLoans(dbUrl, reqUser, firmId, userId) {
    const prisma = this.getPrisma(dbUrl);
    try {
      const whereClause = {};
      if (firmId && firmId !== "all" && firmId !== "undefined") {
        whereClause.al_firm_id = parseInt(firmId);
      }
      
      let auctionLoans = await prisma.auctionLoan.findMany({
        where: whereClause,
        orderBy: { al_id: "desc" }
      });

      if (auctionLoans.length === 0) return [];

      // Since Prisma relations are not explicitly defined in schema, fetch manually
      const girvIds = auctionLoans.map(l => l.al_girv_id);
      const buyerIds = auctionLoans.map(l => l.al_buyer_id);

      const [girvis, buyers] = await Promise.all([
        prisma.girvi.findMany({ where: { girv_id: { in: girvIds } } }),
        prisma.auctionUser.findMany({ where: { au_id: { in: buyerIds } } })
      ]);

      // If userId is provided, filter the results based on original girvi owner
      let filteredGirvis = girvis;
      if (userId && userId !== "all" && userId !== "undefined") {
        filteredGirvis = girvis.filter(g => g.girv_user_id === parseInt(userId));
        const filteredGirvIds = new Set(filteredGirvis.map(g => g.girv_id));
        auctionLoans = auctionLoans.filter(loan => filteredGirvIds.has(loan.al_girv_id));
      }

      if (auctionLoans.length === 0) return [];

      // Also fetch original customers (User table)
      const userIds = filteredGirvis.map(g => g.girv_user_id);
      const originalUsers = await prisma.user.findMany({ where: { user_id: { in: userIds } } });

      const girviMap = new Map(filteredGirvis.map(g => [g.girv_id, g]));
      const buyerMap = new Map(buyers.map(b => [b.au_id, b]));
      const originalUserMap = new Map(originalUsers.map(u => [u.user_id, u]));

      return auctionLoans.map(loan => {
        const girvi = girviMap.get(loan.al_girv_id) || {};
        const buyer = buyerMap.get(loan.al_buyer_id) || {};
        const originalUser = originalUserMap.get(girvi.girv_user_id) || {};

        return {
          ...loan,
          girviDetails: girvi,
          buyerDetails: buyer,
          originalCustomerName: `${originalUser.user_first_name || ""} ${originalUser.user_last_name || ""}`.trim() || "Unknown",
          originalCustomerMobile: originalUser.user_mobile_no || "Unknown",
          originalCustomer: originalUser,
        };
      });
    } finally {
      await prisma.$disconnect();
    }
  }

  async updateAuctionUserProfile(dbUrl, auId, profileImg) {
    const prisma = this.getPrisma(dbUrl);
    try {
      return await prisma.auctionUser.update({
        where: { au_id: parseInt(auId) },
        data: { au_profile_img: profileImg },
      });
    } finally {
      await prisma.$disconnect();
    }
  }

  async getAuctionUserById(dbUrl, auId) {
    const prisma = this.getPrisma(dbUrl);
    try {
      return await prisma.auctionUser.findUnique({
        where: { au_id: parseInt(auId) },
      });
    } finally {
      await prisma.$disconnect();
    }
  }

  async updateAuctionUserOtherImages(dbUrl, auId, otherImages) {
    const prisma = this.getPrisma(dbUrl);
    try {
      return await prisma.auctionUser.update({
        where: { au_id: parseInt(auId) },
        data: { au_other_images: otherImages },
      });
    } finally {
      await prisma.$disconnect();
    }
  }
}

module.exports = AuctionService;
