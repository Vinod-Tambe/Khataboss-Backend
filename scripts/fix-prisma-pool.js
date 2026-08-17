"use strict";

const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");

function walk(dir, acc = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory() && ent.name !== "node_modules") walk(full, acc);
    else if (ent.name.endsWith(".js")) acc.push(full);
  }
  return acc;
}

/** Remove `try { ... } finally { await prisma.$disconnect(); }` wrappers only. */
function stripTryFinallyDisconnect(source) {
  let result = source;
  const re = /\} finally \{\s*await (?:prisma|tenantPrisma)\.\$disconnect\(\);\s*\}/g;

  while (true) {
    const match = re.exec(result);
    if (!match) break;

    const blockEnd = match.index + match[0].length;
    const prefix = result.slice(0, match.index);
    const tryIdx = prefix.lastIndexOf("try {");
    if (tryIdx === -1) break;

    const lineStart = prefix.lastIndexOf("\n", tryIdx) + 1;
    const linePrefix = prefix.slice(lineStart, tryIdx);
    if (!/^[\t ]*$/.test(linePrefix)) break;

    const bodyStart = tryIdx + "try {".length;
    const body = result.slice(bodyStart, match.index);
    if (/catch\s*\(/.test(body)) break;

    result = result.slice(0, lineStart) + body + result.slice(blockEnd);
    re.lastIndex = 0;
  }

  return result;
}

function fixTenantPrismaUsage(source) {
  let src = source.replace(/\r\n/g, "\n");

  if (src.includes('require("../../../prisma/generated/main")')) {
    src = src.replace(
      'const { PrismaClient } = require("../../../prisma/generated/main");',
      'const { getTenantPrisma } = require("../../../utils/tenantPrisma");'
    );
    src = src.replace(
      /return new PrismaClient\(\{\s*datasources:\s*\{\s*db:\s*\{\s*url:\s*dbUrl,?\s*\},?\s*\},?\s*\}\);/gs,
      "return getTenantPrisma(dbUrl);"
    );
    src = src.replace(
      /new PrismaClient\(\{\s*datasources:\s*\{\s*db:\s*\{\s*url:\s*dbUrl\s*\}\s*\}\s*\}\)/g,
      "getTenantPrisma(dbUrl)"
    );
  }

  src = stripTryFinallyDisconnect(src);
  return src;
}

function fixMasterPrismaUsage(source) {
  let src = source.replace(/\r\n/g, "\n");

  if (src.includes("new MasterPrismaClient()")) {
    if (!src.includes("getMasterPrisma")) {
      src = src.replace(
        '"use strict";\n\n',
        '"use strict";\n\nconst { getMasterPrisma } = require("../../../utils/masterPrisma");\n'
      );
      src = src.replace(
        /const \{ getMasterPrisma \} = require\("\.\.\/\.\.\/\.\.\/utils\/masterPrisma"\);\nconst \{ getTenantPrisma \}/,
        'const { getMasterPrisma } = require("../../../utils/masterPrisma");\nconst { getTenantPrisma }'
      );
    }
    src = src.replace(
      /const \{ PrismaClient: MasterPrismaClient \} = require\([^)]+\);\n/g,
      ""
    );
    src = src.replace(
      /const masterPrisma = new MasterPrismaClient\(\);\n/g,
      "const masterPrisma = getMasterPrisma();\n"
    );
  }

  if (src.includes('new PrismaClient()') && src.includes("generated/master")) {
    src = src.replace(
      /const \{ PrismaClient \} = require\("\.\.\/\.\.\/\.\.\/prisma\/generated\/master"\);\n\nconst masterPrisma = new PrismaClient\(\);\n/,
      'const { getMasterPrisma } = require("../../../utils/masterPrisma");\n\nconst masterPrisma = getMasterPrisma();\n'
    );
  }

  if (src.includes("new MainPrismaClient")) {
    if (!src.includes("getTenantPrisma")) {
      src = src.replace(
        '"use strict";\n\n',
        '"use strict";\n\nconst { getTenantPrisma } = require("../../../utils/tenantPrisma");\n'
      );
    }
    src = src.replace(
      /const \{ PrismaClient: MainPrismaClient \} = require\([^)]+\);\n/g,
      ""
    );
    src = src.replace(
      /new MainPrismaClient\(\{\s*datasources:\s*\{\s*db:\s*\{\s*url:\s*dbUrl\s*\}\s*\}\s*\}\)/g,
      "getTenantPrisma(dbUrl)"
    );
    src = stripTryFinallyDisconnect(src);
  }

  return src;
}

const targetFiles = [
  ...walk(path.join(root, "modules")),
  path.join(root, "middlewares", "auth.middleware.js"),
];

const broken = [];

for (const file of targetFiles) {
  if (!fs.existsSync(file)) continue;
  const orig = fs.readFileSync(file, "utf8");
  let next = fixTenantPrismaUsage(orig);
  next = fixMasterPrismaUsage(next);

  if (next !== orig.replace(/\r\n/g, "\n")) {
    fs.writeFileSync(file, next);
    console.log("updated", path.relative(root, file));
  }

  try {
    delete require.cache[require.resolve(file)];
    require(file);
  } catch (err) {
    if (err instanceof SyntaxError) {
      broken.push(`${path.relative(root, file)}: ${err.message}`);
    }
  }
}

// auth.middleware uses ../ paths
const mw = path.join(root, "middlewares", "auth.middleware.js");
let mwSrc = fs.readFileSync(mw, "utf8");
if (mwSrc.includes("new MasterPrismaClient()")) {
  mwSrc = mwSrc.replace(
    /const \{ PrismaClient: MasterPrismaClient \} = require\("\.\.\/prisma\/generated\/master"\);\n/,
    'const { getMasterPrisma } = require("../utils/masterPrisma");\n'
  );
  mwSrc = mwSrc.replace(
    "const masterPrisma = new MasterPrismaClient();",
    "const masterPrisma = getMasterPrisma();"
  );
  fs.writeFileSync(mw, mwSrc);
  console.log("updated middlewares/auth.middleware.js");
}

console.log(`\nSyntax errors: ${broken.length}`);
broken.forEach((line) => console.log(line));
