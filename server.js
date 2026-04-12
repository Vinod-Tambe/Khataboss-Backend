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
  "http://10.145.173.254:3001",
  "https://khataboss.com"
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

app.use("/api/v1", v1Router);

module.exports = app;
