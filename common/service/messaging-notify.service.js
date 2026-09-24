"use strict";

const fs = require("fs");
const messageDispatchService = require("./message-dispatch.service");
const messagingPdf = require("./messaging-pdf.service");
const { getCustomerWhatsAppNo } = require("../../utils/customer.helper");

async function unlinkQuiet(filePath) {
  if (!filePath) return;
  try {
    await fs.promises.unlink(filePath);
  } catch {
    /* ignore */
  }
}

/**
 * Send WhatsApp (and optional email) with optional PDF receipt.
 */
async function notifyCustomerTransaction({
  dbUrl,
  firmId,
  templateKey,
  user,
  vars,
  pdfSpec = null,
}) {
  const ownDb = messageDispatchService.ownDbFromUrl(dbUrl);
  let documentPath = null;
  let documentFilename = null;

  try {
    if (pdfSpec) {
      documentPath = await messagingPdf.writeReceiptPdf(pdfSpec);
      documentFilename = pdfSpec.filename;
    }

    return await messageDispatchService.dispatchMessage({
      dbUrl,
      ownDb,
      firmId,
      templateKey,
      toPhone: getCustomerWhatsAppNo(user),
      toEmail: user?.user_email_id,
      vars,
      documentPath,
      documentFilename,
      sendWhatsApp: true,
      sendEmail: Boolean(user?.user_email_id),
    });
  } finally {
    await unlinkQuiet(documentPath);
  }
}

function notifyCustomerTransactionSafe(opts) {
  return notifyCustomerTransaction(opts).catch((err) => {
    console.warn(`[messaging] ${opts.templateKey} notify failed:`, err.message);
    return { error: err.message };
  });
}

module.exports = {
  notifyCustomerTransaction,
  notifyCustomerTransactionSafe,
};
