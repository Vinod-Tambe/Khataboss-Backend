"use strict";

const fs = require("fs");
const path = require("path");
const os = require("os");
const PDFDocument = require("pdfkit");
const { formatInr, formatDisplayDate, buildCustomerName } = require("./messaging-format.helper");

function drawReceipt(doc, { title, firmName, subtitle, rows = [] }) {
  doc.fontSize(18).font("Helvetica-Bold").text(title, { align: "center" });
  doc.moveDown(0.3);
  if (firmName) {
    doc.fontSize(12).font("Helvetica-Bold").text(String(firmName), { align: "center" });
  }
  if (subtitle) {
    doc.fontSize(10).font("Helvetica").fillColor("#444444").text(String(subtitle), { align: "center" });
    doc.fillColor("#000000");
  }
  doc.moveDown(1);
  doc.fontSize(11);
  rows.forEach(([label, value]) => {
    doc.font("Helvetica-Bold").text(`${label}: `, { continued: true });
    doc.font("Helvetica").text(String(value ?? "—"));
    doc.moveDown(0.15);
  });
  doc.moveDown(1);
  doc.fontSize(9).fillColor("#666666").text(`Generated on ${formatDisplayDate(new Date())}`, { align: "center" });
  doc.fillColor("#000000");
}

function writeReceiptPdf({ filename, title, firmName, subtitle, rows }) {
  return new Promise((resolve, reject) => {
    const safeName = String(filename || "receipt.pdf").replace(/[^\w.-]+/g, "_");
    const filePath = path.join(os.tmpdir(), `kb_msg_${Date.now()}_${safeName}`);
    const doc = new PDFDocument({ margin: 48, size: "A4" });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);
    drawReceipt(doc, { title, firmName, subtitle, rows });
    doc.end();
    stream.on("finish", () => resolve(filePath));
    stream.on("error", reject);
    doc.on("error", reject);
  });
}

function buildLoanCreatedPdfSpec(girvi, user, firm) {
  const firmName = firm?.firm_name || "Firm";
  const ref = girvi.girv_unique_code || girvi.girv_loan_no || String(girvi.girv_id);
  return {
    filename: `Loan_${ref}.pdf`,
    title: "Loan Account Statement",
    firmName,
    subtitle: `Loan No: ${ref}`,
    rows: [
      ["Customer Name", buildCustomerName(user)],
      ["Loan / Ticket No", ref],
      ["Packet No", girvi.girv_packet_no || "—"],
      ["Principal Amount", formatInr(girvi.girv_prin_amt)],
      ["Interest Rate", girvi.girv_roi ? `${girvi.girv_roi}%` : "—"],
      ["Loan Start Date", formatDisplayDate(girvi.girv_start_date)],
      ["Status", girvi.girv_status || "ACTIVE"],
    ],
  };
}

function buildFinanceCreatedPdfSpec(finance, user, firm) {
  const firmName = firm?.firm_name || "Firm";
  const ref = finance.fin_unique_code || String(finance.fin_id);
  return {
    filename: `Finance_${ref}.pdf`,
    title: "Finance Account Statement",
    firmName,
    subtitle: `Finance No: ${ref}`,
    rows: [
      ["Customer Name", buildCustomerName(user)],
      ["Finance No", ref],
      ["Finance Amount", formatInr(finance.fin_prin_amt)],
      ["Start Date", formatDisplayDate(finance.fin_start_date)],
      ["Tenure (Months)", finance.fin_tenure_months ?? finance.fin_months ?? "—"],
      ["Status", finance.fin_status || "ACTIVE"],
    ],
  };
}

function buildLoanDepositPdfSpec(girvi, user, firm, deposit) {
  const ref = girvi.girv_unique_code || girvi.girv_loan_no || String(girvi.girv_id);
  return {
    filename: `Loan_Deposit_${ref}.pdf`,
    title: "Loan Payment Receipt",
    firmName: firm?.firm_name || "Firm",
    subtitle: `Loan No: ${ref}`,
    rows: [
      ["Customer Name", buildCustomerName(user)],
      ["Loan No", ref],
      ["Payment Date", formatDisplayDate(deposit.dep_trans_date)],
      ["Principal Received", formatInr(deposit.dep_prin_amt)],
      ["Interest Received", formatInr(deposit.dep_int_amt)],
      ["Discount", formatInr(deposit.dep_disc_amt)],
      ["Extra Amount", formatInr(deposit.dep_extra_amt)],
      ["Total Received", formatInr(deposit.dep_payable_amt)],
    ],
  };
}

function buildLoanReleasePdfSpec(girvi, user, firm, release) {
  const ref = girvi.girv_unique_code || girvi.girv_loan_no || String(girvi.girv_id);
  return {
    filename: `Loan_Release_${ref}.pdf`,
    title: "Loan Release Receipt",
    firmName: firm?.firm_name || "Firm",
    subtitle: `Loan No: ${ref}`,
    rows: [
      ["Customer Name", buildCustomerName(user)],
      ["Loan No", ref],
      ["Release Date", formatDisplayDate(release.rel_trans_date)],
      ["Principal Settled", formatInr(release.rel_prin_amt)],
      ["Interest Settled", formatInr(release.rel_int_amt)],
      ["Total Paid", formatInr(release.rel_payable_amt)],
    ],
  };
}

function buildLoanAddPrincipalPdfSpec(girvi, user, firm, ap) {
  const ref = girvi.girv_unique_code || girvi.girv_loan_no || String(girvi.girv_id);
  return {
    filename: `Loan_Add_Principal_${ref}.pdf`,
    title: "Additional Principal Receipt",
    firmName: firm?.firm_name || "Firm",
    subtitle: `Loan No: ${ref}`,
    rows: [
      ["Customer Name", buildCustomerName(user)],
      ["Loan No", ref],
      ["Transaction Date", formatDisplayDate(ap.ap_trans_date)],
      ["Additional Principal", formatInr(ap.ap_prin_amt)],
      ["Interest Rate", ap.ap_roi ? `${ap.ap_roi}%` : "—"],
    ],
  };
}

function buildFinancePaymentPdfSpec(finance, user, firm, payment) {
  const ref = finance.fin_unique_code || String(finance.fin_id);
  return {
    filename: `Finance_Payment_${ref}.pdf`,
    title: payment.closed ? "Finance Closure Receipt" : "Finance Payment Receipt",
    firmName: firm?.firm_name || "Firm",
    subtitle: `Finance No: ${ref}`,
    rows: [
      ["Customer Name", buildCustomerName(user)],
      ["Finance No", ref],
      ["Payment Date", formatDisplayDate(payment.date)],
      ["Amount", formatInr(payment.amount)],
      ["Transaction Type", payment.type || "Payment"],
    ],
  };
}

module.exports = {
  writeReceiptPdf,
  buildLoanCreatedPdfSpec,
  buildFinanceCreatedPdfSpec,
  buildLoanDepositPdfSpec,
  buildLoanReleasePdfSpec,
  buildLoanAddPrincipalPdfSpec,
  buildFinancePaymentPdfSpec,
};
