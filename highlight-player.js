// サーガ・ハイライト動画の再生準備。
// 公開版（Cloudflare）は1ファイル25MiB制限のためHLS（分割配信）で再生する。
// Safari はネイティブ再生、それ以外は hls.js を読み込む。ローカル表示（file:）では従来のmp4を使う。
(function () {
  const HLS_JS = "https://cdn.jsdelivr.net/npm/hls.js@1.5.20/dist/hls.min.js";
  let hlsLoader = null;

  function loadHlsJs() {
    if (window.Hls) return Promise.resolve(window.Hls);
    if (!hlsLoader) {
      hlsLoader = new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = HLS_JS;
        script.onload = () => resolve(window.Hls);
        script.onerror = () => reject(new Error("hls.js の読み込みに失敗しました"));
        document.head.appendChild(script);
      });
    }
    return hlsLoader;
  }

  function attach(video) {
    const hlsSrc = video.dataset.hls;
    const mp4Src = video.dataset.mp4;
    if (location.protocol === "file:" && mp4Src) {
      video.src = mp4Src;
      return;
    }
    if (!hlsSrc) return;
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = hlsSrc;
      return;
    }
    loadHlsJs().then((Hls) => {
      if (!Hls || !Hls.isSupported()) {
        if (mp4Src) video.src = mp4Src;
        return;
      }
      const hls = new Hls({ capLevelToPlayerSize: true });
      hls.loadSource(hlsSrc);
      hls.attachMedia(video);
    }).catch(() => {
      if (mp4Src) video.src = mp4Src;
    });
  }

  function init() {
    document.querySelectorAll("video[data-hls]").forEach((video) => {
      // 再生ボタンが押されるまで分割ファイルは読まない（preload=none 相当）
      let started = false;
      const start = () => {
        if (started) return;
        started = true;
        attach(video);
      };
      video.addEventListener("play", start, { once: true });
      video.addEventListener("click", start, { once: true });
      const observer = "IntersectionObserver" in window
        ? new IntersectionObserver((entries) => {
          if (entries.some((e) => e.isIntersecting)) { observer.disconnect(); start(); }
        }, { rootMargin: "400px" })
        : null;
      if (observer) observer.observe(video); else start();
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
