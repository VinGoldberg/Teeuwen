document.addEventListener("DOMContentLoaded", function () {
  var prefersReducedMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
        if (typeof toggleBackToTop === "function") {
          toggleBackToTop();
        }
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

    if (!prefersReducedMotion && window.IntersectionObserver) {
      var demoCancelled = false;
      range.addEventListener(
        "pointerdown",
        function () {
          demoCancelled = true;
        },
        { once: true }
      );

      var easeInOutQuad = function (t) {
        return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      };

      var runDemo = function () {
        var keyframes = [50, 28, 72, 50];
        var segmentMs = 700;
        var segmentIndex = 0;
        var startTime = null;

        var step = function (timestamp) {
          if (demoCancelled) return;
          if (startTime === null) startTime = timestamp;
          var t = Math.min((timestamp - startTime) / segmentMs, 1);
          var from = keyframes[segmentIndex];
          var to = keyframes[segmentIndex + 1];
          range.value = from + (to - from) * easeInOutQuad(t);
          updatePosition();
          if (t >= 1) {
            segmentIndex++;
            startTime = null;
            if (segmentIndex >= keyframes.length - 1) {
              range.value = 50;
              updatePosition();
              return;
            }
          }
          window.requestAnimationFrame(step);
        };
        window.requestAnimationFrame(step);
      };

      var demoObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              demoObserver.unobserve(slider);
              window.setTimeout(runDemo, 400);
            }
          });
        },
        { threshold: 0.4 }
      );
      demoObserver.observe(slider);
    }
  });

  var revealTargets = document.querySelectorAll(
    ".usp, .service-card, .step, .contact-card, .split > div, .cta-band"
  );
  if (revealTargets.length && window.IntersectionObserver) {
    revealTargets.forEach(function (el, index) {
      el.classList.add("reveal");
      el.style.setProperty("--reveal-delay", Math.min(index % 6, 5) * 0.07 + "s");
    });
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealTargets.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  var countTargets = document.querySelectorAll("[data-count-to]");
  if (countTargets.length) {
    var animateCount = function (el) {
      var target = parseFloat(el.getAttribute("data-count-to"));
      if (isNaN(target)) return;
      if (prefersReducedMotion || !window.requestAnimationFrame) {
        el.textContent = target;
        return;
      }
      var duration = 1400;
      var startTime = null;
      var easeOutCubic = function (t) {
        return 1 - Math.pow(1 - t, 3);
      };
      var step = function (timestamp) {
        if (startTime === null) startTime = timestamp;
        var t = Math.min((timestamp - startTime) / duration, 1);
        el.textContent = Math.round(target * easeOutCubic(t));
        if (t < 1) {
          window.requestAnimationFrame(step);
        } else {
          el.textContent = target;
        }
      };
      window.requestAnimationFrame(step);
    };

    if (window.IntersectionObserver) {
      var countObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              animateCount(entry.target);
              countObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.6 }
      );
      countTargets.forEach(function (el) {
        countObserver.observe(el);
      });
    } else {
      countTargets.forEach(animateCount);
    }
  }

  var header = document.querySelector(".header");
  if (header) {
    var updateHeaderState = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 40);
    };
    var headerTicking = false;
    window.addEventListener(
      "scroll",
      function () {
        if (!headerTicking) {
          window.requestAnimationFrame(updateHeaderState);
          headerTicking = true;
          window.setTimeout(function () {
            headerTicking = false;
          }, 100);
        }
      },
      { passive: true }
    );
    updateHeaderState();
  }

  var backToTop = document.createElement("button");
  backToTop.type = "button";
  backToTop.className = "back-to-top";
  backToTop.setAttribute("aria-label", "Terug naar boven");
  backToTop.innerHTML =
    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
  document.body.appendChild(backToTop);

  var toggleBackToTop = function () {
    backToTop.classList.toggle("is-visible", window.scrollY > 600);
    backToTop.classList.toggle(
      "above-cookie-notice",
      !!cookieNotice && cookieNotice.classList.contains("is-visible")
    );
  };
  var backToTopTicking = false;
  window.addEventListener(
    "scroll",
    function () {
      if (!backToTopTicking) {
        window.requestAnimationFrame(toggleBackToTop);
        backToTopTicking = true;
        window.setTimeout(function () {
          backToTopTicking = false;
        }, 100);
      }
    },
    { passive: true }
  );
  toggleBackToTop();

  backToTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  });

  var stickyCallBar = document.createElement("div");
  stickyCallBar.className = "sticky-call-bar";
  stickyCallBar.innerHTML =
    '<a href="tel:+3211641975" class="btn btn-primary">' +
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>' +
    "Bel nu</a>" +
    '<a href="contact.html" class="btn btn-outline" style="border-color:rgba(255,255,255,0.4);">Offerte aanvragen</a>';
  document.body.appendChild(stickyCallBar);

  var logoStrip = document.querySelector(".logo-strip");
  if (logoStrip && !prefersReducedMotion) {
    var marqueeWrapper = document.createElement("div");
    marqueeWrapper.className = "logo-marquee";
    logoStrip.parentNode.insertBefore(marqueeWrapper, logoStrip);
    marqueeWrapper.appendChild(logoStrip);
    logoStrip.removeAttribute("style");
    logoStrip.classList.add("logo-marquee-track");

    var originalPills = Array.prototype.slice.call(logoStrip.children);
    originalPills.forEach(function (pill) {
      var clone = pill.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      logoStrip.appendChild(clone);
    });
  }
});
