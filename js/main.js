/* Maple & Rose Hair Studio — interactions (lightweight, no dependencies) */
(function () {
  "use strict";

  // ---- Mobile nav toggle ----
  var toggle = document.querySelector(".nav__toggle");
  var links = document.querySelector(".nav__links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // ---- Header shadow on scroll ----
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("scrolled", window.scrollY > 10);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // ---- Reveal on scroll ----
  var reveals = document.querySelectorAll(".reveal");
  if (reveals.length && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  // ---- Gallery filter ----
  var filterBtns = document.querySelectorAll(".gallery-filters button");
  var figures = document.querySelectorAll(".gallery-grid figure");
  if (filterBtns.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        filterBtns.forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        var cat = btn.getAttribute("data-filter");
        figures.forEach(function (fig) {
          var show = cat === "all" || fig.getAttribute("data-cat") === cat;
          fig.style.display = show ? "" : "none";
        });
      });
    });
  }

  // ---- Contact form validation ----
  var form = document.querySelector("form[data-validate]");
  if (form) {
    var emailRe = /^[a-zA-Z][^\s@]*@[^\s@]+\.[^\s@]+$/;
    var phoneRe = /^[0-9()+\-.\s]{7,}$/;

    var setError = function (field, msg) {
      var wrap = field.closest(".field");
      if (!wrap) return;
      wrap.classList.add("field--error");
      var err = wrap.querySelector(".field__err");
      if (err && msg) err.textContent = msg;
    };
    var clearError = function (field) {
      var wrap = field.closest(".field");
      if (wrap) wrap.classList.remove("field--error");
    };

    form.querySelectorAll("input, textarea, select").forEach(function (f) {
      f.addEventListener("input", function () { clearError(f); });
      f.addEventListener("change", function () { clearError(f); });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      var firstBad = null;

      // Honeypot: if filled, silently ignore (bot)
      var hp = form.querySelector(".honeypot input");
      if (hp && hp.value) { return; }

      form.querySelectorAll("[required]").forEach(function (f) {
        if (f.type === "checkbox") {
          if (!f.checked) { ok = false; setError(f, ""); firstBad = firstBad || f; }
          return;
        }
        if (!f.value.trim()) { ok = false; setError(f, "This field is required."); firstBad = firstBad || f; }
      });

      var email = form.querySelector('input[type="email"]');
      if (email && email.value.trim() && !emailRe.test(email.value.trim())) {
        ok = false; setError(email, "Please enter a valid email address."); firstBad = firstBad || email;
      }
      var phone = form.querySelector('input[type="tel"]');
      if (phone && phone.value.trim() && !phoneRe.test(phone.value.trim())) {
        ok = false; setError(phone, "Please enter a valid phone number."); firstBad = firstBad || phone;
      }

      if (!ok) {
        if (firstBad) firstBad.focus();
        return;
      }

      var success = form.querySelector(".form-success");
      if (success) {
        success.classList.add("show");
        success.setAttribute("role", "status");
      }
      form.reset();
      if (success) success.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  // ---- Footer year ----
  var yr = document.querySelector("[data-year]");
  if (yr) yr.textContent = new Date().getFullYear();
})();
