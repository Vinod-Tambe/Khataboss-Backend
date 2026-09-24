"use strict";

const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "../common/template");
const LINE = "──────────────────";

const wa = (title, greeting, detailLines, options = {}) => {
  const { attachPdf = false, attachNote = false } = options;
  const lines = [`*${title}*`, "", greeting, ""];
  detailLines.forEach((line) => lines.push(line));
  if (attachPdf) {
    lines.push("", "📎 *Full details are in the attached PDF.*");
  } else if (attachNote) {
    lines.push("", "_Please save this message for your records._");
  }
  lines.push("", LINE, "*{{firm_name}}*");
  return lines.join("\n");
};

const em = (...parts) => parts.join("");
const p = (html) => `<p>${html}</p>`;
const hi = (n = "{{1}}") => p(`Hello <strong>${n}</strong>,`);
const hiHi = (n = "{{1}}") => p(`Hi <strong>${n}</strong>,`);
const dear = (n = "{{1}}") => p(`Dear <strong>${n}</strong>,`);

const bodies = {
  owner_otp_login: {
    wa: wa(
      "Login OTP",
      "Hello *{{1}}*,",
      ["Your one-time password (OTP) is:", "", "*{{2}}*", "", "Valid for *1 minute*. Do not share this code with anyone."],
      { attachNote: true }
    ),
    sms: "OTP {{2}} for owner login {{1}}. Valid 1 min. - {{firm_name}}",
    email: em(hi(), p("Your owner login OTP is:"), p('<span style="font-size:28px;font-weight:700;letter-spacing:6px;color:#70016e;font-family:monospace;">{{2}}</span>'), p("Expires in <strong>1 minute</strong>. Do not share.")),
  },
  owner_password_updated: {
    wa: wa("Password Updated", "Hello *{{1}}*,", ["Your KhataBoss login password was updated on *{{4}}*.", "", "If you did not make this change, contact your firm immediately."], { attachNote: true }),
    sms: "Owner password updated for {{1}} at {{firm_name}} on {{4}}.",
    email: em(hi(), p("Password for <strong>{{firm_name}}</strong> updated on <strong>{{4}}</strong>."), p("If you did not request this, contact support.")),
  },
  owner_password_reset: {
    wa: wa("Password Reset", "Hello *{{1}}*,", ["Your temporary password is:", "", "*{{3}}*", "", "Please login and change it immediately."], { attachNote: true }),
    sms: "Temp owner password for {{1}}: {{3}}. - {{firm_name}}",
    email: em(hi(), p("Temporary password: <strong>{{3}}</strong>"), p("Please login and change it immediately.")),
  },
  staff_created: {
    wa: wa("Staff Account Created", "Hello *{{1}}*,", ["Your staff account at *{{firm_name}}* is ready.", "", "Login ID: *{{2}}*", "Password: *{{3}}*", "", "Change your password after first login."], { attachNote: true }),
    sms: "Staff at {{firm_name}}. Login {{2}} Pass {{3}} - {{1}}",
    email: em(hi(), p("Staff account at <strong>{{firm_name}}</strong>."), p("Login: <strong>{{2}}</strong><br/>Password: <strong>{{3}}</strong>")),
  },
  staff_updated: {
    wa: wa("Profile Updated", "Hello *{{1}}*,", ["Your staff profile at *{{firm_name}}* was updated on *{{4}}*."], { attachNote: true }),
    sms: "Staff profile updated for {{1}} at {{firm_name}} on {{4}}.",
    email: em(hi(), p("Profile updated at <strong>{{firm_name}}</strong> on <strong>{{4}}</strong>.")),
  },
  staff_password_updated: {
    wa: wa("Password Updated", "Hello *{{1}}*,", ["Your staff password at *{{firm_name}}* was updated on *{{4}}*."], { attachNote: true }),
    sms: "Staff password updated for {{1}} at {{firm_name}} on {{4}}.",
    email: em(hi(), p("Password updated at <strong>{{firm_name}}</strong> on <strong>{{4}}</strong>.")),
  },
  staff_password_reset: {
    wa: wa("Password Reset", "Hello *{{1}}*,", ["Login ID: *{{2}}*", "Temporary password: *{{3}}*", "", "Change your password after login."], { attachNote: true }),
    sms: "Temp staff pass {{3}} for {{2}} - {{firm_name}}",
    email: em(hi(), p("Login: <strong>{{2}}</strong><br/>Password: <strong>{{3}}</strong>")),
  },
  staff_otp_login: {
    wa: wa("Login OTP", "Hello *{{1}}*,", ["Your OTP is:", "", "*{{2}}*", "", "Do not share this code."], { attachNote: true }),
    sms: "Staff OTP {{2}} for {{1}}. - {{firm_name}}",
    email: em(hi(), p("Staff OTP: <strong>{{2}}</strong>"), p("Do not share this code.")),
  },
  customer_created: {
    wa: wa("Welcome", "Hello *{{1}}*, welcome to *{{firm_name}}*!", ["Your customer ID is: *{{2}}*", "", "We are happy to serve you."], { attachNote: true }),
    sms: "Welcome {{1}} to {{firm_name}}. ID: {{2}}",
    email: em(hi(), p("Welcome to <strong>{{firm_name}}</strong>."), p("Customer ID: <strong>{{2}}</strong>")),
  },
  customer_updated: {
    wa: wa("Profile Updated", "Hello *{{1}}*,", ["Your details at *{{firm_name}}* were updated on *{{4}}*.", "Customer ID: *{{2}}*"], { attachNote: true }),
    sms: "Customer {{1}} ({{2}}) updated at {{firm_name}}.",
    email: em(hi(), p("Details updated at <strong>{{firm_name}}</strong> on <strong>{{4}}</strong>."), p("Customer ID: <strong>{{2}}</strong>")),
  },
  customer_welcome: {
    wa: wa("Thank You", "Hello *{{1}}*,", ["Thank you for choosing *{{firm_name}}*.", "Reference: *{{2}}*"], { attachNote: true }),
    sms: "Thanks {{1}} - {{firm_name}}. Ref {{2}}",
    email: em(hi(), p("Thank you for choosing <strong>{{firm_name}}</strong>."), p("Reference: <strong>{{2}}</strong>")),
  },
  loan_created: {
    wa: wa(
      "New Loan Created",
      "Hello *{{1}}*,",
      [
        "Your loan account has been opened at *{{firm_name}}*.",
        "",
        "Loan / Ticket No: *{{2}}*",
        "Principal Amount: *{{3}}*",
        "Start Date: *{{4}}*",
      ],
      { attachPdf: true }
    ),
    sms: "Loan {{2}} opened for {{1}}. Amount {{3}} on {{4}} - {{firm_name}}",
    email: em(hiHi(), p("Loan created at <strong>{{firm_name}}</strong>."), p("Loan No: <strong>{{2}}</strong><br/>Amount: <strong>{{3}}</strong><br/>Date: {{4}}"), p("Detailed statement attached.")),
  },
  loan_updated: {
    wa: wa("Loan Updated", "Hello *{{1}}*,", ["Loan *{{2}}* was updated on *{{4}}*.", "Current principal: *{{3}}*"], { attachNote: true }),
    sms: "Loan {{2}} updated. Principal {{3}} - {{firm_name}}",
    email: em(hiHi(), p("Loan <strong>{{2}}</strong> updated on <strong>{{4}}</strong>."), p("Amount: <strong>{{3}}</strong>")),
  },
  loan_deposit: {
    wa: wa(
      "Payment Received on Loan",
      "Hello *{{1}}*,",
      [
        "We received your payment towards loan *{{2}}*.",
        "",
        "Total Received: *{{3}}*",
        "Payment Date: *{{4}}*",
      ],
      { attachPdf: true }
    ),
    sms: "Payment {{3}} received for loan {{2}} on {{4}} - {{firm_name}}",
    email: em(hi(), p("Payment received for loan <strong>{{2}}</strong>."), p("Amount: <strong>{{3}}</strong><br/>Date: {{4}}"), p("Receipt attached.")),
  },
  loan_add_principal: {
    wa: wa(
      "Additional Principal Added",
      "Hello *{{1}}*,",
      [
        "Additional principal was added to loan *{{2}}*.",
        "",
        "Amount Added: *{{3}}*",
        "Date: *{{4}}*",
      ],
      { attachPdf: true }
    ),
    sms: "Add principal {{3}} on loan {{2}} - {{firm_name}}",
    email: em(hi(), p("Principal added to loan <strong>{{2}}</strong>."), p("Added: <strong>{{3}}</strong><br/>Date: {{4}}")),
  },
  loan_release: {
    wa: wa(
      "Loan Released / Closed",
      "Hello *{{1}}*,",
      [
        "Your loan *{{2}}* has been released successfully.",
        "",
        "Total Settlement: *{{3}}*",
        "Release Date: *{{4}}*",
      ],
      { attachPdf: true }
    ),
    sms: "Loan {{2}} released. Settlement {{3}} on {{4}} - {{firm_name}}",
    email: em(hi(), p("Loan <strong>{{2}}</strong> released."), p("Settlement: <strong>{{3}}</strong><br/>Date: {{4}}"), p("Receipt attached.")),
  },
  loan_transfer: {
    wa: wa("Loan Transferred", "Hello *{{1}}*,", ["Loan *{{2}}* was transferred on *{{4}}*.", "Amount: *{{3}}*"], { attachNote: true }),
    sms: "Loan {{2}} transferred. Amount {{3}} - {{firm_name}}",
    email: em(hi(), p("Loan <strong>{{2}}</strong> transfer completed on <strong>{{4}}</strong>."), p("Amount: <strong>{{3}}</strong>")),
  },
  loan_due_reminder: {
    wa: wa("Payment Reminder", "Dear *{{1}}*,", ["This is a friendly reminder for loan *{{2}}*.", "Amount Due: *{{3}}*", "Due Date: *{{4}}*", "", "Please visit the firm or pay on time to avoid penalty."], { attachNote: true }),
    sms: "Loan {{2}} due {{3}} by {{4}} - {{firm_name}}",
    email: em(dear(), p("Loan <strong>{{2}}</strong> due <strong>{{3}}</strong>."), p("Due date: <strong>{{4}}</strong>"), p("Please pay on time.")),
  },
  loan_notice: {
    wa: wa("Important Loan Notice", "Dear *{{1}}*,", ["Notice regarding loan *{{2}}*.", "Outstanding Balance: *{{3}}*", "Date: *{{4}}*"], { attachPdf: true }),
    sms: "Notice loan {{2}} outstanding {{3}} - {{firm_name}}",
    email: em(dear(), p("Notice for loan <strong>{{2}}</strong>."), p("Outstanding: <strong>{{3}}</strong><br/>Date: {{4}}")),
  },
  loan_auction: {
    wa: wa("Auction Notice", "Hello *{{1}}*,", ["Loan *{{2}}* is marked for auction.", "Amount: *{{3}}*", "Date: *{{4}}*", "", "Please contact the firm urgently."], { attachPdf: true }),
    sms: "Loan {{2}} auction notice. Amount {{3}} - {{firm_name}}",
    email: em(hi(), p("Loan <strong>{{2}}</strong> moved to auction."), p("Amount: <strong>{{3}}</strong><br/>Date: {{4}}")),
  },
  finance_created: {
    wa: wa(
      "New Finance Account",
      "Hello *{{1}}*,",
      [
        "Your finance account is opened at *{{firm_name}}*.",
        "",
        "Finance No: *{{2}}*",
        "Finance Amount: *{{3}}*",
        "Start Date: *{{4}}*",
      ],
      { attachPdf: true }
    ),
    sms: "Finance {{2}} for {{1}}. Amount {{3}} - {{firm_name}}",
    email: em(hi(), p("Finance created at <strong>{{firm_name}}</strong>."), p("Finance No: <strong>{{2}}</strong><br/>Amount: <strong>{{3}}</strong><br/>Start: {{4}}"), p("Statement attached.")),
  },
  finance_emi_reminder: {
    wa: wa("EMI Reminder", "Dear *{{1}}*,", ["EMI reminder for finance *{{2}}*.", "EMI Amount: *{{3}}*", "Due Date: *{{4}}*", "", "Please pay on time."], { attachNote: true }),
    sms: "EMI {{3}} for finance {{2}} due {{4}} - {{firm_name}}",
    email: em(dear(), p("EMI reminder from <strong>{{firm_name}}</strong>."), p("Finance: <strong>{{2}}</strong><br/>EMI: <strong>{{3}}</strong><br/>Due: {{4}}")),
  },
  finance_payment_received: {
    wa: wa(
      "Finance Payment Received",
      "Hello *{{1}}*,",
      ["Payment received for finance *{{2}}*.", "Amount: *{{3}}*", "Date: *{{4}}*"],
      { attachPdf: true }
    ),
    sms: "Payment {{3}} for finance {{2}} on {{4}} - {{firm_name}}",
    email: em(hi(), p("Payment for finance <strong>{{2}}</strong>."), p("Amount: <strong>{{3}}</strong><br/>Date: {{4}}"), p("Receipt attached.")),
  },
  finance_collection_receipt: {
    wa: wa(
      "Collection Receipt",
      "Hello *{{1}}*,",
      ["Collection recorded for finance *{{2}}*.", "Collected: *{{3}}*", "Date: *{{4}}*"],
      { attachPdf: true }
    ),
    sms: "Collection {{3}} finance {{2}} - {{firm_name}}",
    email: em(hi(), p("Collection for finance <strong>{{2}}</strong>."), p("Collected: <strong>{{3}}</strong><br/>Date: {{4}}")),
  },
  finance_closed: {
    wa: wa(
      "Finance Account Closed",
      "Hello *{{1}}*,",
      ["Finance *{{2}}* is closed successfully.", "Final Settlement: *{{3}}*", "Closure Date: *{{4}}*"],
      { attachPdf: true }
    ),
    sms: "Finance {{2}} closed. Final {{3}} - {{firm_name}}",
    email: em(hi(), p("Finance <strong>{{2}}</strong> closed."), p("Final: <strong>{{3}}</strong><br/>Date: {{4}}")),
  },
  report_daybook: {
    wa: wa("Daybook Report", "Hello *{{1}}*,", ["Your *Daybook* report for *{{firm_name}}* is ready.", "Period: *{{3}}*", "Generated: *{{4}}*"], { attachPdf: true }),
    sms: "Daybook report {{3}} - {{firm_name}}",
    email: em(hi(), p("Daybook report attached for <strong>{{firm_name}}</strong>."), p("Period: {{3}}")),
  },
  report_balance_sheet: {
    wa: wa("Balance Sheet", "Hello *{{1}}*,", ["Your *Balance Sheet* for *{{firm_name}}* is ready.", "Period: *{{3}}*", "Generated: *{{4}}*"], { attachPdf: true }),
    sms: "Balance sheet {{3}} - {{firm_name}}",
    email: em(hi(), p("Balance sheet attached for <strong>{{firm_name}}</strong>."), p("Period: {{3}}")),
  },
  report_trial_balance: {
    wa: wa("Trial Balance", "Hello *{{1}}*,", ["Your *Trial Balance* for *{{firm_name}}* is ready.", "Period: *{{3}}*", "Generated: *{{4}}*"], { attachPdf: true }),
    sms: "Trial balance {{3}} - {{firm_name}}",
    email: em(hi(), p("Trial balance attached for <strong>{{firm_name}}</strong>."), p("Period: {{3}}")),
  },
  report_profit_loss: {
    wa: wa("Profit & Loss Report", "Hello *{{1}}*,", ["Your *Profit & Loss* report for *{{firm_name}}* is ready.", "Period: *{{3}}*", "Generated: *{{4}}*"], { attachPdf: true }),
    sms: "P&L report {{3}} - {{firm_name}}",
    email: em(hi(), p("Profit & Loss report attached for <strong>{{firm_name}}</strong>."), p("Period: {{3}}")),
  },
};

for (const folder of ["whatsapp", "email", "text"]) {
  const file = path.join(root, folder, "templates.json");
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  data.version = 2;
  data.description = `${data.channel} templates v2 — customer-friendly wording`;
  for (const t of data.templates) {
    const b = bodies[t.key];
    if (!b) continue;
    if (folder === "whatsapp") t.body = b.wa;
    else if (folder === "email") t.body = b.email;
    else t.body = b.sms;
  }
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
  console.log(`patched ${folder}: ${data.templates.length} templates`);
}
