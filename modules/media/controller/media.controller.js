"use strict";

const imageService = require("../../../utils/image.service");

const detectImageMime = (buffer) => {
  if (!buffer || buffer.length < 12) return "image/png";
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return "image/jpeg";
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) {
    return "image/png";
  }
  if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46) return "image/gif";
  if (
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return "image/webp";
  }
  return "image/png";
};

class MediaController {
  /**
   * GET /media/data-url?path=owner/1/firm/3/logo.png
   * Returns base64 data URL for pdfMake embedding (avoids browser CORS on R2).
   */
  async getImageDataUrl(req, res) {
    try {
      const rawPath = String(req.query.path || "").trim();
      if (!rawPath) {
        return res.status(400).json({ error: "path query parameter is required" });
      }

      if (rawPath.includes("..") || rawPath.startsWith("http")) {
        return res.status(400).json({ error: "Invalid image path" });
      }

      const buffer = await imageService.getFileBuffer(rawPath);
      if (!buffer?.length) {
        return res.status(404).json({ error: "Image not found" });
      }

      const mime = detectImageMime(buffer);
      const dataUrl = `data:${mime};base64,${buffer.toString("base64")}`;

      return res.json({ data: dataUrl });
    } catch (error) {
      console.error("getImageDataUrl error:", error.message);
      return res.status(500).json({ error: error.message || "Failed to load image" });
    }
  }
}

module.exports = new MediaController();
