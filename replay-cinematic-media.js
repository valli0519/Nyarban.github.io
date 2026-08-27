(() => {
  "use strict";

  if (window.ReplayCinematicMedia) return;

  let rangeSupport = null;
  const preparations = new WeakMap();
  const objectUrls = new Set();

  const loadNatively = (video, delivery) => {
    if (!video.isConnected) return delivery;
    video.dataset.cinematicDelivery = delivery;
    video.preload = "auto";
    video.load();
    return delivery;
  };

  /**
   * Cloudflare Static Assets がRangeを返さない場合は、動画全体をBlobとして
   * 一度だけ取得する。Blob URLならブラウザ内で確実にシークできるため、
   * スクロール位置と動画フレームの同期を保てる。
   */
  const prepare = (video) => {
    if (!video) return Promise.resolve("missing");
    const existing = preparations.get(video);
    if (existing) return existing;

    const source = video.getAttribute("src") || video.currentSrc;
    const sourceUrl = source ? new URL(source, document.baseURI) : null;
    video.dataset.cinematicDelivery = "preparing";
    video.preload = "auto";

    const preparation = (async () => {
      if (
        !sourceUrl
        || !/^https?:$/.test(sourceUrl.protocol)
        || sourceUrl.origin !== window.location.origin
        || typeof window.fetch !== "function"
      ) {
        return loadNatively(video, "native");
      }

      try {
        if (rangeSupport === true) return loadNatively(video, "native-range");

        let response = await window.fetch(sourceUrl.href, {
          cache: "force-cache",
          headers: rangeSupport === null ? { Range: "bytes=0-0" } : undefined,
        });

        const supportsByteRanges = response.status === 206
          && /^bytes\s+0-0\/\d+$/i.test(response.headers.get("content-range") || "")
          && /\bbytes\b/i.test(response.headers.get("accept-ranges") || "");
        if (supportsByteRanges) {
          rangeSupport = true;
          if (response.body && typeof response.body.cancel === "function") {
            await response.body.cancel();
          }
          return loadNatively(video, "native-range");
        }

        if (response.status === 206) {
          if (response.body && typeof response.body.cancel === "function") {
            await response.body.cancel();
          }
          response = await window.fetch(sourceUrl.href, { cache: "force-cache" });
        }

        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        rangeSupport = false;
        const blob = await response.blob();
        if (!video.isConnected) return "detached";

        const objectUrl = URL.createObjectURL(blob);
        objectUrls.add(objectUrl);
        video.dataset.cinematicOriginalSrc = sourceUrl.href;
        video.dataset.cinematicDelivery = "blob";
        video.src = objectUrl;
        video.load();
        return "blob";
      } catch (_error) {
        return loadNatively(video, "native-fallback");
      }
    })();

    preparations.set(video, preparation);
    return preparation;
  };

  window.addEventListener("pagehide", (event) => {
    if (event.persisted) return;
    objectUrls.forEach((url) => URL.revokeObjectURL(url));
    objectUrls.clear();
  });

  window.ReplayCinematicMedia = Object.freeze({ prepare });
})();
