// replay-enhance.js

document.addEventListener("DOMContentLoaded", () => {
  const popup = document.getElementById("scene-popup");
  const titleEl = document.getElementById("modal-scene-title");
  const bodyEl = document.getElementById("scene-popup-body");
  const bgmBtn = document.getElementById("modal-bgm-btn");
  const player = document.getElementById("bgm-player");
  const closeBtn = document.getElementById("close-scene-popup");

  // Global BGM UI elements
  const globalBgmUi = document.getElementById("global-bgm-ui");
  const trackNameEl = document.getElementById("global-track-name");
  const volumeSlider = document.getElementById("global-bgm-volume");
  const playPauseBtn = document.getElementById("global-play-pause");

  let currentBgmUrl = "";

  // 0. Initialize Global Volume
  if (player && volumeSlider) {
    const savedVol = localStorage.getItem("nyarban_bgm_volume");
    if (savedVol !== null) {
      player.volume = savedVol;
      volumeSlider.value = savedVol;
    } else {
      player.volume = 0.5; // Default 50%
    }

    volumeSlider.addEventListener("input", (e) => {
      player.volume = e.target.value;
      localStorage.setItem("nyarban_bgm_volume", e.target.value);
    });
  }

  // Helper to extract track name
  function getFilenameFromPath(path) {
    if (!path) return "No Track";
    const parts = path.split(/[\/\\]/);
    const filename = parts[parts.length - 1];
    return filename.replace(".mp3", "").replace("DOVA", "").replace(".ogg", "").trim() || "Unknown Track";
  }

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
    bodyEl.innerHTML = `<pre>${escapeHTML(data.text)}</pre>`;

    // Safety check for info-title if it exists
    const infoTitle = document.getElementById("info-title");
    if (infoTitle) infoTitle.textContent = data.title;

    currentBgmUrl = data.bgm || "";
    if (bgmBtn) bgmBtn.textContent = "▶ BGM";

    // Stop current track to switch seamlessly if required, or let user decide
    // For global UI, auto-play the new scene's BGM
    if (globalBgmUi && currentBgmUrl) {
      const safeUrl = encodeURI(currentBgmUrl);
      // Check if it's already playing the exact same track. If yes, don't interrupt.
      if (player.getAttribute("src") !== safeUrl) {
        player.setAttribute("src", safeUrl);
        player.load();
        player.play().catch(e => console.log("Autoplay prevented by browser:", e));
      } else if (player.paused) {
        player.play().catch(e => console.log("Autoplay prevented:", e));
      }
      trackNameEl.textContent = getFilenameFromPath(currentBgmUrl);
      playPauseBtn.textContent = "⏸";
      globalBgmUi.classList.add("active");
    } else if (globalBgmUi && !currentBgmUrl) {
      player.pause();
      player.removeAttribute("src");
      trackNameEl.textContent = "No Track";
      playPauseBtn.textContent = "▶";
      globalBgmUi.classList.remove("active");
    } else if (!globalBgmUi) {
      // Fallback to old behavior if user hasn't added the HTML snippet yet
      player.pause();
      player.removeAttribute("src");
    }

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
    if (!str) return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // 5. Global BGM Play/Pause Toggle
  if (playPauseBtn) {
    playPauseBtn.addEventListener("click", () => {
      if (!player.src || player.src.endsWith("null")) return;
      if (player.paused) {
        player.play().catch(err => console.error("Play failed", err));
        playPauseBtn.textContent = "⏸";
      } else {
        player.pause();
        playPauseBtn.textContent = "▶";
      }
    });
  }

  // Backward compatibility for the old modal bgm button
  if (bgmBtn) {
    bgmBtn.addEventListener("click", () => {
      if (!currentBgmUrl) {
        alert("このシーンにはBGMが設定されていません。");
        return;
      }

      // If global UI exists, redirect the action
      if (globalBgmUi) {
        playPauseBtn.click();
        // Sync text on the old button
        setTimeout(() => {
          bgmBtn.textContent = player.paused ? "▶ BGM" : "⏸ BGM";
        }, 100);
        return;
      }

      const safeUrl = encodeURI(currentBgmUrl);
      if (!player.paused && player.getAttribute("src") === safeUrl) {
        player.pause();
        bgmBtn.textContent = "▶ BGM";
      } else {
        if (player.getAttribute("src") !== safeUrl) {
          player.setAttribute("src", safeUrl);
          player.load();
        }
        player.play().catch(err => {
          console.error("Audio play failed:", err);
          alert("BGMの再生に失敗しました。");
        });
        bgmBtn.textContent = "⏸ BGM";
      }
    });
  }

  // 6. Close Modal
  const closeModal = () => {
    popup.classList.remove("visible");
    const safeUrl = encodeURI(currentBgmUrl);

    // Clear log text to prevent scroll overlap bugs
    bodyEl.innerHTML = "";

    // Note: In global BGM mode, closing the scene modal DOES NOT stop the BGM!
    // This allows the user to listen to the BGM while reading the chapter summaries.
    if (!globalBgmUi) {
      player.pause();
      player.removeAttribute("src");
      currentBgmUrl = "";
      if (bgmBtn) bgmBtn.textContent = "▶ BGM";
    } else {
      // Just sync the modal button text back to Start when closed
      if (bgmBtn) bgmBtn.textContent = "▶ BGM";
    }
  };

  closeBtn.addEventListener("click", closeModal);
  popup.addEventListener("click", e => {
    if (e.target === popup) closeModal();
  });
});