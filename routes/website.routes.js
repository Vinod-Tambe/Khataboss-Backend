"use strict";

const express = require("express");
const fs = require("fs");
const path = require("path");

const websiteRoot = path.join(__dirname, "..", "public", "website");

/**
 * Mount SEO-friendly marketing pages on the same port as the API (e.g. 9000).
 * Swagger remains at /api/v1/docs
 */
function mountWebsite(app) {
  app.use("/assets", express.static(path.join(websiteRoot, "assets"), { maxAge: "1d" }));

  const publicBaseUrl = (
    process.env.API_PUBLIC_URL ||
    process.env.WEBSITE_PUBLIC_URL ||
    "https://khataboss.in"
  ).replace(/\/$/, "");

  const sendPage = (filename) => (req, res, next) => {
    const filePath = path.join(websiteRoot, filename);
    fs.access(filePath, fs.constants.R_OK, (err) => {
      if (err) return next();
      res.type("html").sendFile(filePath);
    });
  };

  app.get("/robots.txt", (req, res) => {
    res.type("text/plain").send(
      `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${publicBaseUrl}/sitemap.xml\n`
    );
  });

  app.get("/sitemap.xml", (req, res) => {
    const urls = [
      "",
      "/about",
      "/features",
      "/contact",
      "/blog",
      "/blog/girvi-loan-digitization",
      "/blog/daybook-best-practices",
    ];
    const body = urls
      .map(
        (p) =>
          `  <url><loc>${publicBaseUrl}${p || "/"}</loc><changefreq>weekly</changefreq></url>`
      )
      .join("\n");
    res.type("application/xml").send(
      `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`
    );
  });

  /** Confirm website + Node are reachable behind nginx (optional ops check) */
  app.get("/health/website", (req, res) => {
    const indexPath = path.join(websiteRoot, "index.html");
    fs.access(indexPath, fs.constants.R_OK, (err) => {
      res.json({
        ok: !err,
        websiteRoot,
        publicBaseUrl,
        indexExists: !err,
      });
    });
  });

  app.get("/", sendPage("index.html"));
  app.get("/about", sendPage("about.html"));
  app.get("/features", sendPage("features.html"));
  app.get("/contact", sendPage("contact.html"));
  app.get("/blog", sendPage("blog.html"));

  app.get("/blog/:slug", (req, res, next) => {
    const slug = String(req.params.slug || "").replace(/[^a-z0-9-]/gi, "");
    if (!slug) return next();
    const postPath = path.join(websiteRoot, "blog", `${slug}.html`);
    fs.access(postPath, fs.constants.R_OK, (err) => {
      if (err) return next();
      res.type("html").sendFile(postPath);
    });
  });

  app.get("/404", sendPage("404.html"));
}

module.exports = { mountWebsite, websiteRoot };
