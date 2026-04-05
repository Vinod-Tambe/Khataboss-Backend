"use strict";

const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

/**
 * Service to handle email sending.
 */
class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  /**
   * Send an email using a template.
   * @param {string} to - Recipient email.
   * @param {string} subject - Email subject.
   * @param {string} templateName - Name of the template file (e.g., "otp.html").
   * @param {object} replacements - Key-value pairs to replace in the template.
   */
  async sendEmail(to, subject, templateName, replacements = {}) {
    try {
      const templatePath = path.join(__dirname, "..", "template", templateName);
      let htmlContent = fs.readFileSync(templatePath, "utf-8");

      // Replace placeholders in the template
      for (const [key, value] of Object.entries(replacements)) {
        const regex = new RegExp(`{{${key}}}`, "g");
        htmlContent = htmlContent.replace(regex, value);
      }

      const mailOptions = {
        from: `Admin <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html: htmlContent,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log("Email sent: " + info.response);
      return info;
    } catch (error) {
      console.error("Error sending email:", error);
      throw error;
    }
  }
}

module.exports = new EmailService();
