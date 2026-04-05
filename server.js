"use strict";

const express = require("express");

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.use("/api/v1", v1Router);

module.exports = app;
