"use strict";

const { PrismaClient } = require("../../../prisma/generated/main");

class JournalBookService {
  getPrisma(dbUrl) {
    return new PrismaClient({
      datasources: {
        db: {
          url: dbUrl,
        },
      },
    });
  }

  async getAllJournals(dbUrl, firmId) {
    const prisma = this.getPrisma(dbUrl);
    try {
      const transactions = await prisma.journalTransaction.findMany({
        where: { 
          jrtr_firm_id: parseInt(firmId), 
          jrtr_is_deleted: false 
        },
        orderBy: [
          { jrtr_date: 'desc' },
          { jrtr_id: 'desc' }
        ]
      });

      const accountIds = new Set();
      transactions.forEach(t => {
        if (t.jrtr_cr_acc_id) accountIds.add(t.jrtr_cr_acc_id);
        if (t.jrtr_dr_acc_id) accountIds.add(t.jrtr_dr_acc_id);
      });

      let accountMap = {};
      if (accountIds.size > 0) {
        const accounts = await prisma.account.findMany({
          where: { acc_id: { in: Array.from(accountIds) } },
          select: { acc_id: true, acc_name: true }
        });
        accounts.forEach(acc => {
          accountMap[acc.acc_id] = acc.acc_name;
        });
      }

      return transactions.map(t => ({
        ...t,
        cr_acc_name: accountMap[t.jrtr_cr_acc_id] || "Unknown Account",
        dr_acc_name: accountMap[t.jrtr_dr_acc_id] || "Unknown Account",
      }));
    } finally {
      await prisma.$disconnect();
    }
  }
}

module.exports = new JournalBookService();
