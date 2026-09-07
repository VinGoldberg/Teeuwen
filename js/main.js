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

  document.querySelectorAll(".ba-slider").forEach(function (slider) {
    var range = slider.querySelector(".ba-range");
    if (!range) return;

    var updatePosition = function () {
      slider.style.setProperty("--pos", range.value + "%");
    };
    range.addEventListener("input", updatePosition);
    updatePosition();

    var markEmpty = function (img) {
      img.style.display = "none";
      slider.classList.add("ba-empty");
    };
    slider.querySelectorAll("img").forEach(function (img) {
      if (img.complete && img.naturalWidth === 0) {
        markEmpty(img);
      } else {
        img.addEventListener("error", function () {
          markEmpty(img);
        });
      }
    });
  });
});
