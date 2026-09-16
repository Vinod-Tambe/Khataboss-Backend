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

  const sendPage = (filename) => (req, res, next) => {
    const filePath = path.join(websiteRoot, filename);
    fs.access(filePath, fs.constants.R_OK, (err) => {
      if (err) return next();
      res.type("html").sendFile(filePath);
    });
  };

  app.get("/robots.txt", (req, res) => {
    res.type("text/plain").sendFile(path.join(websiteRoot, "robots.txt"));
  });

  app.get("/sitemap.xml", (req, res) => {
    res.type("application/xml").sendFile(path.join(websiteRoot, "sitemap.xml"));
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
