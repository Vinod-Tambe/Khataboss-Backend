"use strict";

/**
 * Utility functions for generating and managing OTPs.
 */
class OtpService {
  /**
   * Generate a 6-digit random number.
   * @returns {string} The generated OTP.
   */
  generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Calculate the OTP expiry time based on the value in .env (default: 1 minute).
   * @returns {Date} The expiry timestamp.
   */
  getExpiryDate() {
    const expiryMinutes = parseInt(process.env.OTP_EXPIRY || "1", 10);
    return new Date(Date.now() + expiryMinutes * 60 * 1000);
  }

  /**
   * Check if the OTP is expired.
   * @param {Date} expiryDate - The stored expiry timestamp.
   * @returns {boolean} True if expired, false otherwise.
   */
  isExpired(expiryDate) {
    return new Date() > new Date(expiryDate);
  }
}

module.exports = new OtpService();
