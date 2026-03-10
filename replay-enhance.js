// replay-enhance.js リプレイHTMLのコアロジックです。

// ========================================================
// ★ 1. Firebaseの設定
// ========================================================
const firebaseConfig = {
  apiKey: "AIzaSyD2K_heNXBXTxDMhdAlYsgSjTBo9xGgW5I",
  authDomain: "nyarban-comments.firebaseapp.com",
  projectId: "nyarban-comments",
  storageBucket: "nyarban-comments.firebasestorage.app",
  messagingSenderId: "824632107476",
  appId: "1:824632107476:web:ed1d8bfb1134434c8bf641"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

let currentCommentUnsubscribe = null;
let activeSceneIdForComments = null;

// ========================================================
// ★ 2. メインロジック
// ========================================================
document.addEventListener("DOMContentLoaded", () => {
  const popup = document.getElementById("scene-popup");
  const titleEl = document.getElementById("modal-scene-title");
  const bodyEl = document.getElementById("scene-popup-body");
  const bgmBtn = document.getElementById("modal-bgm-btn");
  const player = document.getElementById("bgm-player");
  const closeBtn = document.getElementById("close-scene-popup");

  const globalBgmUi = document.getElementById("global-bgm-ui");
  const trackNameEl = document.getElementById("global-track-name");
  const volumeSlider = document.getElementById("global-bgm-volume");
  const playPauseBtn = document.getElementById("global-play-pause");

  const commentsSection = document.getElementById("comments-section");
  const commentsList = document.getElementById("comments-list");
  const submitBtn = document.getElementById("submit-comment");
  const nameInput = document.getElementById("comment-name");
  const textInput = document.getElementById("comment-text");

  let currentBgmUrl = "";

  if (commentsSection) {
    commentsSection.style.display = "none";
  }

  function escapeHTML(str) {
    if (!str) return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function getFilenameFromPath(path) {
    if (!path) return "No Track";
    const parts = path.split(/[\/\\]/);
    const filename = parts[parts.length - 1];
    return filename.replace(".mp3", "").replace("DOVA", "").replace(".ogg", "").trim() || "Unknown Track";
  }

  function convertDriveUrl(url) {
    if (!url) return "";
    if (url.includes("drive.google.com")) {
      const match = url.match(/\/d\/(.+?)\//) || url.match(/id=(.+?)(&|$)/);
      if (match && match[1]) {
        return `https://drive.google.com/uc?export=download&id=${match[1]}`;
      }
    }
    return url;
  }

  window.SCENES_MAP = {};
  const navContainer = document.getElementById("dynamic-nav") || document.querySelector(".replay-nav");
  const accordionContainer = document.getElementById("scene-accordion");

  if (window.ALL_CHAPTERS && navContainer && accordionContainer) {
    navContainer.innerHTML = "";
    accordionContainer.innerHTML = "";

    window.ALL_CHAPTERS.forEach((chapterData, chIndex) => {
      const chapterNum = chIndex + 1;
      const panelId = chapterData.panelId || `panel-chapter${chapterNum}`;
      
      const navLi = document.createElement("li");
      const navA = document.createElement("a");
      navA.href = `#${panelId}`;
      navA.textContent = chapterData.chapterName;
      navLi.appendChild(navA);
      navContainer.appendChild(navLi);

      const accLi = document.createElement("li");
      const toggleBtn = document.createElement("button");
      toggleBtn.className = "scene-toggle";
      toggleBtn.setAttribute("data-target", panelId);
      toggleBtn.textContent = chapterData.chapterName;
      accLi.appendChild(toggleBtn);

      const panelDiv = document.createElement("div");
      panelDiv.id = panelId;
      panelDiv.className = "scene-panel";

      if (chapterData.summary) {
        const summaryDiv = document.createElement("div");
        summaryDiv.className = "chapter-summary";
        summaryDiv.innerHTML = escapeHTML(chapterData.summary).replace(/\n/g, "<br>");
        panelDiv.appendChild(summaryDiv);
      }

      const filterInput = document.createElement("input");
      filterInput.type = "text";
      filterInput.className = "scene-filter";
      filterInput.placeholder = "シーンを検索…";
      panelDiv.appendChild(filterInput);

      const sceneUl = document.createElement("ul");
      sceneUl.className = "scene-list";

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

  document.querySelectorAll(".scene-toggle").forEach(btn => {
    btn.addEventListener("click", () => {
      const panel = document.getElementById(btn.getAttribute("data-target"));
      if (panel) panel.classList.toggle("open");
    });
  });

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

  document.querySelectorAll(".scene-filter").forEach(input => {
    input.addEventListener("input", () => {
      const panel = input.closest(".scene-panel");
      if (!panel) return;
      const list = panel.querySelector(".scene-list");
      if (!list) return;
      const f = input.value.trim().toLowerCase();
      list.querySelectorAll("li").forEach(li => {
        if(li.querySelector("a")) {
          li.style.display = (!f || li.textContent.toLowerCase().includes(f)) ? "" : "none";
        }
      });
    });
  });

  // ========================================================
  // ★ シーン展開 ＆ ナビボタン ＆ コメント欄の配置
  // ========================================================
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

    if (commentsSection && commentsSection.parentNode === bodyEl) {
      document.body.appendChild(commentsSection);
    }

    titleEl.textContent = data.title;
    
    // 1. ログ本文を描画します
    bodyEl.innerHTML = `<pre>${escapeHTML(data.text)}</pre>`;

    // 2. ナビゲーションボタンを生成して配置します
    const navDiv = document.createElement("div");
    navDiv.id = "scene-nav-buttons";
    navDiv.style.display = "flex";
    navDiv.style.justifyContent = "space-between";
    navDiv.style.margin = "30px auto 10px auto";
    navDiv.style.width = "95%";
    navDiv.style.maxWidth = "800px";

    const prevBtn = document.createElement("button");
    prevBtn.className = "nav-scene-btn";
    prevBtn.textContent = "◀ 前のシーンへ";

    const nextBtn = document.createElement("button");
    nextBtn.className = "nav-scene-btn";
    nextBtn.textContent = "次のシーンへ ▶";

    navDiv.appendChild(prevBtn);
    navDiv.appendChild(nextBtn);

    // 現在のシーンが全体の中で何番目かを判定します
    const sceneLinks = Array.from(document.querySelectorAll("a[data-scene]"));
    const currentIndex = sceneLinks.findIndex(l => l.dataset.scene === sceneId);

    // ★ 修正箇所：ボタンクリック時は純粋に「次のシーンのリンクを押す」だけにする
    if (currentIndex > 0) {
      prevBtn.style.visibility = "visible";
      prevBtn.onclick = () => {
        sceneLinks[currentIndex - 1].click(); 
      };
    } else {
      prevBtn.style.visibility = "hidden";
    }

    if (currentIndex >= 0 && currentIndex < sceneLinks.length - 1) {
      nextBtn.style.visibility = "visible";
      nextBtn.onclick = () => {
        sceneLinks[currentIndex + 1].click();
      };
    } else {
      nextBtn.style.visibility = "hidden";
    }

    // ログの直後にボタンを追加します
    bodyEl.appendChild(navDiv);

    // 3. その直後にコメント欄を配置します
    if (commentsSection) {
      bodyEl.appendChild(commentsSection);
      commentsSection.style.display = "block";
      commentsSection.style.margin = "40px auto 20px auto";
      commentsSection.style.width = "95%";
    }

    const infoTitle = document.getElementById("info-title");
    if (infoTitle) infoTitle.textContent = data.title;

    const uniqueSceneId = (data.uid) ? String(data.uid) : sceneId;
    activeSceneIdForComments = uniqueSceneId;
    const campaignId = window.CAMPAIGN_ID || "default_campaign";

    if (currentCommentUnsubscribe) {
      currentCommentUnsubscribe();
    }
    if (commentsList) {
      commentsList.innerHTML = `<div style="text-align:center; color:#64748b; padding:20px;">読み込んでいます...</div>`;
    }

    currentCommentUnsubscribe = db.collection("campaigns").doc(campaignId)
      .collection("scenes").doc(uniqueSceneId)
      .collection("comments")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        if (!commentsList) return;
        commentsList.innerHTML = "";
        
        if (snapshot.empty) {
          commentsList.innerHTML = `<div style="text-align:center; color:#64748b; padding:20px;">まだコメントはありません。</div>`;
          return;
        }

        snapshot.forEach((doc) => {
          const cData = doc.data();
          const div = document.createElement("div");
          div.className = "comment-item";
          
          let timeStr = "";
          if (cData.timestamp) {
            const d = cData.timestamp.toDate();
            timeStr = `${d.getFullYear()}/${(d.getMonth()+1).toString().padStart(2, '0')}/${d.getDate().toString().padStart(2, '0')} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
          }

          div.innerHTML = `
            <div class="comment-header">
              <span class="comment-name">${escapeHTML(cData.name || "名無しさん")}</span>
              <span class="comment-time">${timeStr}</span>
            </div>
            <div class="comment-body">${escapeHTML(cData.text).replace(/\n/g, "<br>")}</div>
          `;
          commentsList.appendChild(div);
        });
      });

    const rawBgm = data.bgm || "";
    currentBgmUrl = convertDriveUrl(rawBgm);
    
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
      trackNameEl.textContent = getFilenameFromPath(rawBgm);
      playPauseBtn.textContent = "⏸";
      globalBgmUi.classList.add("active");
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

    const rawBg = data.bg_image || "";
    const convertedBg = convertDriveUrl(rawBg);
    const popupCont = popup.querySelector(".popup-content");
    
    if (convertedBg) {
      const bgUrl = convertedBg.startsWith("url") ? convertedBg : `url('${convertedBg}')`;
      popupCont.style.backgroundImage = bgUrl;
      popupCont.style.backgroundSize = "cover";
      popupCont.style.backgroundPosition = "center";
    } else {
      popupCont.style.backgroundImage = "none";
    }

    popup.classList.add("visible");

    // ★ 修正箇所：シーンの中身が完全に書き換わった「直後」に、スクロールを一番上に強制リセットする
    setTimeout(() => {
      const popupContScroll = popup.querySelector(".popup-content");
      if (popupContScroll) popupContScroll.scrollTop = 0;
      if (popup) popup.scrollTop = 0;
      if (bodyEl) bodyEl.scrollTop = 0;
    }, 50);

  });

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

  const closeModal = () => {
    popup.classList.remove("visible");
    
    if (commentsSection) {
      commentsSection.style.display = "none";
      document.body.appendChild(commentsSection);
    }
    
    bodyEl.innerHTML = "";
    
    if (currentCommentUnsubscribe) {
      currentCommentUnsubscribe();
      currentCommentUnsubscribe = null;
    }

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

  const bgmToggleTab = document.getElementById("bgm-toggle-tab");
  if (bgmToggleTab && globalBgmUi) {
    bgmToggleTab.addEventListener("click", () => {
      globalBgmUi.classList.toggle("minimized");
    });
  }

  if (submitBtn) {
    submitBtn.addEventListener("click", () => {
      if (!activeSceneIdForComments) {
        alert("シーンが開かれていません。");
        return;
      }

      const name = nameInput.value.trim() || "名無しのニャル様";
      const text = textInput.value.trim();
      
      if (!text) {
        alert("コメントを入力してください。");
        return;
      }
      
      submitBtn.disabled = true;
      submitBtn.textContent = "送信中...";
      
      const campaignId = window.CAMPAIGN_ID || "default_campaign";
      
      db.collection("campaigns").doc(campaignId)
        .collection("scenes").doc(activeSceneIdForComments)
        .collection("comments").add({
        name: name,
        text: text,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      }).then(() => {
        textInput.value = ""; 
        submitBtn.disabled = false;
        submitBtn.textContent = "コメントを送信";
      }).catch((error) => {
        console.error("Error:", error);
        alert("コメントの送信に失敗しました。");
        submitBtn.disabled = false;
        submitBtn.textContent = "コメントを送信";
      });
    });
  }
});