"use strict";

const swaggerJsdoc = require("swagger-jsdoc");
const path = require("path");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Master Project API Documentation",
      version: "1.0.0",
      description: "API documentation for the Master Project, including Owner management.",
    },
    servers: [
      {
        url: "http://localhost:9000/api/v1",
        description: "Development server",
      },
    ],
  },
  // Ensure we pick up documentation from all modules
  apis: [
    path.join(__dirname, "../modules/*/routes/*.js"),
    path.join(__dirname, "../modules/*/document/*.swagger.js"),
  ],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
