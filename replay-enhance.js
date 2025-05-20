// replay-enhance.js

document.addEventListener("DOMContentLoaded", () => {
    const popup      = document.getElementById("scene-popup");
    const titleEl    = document.getElementById("modal-scene-title");
    const bodyEl     = document.getElementById("scene-popup-body");
    const bgmBtn     = document.getElementById("modal-bgm-btn");
    const player     = document.getElementById("bgm-player");
    const closeBtn   = document.getElementById("close-scene-popup");
  
    let currentBgmId = "";
  
    //
    // 1. アコーディオン開閉
    //
    document.querySelectorAll(".scene-toggle").forEach(btn => {
      const panel = document.getElementById(btn.dataset.target);
      btn.addEventListener("click", () => {
        panel.classList.toggle("open");
      });
    });
  
    //
    // 2. 概要リンクで章を開く
    //
    document.querySelectorAll(".replay-nav a").forEach(link => {
      const tgt = link.getAttribute("href");
      if (tgt.startsWith("#panel-")) {
        link.addEventListener("click", e => {
          e.preventDefault();
          const panel = document.querySelector(tgt);
          if (panel) {
            panel.classList.add("open");
            panel.scrollIntoView({ behavior: "smooth" });
          }
        });
      }
    });
  
    //
    // 3. 検索フィルタ
    //
    document.querySelectorAll(".scene-filter").forEach(input => {
      const list = input.closest(".scene-panel").querySelector(".scene-list");
      input.addEventListener("input", () => {
        const f = input.value.trim().toLowerCase();
        list.querySelectorAll("li").forEach(li => {
          li.style.display = (!f || li.textContent.toLowerCase().includes(f)) ? "" : "none";
        });
      });
    });
  
    //
    // 4. シーンリンククリック → モーダル表示＆BGM IDをセット
    //
    document.querySelectorAll(".scene-list a").forEach(link => {
      link.addEventListener("click", e => {
        e.preventDefault();
        const sceneId = link.dataset.scene;
        const art     = document.getElementById(sceneId);
        if (!art) return;
  
        // タイトル
        titleEl.textContent = art.querySelector("h3").textContent;
  
        // 本文（<h3>タグ部分を除去）
        const html = art.innerHTML.replace(/<h3[\s\S]*?<\/h3>/, "");
        bodyEl.innerHTML = html;
  
        // BGM用動画ID抽出
        const shareUrl = art.dataset.bgmUrl || "";
        let vidId = "";
        if (shareUrl.includes("youtu.be/")) {
          vidId = shareUrl.split("youtu.be/")[1];
        } else if (shareUrl.includes("watch?v=")) {
          vidId = shareUrl.split("watch?v=")[1].split("&")[0];
        }
        currentBgmId = vidId;
        bgmBtn.textContent = "▶︎ BGM";
        player.src = "";
  
        // モーダル背景
        const bg        = art.dataset.bgImage;
        const popupCont = popup.querySelector(".popup-content");
        if (bg) {
          popupCont.style.backgroundImage    = bg;
          popupCont.style.backgroundSize     = "cover";
          popupCont.style.backgroundPosition = "center";
        } else {
          popupCont.style.backgroundImage = "none";
        }
  
        // モーダル表示
        popup.classList.add("visible");
      });
    });
  
    //
    // 5. BGM 再生／ループ切り替え
    //
    bgmBtn.addEventListener("click", () => {
      if (!currentBgmId) return;
      const embedUrl =
        `https://www.youtube.com/embed/${currentBgmId}` +
        `?autoplay=1` +
        `&loop=1` +
        `&playlist=${currentBgmId}` +
        `&rel=0`;
      if (player.src.includes(currentBgmId)) {
        player.src = "";
        bgmBtn.textContent = "▶︎ BGM";
      } else {
        player.src = embedUrl;
        bgmBtn.textContent = "⏸︎ BGM";
      }
    });
  
    //
    // 6. モーダルを閉じる
    //
    const closeModal = () => {
      popup.classList.remove("visible");
      bodyEl.innerHTML = "";
      player.src = "";
      currentBgmId = "";
    };
    closeBtn.addEventListener("click", closeModal);
    popup.addEventListener("click", e => {
      if (e.target === popup) closeModal();
    });
  });
  