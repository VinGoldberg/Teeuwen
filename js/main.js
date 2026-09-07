document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".nav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", nav.classList.contains("open"));
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("open");
      });
    });
  }

  var yearEl = document.querySelector("[data-year]");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  var cookieNotice = document.querySelector("[data-cookie-notice]");
  if (cookieNotice) {
    var cookieKey = "teeuwen-cookie-notice-dismissed";
    var alreadyDismissed = false;
    try {
      alreadyDismissed = window.localStorage.getItem(cookieKey) === "1";
    } catch (e) {}

    if (!alreadyDismissed) {
      window.setTimeout(function () {
        cookieNotice.classList.add("is-visible");
      }, 600);
    }

    var acceptBtn = cookieNotice.querySelector("[data-cookie-accept]");
    if (acceptBtn) {
      acceptBtn.addEventListener("click", function () {
        cookieNotice.classList.remove("is-visible");
        try {
          window.localStorage.setItem(cookieKey, "1");
        } catch (e) {}
      });
    }
  }

  var mapPlaceholder = document.querySelector("[data-map-placeholder]");
  if (mapPlaceholder) {
    var mapFrame = mapPlaceholder.closest(".map-frame");
    var loadMap = function () {
      var iframe = document.createElement("iframe");
      iframe.src = mapPlaceholder.getAttribute("data-map-src");
      iframe.loading = "lazy";
      iframe.referrerPolicy = "no-referrer-when-downgrade";
      iframe.title = "Locatie Carrosserie Teeuwen";
      mapFrame.replaceChild(iframe, mapPlaceholder);
      try {
        window.localStorage.setItem("teeuwen-map-consent", "1");
      } catch (e) {}
    };

    var mapConsent = false;
    try {
      mapConsent = window.localStorage.getItem("teeuwen-map-consent") === "1";
    } catch (e) {}

    if (mapConsent) {
      loadMap();
    } else {
      var mapBtn = mapPlaceholder.querySelector("[data-map-load]");
      if (mapBtn) {
        mapBtn.addEventListener("click", loadMap);
      }
    }
  }

  document.querySelectorAll(".ba-slider").forEach(function (slider) {
    var range = slider.querySelector(".ba-range");
    if (!range) return;

    var updatePosition = function () {
      slider.style.setProperty("--pos", range.value + "%");
    };
    range.addEventListener("input", updatePosition);
    updatePosition();

    var caption = slider.parentElement.querySelector(".ba-caption-placeholder");

    var useFallback = function (img) {
      var fallback = img.getAttribute("data-fallback");
      if (!fallback || img.dataset.fallbackUsed) return;
      img.dataset.fallbackUsed = "1";
      img.src = fallback;
      if (caption) caption.classList.add("is-visible");
    };
    slider.querySelectorAll("img[data-fallback]").forEach(function (img) {
      if (img.complete && img.naturalWidth === 0) {
        useFallback(img);
      } else {
        img.addEventListener("error", function () {
          useFallback(img);
        });
      }
    });
  });
});
