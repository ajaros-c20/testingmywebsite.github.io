// image-loader.js

// Force reset on refresh
if (performance.getEntriesByType("navigation")[0]?.type === "reload") {
  sessionStorage.removeItem("imageConsent");
}

function isMobile() {
  return window.innerHeight/window.innerWidth >1.15;
}

function loadImages() {
  const images = document.querySelectorAll("[data-src]");

  images.forEach(img => {
    // Only load if not already loaded
    if (!img.getAttribute("src")) {
      img.setAttribute("src", img.dataset.src);
    }
  });
}

function showPopup() {
  document.getElementById("image-consent-popup").classList.remove("hidden");
}

function hidePopup() {
  document.getElementById("image-consent-popup").classList.add("hidden");
}

function handleConsent() {
  const consent = sessionStorage.getItem("imageConsent");

  if (!isMobile()) {
    loadImages();
    return;
  }

  if (consent === "yes") {
    loadImages();
  } else if (consent === "no") {
    // do nothing
  } else {
    showPopup();
  }
}

function setupButtons() {
  const yesBtn = document.getElementById("accept-images");
  const noBtn = document.getElementById("decline-images");

  if (!yesBtn || !noBtn) return;

  yesBtn.onclick = () => {
    sessionStorage.setItem("imageConsent", "yes");
    loadImages();
    hidePopup();
  };

  noBtn.onclick = () => {
    sessionStorage.setItem("imageConsent", "no");
    hidePopup();
  };
}

// 👇 This runs EVERY time new content appears (SPA safe)
function initImageLoader() {
  handleConsent();
}

// First load
window.addEventListener("load", () => {
  setupButtons();
  initImageLoader();
});

// Expose globally
window.initImageLoader = initImageLoader;