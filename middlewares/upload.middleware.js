"use strict";
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { MAX_UPLOAD_FILE_SIZE } = require("../config/upload");
const {
  isCloudflareAccessEnabled,
  IMAGE_ACCESS_DENIED,
} = require("../config/storage");

// Storage configuration (initially upload to temp)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const tempDir = path.join(__dirname, "../uploads/temp");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    cb(null, tempDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter (optional: restrict to images)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed!"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: MAX_UPLOAD_FILE_SIZE },
});

function requireCloudflareImageAccess(req, res, next) {
  if (!isCloudflareAccessEnabled()) {
    return res.status(403).json({ error: IMAGE_ACCESS_DENIED });
  }
  next();
}

/** Chain before multer: blocks upload when CLOUDFLARE_ACCESS is false */
function withCloudflareAccess(...middlewares) {
  return [requireCloudflareImageAccess, ...middlewares];
}

module.exports = upload;
module.exports.requireCloudflareImageAccess = requireCloudflareImageAccess;
module.exports.withCloudflareAccess = withCloudflareAccess;
