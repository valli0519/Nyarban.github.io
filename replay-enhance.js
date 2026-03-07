// replay-enhance.js リプレイHTMLのコアロジックです。

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

  // Helper for safe HTML
  function escapeHTML(str) {
    if (!str) return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Helper to extract track name
  function getFilenameFromPath(path) {
    if (!path) return "No Track";
    const parts = path.split(/[\/\\]/);
    const filename = parts[parts.length - 1];
    return filename.replace(".mp3", "").replace("DOVA", "").replace(".ogg", "").trim() || "Unknown Track";
  }

  // 0. Auto-Generate HTML Elements from ALL_CHAPTERS
  window.SCENES_MAP = {};
  const navContainer = document.getElementById("dynamic-nav") || document.querySelector(".replay-nav");
  const accordionContainer = document.getElementById("scene-accordion");

  if (window.ALL_CHAPTERS && navContainer && accordionContainer) {
    navContainer.innerHTML = "";
    accordionContainer.innerHTML = "";

    window.ALL_CHAPTERS.forEach((chapterData, chIndex) => {
      const chapterNum = chIndex + 1;
      const panelId = chapterData.panelId || `panel-chapter${chapterNum}`;
      
      // --- 1. ナビゲーション（目次）の生成 ---
      const navLi = document.createElement("li");
      const navA = document.createElement("a");
      navA.href = `#${panelId}`;
      navA.textContent = chapterData.chapterName;
      navLi.appendChild(navA);
      navContainer.appendChild(navLi);

      // --- 2. アコーディオンパネルの生成 ---
      const accLi = document.createElement("li");

      // トグルボタン
      const toggleBtn = document.createElement("button");
      toggleBtn.className = "scene-toggle";
      toggleBtn.setAttribute("data-target", panelId);
      toggleBtn.textContent = chapterData.chapterName;
      accLi.appendChild(toggleBtn);

      // パネル本体
      const panelDiv = document.createElement("div");
      panelDiv.id = panelId;
      panelDiv.className = "scene-panel";

      // 概要（Summary）があれば生成（改行を<br>に変換）
      if (chapterData.summary) {
        const summaryDiv = document.createElement("div");
        summaryDiv.className = "chapter-summary";
        summaryDiv.innerHTML = escapeHTML(chapterData.summary).replace(/\n/g, "<br>");
        panelDiv.appendChild(summaryDiv);
      }

      // 検索バー
      const filterInput = document.createElement("input");
      filterInput.type = "text";
      filterInput.className = "scene-filter";
      filterInput.placeholder = "シーンを検索…";
      panelDiv.appendChild(filterInput);

      // シーンリスト（ul）
      const sceneUl = document.createElement("ul");
      sceneUl.className = "scene-list";

      // シーンデータの構築
      const displayChapterNum = chapterData.chapterPrefix || chapterNum;
      const isSpecialChapter = isNaN(parseFloat(displayChapterNum));

      if (chapterData.scenes && chapterData.scenes.length > 0) {
        chapterData.scenes.forEach((scene, scIndex) => {
          const sceneId = `ch${chapterNum}-sc${scIndex}`;
          window.SCENES_MAP[sceneId] = scene;

          let displayTitle = scene.title || "";
          if (!displayTitle.includes("シーン") && !displayTitle.includes("幕間") && !displayTitle.includes("外伝")) {
            if (isSpecialChapter) {
              displayTitle = `${displayChapterNum}-${scIndex + 1}: ${displayTitle}`;
            } else {
              displayTitle = `シーン ${displayChapterNum}-${scIndex + 1}: ${displayTitle}`;
            }
          }

          const scLi = document.createElement("li");
          const scA = document.createElement("a");
          scA.href = "#";
          scA.setAttribute("data-scene", sceneId);
          scA.textContent = displayTitle;
          scLi.appendChild(scA);
          sceneUl.appendChild(scLi);
        });
      } else {
        const emptyLi = document.createElement("li");
        emptyLi.textContent = "まだシーンがありません";
        emptyLi.style.color = "#888";
        sceneUl.appendChild(emptyLi);
      }

      panelDiv.appendChild(sceneUl);
      accLi.appendChild(panelDiv);
      accordionContainer.appendChild(accLi);
    });
  } else if (window.SCENES_DATA) {
    window.SCENES_MAP = window.SCENES_DATA;
  }

  // 0.5. Initialize Global Volume
  if (player && volumeSlider) {
    const savedVol = localStorage.getItem("nyarban_bgm_volume");
    if (savedVol !== null) {
      player.volume = savedVol;
      volumeSlider.value = savedVol;
    } else {
      player.volume = 0.5;
    }

    volumeSlider.addEventListener("input", (e) => {
      player.volume = e.target.value;
      localStorage.setItem("nyarban_bgm_volume", e.target.value);
    });
  }

  // 1. Accordion
  document.querySelectorAll(".scene-toggle").forEach(btn => {
    btn.addEventListener("click", () => {
      const panel = document.getElementById(btn.getAttribute("data-target"));
      if (panel) panel.classList.toggle("open");
    });
  });

  // 2. Nav links
  document.querySelectorAll(".replay-nav a").forEach(el => {
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
  });

  // 3. Search Filter
  document.querySelectorAll(".scene-filter").forEach(input => {
    input.addEventListener("input", () => {
      const panel = input.closest(".scene-panel");
      if (!panel) return;
      const list = panel.querySelector(".scene-list");
      if (!list) return;
      const f = input.value.trim().toLowerCase();
      list.querySelectorAll("li").forEach(li => {
        // "まだシーンがありません" のliは除外して検索
        if(li.querySelector("a")) {
          li.style.display = (!f || li.textContent.toLowerCase().includes(f)) ? "" : "none";
        }
      });
    });
  });

  // 4. Lazy Loading Scene Data
  document.body.addEventListener("click", e => {
    const link = e.target.closest("[data-scene]");
    if (!link) return;

    e.preventDefault();
    const sceneId = link.dataset.scene;
    const data = window.SCENES_MAP ? window.SCENES_MAP[sceneId] : null;

    if (!data) {
      console.error("Scene data not found for:", sceneId);
      return;
    }

    // Update Modal
    titleEl.textContent = data.title;
    bodyEl.innerHTML = `<pre>${escapeHTML(data.text)}</pre>`;

    const infoTitle = document.getElementById("info-title");
    if (infoTitle) infoTitle.textContent = data.title;

    currentBgmUrl = data.bgm || "";
    if (bgmBtn) bgmBtn.textContent = "▶ BGM";

    if (globalBgmUi && currentBgmUrl) {
      const safeUrl = encodeURI(currentBgmUrl);
      if (player.getAttribute("src") !== safeUrl) {
        player.setAttribute("src", safeUrl);
        player.load();
        player.play().catch(e => console.log("Autoplay prevented:", e));
      } else if (player.paused) {
        player.play().catch(e => console.log("Autoplay prevented:", e));
      }
      trackNameEl.textContent = getFilenameFromPath(currentBgmUrl);
      playPauseBtn.textContent = "⏸";
      globalBgmUi.classList.add("active");
      
      // ★ 新しい曲が流れたら、隠れていても自動で上にシュッと表示させる
      globalBgmUi.classList.remove("minimized"); 
      
    } else if (globalBgmUi && !currentBgmUrl) {
      player.pause();
      player.removeAttribute("src");
      trackNameEl.textContent = "No Track";
      playPauseBtn.textContent = "▶";
      globalBgmUi.classList.remove("active");
    } else if (!globalBgmUi) {
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

  // Backward compatibility for old modal bgm button
  if (bgmBtn) {
    bgmBtn.addEventListener("click", () => {
      if (!currentBgmUrl) {
        alert("このシーンにはBGMが設定されていません。");
        return;
      }
      if (globalBgmUi) {
        playPauseBtn.click();
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
          alert("BGMの再生に失敗しました。");
        });
        bgmBtn.textContent = "⏸ BGM";
      }
    });
  }

  // 6. Close Modal
  const closeModal = () => {
    popup.classList.remove("visible");
    bodyEl.innerHTML = "";
    if (!globalBgmUi) {
      player.pause();
      player.removeAttribute("src");
      currentBgmUrl = "";
      if (bgmBtn) bgmBtn.textContent = "▶ BGM";
    } else {
      if (bgmBtn) bgmBtn.textContent = "▶ BGM";
    }
  };

  closeBtn.addEventListener("click", closeModal);
  popup.addEventListener("click", e => {
    if (e.target === popup) closeModal();
  });

  // ========================================================
  // ★7. Global BGM Toggle (Minimize/Maximize)
  // ========================================================
  const bgmToggleTab = document.getElementById("bgm-toggle-tab");
  if (bgmToggleTab && globalBgmUi) {
    bgmToggleTab.addEventListener("click", () => {
      // つまみをタップするたびに、minimized クラスを付け外しして隠す/出すを切り替えます
      globalBgmUi.classList.toggle("minimized");
    });
  }

});