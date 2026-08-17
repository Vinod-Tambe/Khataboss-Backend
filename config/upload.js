"use strict";

/** Max upload size — 2MB (images/documents). Enforced in multer + image.service. */
const MAX_UPLOAD_FILE_SIZE = 2 * 1024 * 1024;

const UPLOAD_SIZE_ERROR = "File size must be less than 2MB";

module.exports = {
  MAX_UPLOAD_FILE_SIZE,
  UPLOAD_SIZE_ERROR,
};
