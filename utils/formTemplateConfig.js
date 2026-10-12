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

const FORM8_SECTION_STYLE_KEYS = [
  "backgroundColor",
  "borderColor",
  "titleColor",
  "titleBackgroundColor",
  "titleFontSizePt",
  "titleFontWeight",
  "labelFontSizePt",
  "labelFontWeight",
  "valueFontSizePt",
  "valueFontWeight",
];

const mergeSectionStyleFields = (section = {}, defSection = {}) => {
  const out = {};
  FORM8_SECTION_STYLE_KEYS.forEach((key) => {
    const sv = section[key];
    if (sv != null && String(sv).trim() !== "") {
      out[key] = sv;
      return;
    }
    if (Object.prototype.hasOwnProperty.call(section, key) && sv === "") {
      out[key] = "";
      return;
    }
    const dv = defSection[key];
    if (dv != null && String(dv).trim() !== "") {
      out[key] = dv;
    }
  });
  return out;
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
      ...mergeSectionStyleFields(section, defSection),
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

  const isLegacyBuilder =
    !Array.isArray(config.builderBlockOrder) || config.builderBlockOrder.length === 0;

  const builderBlockOrder =
    Array.isArray(config.builderBlockOrder) && config.builderBlockOrder.length
      ? config.builderBlockOrder
      : defaults.builderBlockOrder || [];

  const blockLayouts = isLegacyBuilder
    ? { ...(defaults.blockLayouts || {}) }
    : { ...(defaults.blockLayouts || {}), ...(config.blockLayouts || {}) };

  const layoutFromConfig = config.layout || {};

  const { printHtml: _omitPrintHtml, ...configRest } = config;

  return {
    ...defaults,
    ...configRest,
    subtitle: config.subtitle || defaults.subtitle,
    complianceReference: config.complianceReference || defaults.complianceReference || "",
    headerNote: config.headerNote || defaults.headerNote || "",
    footerNoteTitle: config.footerNoteTitle || defaults.footerNoteTitle || "Footer note",
    footerNote: config.footerNote || defaults.footerNote || "",
    termsAndConditions: config.termsAndConditions || defaults.termsAndConditions,
    declarationText: config.declarationText || defaults.declarationText,
    theme: { ...(defaults.theme || {}), ...(config.theme || {}) },
    layout: isLegacyBuilder
      ? {
          ...defaults.layout,
          useFirmFormHeader:
            layoutFromConfig.useFirmFormHeader !== undefined
              ? Boolean(layoutFromConfig.useFirmFormHeader)
              : defaults.layout?.useFirmFormHeader,
          useFirmFormFooter:
            layoutFromConfig.useFirmFormFooter !== undefined
              ? Boolean(layoutFromConfig.useFirmFormFooter)
              : defaults.layout?.useFirmFormFooter,
        }
      : { ...defaults.layout, ...layoutFromConfig },
    builderBlockOrder,
    blockLayouts,
    assets: {
      ...(defaults.assets || {}),
      ...(config.assets || {}),
    },
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
