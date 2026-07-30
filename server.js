"use strict";

const express = require("express");
const path = require("path");
const cors = require("cors");

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────
const allowedOrigins = [
  "http://localhost:3001",
  "http://192.168.2.173:3001",
  "https://khataboss.com",
  "https://carlie-atavic-tonita.ngrok-free.dev",
  "https://khataboss.in",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// ─── Swagger Documentation ───────────────────────────────────────────────────
app.use(
  "/api/v1/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
      filter: true,
      defaultModelsExpandDepth: -1,
    },
  })
);

// ─── Routes ──────────────────────────────────────────────────────────────────
// API Version 1
const v1Router = express.Router();
v1Router.use("/auth", require("./modules/auth/routes/auth.routes"));
v1Router.use("/owner", require("./modules/owner/routes/owner.routes"));
v1Router.use("/firm", require("./modules/firm/routes/firm.routes"));
v1Router.use("/account", require("./modules/account/routes/account.routes"));
v1Router.use("/user", require("./modules/user/routes/user.routes"));
v1Router.use("/finance", require("./modules/finance/routes/finance.routes"));
v1Router.use("/journal", require("./modules/journal/routes/journal.routes"));
v1Router.use("/dashboard", require("./modules/dashboard/routes/dashboard.routes"));
v1Router.use("/daybook", require("./modules/daybook/routes/daybook.routes"));
v1Router.use("/trial-balance", require("./modules/trial_balance/routes/trial_balance.routes"));
v1Router.use("/balance-sheet", require("./modules/balance_sheet/routes/balance_sheet.routes"));
v1Router.use("/profit-loss", require("./modules/profit_loss/routes/profit_loss.routes"));
v1Router.use("/girvi", require("./modules/girvi/routes/girvi.routes"));
v1Router.use("/stock", require("./modules/stock/routes/stock.routes"));
v1Router.use("/add-prin", require("./modules/principal/routes/principal.routes"));
v1Router.use("/deposit", require("./modules/deposit/routes/deposit.routes"));
v1Router.use("/release", require("./modules/release/routes/release.routes"));
v1Router.use("/rate", require("./modules/rate/routes/rate.routes"));
v1Router.use("/purity", require("./modules/purity/routes/purity.routes"));
v1Router.use("/money-lender", require("./modules/money_lender/routes/money_lender.routes"));
app.use("/api/v1", v1Router);

module.exports = app;
