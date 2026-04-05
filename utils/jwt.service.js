"use strict";

const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";
const JWT_EXPIRY = process.env.JWT_EXPIRY || "24h";
const JWT_REFRESH_EXPIRY = process.env.JWT_REFRESH_EXPIRY || "7d";

/**
 * Service to handle JWT operations: signing and verifying tokens.
 */
class JwtService {
  /**
   * Generate an Access Token.
   * @param {object} payload - Data to be encoded in the token.
   * @returns {string} Signed JWT.
   */
  generateAccessToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
  }

  /**
   * Generate a Refresh Token.
   * @param {object} payload - Data to be encoded in the token.
   * @returns {string} Signed JWT for refreshing.
   */
  generateRefreshToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_REFRESH_EXPIRY });
  }

  /**
   * Verify a JWT token.
   * @param {string} token - The token to verify.
   * @returns {object|null} Decoded payload or null if invalid.
   */
  verifyToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      console.error("JWT Verification Error:", error.message);
      return null;
    }
  }
}

module.exports = new JwtService();
