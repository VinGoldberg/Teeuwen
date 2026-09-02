// ====================================================================
// GOOGLE REVIEWS — pas hier eenvoudig het cijfer en aantal reviews aan
// ====================================================================
// Kijk op jullie Google Bedrijfsprofiel voor de actuele waarden en
// vul ze hieronder in. De website berekent en toont de rest zelf
// (sterren, komma i.p.v. punt, ...). Verder hoeft er niets aangepast
// te worden.

const GOOGLE_REVIEW_SCORE = 4.7;   // het cijfer, met een PUNT (bv. 4.7 of 4.9)
const GOOGLE_REVIEW_COUNT = 120;   // het aantal reviews (enkel het getal)

// ====================================================================
// Onderstaande code hoeft niet aangepast te worden.
// ====================================================================
document.addEventListener("DOMContentLoaded", function () {
  var scoreEl = document.querySelector("[data-review-score]");
  var starsEl = document.querySelector("[data-review-stars]");
  var countEl = document.querySelector("[data-review-count]");

  var scoreText = GOOGLE_REVIEW_SCORE.toString().replace(".", ",");

  if (scoreEl) scoreEl.textContent = scoreText;
  if (countEl) countEl.textContent = GOOGLE_REVIEW_COUNT + " Google reviews";
  if (starsEl) {
    var percent = Math.max(0, Math.min(100, (GOOGLE_REVIEW_SCORE / 5) * 100));
    starsEl.style.setProperty("--rating", percent + "%");
    starsEl.setAttribute("aria-label", scoreText + " van de 5 sterren");
  }
});
