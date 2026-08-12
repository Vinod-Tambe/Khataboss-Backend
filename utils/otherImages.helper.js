"use strict";

const imageService = require("./image.service");

function parseJsonArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

function stripArrayFileFields(files) {
  if (!files) return {};
  const singleFields = { ...files };
  delete singleFields.other_images;
  return singleFields;
}

function applyMetaUpdates(items, updateMetaJson) {
  const updates = parseJsonArray(updateMetaJson);
  if (!updates.length) return items;

  return items.map((img) => {
    if (!img?.path) return img;
    const upd = updates.find((u) => u.path === img.path);
    if (!upd) return img;
    return {
      ...img,
      label: upd.label !== undefined ? upd.label : img.label || "",
      note: upd.note !== undefined ? upd.note : img.note || "",
    };
  });
}

function attachMetaToNewFiles(newMeta, metaJson) {
  const metaList = parseJsonArray(metaJson);
  return newMeta.map((item, index) => ({
    ...item,
    label: metaList[index]?.label || "",
    note: metaList[index]?.note || "",
  }));
}

async function applyOtherImagesUpdate({
  moduleName,
  entityId,
  existingJson,
  reqFiles,
  removePathsJson,
  metaJson,
  updateMetaJson,
}) {
  const existing = parseJsonArray(existingJson);
  const removePaths = parseJsonArray(removePathsJson);

  for (const filePath of removePaths) {
    if (filePath) await imageService.deleteFile(filePath);
  }

  let kept = existing.filter((img) => img?.path && !removePaths.includes(img.path));
  kept = applyMetaUpdates(kept, updateMetaJson);

  const fileArray = reqFiles?.other_images || [];
  const newMeta = await imageService.appendArrayFiles(moduleName, entityId, fileArray);
  const newWithMeta = attachMetaToNewFiles(newMeta, metaJson);

  return [...kept, ...newWithMeta];
}

module.exports = {
  parseJsonArray,
  stripArrayFileFields,
  applyOtherImagesUpdate,
  applyMetaUpdates,
  attachMetaToNewFiles,
};
