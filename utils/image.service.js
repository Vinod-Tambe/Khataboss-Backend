"use strict";

const fs = require("fs");
const path = require("path");
const {
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const {
  getR2Client,
  isR2Configured,
  R2_BUCKET,
  R2_PUBLIC_URL,
} = require("../config/r2");
const { MAX_UPLOAD_FILE_SIZE } = require("../config/upload");
const {
  assertCloudflareImageAccess,
  isCloudflareAccessEnabled,
  IMAGE_ACCESS_DENIED,
  R2_NOT_CONFIGURED,
  createImageAccessError,
} = require("../config/storage");

class ImageService {
  _assertStorageReady() {
    assertCloudflareImageAccess();
    if (!isR2Configured()) {
      throw createImageAccessError(R2_NOT_CONFIGURED, 503);
    }
  }

  /**
   * Owner-scoped storage key: owner/{ownId}/{module}/{entityId}/{fileName}
   */
  buildStorageKey(ownId, moduleName, entityId, fileName) {
    return `owner/${ownId}/${moduleName}/${entityId}/${fileName}`;
  }

  normalizeStoredPath(relativePath) {
    if (!relativePath) return null;
    return String(relativePath).replace(/\\/g, "/").replace(/^\/+/, "");
  }

  resolveStorageKey(storedPath) {
    const norm = this.normalizeStoredPath(storedPath);
    if (!norm) return null;
    if (norm.startsWith("owner/")) return norm;
    if (norm.startsWith("uploads/owner/")) return norm.slice("uploads/".length);
    return null;
  }

  getLocalFullPath(storedPath) {
    const norm = this.normalizeStoredPath(storedPath);
    if (!norm) return null;
    if (norm.startsWith("owner/")) {
      return path.join(__dirname, "../../uploads", norm);
    }
    return path.join(__dirname, "../../", norm);
  }

  async _readMulterFile(file) {
    if (!file || typeof file !== "object" || typeof file.path !== "string" || !file.path) {
      throw new Error("Invalid upload file: missing temp path");
    }
    const buffer = fs.readFileSync(file.path);
    if (buffer.length > MAX_UPLOAD_FILE_SIZE) {
      throw new Error("File size must be less than 2MB");
    }
    return buffer;
  }

  _cleanupTempFile(file) {
    if (!file?.path) return;
    try {
      if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
    } catch {
      /* ignore */
    }
  }

  async _uploadBuffer(key, buffer, mimetype) {
    this._assertStorageReady();
    await getR2Client().send(
      new PutObjectCommand({
        Bucket: R2_BUCKET,
        Key: key,
        Body: buffer,
        ContentType: mimetype || "application/octet-stream",
      })
    );
  }

  _buildFileMeta(key, file, fieldName) {
    const fileName = path.basename(key);
    return {
      filename: fileName,
      originalName: file.originalname,
      path: key,
      mimetype: file.mimetype,
      size: file.size,
      field: fieldName || file.fieldname,
    };
  }

  async _processMulterFile(ownId, moduleName, entityId, file, fieldName) {
    if (!file || typeof file !== "object" || typeof file.path !== "string") return null;

    this._assertStorageReady();

    const actualFieldName = fieldName || file.fieldname;
    const newFileName = `${actualFieldName}-${Date.now()}${path.extname(file.originalname || "")}`;
    const key = this.buildStorageKey(ownId, moduleName, entityId, newFileName);

    const buffer = await this._readMulterFile(file);
    await this._uploadBuffer(key, buffer, file.mimetype);
    this._cleanupTempFile(file);

    return this._buildFileMeta(key, file, actualFieldName);
  }

  async moveFiles(ownId, moduleName, entityId, files) {
    if (!files || Object.keys(files).length === 0) return {};

    const movedFiles = {};
    for (const fieldname in files) {
      const file = files[fieldname][0];
      movedFiles[fieldname] = await this._processMulterFile(
        ownId,
        moduleName,
        entityId,
        file,
        fieldname
      );
    }
    return movedFiles;
  }

  async appendArrayFiles(ownId, moduleName, entityId, fileArray, fieldPrefix = "other") {
    if (!fileArray || !fileArray.length) return [];

    this._assertStorageReady();

    const moved = [];
    for (const file of fileArray) {
      if (!file) continue;
      const newFileName = `${fieldPrefix}-${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname || "")}`;
      const key = this.buildStorageKey(ownId, moduleName, entityId, newFileName);
      const buffer = await this._readMulterFile(file);
      await this._uploadBuffer(key, buffer, file.mimetype);
      this._cleanupTempFile(file);
      moved.push(this._buildFileMeta(key, file, fieldPrefix));
    }
    return moved;
  }

  async moveSingleFile(ownId, moduleName, entityId, file, fieldName) {
    return this._processMulterFile(ownId, moduleName, entityId, file, fieldName);
  }

  resolveStoredPath(stored) {
    if (!stored) return null;
    if (typeof stored === "string") {
      const trimmed = stored.trim();
      if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
        try {
          const parsed = JSON.parse(trimmed);
          return parsed?.path || null;
        } catch {
          return trimmed || null;
        }
      }
      return trimmed || null;
    }
    if (typeof stored === "object") {
      return stored.path || null;
    }
    return null;
  }

  async deleteStoredFile(stored) {
    const filePath = this.resolveStoredPath(stored);
    if (filePath) await this.deleteFile(filePath);
  }

  /** Upload a new file and delete the previous stored file when paths differ. */
  async replaceSingleFile(ownId, moduleName, entityId, file, fieldName, previousStored) {
    const newMeta = await this.moveSingleFile(ownId, moduleName, entityId, file, fieldName);
    if (newMeta) {
      const oldPath = this.resolveStoredPath(previousStored);
      const newPath = newMeta.path;
      if (oldPath && newPath && oldPath !== newPath) {
        await this.deleteFile(oldPath);
      }
    }
    return newMeta;
  }

  /**
   * Upload new files and delete previous stored files for matching fields.
   * @param {object} fieldMap - multer field name -> existing record field (when different)
   */
  async replaceFiles(ownId, moduleName, entityId, files, existingRecord = {}, fieldMap = {}) {
    const movedFiles = await this.moveFiles(ownId, moduleName, entityId, files);
    for (const uploadField of Object.keys(movedFiles)) {
      if (!movedFiles[uploadField]) continue;
      const recordField = fieldMap[uploadField] || uploadField;
      const oldPath = this.resolveStoredPath(existingRecord[recordField]);
      const newPath = movedFiles[uploadField]?.path;
      if (oldPath && newPath && oldPath !== newPath) {
        await this.deleteFile(oldPath);
      }
    }
    return movedFiles;
  }

  async deleteFile(relativePath) {
    if (!relativePath) return;

    const norm = this.normalizeStoredPath(relativePath);
    const r2Key = this.resolveStorageKey(norm);

    if (r2Key) {
      this._assertStorageReady();
      try {
        await getR2Client().send(
          new DeleteObjectCommand({ Bucket: R2_BUCKET, Key: r2Key })
        );
      } catch (err) {
        console.warn("R2 delete failed:", r2Key, err.message);
      }
      return;
    }

    // Legacy local paths only (pre-Cloudflare)
    if (!isCloudflareAccessEnabled()) {
      throw createImageAccessError(IMAGE_ACCESS_DENIED, 403);
    }

    const localPath = this.getLocalFullPath(norm);
    if (localPath && fs.existsSync(localPath)) {
      fs.unlinkSync(localPath);
    }
  }

  async deleteDirectory(ownId, moduleName, entityId) {
    if (!ownId || !moduleName || !entityId) return;
    if (!isCloudflareAccessEnabled()) {
      throw createImageAccessError(IMAGE_ACCESS_DENIED, 403);
    }
    const targetDir = path.join(
      __dirname,
      "../../uploads",
      "owner",
      ownId.toString(),
      moduleName,
      entityId.toString()
    );
    if (fs.existsSync(targetDir)) {
      fs.rmSync(targetDir, { recursive: true, force: true });
    }
  }

  getPublicUrl(storedPath) {
    if (!storedPath) return null;
    const norm = this.normalizeStoredPath(storedPath);
    if (norm.startsWith("http")) return norm;

    const key = this.resolveStorageKey(norm);
    if (key) {
      if (!isCloudflareAccessEnabled()) return null;
      if (!isR2Configured() || !R2_PUBLIC_URL) return null;
      return `${R2_PUBLIC_URL}/${key}`;
    }

    const base =
      process.env.API_PUBLIC_URL ||
      `http://localhost:${process.env.APP_PORT || 9000}`;
    const uploadsPath = norm.startsWith("uploads/") ? norm : `uploads/${norm}`;
    return `${String(base).replace(/\/$/, "")}/${uploadsPath}`;
  }

  getImageUrl(req, relativePath) {
    return this.getPublicUrl(relativePath);
  }

  async getFileBuffer(storedPath) {
    if (!storedPath) return null;

    if (fs.existsSync(storedPath)) {
      return fs.readFileSync(storedPath);
    }

    const key = this.resolveStorageKey(storedPath);
    if (key) {
      this._assertStorageReady();
      const resp = await getR2Client().send(
        new GetObjectCommand({ Bucket: R2_BUCKET, Key: key })
      );
      const chunks = [];
      for await (const chunk of resp.Body) chunks.push(chunk);
      return Buffer.concat(chunks);
    }

    const localPath = this.getLocalFullPath(storedPath);
    if (localPath && fs.existsSync(localPath)) {
      return fs.readFileSync(localPath);
    }
    return null;
  }
}

module.exports = new ImageService();
