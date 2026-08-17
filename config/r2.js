"use strict";

const { S3Client } = require("@aws-sdk/client-s3");

let client = null;

function readEnv(name) {
  return (process.env[name] || "").trim();
}

function getR2Settings() {
  return {
    accountId: readEnv("R2_ACCOUNT_ID"),
    accessKeyId: readEnv("R2_ACCESS_KEY_ID"),
    secretAccessKey: readEnv("R2_SECRET_ACCESS_KEY"),
    bucket: readEnv("R2_BUCKET_NAME"),
    publicUrl: readEnv("R2_PUBLIC_URL").replace(/\/$/, ""),
  };
}

function isR2Configured() {
  const { accountId, accessKeyId, secretAccessKey, bucket } = getR2Settings();
  return Boolean(accountId && accessKeyId && secretAccessKey && bucket);
}

function getR2Client() {
  if (!isR2Configured()) {
    throw new Error(
      "Cloudflare R2 is not configured. Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, and R2_BUCKET_NAME in .env"
    );
  }
  if (!client) {
    const { accountId, accessKeyId, secretAccessKey } = getR2Settings();
    client = new S3Client({
      region: "auto",
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }
  return client;
}

function getR2Bucket() {
  return getR2Settings().bucket;
}

function getR2PublicUrl() {
  return getR2Settings().publicUrl;
}

module.exports = {
  get R2_BUCKET() {
    return getR2Bucket();
  },
  get R2_PUBLIC_URL() {
    return getR2PublicUrl();
  },
  isR2Configured,
  getR2Client,
  getR2Settings,
};
