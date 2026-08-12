"use strict";

const fs = require("fs");
const path = require("path");

class ImageService {
  /**
   * Helper to ensure the module-specific directory exists.
   * @param {string} moduleName - e.g., 'firm', 'owner', 'staff'
   * @param {string|number} entityId - e.g., '1' or UUID
   * @returns {string} - The target directory path
   */
  getTargetDir(moduleName, entityId) {
    const targetDir = path.join(__dirname, "../../uploads", moduleName, entityId.toString());
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    return targetDir;
  }

  /**
   * Moves multiple files from temporary storage to their final destination.
   * Typically used with multer.fields().
   * @param {string} moduleName
   * @param {string|number} entityId
   * @param {object} files - req.files object from Multer
   * @returns {object} - Object with original fieldnames as keys and metadata as values
   */
  async moveFiles(moduleName, entityId, files) {
    if (!files || Object.keys(files).length === 0) return {};

    const targetDir = this.getTargetDir(moduleName, entityId);
    const movedFiles = {};

    for (const fieldname in files) {
      const file = files[fieldname][0];
      const newFileName = `${fieldname}-${Date.now()}${path.extname(file.originalname)}`;
      const newPath = path.join(targetDir, newFileName);

      fs.renameSync(file.path, newPath);

      movedFiles[fieldname] = {
        filename: newFileName,
        originalName: file.originalname,
        path: `uploads/${moduleName}/${entityId}/${newFileName}`,
        mimetype: file.mimetype,
        size: file.size,
      };
    }

    return movedFiles;
  }

  /**
   * Moves multiple files from the same field (multer.fields other_images array).
   * @returns {Array<object>} Metadata objects
   */
  async appendArrayFiles(moduleName, entityId, fileArray, fieldPrefix = "other") {
    if (!fileArray || !fileArray.length) return [];

    const targetDir = this.getTargetDir(moduleName, entityId);
    const moved = [];

    for (const file of fileArray) {
      if (!file) continue;
      const newFileName = `${fieldPrefix}-${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
      const newPath = path.join(targetDir, newFileName);
      fs.renameSync(file.path, newPath);
      moved.push({
        filename: newFileName,
        originalName: file.originalname,
        path: `uploads/${moduleName}/${entityId}/${newFileName}`,
        mimetype: file.mimetype,
        size: file.size,
      });
    }

    return moved;
  }

  /**
   * Moves a single file from temporary storage to its final destination.
   * Typically used with multer.single().
   * @param {string} moduleName
   * @param {string|number} entityId
   * @param {object} file - req.file object from Multer
   * @param {string} fieldName - Optional fieldname (defaults to file.fieldname)
   * @returns {object} - Metadata for the moved file
   */
  async moveSingleFile(moduleName, entityId, file, fieldName) {
    if (!file) return null;

    const targetDir = this.getTargetDir(moduleName, entityId);
    const actualFieldName = fieldName || file.fieldname;
    const newFileName = `${actualFieldName}-${Date.now()}${path.extname(file.originalname)}`;
    const newPath = path.join(targetDir, newFileName);

    fs.renameSync(file.path, newPath);

    return {
      filename: newFileName,
      originalName: file.originalname,
      path: `uploads/${moduleName}/${entityId}/${newFileName}`,
      mimetype: file.mimetype,
      size: file.size,
    };
  }

  /**
   * Deletes a file from the filesystem.
   * @param {string} relativePath - Path relative to the app root (e.g., 'uploads/...')
   */
  async deleteFile(relativePath) {
    if (!relativePath) return;
    const fullPath = path.join(__dirname, "../../", relativePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  }

  /**
   * Deletes a directory and its contents from the filesystem.
   * @param {string} moduleName - e.g., 'firm', 'owner'
   * @param {string|number} entityId - e.g., '6'
   */
  async deleteDirectory(moduleName, entityId) {
    if (!moduleName || !entityId) return;
    const targetDir = path.join(__dirname, "../../uploads", moduleName, entityId.toString());
    if (fs.existsSync(targetDir)) {
      fs.rmSync(targetDir, { recursive: true, force: true });
    }
  }

  /**
   * Returns the full public URL for an image.
   * @param {object} req - Express request object (to construct host)
   * @param {string} relativePath - Path relative to the app root
   * @returns {string} - Full URL
   */
  getImageUrl(req, relativePath) {
    if (!relativePath) return null;
    const protocol = req.protocol;
    const host = req.get("host");
    return `${protocol}://${host}/${relativePath}`;
  }
}

module.exports = new ImageService();
