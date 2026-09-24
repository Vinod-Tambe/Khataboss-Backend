# KhataBoss WhatsApp message catalog

Use this document for AI assistants, support staff, and template customization.

## Placeholders

| Placeholder | Meaning |
|-------------|---------|
| `{{1}}` | Person name (customer, staff, owner, or report recipient) |
| `{{2}}` | Reference (loan no, finance no, customer ID, login ID, etc.) |
| `{{3}}` | Amount or main detail (formatted as **₹** on loan/finance auto messages) |
| `{{4}}` | Date or extra detail (formatted e.g. **24 Sep 2026** on auto messages) |
| `{{firm_name}}` | Firm name (filled automatically; also shown in message footer) |

WhatsApp messages also get an automatic footer from the system: firm name, website, help phone, “Powered by KhataBoss”.

## PDF attachments

| Template key | PDF on auto-send | PDF contents (summary) |
|--------------|------------------|-------------------------|
| `loan_created` | Yes | Loan statement: customer, loan no, principal, ROI, dates |
| `loan_deposit` | Yes | Payment receipt: principal/interest/total received |
| `loan_add_principal` | Yes | Additional principal receipt |
| `loan_release` | Yes | Release/settlement receipt |
| `loan_notice` | Template only* | — |
| `loan_auction` | Template only* | — |
| `finance_created` | Yes | Finance statement |
| `finance_payment_received` | Yes | Payment receipt |
| `finance_closed` | Yes | Closure receipt |
| `finance_collection_receipt` | When sent from app with PDF | Collection receipt |
| `report_*` | When user clicks WhatsApp on report screen | Full report PDF |

\*Manual dispatch may attach PDF from the app; backend auto-notices use template flag.

Auto PDFs are generated on the **server** when the transaction is saved (create loan, deposit, etc.).

Manual **WhatsApp** buttons in the app (receipt modals, finance history) send PDF via `/messaging/dispatch` from the browser.

## Transaction templates (customer)

### `loan_created`
- **When:** New loan saved successfully.
- **To:** Customer WhatsApp (or mobile if WhatsApp empty).
- **Message:** New loan opened — loan no, principal, start date + PDF.

### `loan_deposit`
- **When:** Deposit/payment on loan saved.
- **Message:** Payment received — total, date + PDF receipt.

### `loan_add_principal`
- **When:** Additional principal saved.
- **Message:** Amount added, date + PDF.

### `loan_release`
- **When:** Loan release completed.
- **Message:** Loan released, settlement amount, date + PDF.

### `loan_updated` / `loan_transfer`
- **When:** If wired in backend (update/transfer flows).
- **Message:** Text only (no auto PDF today).

### `loan_due_reminder` / `loan_notice` / `loan_auction`
- **When:** Reminder/notice jobs or manual sends.
- **Message:** Reminder/notice wording; attachment depends on send path.

### `finance_created`
- **When:** New finance account created.
- **Message:** Finance no, amount, start date + PDF statement.

### `finance_payment_received` / `finance_closed`
- **When:** Finance payment or closure posted.
- **Message:** Amount, date + PDF receipt.

### `finance_emi_reminder`
- **When:** EMI reminder (if scheduled).
- **Message:** EMI amount and due date (text).

### `finance_collection_receipt`
- **When:** User sends collection receipt from Finance UI.
- **Message:** Collected amount + PDF from app.

## Reports (owner/staff mobile)

Sent to **logged-in user’s mobile**, not customer.

| Key | Report |
|-----|--------|
| `report_daybook` | Daybook |
| `report_balance_sheet` | Balance Sheet |
| `report_trial_balance` | Trial Balance |
| `report_profit_loss` | Profit & Loss |

Requires a **selected firm** (WhatsApp is connected per firm).

## Staff / owner / customer admin

| Key | Purpose |
|-----|---------|
| `owner_otp_login` / `staff_otp_login` | Login OTP |
| `owner_password_*` / `staff_password_*` | Password change/reset |
| `staff_created` | New staff login credentials |
| `customer_created` / `customer_updated` / `customer_welcome` | Customer onboarding |

## Refresh templates in database

After editing `common/template/whatsapp/templates.json`, run:

```bash
node scripts/patch-template-bodies.js   # sync wording across whatsapp/email/sms JSON
# Then re-seed or update firm templates (message-template-seeder) so mt_is_system rows refresh
```

Firms with customized (non-system) templates keep their edits; system templates update on seed.

## Source files

- Wording: `Khataboss-Backend/common/template/whatsapp/templates.json`
- Patch script: `Khataboss-Backend/scripts/patch-template-bodies.js`
- Auto PDF: `Khataboss-Backend/common/service/messaging-pdf.service.js`
- Auto send: `Khataboss-Backend/common/service/messaging-notify.service.js`
- Manual send (frontend): `khataboss/src/utils/dispatchWhatsAppReceipt.js`
