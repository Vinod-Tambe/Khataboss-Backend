"use strict";

const multer = require("multer");
const { UPLOAD_SIZE_ERROR } = require("../config/upload");

function uploadErrorHandler(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ error: UPLOAD_SIZE_ERROR });
    }
    if (err.code === "LIMIT_FILE_COUNT" || err.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({ error: err.message });
    }
  }
  if (err && err.message === "Only images are allowed!") {
    return res.status(400).json({ error: err.message });
  }
  if (
    err &&
    err.message === "Only images, PDF, Word, and text attachments are allowed."
  ) {
    return res.status(400).json({ error: err.message });
  }
  next(err);
}

module.exports = uploadErrorHandler;
