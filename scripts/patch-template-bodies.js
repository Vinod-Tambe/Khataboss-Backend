"use strict";

const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "../common/template");
const wa = (title, ...lines) =>
  [`*KhataBoss* — ${title}`, "", ...lines, "", "— *{{firm_name}}*"].join("\n");
const em = (...parts) => parts.join("");
const p = (html) => `<p>${html}</p>`;
const hi = (n = "{{1}}") => p(`Hello <strong>${n}</strong>,`);
const hiHi = (n = "{{1}}") => p(`Hi <strong>${n}</strong>,`);
const dear = (n = "{{1}}") => p(`Dear <strong>${n}</strong>,`);

const bodies = {
  owner_otp_login: {
    wa: wa("Owner Login OTP", "Hello *{{1}}*,", "", "Your login OTP is:", "*{{2}}*", "", "Valid for *1 minute*. Do not share."),
    sms: "OTP {{2}} for owner login {{1}}. Valid 1 min. - {{firm_name}}",
    email: em(hi(), p("Your owner login OTP is:"), p('<span style="font-size:28px;font-weight:700;letter-spacing:6px;color:#70016e;font-family:monospace;">{{2}}</span>'), p("Expires in <strong>1 minute</strong>. Do not share.")),
  },
  owner_password_updated: {
    wa: wa("Password Updated", "Hello *{{1}}*,", "", "Password for *{{firm_name}}* updated on *{{4}}*.", "", "If not you, contact support."),
    sms: "Owner password updated for {{1}} at {{firm_name}} on {{4}}.",
    email: em(hi(), p("Password for <strong>{{firm_name}}</strong> updated on <strong>{{4}}</strong>."), p("If you did not request this, contact support.")),
  },
  owner_password_reset: {
    wa: wa("Password Reset", "Hello *{{1}}*,", "", "Temporary password:", "*{{3}}*", "", "Change after login."),
    sms: "Temp owner password for {{1}}: {{3}}. - {{firm_name}}",
    email: em(hi(), p("Temporary password: <strong>{{3}}</strong>"), p("Please login and change it immediately.")),
  },
  staff_created: {
    wa: wa("Staff Account", "Hello *{{1}}*,", "", "Account at *{{firm_name}}*.", "*Login:* {{2}}", "*Password:* {{3}}"),
    sms: "Staff at {{firm_name}}. Login {{2}} Pass {{3}} - {{1}}",
    email: em(hi(), p("Staff account at <strong>{{firm_name}}</strong>."), p("Login: <strong>{{2}}</strong><br/>Password: <strong>{{3}}</strong>")),
  },
  staff_updated: {
    wa: wa("Staff Updated", "Hello *{{1}}*,", "", "Profile updated at *{{firm_name}}* on *{{4}}*."),
    sms: "Staff profile updated for {{1}} at {{firm_name}} on {{4}}.",
    email: em(hi(), p("Profile updated at <strong>{{firm_name}}</strong> on <strong>{{4}}</strong>.")),
  },
  staff_password_updated: {
    wa: wa("Staff Password", "Hello *{{1}}*,", "", "Password updated at *{{firm_name}}* on *{{4}}*."),
    sms: "Staff password updated for {{1}} at {{firm_name}} on {{4}}.",
    email: em(hi(), p("Password updated at <strong>{{firm_name}}</strong> on <strong>{{4}}</strong>.")),
  },
  staff_password_reset: {
    wa: wa("Staff Reset", "Hello *{{1}}*,", "", "*Login:* {{2}}", "*Password:* {{3}}"),
    sms: "Temp staff pass {{3}} for {{2}} - {{firm_name}}",
    email: em(hi(), p("Login: <strong>{{2}}</strong><br/>Password: <strong>{{3}}</strong>")),
  },
  staff_otp_login: {
    wa: wa("Staff OTP", "Hello *{{1}}*,", "", "OTP:", "*{{2}}*", "", "Do not share."),
    sms: "Staff OTP {{2}} for {{1}}. - {{firm_name}}",
    email: em(hi(), p("Staff OTP: <strong>{{2}}</strong>"), p("Do not share this code.")),
  },
  customer_created: {
    wa: wa("Welcome", "Hello *{{1}}*, welcome to *{{firm_name}}*!", "*Customer ID:* {{2}}"),
    sms: "Welcome {{1}} to {{firm_name}}. ID: {{2}}",
    email: em(hi(), p("Welcome to <strong>{{firm_name}}</strong>."), p("Customer ID: <strong>{{2}}</strong>")),
  },
  customer_updated: {
    wa: wa("Profile Updated", "Hello *{{1}}*,", "", "Updated at *{{firm_name}}* on *{{4}}*.", "*ID:* {{2}}"),
    sms: "Customer {{1}} ({{2}}) updated at {{firm_name}}.",
    email: em(hi(), p("Details updated at <strong>{{firm_name}}</strong> on <strong>{{4}}</strong>."), p("Customer ID: <strong>{{2}}</strong>")),
  },
  customer_welcome: {
    wa: wa("Thank You", "Hello *{{1}}*,", "", "Thanks for choosing *{{firm_name}}*.", "*Ref:* {{2}}"),
    sms: "Thanks {{1}} - {{firm_name}}. Ref {{2}}",
    email: em(hi(), p("Thank you for choosing <strong>{{firm_name}}</strong>."), p("Reference: <strong>{{2}}</strong>")),
  },
  loan_created: {
    wa: wa("Loan Created", "Hi *{{1}}*,", "", "*Loan:* {{2}}", "*Amount:* {{3}}", "*Date:* {{4}}"),
    sms: "Loan {{2}} for {{1}}. Amt {{3}} - {{firm_name}}",
    email: em(hiHi(), p("Loan created at <strong>{{firm_name}}</strong>."), p("Loan No: <strong>{{2}}</strong><br/>Amount: <strong>{{3}}</strong><br/>Date: {{4}}"), p("Receipt attached.")),
  },
  loan_updated: {
    wa: wa("Loan Updated", "Hi *{{1}}*,", "", "Loan *{{2}}* updated.", "*Amount:* {{3}}", "*Date:* {{4}}"),
    sms: "Loan {{2}} updated. Amt {{3}} - {{firm_name}}",
    email: em(hiHi(), p("Loan <strong>{{2}}</strong> updated on <strong>{{4}}</strong>."), p("Amount: <strong>{{3}}</strong>")),
  },
  loan_deposit: {
    wa: wa("Deposit", "Hello *{{1}}*,", "", "Deposit for loan *{{2}}*.", "*Amount:* {{3}}", "*Date:* {{4}}"),
    sms: "Deposit {{3}} loan {{2}} - {{firm_name}}",
    email: em(hi(), p("Deposit for loan <strong>{{2}}</strong>."), p("Amount: <strong>{{3}}</strong><br/>Date: {{4}}"), p("Receipt attached.")),
  },
  loan_add_principal: {
    wa: wa("Add Principal", "Hello *{{1}}*,", "", "Loan *{{2}}*.", "*Added:* {{3}}", "*Date:* {{4}}"),
    sms: "Add principal {{3}} loan {{2}} - {{firm_name}}",
    email: em(hi(), p("Principal added to loan <strong>{{2}}</strong>."), p("Added: <strong>{{3}}</strong><br/>Date: {{4}}")),
  },
  loan_release: {
    wa: wa("Loan Released", "Hello *{{1}}*,", "", "Loan *{{2}}* released.", "*Final:* {{3}}", "*Date:* {{4}}"),
    sms: "Loan {{2}} released. Final {{3}} - {{firm_name}}",
    email: em(hi(), p("Loan <strong>{{2}}</strong> released."), p("Final: <strong>{{3}}</strong><br/>Date: {{4}}"), p("Receipt attached.")),
  },
  loan_transfer: {
    wa: wa("Loan Transfer", "Hello *{{1}}*,", "", "Loan *{{2}}* transferred.", "*Amount:* {{3}}", "*Date:* {{4}}"),
    sms: "Loan {{2}} transferred. Amt {{3}} - {{firm_name}}",
    email: em(hi(), p("Loan <strong>{{2}}</strong> transfer completed on <strong>{{4}}</strong>."), p("Amount: <strong>{{3}}</strong>")),
  },
  loan_due_reminder: {
    wa: wa("Due Reminder", "Dear *{{1}}*,", "", "*Loan:* {{2}}", "*Due:* {{3}}", "*Date:* {{4}}"),
    sms: "Loan {{2}} due {{3}} by {{4}} - {{firm_name}}",
    email: em(dear(), p("Loan <strong>{{2}}</strong> due <strong>{{3}}</strong>."), p("Due date: <strong>{{4}}</strong>"), p("Please pay on time.")),
  },
  loan_notice: {
    wa: wa("Loan Notice", "Dear *{{1}}*,", "", "Loan *{{2}}* notice.", "*Outstanding:* {{3}}", "*Date:* {{4}}"),
    sms: "Notice loan {{2}} outstanding {{3}} - {{firm_name}}",
    email: em(dear(), p("Notice for loan <strong>{{2}}</strong>."), p("Outstanding: <strong>{{3}}</strong><br/>Date: {{4}}")),
  },
  loan_auction: {
    wa: wa("Auction", "Hello *{{1}}*,", "", "Loan *{{2}}* to auction.", "*Amount:* {{3}}", "*Date:* {{4}}"),
    sms: "Loan {{2}} auction. Amt {{3}} - {{firm_name}}",
    email: em(hi(), p("Loan <strong>{{2}}</strong> moved to auction."), p("Amount: <strong>{{3}}</strong><br/>Date: {{4}}")),
  },
  finance_created: {
    wa: wa("Finance Created", "Hello *{{1}}*,", "", "*Finance:* {{2}}", "*Amount:* {{3}}", "*Start:* {{4}}"),
    sms: "Finance {{2}} for {{1}}. Amt {{3}} - {{firm_name}}",
    email: em(hi(), p("Finance created at <strong>{{firm_name}}</strong>."), p("Finance No: <strong>{{2}}</strong><br/>Amount: <strong>{{3}}</strong><br/>Start: {{4}}")),
  },
  finance_emi_reminder: {
    wa: wa("EMI Reminder", "Dear *{{1}}*,", "", "*Finance:* {{2}}", "*EMI:* {{3}}", "*Due:* {{4}}"),
    sms: "EMI {{3}} finance {{2}} due {{4}} - {{firm_name}}",
    email: em(dear(), p("EMI reminder from <strong>{{firm_name}}</strong>."), p("Finance: <strong>{{2}}</strong><br/>EMI: <strong>{{3}}</strong><br/>Due: {{4}}")),
  },
  finance_payment_received: {
    wa: wa("Payment Received", "Hello *{{1}}*,", "", "Finance *{{2}}*.", "*Amount:* {{3}}", "*Date:* {{4}}"),
    sms: "Payment {{3}} finance {{2}} - {{firm_name}}",
    email: em(hi(), p("Payment for finance <strong>{{2}}</strong>."), p("Amount: <strong>{{3}}</strong><br/>Date: {{4}}"), p("Receipt attached.")),
  },
  finance_collection_receipt: {
    wa: wa("Collection", "Hello *{{1}}*,", "", "Finance *{{2}}*.", "*Collected:* {{3}}", "*Date:* {{4}}"),
    sms: "Collection {{3}} finance {{2}} - {{firm_name}}",
    email: em(hi(), p("Collection for finance <strong>{{2}}</strong>."), p("Collected: <strong>{{3}}</strong><br/>Date: {{4}}")),
  },
  finance_closed: {
    wa: wa("Finance Closed", "Hello *{{1}}*,", "", "Finance *{{2}}* closed.", "*Final:* {{3}}", "*Date:* {{4}}"),
    sms: "Finance {{2}} closed. Final {{3}} - {{firm_name}}",
    email: em(hi(), p("Finance <strong>{{2}}</strong> closed."), p("Final: <strong>{{3}}</strong><br/>Date: {{4}}")),
  },
};

for (const folder of ["whatsapp", "email", "text"]) {
  const file = path.join(root, folder, "templates.json");
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  data.version = 2;
  data.description = `${data.channel} templates v2 — formatted per channel`;
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
