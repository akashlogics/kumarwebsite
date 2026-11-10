/* ==========================================================
   Kumar & Co — main.js
   1. WhatsApp links + enquiry form
   2. Scroll-driven construction story (canvas frame sequence)
   3. Nav, reveal-on-scroll, lightbox
   ========================================================== */
(function () {
  "use strict";

  var cfg = window.KUMAR_CONFIG || {};
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function $(s, r) { return (r || document).querySelector(s); }
  function $all(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }

  /* ---------- 1. WhatsApp ---------- */
  function waUrl(text) {
    var num = String(cfg.whatsappNumber || "").replace(/\D/g, "");
    var base = num ? "https://wa.me/" + num : "https://wa.me/";
    return base + "?text=" + encodeURIComponent(text);
  }
  if (!cfg.whatsappNumber && window.console) {
    console.warn("[Kumar & Co] Set whatsappNumber in js/config.js so WhatsApp buttons open the company chat.");
  }
  $all("[data-wa-link]").forEach(function (a) {
    a.href = waUrl(cfg.defaultMessage || "Hello Kumar & Co");
    a.target = "_blank";
    a.rel = "noopener";
  });

  var form = $("#enquiry-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var els = form.elements;
      var name = els["name"].value.trim();
      var phone = els["phone"].value.trim();
      var type = els["type"].value;
      var msg = els["message"].value.trim();
      var err = $("#form-error");
      if (!name || !phone || !msg) { err.textContent = "Please fill in your name, phone number and project details."; return; }
      if (phone.replace(/\D/g, "").length < 10) { err.textContent = "Please enter a valid phone number."; return; }
      err.textContent = "";
      var text = "Hello Kumar & Co,\n\n" +
        "Name: " + name + "\n" +
        "Phone: " + phone + "\n" +
        "Looking for: " + type + "\n" +
        "Details: " + msg;
      window.open(waUrl(text), "_blank", "noopener");
    });
  }

  // optional contact details
  var links = $("#contact-links");
  if (links) {
    var items = [];
    if (cfg.contactPhoneDisplay) items.push(["a", cfg.contactPhoneDisplay, "tel:" + cfg.contactPhoneDisplay.replace(/[^0-9+]/g, "")]);
    if (cfg.contactEmail) items.push(["a", cfg.contactEmail, "mailto:" + cfg.contactEmail]);
    if (cfg.contactAddress) items.push(["span", cfg.contactAddress]);
    items.forEach(function (it) {
      var el = document.createElement(it[0]); el.textContent = it[1]; if (it[2]) el.href = it[2]; links.appendChild(el);
    });
  }
  var fx = $("#footer-extra");
  if (fx) {
    var bits = [];
    if (cfg.gstNumber) bits.push("GST No: " + cfg.gstNumber);
    if (cfg.udyamNumber) bits.push("UDYAM: " + cfg.udyamNumber);
    fx.textContent = bits.join("  ·  ");
  }
  var yr = $("#year"); if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- 2. Story ---------- */
  var story = $("#story");
  var canvas = $("#story-canvas");
  var ctx = canvas.getContext("2d");
  var wash = $("#story-wash");
  var loaderBar = $("#story-loader");
  var loaderFill = loaderBar && loaderBar.firstElementChild;
  var panels = $all(".panel", story).map(function (el) {
    var r = el.getAttribute("data-range").split(",").map(Number);
    return { el: el, a: r[0], b: r[1] };
  });
  var dots = $all("#chapters button");
  var dotRanges = [[-1, 0.16], [0.16, 0.42], [0.42, 0.66], [0.66, 0.88], [0.88, 2]];

  var TOTAL = 249;
  var smallScreen = window.innerWidth < 860 || (navigator.connection && navigator.connection.saveData);
  var STEP = smallScreen ? 2 : 1;          // phones load every 2nd frame
  var frames = new Array(TOTAL);           // loaded Image objects
  var loadedCount = 0, wanted = 0;
  function src(i) { var n = i + 1; return "assets/frames/f" + (n < 10 ? "00" : n < 100 ? "0" : "") + n + ".webp"; }

  // loading order: first frame, coarse pass, then fill in
  function loadOrder() {
    var seen = {}, order = [];
    function add(i) { if (i >= 0 && i < TOTAL && !seen[i] && (i % STEP === 0 || i === TOTAL - 1)) { seen[i] = 1; order.push(i); } }
    add(0);
    [16, 8, 4, 2, 1].forEach(function (s) { for (var i = 0; i < TOTAL; i += s) add(i); });
    add(TOTAL - 1);
    return order;
  }
  var order = loadOrder();
  wanted = order.length;
  var qi = 0, active = 0, MAX_PARALLEL = smallScreen ? 4 : 6;
  function pump() {
    while (active < MAX_PARALLEL && qi < order.length) {
      (function (idx) {
        var img = new Image();
        active++;
        img.onload = img.onerror = function (ev) {
          active--;
          if (ev && ev.type === "load") { frames[idx] = img; }
          loadedCount++;
          if (loaderFill) loaderFill.style.width = Math.round(loadedCount / wanted * 100) + "%";
          if (loadedCount >= wanted && loaderBar) loaderBar.classList.add("done");
          needsDraw = true;
          pump();
        };
        img.src = src(idx);
      })(order[qi++]);
    }
  }

  var W = 0, H = 0, dpr = 1;
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.clientWidth; H = canvas.clientHeight;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    needsDraw = true;
  }

  function nearest(idx) {
    if (frames[idx]) return frames[idx];
    for (var d = 1; d < TOTAL; d++) {
      if (idx - d >= 0 && frames[idx - d]) return frames[idx - d];
      if (idx + d < TOTAL && frames[idx + d]) return frames[idx + d];
    }
    return null;
  }

  var lastDrawn = null;
  function draw(idx) {
    var img = nearest(Math.round(idx));
    if (!img || img === lastDrawn && !needsResizeDraw) return;
    lastDrawn = img; needsResizeDraw = false;
    var cw = canvas.width, ch = canvas.height;
    var ir = img.naturalWidth / img.naturalHeight, cr = cw / ch;
    var sw, sh, sx, sy, focusX = W < 860 ? 0.62 : 0.5;
    if (cr > ir) { sw = img.naturalWidth; sh = sw / cr; sx = 0; sy = (img.naturalHeight - sh) / 2; }
    else { sh = img.naturalHeight; sw = sh * cr; sy = 0; sx = (img.naturalWidth - sw) * focusX; }
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch);
  }

  var needsDraw = true, needsResizeDraw = true;
  var progress = 0, current = 0, target = 0;

  function readProgress() {
    var rect = story.getBoundingClientRect();
    var span = story.offsetHeight - window.innerHeight;
    progress = clamp(-rect.top / span, 0, 1);
    target = progress * (TOTAL - 1);
  }

  function updatePanels(p) {
    var f = 0.03;
    panels.forEach(function (pn) {
      var inn = pn.a < 0 ? 1 : clamp((p - pn.a) / f, 0, 1);
      var out = pn.b > 1 ? 1 : clamp((pn.b - p) / f, 0, 1);
      var o = Math.min(inn, out);
      var ty = (1 - inn) * 28 - (1 - out) * 28;
      pn.el.style.opacity = o.toFixed(3);
      pn.el.style.visibility = o > 0.01 ? "visible" : "hidden";
      pn.el.style.transform = "translate3d(0," + ty.toFixed(1) + "px,0)";
      pn.el.classList.toggle("on", o > 0.6);
      if (o > 0.6) { pn.el.removeAttribute("aria-hidden"); } else { pn.el.setAttribute("aria-hidden", "true"); }
    });
    // white wash only matters on the hero page
    var hero = panels[0];
    var wo = hero ? clamp((hero.b - p) / 0.05, 0, 1) : 0;
    wash.style.opacity = wo.toFixed(3);
    dots.forEach(function (d, i) { d.classList.toggle("on", p >= dotRanges[i][0] && p < dotRanges[i][1]); });
  }

  function tick() {
    readProgress();
    if (reduceMotion) current = target;
    else current += (target - current) * 0.14;
    if (Math.abs(target - current) < 0.02) current = target;
    draw(current);
    updatePanels(progress);
    requestAnimationFrame(tick);
  }

  // jump helpers
  function scrollToStory(p) {
    var top = story.getBoundingClientRect().top + window.pageYOffset;
    var span = story.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + span * p, behavior: reduceMotion ? "auto" : "smooth" });
  }
  dots.forEach(function (d) { d.addEventListener("click", function () { scrollToStory(parseFloat(d.getAttribute("data-p"))); }); });
  $all("[data-story-p]").forEach(function (a) {
    a.addEventListener("click", function (e) {
      e.preventDefault();
      scrollToStory(parseFloat(a.getAttribute("data-story-p")));
      closeMenu();
    });
  });

  window.addEventListener("resize", function () { resize(); needsResizeDraw = true; });
  resize();
  pump();
  requestAnimationFrame(tick);

  /* ---------- 3. Nav ---------- */
  var nav = $("#site-nav");
  var toggle = $("#nav-toggle");
  var menu = $("#nav-links");
  function closeMenu() { toggle.setAttribute("aria-expanded", "false"); menu.classList.remove("open"); }
  toggle.addEventListener("click", function () {
    var open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!open));
    menu.classList.toggle("open", !open);
  });
  $all("a", menu).forEach(function (a) { a.addEventListener("click", closeMenu); });
  function navState() { nav.classList.toggle("scrolled", window.pageYOffset > 24); }
  window.addEventListener("scroll", navState, { passive: true }); navState();

  // smooth in-page anchors for the non-story links
  $all('a[href^="#"]').forEach(function (a) {
    var h = a.getAttribute("href");
    if (h.length < 2 || a.hasAttribute("data-story-p") || a.hasAttribute("data-wa-link")) return;
    a.addEventListener("click", function (e) {
      var t = document.getElementById(h.slice(1));
      if (!t) return;
      e.preventDefault();
      var y = t.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({ top: y, behavior: reduceMotion ? "auto" : "smooth" });
    });
  });
  // "Contact" buttons that are also WhatsApp links: let the nav CTA go to WhatsApp, fine.

  /* ---------- Reveal on scroll ---------- */
  var revealEls = $all(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else { revealEls.forEach(function (el) { el.classList.add("in"); }); }

  /* ---------- Lightbox ---------- */
  var lb = $("#lightbox"), lbImg = $("#lb-img"), lbCap = $("#lb-cap");
  var zoomables = $all(".zoomable");
  var lbIndex = 0, lastFocus = null;
  function openLb(i) {
    lbIndex = (i + zoomables.length) % zoomables.length;
    var z = zoomables[lbIndex];
    lbImg.src = z.getAttribute("data-full");
    lbImg.alt = $("img", z).alt;
    lbCap.textContent = z.getAttribute("data-cap") || "";
    lb.hidden = false;
    document.body.style.overflow = "hidden";
  }
  function closeLb() { lb.hidden = true; lbImg.src = ""; document.body.style.overflow = ""; if (lastFocus) lastFocus.focus(); }
  zoomables.forEach(function (z, i) { z.addEventListener("click", function () { lastFocus = z; openLb(i); $("#lb-close").focus(); }); });
  $("#lb-close").addEventListener("click", closeLb);
  $("#lb-prev").addEventListener("click", function () { openLb(lbIndex - 1); });
  $("#lb-next").addEventListener("click", function () { openLb(lbIndex + 1); });
  lb.addEventListener("click", function (e) { if (e.target === lb) closeLb(); });
  document.addEventListener("keydown", function (e) {
    if (lb.hidden) return;
    if (e.key === "Escape") closeLb();
    if (e.key === "ArrowLeft") openLb(lbIndex - 1);
    if (e.key === "ArrowRight") openLb(lbIndex + 1);
  });
})();
