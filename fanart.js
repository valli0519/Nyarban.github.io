document.addEventListener("DOMContentLoaded", () => {
  const gallery = document.getElementById("fanart-gallery");
  const modal = document.getElementById("fanart-modal");
  const modalImg = document.getElementById("fanart-modal-img");
  const closeBtn = document.querySelector(".fanart-modal-close");

  // 1. fanart_data.js で自動生成された fanartFiles のリストを使います
  if (gallery && typeof fanartFiles !== 'undefined') {
    fanartFiles.forEach(file => {
      // ★ 修正：画像を枠（div）で囲むことで、CSSで正方形に固定できるようにします
      const itemDiv = document.createElement("div");
      itemDiv.className = "gallery-item";

      const img = document.createElement("img");
      img.src = `img/fanart/${file}`;
      img.alt = "ファンアート";
      
      // ★ 修正：枠（div）をクリックしたときにモーダルを開くようにします
      itemDiv.addEventListener("click", () => {
        modal.style.display = "block";
        modalImg.src = img.src; // 拡大画像も同じソース
        document.body.style.overflow = "hidden"; // 公式サイトがスクロールしないように禁止
      });
      
      itemDiv.appendChild(img);
      gallery.appendChild(itemDiv);
    });

    if (fanartFiles.length === 0) {
      gallery.innerHTML = '<p style="color: #64748b; text-align: center; grid-column: 1 / -1; padding: 50px 0;">まだファンアートがありません……っ。</p>';
    }
  }

  // 2. モーダルを閉じる処理（共通化）
  const closeModal = () => {
    modal.style.display = "none";
    document.body.style.overflow = ""; // スクロールを再開
  };

  if (closeBtn) {
    closeBtn.addEventListener("click", closeModal);
  }
  
  // 背景部分、または画像自体をクリックしても閉じる（zoom-out）ようにします
  if (modal) {
    modal.addEventListener("click", (e) => {
      // 閉じるボタン以外をクリックした場合は閉じる
      if (e.target !== closeBtn) {
        closeModal();
      }
    });
  }
});