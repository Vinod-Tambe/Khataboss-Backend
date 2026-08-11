"use strict";

const auctionService = require("../service/auction.service");
const imageService = require("../../../utils/image.service");
const { BASE_URL } = require("../../../config/db");
const {
  logActivity,
  MODULE,
  ACTION,
  descriptions,
} = require("../../../common/service/activityLog.service");
const { formatLoanNo } = require("../../../utils/journalNarration");

const getDbUrl = (dbName) => `${BASE_URL}/${dbName}`;

exports.addAuction = async (req, res) => {
  try {
    const dbUrl = req.user?.own_db ? getDbUrl(req.user.own_db) : null;
    const reqUser = req.user;
    const data = req.body;
    
    if (!dbUrl) {
      return res.status(400).json({ error: "Database URL not found in request." });
    }

    const service = new auctionService();
    const { newAuctionLoan, auctionUserId } = await service.addAuction(dbUrl, reqUser, data);

    if (req.file) {
      const movedFile = await imageService.moveSingleFile("auction", auctionUserId, req.file, "photo");
      if (movedFile) {
        await service.updateAuctionImage(dbUrl, auctionUserId, movedFile.filename);
        // We do not append image to newAuctionLoan as the image belongs to AuctionUser,
        // but if frontend expects it, we can just attach it.
        newAuctionLoan.auc_user_image = movedFile.filename; 
      }
    }

    logActivity(dbUrl, reqUser, {
      firmId: newAuctionLoan.al_firm_id || data.al_firm_id,
      module: MODULE.AUCTION,
      action: ACTION.AUCTION,
      subject: "Auction Loan",
      description: (at) =>
        descriptions.auctionCreated(
          { girv_id: newAuctionLoan.al_girv_id },
          {
            auc_payable_amt: newAuctionLoan.al_payable_amt,
            auc_prin_amt: newAuctionLoan.al_prin_amt,
            auc_trans_date: newAuctionLoan.al_date,
          },
          at
        ),
      transDate: newAuctionLoan.al_date,
      entityType: "girvi",
      entityId: newAuctionLoan.al_girv_id,
      refNo: formatLoanNo({ girv_id: newAuctionLoan.al_girv_id }),
      amount: newAuctionLoan.al_payable_amt ?? newAuctionLoan.al_prin_amt,
    });

    return res.status(201).json({ message: "Auction submitted successfully", newAuction: newAuctionLoan });
  } catch (error) {
    console.error("Error submitting auction:", error);
    return res.status(500).json({ error: error.message || "Failed to submit auction" });
  }
};

exports.getAuctionUsers = async (req, res) => {
  try {
    const dbUrl = req.user?.own_db ? getDbUrl(req.user.own_db) : null;
    const reqUser = req.user;
    const { firmId, search } = req.query;

    if (!dbUrl) {
      return res.status(400).json({ error: "Database URL not found in request." });
    }

    const service = new auctionService();
    const users = await service.getAuctionUsers(dbUrl, reqUser, firmId, search);
    return res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching auction users:", error);
    return res.status(500).json({ error: error.message || "Failed to fetch auction users" });
  }
};

exports.getAuctionLoans = async (req, res) => {
  try {
    const dbUrl = req.user?.own_db ? getDbUrl(req.user.own_db) : null;
    const reqUser = req.user;
    const { firmId, userId } = req.query;

    if (!dbUrl) {
      return res.status(400).json({ error: "Database URL not found in request." });
    }

    const service = new auctionService();
    const loans = await service.getAuctionLoans(dbUrl, reqUser, firmId, userId);
    return res.status(200).json(loans);
  } catch (error) {
    console.error("Error fetching auction loans:", error);
    return res.status(500).json({ error: error.message || "Failed to fetch auction loans" });
  }
};
