(function () {
  "use strict";

  var cfg = window.KUMAR_CONFIG || {};

  /* ---------------------------------------------------------------
     Nav: solid background on scroll + mobile menu toggle
  --------------------------------------------------------------- */
  var nav = document.querySelector(".site-nav");
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");

  function onScrollNav() {
    if (window.scrollY > 40) {
      nav.classList.add("is-scrolled");
    } else {
      nav.classList.remove("is-scrolled");
    }
  }
  onScrollNav();
  window.addEventListener("scroll", onScrollNav, { passive: true });

  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      links.classList.toggle("is-open", !open);
      document.body.style.overflow = !open ? "hidden" : "";
    });

    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        toggle.setAttribute("aria-expanded", "false");
        links.classList.remove("is-open");
        document.body.style.overflow = "";
      });
    });
  }

  /* ---------------------------------------------------------------
     Highway scroll-progress spine
  --------------------------------------------------------------- */
  var progressEl = document.documentElement;
  function onScrollProgress() {
    var h = document.documentElement;
    var scrollTop = h.scrollTop || document.body.scrollTop;
    var scrollHeight = (h.scrollHeight || document.body.scrollHeight) - h.clientHeight;
    var pct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    progressEl.style.setProperty("--scroll-progress", pct.toFixed(2));
  }
  onScrollProgress();
  window.addEventListener("scroll", onScrollProgress, { passive: true });
  window.addEventListener("resize", onScrollProgress);

  /* ---------------------------------------------------------------
     Scroll reveals
  --------------------------------------------------------------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------------------------------------------------------------
     Our Works — gallery data
     Every entry is a real site photo. Captions come from the
     project's own site records / company brochure.
  --------------------------------------------------------------- */
  var GALLERY = [
    { src: "assets/images/hero-corridor.jpg", caption: "Corridor safety & signage — Thekkupattu, Tamil Nadu" },
    { src: "assets/images/project-01.jpg", caption: "Median maintenance — Mumbai Highway, Thekkupattu" },
    { src: "assets/images/works/work-16.jpg", caption: "BHGE Phase IV — PEB building erection, Coimbatore" },
    { src: "assets/images/works/work-01.jpg", caption: "Srirangam Infra Pvt Ltd — BC relaying work, NH-227" },
    { src: "assets/images/works/work-09.jpg", caption: "Road widening, Thoppur Ghat Section — NH-44, Dharmapuri" },
    { src: "assets/images/works/work-20.jpg", caption: "BHGE Phase IV — PEB building, Eachanari, Coimbatore" },
    { src: "assets/images/service-tollplaza.jpg", caption: "Toll plaza weighbridge cleaning — Trupatthur Padakallupalli" },
    { src: "assets/images/about-team.jpg", caption: "Median plant basin making — NH corridor" },
    { src: "assets/images/service-landscaping.jpg", caption: "Median plant basin, 34+650" },
    { src: "assets/images/service-marking.jpg", caption: "Road & kerb marking — Bynapalli, Tamil Nadu" },
    { src: "assets/images/service-barrier.jpg", caption: "Shoulder & railing cleaning, 5+100" },
    { src: "assets/images/service-cleaning.jpg", caption: "Vehicular underpass cleaning, 0+100" },
    { src: "assets/images/project-02.jpg", caption: "Drain de-silting — Bengaluru–Chennai Highway, Natrampalli" },
    { src: "assets/images/project-03.jpg", caption: "Culvert & wall upkeep — Bhangalamade, Natrampalli" },
    { src: "assets/images/project-04.jpg", caption: "Toll plaza cleaning — Trupatthur Padakallupalli, 46+800" },
    { src: "assets/images/works/work-02.jpg", caption: "Srirangam Infra Pvt Ltd — BC relaying work, NH-227" },
    { src: "assets/images/works/work-03.jpg", caption: "Srirangam Infra Pvt Ltd — BC relaying work, NH-227" },
    { src: "assets/images/works/work-04.jpg", caption: "Srirangam Infra Pvt Ltd — BC relaying work, NH-227" },
    { src: "assets/images/works/work-05.jpg", caption: "Truck lay bay, Karimangalam — NH-44, Dharmapuri" },
    { src: "assets/images/works/work-06.jpg", caption: "Truck lay bay, Karimangalam — NH-44, Dharmapuri" },
    { src: "assets/images/works/work-07.jpg", caption: "Truck lay bay, Karimangalam — NH-44, Dharmapuri" },
    { src: "assets/images/works/work-08.jpg", caption: "Truck lay bay, Karimangalam — NH-44, Dharmapuri" },
    { src: "assets/images/works/work-10.jpg", caption: "Road widening, Thoppur Ghat Section — NH-44, Dharmapuri" },
    { src: "assets/images/works/work-11.jpg", caption: "Road widening, Thoppur Ghat Section — NH-44, Dharmapuri" },
    { src: "assets/images/works/work-12.jpg", caption: "IVRCL Chengapalli Tollways Ltd — structure repair, NH-47, Coimbatore" },
    { src: "assets/images/works/work-13.jpg", caption: "IVRCL Chengapalli Tollways Ltd — structure repair, NH-47, Coimbatore" },
    { src: "assets/images/works/work-14.jpg", caption: "IVRCL Chengapalli Tollways Ltd — structure repair, NH-47, Coimbatore" },
    { src: "assets/images/works/work-15.jpg", caption: "IVRCL Chengapalli Tollways Ltd — structure repair, NH-47, Coimbatore" },
    { src: "assets/images/works/work-17.jpg", caption: "BHGE Phase IV — PEB building erection, Coimbatore" },
    { src: "assets/images/works/work-18.jpg", caption: "BHGE Phase IV — PEB building, Coimbatore" },
    { src: "assets/images/works/work-19.jpg", caption: "BHGE Phase IV — PEB building, Coimbatore" },
    { src: "assets/images/works/work-21.jpg", caption: "BHGE Phase IV — PEB building, Eachanari, Coimbatore" }
  ];

  var PREVIEW_COUNT = 8;

  var previewEl = document.getElementById("works-preview");
  var totalCountEl = document.getElementById("works-total-count");
  if (totalCountEl) totalCountEl.textContent = GALLERY.length;

  if (previewEl) {
    GALLERY.slice(0, PREVIEW_COUNT).forEach(function (item) {
      var fig = document.createElement("figure");
      fig.className = "works-preview-tile";
      fig.setAttribute("role", "button");
      fig.setAttribute("tabindex", "0");
      fig.setAttribute("aria-label", "Open full gallery: " + item.caption);
      var img = document.createElement("img");
      img.src = item.src;
      img.alt = item.caption;
      img.loading = "lazy";
      fig.appendChild(img);
      fig.addEventListener("click", function () { openGallery(); });
      fig.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openGallery(); }
      });
      previewEl.appendChild(fig);
    });
  }

  var collageEl = document.getElementById("gallery-collage");
  if (collageEl) {
    GALLERY.forEach(function (item, idx) {
      var fig = document.createElement("figure");
      fig.setAttribute("role", "button");
      fig.setAttribute("tabindex", "0");
      fig.setAttribute("aria-label", "Enlarge: " + item.caption);
      var img = document.createElement("img");
      img.src = item.src;
      img.alt = item.caption;
      img.loading = "lazy";
      var cap = document.createElement("figcaption");
      cap.textContent = item.caption;
      fig.appendChild(img);
      fig.appendChild(cap);
      fig.addEventListener("click", function () { openViewer(idx); });
      fig.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openViewer(idx); }
      });
      collageEl.appendChild(fig);
    });
  }

  var galleryModal = document.getElementById("gallery-modal");
  var openGalleryBtn = document.getElementById("open-gallery-btn");
  var closeGalleryBtn = document.getElementById("gallery-modal-close");

  function openGallery() {
    if (!galleryModal) return;
    galleryModal.classList.add("is-open");
    document.body.classList.add("modal-open");
  }
  function closeGallery() {
    if (!galleryModal) return;
    galleryModal.classList.remove("is-open");
    if (!viewerEl || !viewerEl.classList.contains("is-open")) {
      document.body.classList.remove("modal-open");
    }
  }
  if (openGalleryBtn) openGalleryBtn.addEventListener("click", openGallery);
  if (closeGalleryBtn) closeGalleryBtn.addEventListener("click", closeGallery);
  if (galleryModal) {
    galleryModal.addEventListener("click", function (e) {
      if (e.target === galleryModal) closeGallery();
    });
  }

  var viewerEl = document.getElementById("gallery-viewer");
  var viewerImg = document.getElementById("gallery-viewer-img");
  var viewerCaption = document.getElementById("gallery-viewer-caption");
  var viewerClose = document.getElementById("gallery-viewer-close");
  var viewerPrev = document.getElementById("gallery-viewer-prev");
  var viewerNext = document.getElementById("gallery-viewer-next");
  var viewerIndex = 0;

  function openViewer(idx) {
    viewerIndex = idx;
    renderViewer();
    viewerEl.classList.add("is-open");
    document.body.classList.add("modal-open");
  }
  function renderViewer() {
    var item = GALLERY[viewerIndex];
    viewerImg.src = item.src;
    viewerImg.alt = item.caption;
    viewerCaption.textContent = item.caption;
  }
  function closeViewer() {
    viewerEl.classList.remove("is-open");
    if (!galleryModal || !galleryModal.classList.contains("is-open")) {
      document.body.classList.remove("modal-open");
    }
  }
  function showNext() { viewerIndex = (viewerIndex + 1) % GALLERY.length; renderViewer(); }
  function showPrev() { viewerIndex = (viewerIndex - 1 + GALLERY.length) % GALLERY.length; renderViewer(); }

  if (viewerClose) viewerClose.addEventListener("click", closeViewer);
  if (viewerNext) viewerNext.addEventListener("click", showNext);
  if (viewerPrev) viewerPrev.addEventListener("click", showPrev);
  if (viewerEl) {
    viewerEl.addEventListener("click", function (e) {
      if (e.target === viewerEl) closeViewer();
    });
  }
  document.addEventListener("keydown", function (e) {
    if (viewerEl && viewerEl.classList.contains("is-open")) {
      if (e.key === "Escape") closeViewer();
      if (e.key === "ArrowRight") showNext();
      if (e.key === "ArrowLeft") showPrev();
    } else if (galleryModal && galleryModal.classList.contains("is-open") && e.key === "Escape") {
      closeGallery();
    }
  });

  /* ---------------------------------------------------------------
     Footer year
  --------------------------------------------------------------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------------------------------------------------------
     WhatsApp enquiry form
  --------------------------------------------------------------- */
  var form = document.getElementById("enquiry-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var nameEl = document.getElementById("f-name");
      var phoneEl = document.getElementById("f-phone");
      var reqEl = document.getElementById("f-requirement");
      var successEl = document.getElementById("form-success");

      var name = nameEl.value.trim();
      var phone = phoneEl.value.trim();
      var requirement = reqEl.value.trim();

      var valid = true;

      if (name.length < 2) {
        showError(nameEl, "Please enter your name.");
        valid = false;
      } else {
        clearError(nameEl);
      }

      var phoneDigits = phone.replace(/[^0-9]/g, "");
      if (phoneDigits.length < 10) {
        showError(phoneEl, "Please enter a valid phone number.");
        valid = false;
      } else {
        clearError(phoneEl);
      }

      if (requirement.length < 5) {
        showError(reqEl, "Tell us briefly what you need.");
        valid = false;
      } else {
        clearError(reqEl);
      }

      if (!valid) return;

      if (!cfg.whatsappNumber) {
        successEl.textContent =
          "This form isn't connected to WhatsApp yet — add the official number in js/config.js (whatsappNumber).";
        successEl.classList.add("is-visible");
        return;
      }

      var message =
        "Hi " + (cfg.companyName || "Kumar & Co") + ",\n\n" +
        "I'm interested in your services and would like to discuss a project with your team.\n\n" +
        "Name: " + name + "\n" +
        "Phone: " + phone + "\n" +
        "Requirement: " + requirement + "\n\n" +
        "Please get back to me.";

      var url =
        "https://wa.me/" +
        cfg.whatsappNumber.replace(/[^0-9]/g, "") +
        "?text=" +
        encodeURIComponent(message);

      window.open(url, "_blank", "noopener");

      successEl.textContent = "Thanks, " + name.split(" ")[0] + " — WhatsApp is opening with your enquiry.";
      successEl.classList.add("is-visible");
      form.reset();
    });
  }

  function showError(inputEl, msg) {
    var wrap = inputEl.closest(".form-row");
    var err = wrap && wrap.querySelector(".form-error");
    if (err) err.textContent = msg;
    inputEl.setAttribute("aria-invalid", "true");
  }
  function clearError(inputEl) {
    var wrap = inputEl.closest(".form-row");
    var err = wrap && wrap.querySelector(".form-error");
    if (err) err.textContent = "";
    inputEl.removeAttribute("aria-invalid");
  }
})();
