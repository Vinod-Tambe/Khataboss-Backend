"use strict";

const fs = require("fs");
const path = require("path");

const DEFAULT_PATH = path.join(__dirname, "../common/template/form/default.json");

let cachedDefault = null;

const loadDefaultConfig = () => {
  if (cachedDefault) return cachedDefault;
  cachedDefault = JSON.parse(fs.readFileSync(DEFAULT_PATH, "utf8"));
  return cachedDefault;
};

const findDefaultSection = (defaults, sectionId) =>
  (defaults.sections || []).find((s) => s.id === sectionId) || null;

const findDefaultField = (defaultSection, fieldId) =>
  (defaultSection?.fields || []).find((f) => f.id === fieldId) || null;

const normalizeFieldLayout = (layout) => {
  if (layout === "full" || layout === "small") return layout;
  return "half";
};

const LEGACY_TXN_FIELD_IDS = new Set([
  "txn_date",
  "txn_type",
  "txn_amount",
  "txn_narration",
]);

const isLegacyTransactionSection = (section) =>
  section?.id === "transaction_history" &&
  (section.fields || []).length > 0 &&
  (section.fields || []).every((field) => LEGACY_TXN_FIELD_IDS.has(field.id));

const mapDefaultSectionFields = (defSection) =>
  (defSection?.fields || []).map((field, fIdx) => ({
    ...field,
    order: field.order ?? fIdx + 1,
    fieldLayout: normalizeFieldLayout(field.fieldLayout),
    backgroundColor: "",
  }));

/**
 * Deep-merge saved config with defaults without wiping user customizations
 * (theme colors, section/field order, labels, enabled flags).
 */
const normalizeFormTemplateConfig = (config, defaults = loadDefaultConfig()) => {
  if (!config || typeof config !== "object") {
    return structuredClone(defaults);
  }

  const sourceSections =
    Array.isArray(config.sections) && config.sections.length
      ? config.sections
      : defaults.sections || [];

  const mergeSectionFields = (section, defSection) => {
    if (isLegacyTransactionSection(section) && defSection) {
      return mapDefaultSectionFields(defSection);
    }

    const mergedFields = (section.fields || []).map((field, fIdx) => ({
      ...findDefaultField(defSection, field.id),
      ...field,
      order: field.order ?? fIdx + 1,
      fieldLayout: normalizeFieldLayout(field.fieldLayout),
      backgroundColor: field.backgroundColor || "",
    }));

    const existingFieldIds = new Set(mergedFields.map((field) => field.id));
    (defSection?.fields || []).forEach((defField, fIdx) => {
      if (!existingFieldIds.has(defField.id)) {
        mergedFields.push({
          ...defField,
          order: defField.order ?? mergedFields.length + fIdx + 1,
          fieldLayout: normalizeFieldLayout(defField.fieldLayout),
          backgroundColor: "",
        });
      }
    });

    mergedFields.sort((a, b) => (a.order || 0) - (b.order || 0));
    return mergedFields;
  };

  const sections = sourceSections.map((section, sIdx) => {
    const defSection = findDefaultSection(defaults, section.id);
    return {
      ...defSection,
      ...section,
      order: section.order ?? sIdx + 1,
      backgroundColor: section.backgroundColor || "",
      fields: mergeSectionFields(section, defSection),
    };
  });

  const existingSectionIds = new Set(sections.map((section) => section.id));
  (defaults.sections || []).forEach((defSection) => {
    if (!existingSectionIds.has(defSection.id)) {
      sections.push({
        ...defSection,
        fields: (defSection.fields || []).map((field, fIdx) => ({
          ...field,
          order: field.order ?? fIdx + 1,
          fieldLayout: normalizeFieldLayout(field.fieldLayout),
          backgroundColor: "",
        })),
      });
    }
  });

  sections.sort((a, b) => (a.order || 0) - (b.order || 0));

  return {
    ...defaults,
    ...config,
    subtitle: config.subtitle || defaults.subtitle,
    complianceReference: config.complianceReference || defaults.complianceReference || "",
    headerNote: config.headerNote || defaults.headerNote || "",
    footerNote: config.footerNote || defaults.footerNote || "",
    termsAndConditions: config.termsAndConditions || defaults.termsAndConditions,
    declarationText: config.declarationText || defaults.declarationText,
    theme: { ...(defaults.theme || {}), ...(config.theme || {}) },
    layout: { ...defaults.layout, ...(config.layout || {}) },
    signatureLabels: {
      ...defaults.signatureLabels,
      ...(config.signatureLabels || {}),
    },
    variables: config.variables?.length ? config.variables : defaults.variables,
    sections,
  };
};

module.exports = {
  loadDefaultConfig,
  normalizeFormTemplateConfig,
};
