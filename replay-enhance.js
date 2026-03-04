// replay-enhance.js

document.addEventListener("DOMContentLoaded", () => {
  const popup = document.getElementById("scene-popup");
  const titleEl = document.getElementById("modal-scene-title");
  const bodyEl = document.getElementById("scene-popup-body");
  const bgmBtn = document.getElementById("modal-bgm-btn");
  const player = document.getElementById("bgm-player");
  const closeBtn = document.getElementById("close-scene-popup");

  let currentBgmUrl = "";

  // 1. Accordion
  document.querySelectorAll(".scene-toggle").forEach(btn => {
    const panel = document.getElementById(btn.dataset.target);
    btn.addEventListener("click", () => {
      panel.classList.toggle("open");
    });
  });

  // 2. Nav links
  document.querySelectorAll(".replay-nav a, #jump-select").forEach(el => {
    if (el.tagName === "SELECT") {
      el.addEventListener("change", () => {
        const tgt = el.value;
        if (tgt) {
          const panel = document.querySelector(tgt);
          if (panel) {
            panel.classList.add("open");
            panel.scrollIntoView({ behavior: "smooth" });
          }
        }
      });
    } else {
      const tgt = el.getAttribute("href");
      if (tgt && tgt.startsWith("#panel-")) {
        el.addEventListener("click", e => {
          e.preventDefault();
          const panel = document.querySelector(tgt);
          if (panel) {
            panel.classList.add("open");
            panel.scrollIntoView({ behavior: "smooth" });
          }
        });
      }
    }
  });

  // 3. Search Filter
  document.querySelectorAll(".scene-filter").forEach(input => {
    const list = input.closest(".scene-panel").querySelector(".scene-list");
    input.addEventListener("input", () => {
      const f = input.value.trim().toLowerCase();
      list.querySelectorAll("li").forEach(li => {
        li.style.display = (!f || li.textContent.toLowerCase().includes(f)) ? "" : "none";
      });
    });
  });

  // 4. Lazy Loading Scene Data
  document.body.addEventListener("click", e => {
    const link = e.target.closest("[data-scene]");
    if (!link) return;

    e.preventDefault();
    const sceneId = link.dataset.scene;
    const data = window.SCENES_DATA ? window.SCENES_DATA[sceneId] : null;

    if (!data) {
      console.error("Scene data not found for:", sceneId);
      return;
    }

    // Update Modal
    titleEl.textContent = data.title;
    // Use <pre> for log formatting
    bodyEl.innerHTML = `<pre>${escapeHTML(data.text)}</pre>`;
    document.getElementById("info-title").textContent = data.title;

    currentBgmUrl = data.bgm || "";
    bgmBtn.textContent = "▶ BGM";

    if (window._currentAudio) {
      window._currentAudio.pause();
      window._currentAudio = null;
    }
    player.src = "";

    // Background
    const bg = data.bg_image;
    const popupCont = popup.querySelector(".popup-content");
    if (bg) {
      const bgUrl = bg.startsWith("url") ? bg : `url('${bg}')`;
      popupCont.style.backgroundImage = bgUrl;
      popupCont.style.backgroundSize = "cover";
      popupCont.style.backgroundPosition = "center";
    } else {
      popupCont.style.backgroundImage = "none";
    }

    popup.classList.add("visible");
  });

  function escapeHTML(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // 5. BGM Controls
  bgmBtn.addEventListener("click", () => {
    if (!currentBgmUrl) return;

    if (window._currentAudio && !window._currentAudio.paused) {
      window._currentAudio.pause();
      bgmBtn.textContent = "▶ BGM";
    } else {
      if (!window._currentAudio || window._currentAudio.src !== currentBgmUrl) {
        window._currentAudio = new Audio(currentBgmUrl);
        window._currentAudio.loop = true;
      }
      window._currentAudio.play().catch(err => console.error("Audio play failed:", err));
      bgmBtn.textContent = "⏸ BGM";
    }
  });

  // 6. Close Modal
  const closeModal = () => {
    popup.classList.remove("visible");
    bodyEl.innerHTML = "";
    player.src = "";
    if (window._currentAudio) {
      window._currentAudio.pause();
      window._currentAudio = null;
    }
    currentBgmUrl = "";
    bgmBtn.textContent = "▶ BGM";
  };
  closeBtn.addEventListener("click", closeModal);
  popup.addEventListener("click", e => {
    if (e.target === popup) closeModal();
  });
});