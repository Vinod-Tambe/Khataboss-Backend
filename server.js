"use strict";

const express = require("express");
const path = require("path");
const cors = require("cors");

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

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

app.use("/api/v1", v1Router);

module.exports = app;
