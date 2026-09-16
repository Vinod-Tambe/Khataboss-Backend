(function () {
  "use strict";

  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".nav-toggle");
  var mobileNav = document.querySelector(".mobile-nav");

  if (header) {
    window.addEventListener(
      "scroll",
      function () {
        header.classList.toggle("is-scrolled", window.scrollY > 20);
      },
      { passive: true }
    );
  }

  if (toggle && mobileNav) {
    toggle.addEventListener("click", function () {
      var open = mobileNav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  var counters = document.querySelectorAll("[data-count]");
  var counted = false;

  function animateCounters() {
    if (counted) return;
    var stats = document.querySelector(".stats-row");
    if (!stats) return;
    var rect = stats.getBoundingClientRect();
    if (rect.top > window.innerHeight || rect.bottom < 0) return;
    counted = true;
    counters.forEach(function (el) {
      var target = parseInt(el.getAttribute("data-count"), 10) || 0;
      var suffix = el.getAttribute("data-suffix") || "";
      var duration = 1800;
      var start = performance.now();
      function step(now) {
        var p = Math.min((now - start) / duration, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }

  window.addEventListener("scroll", animateCounters, { passive: true });
  animateCounters();

  var aosEls = document.querySelectorAll("[data-aos]");
  if ("IntersectionObserver" in window && aosEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("aos-animate");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    aosEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    aosEls.forEach(function (el) {
      el.classList.add("aos-animate");
    });
  }

  var contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var success = document.querySelector(".form-success");
      if (success) {
        success.classList.add("is-visible");
        contactForm.reset();
      }
    });
  }
})();
