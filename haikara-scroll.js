(() => {
  "use strict";

  const media = [
    {
      number: "01",
      chapterIndex: 0,
      fallbackTitle: "日常に潜む闇",
      fallbackSummary: "魔法都市アルカナの劣等生三人は、未知の感覚に導かれ『枢機の樹』の地下へ足を踏み入れる。",
      first: "img/cinematic-scenes/haikara/ch01-01-door.webp",
      last: "img/cinematic-scenes/haikara/ch01-03-awakening.webp",
    },
    {
      number: "02",
      chapterIndex: 1,
      fallbackTitle: "陰るアルカナ、中間考査。",
      fallbackSummary: "行方不明者が増える街で、ハイカラ部は中間考査に追われながらも自らの足で真相を追う。",
      first: "img/cinematic-scenes/haikara/ch02-01-lesson.webp",
      last: "img/cinematic-scenes/haikara/ch02-03-stakeout.webp",
    },
  ];

  const chapterData = Array.isArray(window.ALL_CHAPTERS) ? window.ALL_CHAPTERS : [];
  const scenes = media.map((item) => {
    const chapter = chapterData[item.chapterIndex] || {};
    return {
      ...item,
      title: String(chapter.chapterName || item.fallbackTitle).replace(/^第\d+章[：:]\s*/, ""),
      summary: chapter.summary || item.fallbackSummary,
    };
  });

  const section = document.getElementById("replay-header");
  const stage = document.getElementById("haikara-journey-stage");
  const currentImage = document.getElementById("haikara-journey-current");
  const nextImage = document.getElementById("haikara-journey-next");
  const chapterNumber = document.getElementById("haikara-journey-chapter-number");
  const chapterTitle = document.getElementById("haikara-journey-chapter-title");
  const chapterSummary = document.getElementById("haikara-journey-summary");
  const campaignCard = section?.querySelector(".campaign-card");
  const frameNumber = document.getElementById("haikara-journey-frame-number");
  const railButtons = Array.from(document.querySelectorAll("[data-haikara-chapter]"));
  const videos = Array.from(document.querySelectorAll("[data-haikara-clip]"));

  if (
    !section ||
    !stage ||
    !currentImage ||
    !nextImage ||
    !chapterNumber ||
    !chapterTitle ||
    !chapterSummary ||
    !campaignCard ||
    !frameNumber ||
    videos.length !== scenes.length
  ) {
    return;
  }

  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
  const smoothstep = (value) => {
    const t = clamp(value);
    return t * t * (3 - 2 * t);
  };

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const videoState = videos.map((video, index) => ({
    video,
    duration: 10.333,
    current: 0,
    target: 0,
    ready: false,
    failed: false,
    promoted: index === 0,
  }));

  let activeChapter = -1;
  let fallbackKey = "";
  let sectionTop = 0;
  let scrollDistance = 1;
  let renderQueued = false;
  let labelTransitionTimer = 0;

  const setFallback = (from, to, blend, local) => {
    const key = `${from}|${to}`;
    if (fallbackKey !== key) {
      fallbackKey = key;
      currentImage.src = from;
      nextImage.src = to;
    }

    currentImage.style.opacity = String(1 - blend);
    currentImage.style.transform = `translate3d(${-0.7 * local}%, ${0.24 * local}%, 0) scale(${1.035 + 0.055 * local})`;
    nextImage.style.opacity = String(blend);
    nextImage.style.transform = `translate3d(${0.24 * (1 - blend)}%, ${-0.18 * (1 - blend)}%, 0) scale(${1.025 + 0.025 * blend})`;
  };

  const renderFallback = (segment, local) => {
    const scene = scenes[segment];
    const nextScene = scenes[segment + 1];

    if (nextScene && local >= 0.78) {
      setFallback(scene.last, nextScene.first, smoothstep((local - 0.78) / 0.22), local);
      return;
    }

    const start = 0.12;
    const end = segment === scenes.length - 1 ? 0.9 : 0.75;
    setFallback(scene.first, scene.last, smoothstep((local - start) / (end - start)), local);
  };

  const updateLabels = (chapterIndex) => {
    if (activeChapter === chapterIndex) return;
    activeChapter = chapterIndex;
    const scene = scenes[chapterIndex];

    chapterNumber.textContent = scene.number;
    chapterTitle.textContent = scene.title;
    chapterSummary.textContent = scene.summary;
    frameNumber.textContent = scene.number;
    section.dataset.activeChapter = String(chapterIndex + 1);

    campaignCard.classList.remove("is-updating");
    void campaignCard.offsetWidth;
    campaignCard.classList.add("is-updating");
    window.clearTimeout(labelTransitionTimer);
    labelTransitionTimer = window.setTimeout(() => {
      campaignCard.classList.remove("is-updating");
    }, 520);

    railButtons.forEach((button, index) => {
      const isActive = index === chapterIndex;
      button.classList.toggle("is-active", isActive);
      if (isActive) {
        button.setAttribute("aria-current", "step");
      } else {
        button.removeAttribute("aria-current");
      }
    });
  };

  const promoteVideo = (index) => {
    const state = videoState[index];
    if (!state || state.promoted || state.failed) return;
    state.promoted = true;
    state.video.preload = "auto";
    state.video.load();
  };

  const measure = () => {
    sectionTop = section.offsetTop;
    scrollDistance = Math.max(1, section.offsetHeight - window.innerHeight);
  };

  const render = () => {
    renderQueued = false;
    const progress = clamp((window.scrollY - sectionTop) / scrollDistance);
    const exact = progress * scenes.length;
    const segment = Math.min(scenes.length - 1, Math.floor(exact));
    const local = segment === scenes.length - 1 ? clamp(exact - segment) : exact - segment;
    const nextSegment = Math.min(segment + 1, scenes.length - 1);
    const crossfade = segment < scenes.length - 1 ? smoothstep((local - 0.88) / 0.12) : 0;

    renderFallback(segment, local);
    promoteVideo(segment);
    promoteVideo(nextSegment);

    videoState.forEach((state, index) => {
      state.target = index < segment ? 1 : index === segment ? local : 0;
      if (state.ready && !state.failed) {
        const lastFrame = Math.max(0, state.duration - 1 / 24);
        const destination = state.target * lastFrame;
        state.current = destination;
        if (Math.abs(state.video.currentTime - destination) > 1 / 48) {
          try {
            state.video.currentTime = destination;
          } catch (_error) {
            // A loadeddata/canplay event retries after metadata races.
          }
        }
      }
      let opacity = 0;
      if (videoState[segment].ready) {
        if (index === segment) opacity = videoState[nextSegment].ready ? 1 - crossfade : 1;
        if (index === nextSegment && nextSegment !== segment && videoState[nextSegment].ready) {
          opacity = crossfade;
        }
      }
      state.video.style.opacity = opacity.toFixed(4);
    });

    stage.classList.toggle("is-video-active", videoState[segment].ready);
    section.style.setProperty("--lv1-progress", progress.toFixed(4));
    updateLabels(crossfade >= 0.5 ? nextSegment : segment);
  };

  const requestRender = () => {
    if (renderQueued) return;
    renderQueued = true;
    window.requestAnimationFrame(render);
  };

  const jumpToChapter = (chapterIndex) => {
    if (!scenes[chapterIndex]) return;
    const progress = chapterIndex / scenes.length;
    window.scrollTo({
      top: sectionTop + progress * scrollDistance,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  railButtons.forEach((button) => {
    button.addEventListener("click", () => {
      jumpToChapter(Number(button.dataset.haikaraChapter));
    });
  });

  if (prefersReducedMotion) {
    const scrollLabel = section.querySelector(".lv1-journey-scroll span");
    if (scrollLabel) scrollLabel.textContent = "MOTION REDUCED";
    currentImage.style.opacity = "1";
    currentImage.style.transform = "none";
    nextImage.style.opacity = "0";
    updateLabels(0);
    return;
  }

  videoState.forEach((state) => {
    const markMetadata = () => {
      if (Number.isFinite(state.video.duration) && state.video.duration > 0) {
        state.duration = state.video.duration;
      }
      requestRender();
    };
    const markReady = () => {
      markMetadata();
      state.ready = true;
      state.failed = false;
      state.video.pause();
      requestRender();
    };

    state.video.muted = true;
    state.video.playsInline = true;
    state.video.addEventListener("loadedmetadata", markMetadata);
    state.video.addEventListener("loadeddata", markReady);
    state.video.addEventListener("canplay", markReady);
    state.video.addEventListener("error", () => {
      state.failed = true;
      state.ready = false;
      state.video.style.opacity = "0";
      requestRender();
    });

    if (state.video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) markReady();
  });

  section.classList.add("is-enhanced");
  measure();
  render();

  window.addEventListener("scroll", requestRender, { passive: true });
  window.addEventListener("resize", () => {
    measure();
    requestRender();
  });
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) requestRender();
  });

  const preloadAll = () => videoState.forEach((_, index) => promoteVideo(index));
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(preloadAll, { timeout: 2800 });
  } else {
    window.setTimeout(preloadAll, 1200);
  }
})();
