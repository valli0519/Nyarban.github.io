(() => {
  "use strict";

  const scenes = [
    {
      number: "01",
      title: "エルツ山のゴブリン退治",
      summary: "全てを奪われ故郷を失った剣士クラウドと、あてどない好奇心で旅に出たエルフの魔法使いフリーレンが、秘薬の霊峰エルツ山で運命の出会いを果たす。ここから二人の旅——そして世界の歯車——が静かに廻り始める。",
      first: "img/scroll-lv1-2nd/01-mountain.webp",
      last: "img/scroll-lv1-2nd/02-crystal-tree.webp",
      target: "panel-chapter1",
    },
    {
      number: "02",
      title: "商業都市メルゼン",
      summary: "路銀稼ぎに訪れた運河の商業都市メルゼンで、クラウドとフリーレンは闇の組織の影を嗅ぎつける。ギルドの試験をくぐり抜けながら、港に巣食う人攫い組織との決戦へ。そしてある出会いが、パーティの形を変えていく。",
      first: "img/scroll-lv1-2nd/03-tavern.webp",
      last: "img/scroll-lv1-2nd/04-pirate-battle.webp",
      target: "panel-chapter2",
    },
    {
      number: "03",
      title: "目指せホーヴァルロード島",
      summary: "四人が揃い、北上の旅が本格的に動き出す。アレスタ港からフロルブリッジ号に乗り込み、島へと向かう一行の前に次々と難敵が立ちはだかる。諸島を渡るこの航路が、パーティの絆を鍛え直す試練となる。",
      first: "img/scroll-lv1-2nd/05-harbor.webp",
      last: "img/scroll-lv1-2nd/06-kraken.webp",
      target: "panel-chapter3",
    },
    {
      number: "04",
      title: "海神伝説",
      summary: "ホーヴァルロード島に古くから伝わる海神の神話。信仰と祟りと秘密が複雑に絡み合う島の深部へ、一行は否応なく引き込まれていく。サンズガルド山の頂で待ち受ける真実が、世界の広さを四人に突きつける。",
      first: "img/scroll-lv1-2nd/07-guild.webp",
      last: "img/scroll-lv1-2nd/08-descent.webp",
      target: "panel-chapter4",
    },
    {
      number: "05",
      title: "闇を駆ける",
      summary: "トワド諸島の二つ目の島、鉱山の島センドルイス。平穏を装った街の底に隠された炭鉱支配と孤児院の暗部——一行はその真相を暴くべく、泥と闇の中を疾駆する。センドアルスの神殿都市で物語は次の幕へと接続する。",
      first: "img/cinematic-scenes/lv1_2nd/ch05-01-night-flight.webp",
      last: "img/cinematic-scenes/lv1_2nd/ch05-03-ritual.webp",
      target: "panel-chapter5",
    },
    {
      number: "06",
      title: "アルダニスの決戦",
      summary: "神殿都市を越え、一行は大陸都市アルダニスへ。歓楽街、闘技場、舞踏会が華やぐ一方、その裏では陰謀が幾重にも絡み合う。翼竜の襲来を退け、大闘技大会を勝ち抜いた先で、新たな仲間と次なる戦いへの旗が上がる。",
      first: "img/cinematic-scenes/lv1_2nd/ch06-01-grand-arena.webp",
      last: "img/cinematic-scenes/lv1_2nd/ch06-03-victory.webp",
      target: "panel-chapter7",
    },
    {
      number: "6.5",
      title: "東方編",
      summary: "オオドとウツミヤを巡り、人と半妖の間に横たわる境界へ踏み込む東方の旅。桃都を襲う百鬼夜行との戦いを経て、敵味方を隔てていた線がほどけていく。最後に残るのは、花火の下で結び直された縁と笑顔だった。",
      first: "img/cinematic-scenes/lv1_2nd/ch065-01-peach-city.webp",
      last: "img/cinematic-scenes/lv1_2nd/ch065-03-fireworks.webp",
      target: "panel-chapter8",
    },
    {
      number: "07",
      title: "祖竜聖杯戦争　約束の刻来たれり",
      summary: "聖杯を巡り、国家と勢力が激突する大戦争。舞台は白亜の王城を擁する大都市ログレス。祖竜ティアマト、魔女モルガン、円卓の騎士たちが交錯する中、クラウドたちは竜骸の回廊へ挑む。喪失と誓いの果てに、帰る場所を取り戻す。",
      first: "img/cinematic-scenes/lv1_2nd/ch07-01-star-splitting-sword.webp",
      last: "img/cinematic-scenes/lv1_2nd/ch07-03-homecoming.webp",
      target: "panel-chapter9",
    },
    {
      number: "08",
      title: "葬送歌 ～冒涜の旅路～　第一幕『遺跡都市の誘惑』",
      summary: "聖杯戦争後、名ばかりの停戦協定の裏でグランフェルデンの凶行を追う一行は、魔導車を駆って遺跡都市ラクレールへ。Lv1装備に身を落として潜入し、水売りの少年を手掛かりに街の地下へ踏み込む。陽動、救出、爆弾処理——保音機に残された真実を携え、夜の焚き火で束の間の息をつく。",
      first: "img/cinematic-scenes/lv1_2nd/ch08-forward-v6/shot01-start.webp",
      last: "img/cinematic-scenes/lv1_2nd/ch08-forward-v6/shot02-end.webp",
      target: "panel-chapter11-group-1",
    },
    {
      number: "08-II",
      title: "葬送歌 ～冒涜の旅路～　第二幕『水上の審問者』",
      summary: "ラクレールを発った一行は、身分も姿も魔法で偽り、河港から水上審問都市クラン＝ベルへ。白い石造りの街と青い水路、ゴンドラの舟歌に迎えられるが、平穏な水面の下には王女失踪と国王裁判の影が漂う。観光のような街歩きは、やがて水都の秩序を揺るがす審問へつながっていく。",
      first: "img/cinematic-scenes/lv1_2nd/ch08-act2-clanbell-water-city-start.webp",
      last: "img/cinematic-scenes/lv1_2nd/ch08-act2-clanbell-water-city-end.webp",
      target: "panel-chapter11-group-2",
    },
  ];

  const section = document.getElementById("replay-header");
  const stage = document.getElementById("lv1-journey-stage");
  const currentImage = document.getElementById("lv1-journey-current");
  const nextImage = document.getElementById("lv1-journey-next");
  const chapterNumber = document.getElementById("lv1-journey-chapter-number");
  const chapterTitle = document.getElementById("lv1-journey-chapter-title");
  const chapterSummary = document.getElementById("lv1-journey-summary");
  const chapterLink = document.getElementById("lv1-journey-chapter-link");
  const campaignCard = section ? section.querySelector(".campaign-card") : null;
  const motionToggle = section ? section.querySelector("[data-cinematic-motion-toggle]") : null;
  const scrollLabel = section ? section.querySelector(".lv1-journey-scroll span") : null;
  const frameNumber = document.getElementById("lv1-journey-frame-number");
  const railButtons = Array.from(document.querySelectorAll("[data-lv1-chapter]"));
  const videos = scenes.map((_scene, index) => document.querySelector(`[data-lv1-clip="${index}"]`));

  if (
    !section ||
    !stage ||
    !currentImage ||
    !nextImage ||
    !chapterNumber ||
    !chapterTitle ||
    !chapterSummary ||
    !campaignCard ||
    !frameNumber
  ) {
    return;
  }

  section.style.setProperty("--lv1-scroll-height", `${scenes.length * 130}vh`);
  section.style.setProperty("--lv1-scroll-height-mobile", `${scenes.length * 104}vh`);

  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
  const smoothstep = (value) => {
    const t = clamp(value);
    return t * t * (3 - 2 * t);
  };

  const motionPreferenceKey = "nyarban.cinematic-motion";
  const motionQuery = typeof window.matchMedia === "function"
    ? window.matchMedia("(prefers-reduced-motion: reduce)")
    : null;
  const videoState = videos.map((video) => ({
    video,
    duration: 5.166,
    current: 0,
    target: 0,
    ready: false,
    failed: !video,
    promoted: false,
  }));

  let storedMotionPreference = null;
  try {
    const storedValue = window.localStorage.getItem(motionPreferenceKey);
    if (storedValue === "enabled" || storedValue === "reduced") {
      storedMotionPreference = storedValue;
    }
  } catch (_error) {
    // Storage can be unavailable in private browsing or local-file contexts.
  }

  let motionEnabled = false;
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
    if (chapterLink) {
      chapterLink.href = `#${scene.target}`;
      chapterLink.dataset.lv1Target = scene.target;
      chapterLink.setAttribute("aria-label", `${scene.title}のシーン一覧を見る`);
    }
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
    if (!state || !state.video || state.promoted || state.failed) return;
    state.promoted = true;
    state.video.preload = "auto";
    try {
      const preparation = window.ReplayCinematicMedia
        ? window.ReplayCinematicMedia.prepare(state.video)
        : Promise.resolve(state.video.load());
      preparation.catch(() => {
        state.failed = true;
        updateMotionUI();
      });
    } catch (_error) {
      state.failed = true;
      updateMotionUI();
    }
  };

  const getScrollY = () => window.scrollY || window.pageYOffset || 0;

  const measure = () => {
    sectionTop = section.offsetTop;
    scrollDistance = Math.max(1, section.offsetHeight - window.innerHeight);
  };

  const render = () => {
    renderQueued = false;
    if (!motionEnabled) return;

    const progress = clamp((getScrollY() - sectionTop) / scrollDistance);
    const exact = progress * scenes.length;
    const segment = Math.min(scenes.length - 1, Math.floor(exact));
    const local = segment === scenes.length - 1 ? clamp(exact - segment) : exact - segment;
    const nextSegment = Math.min(segment + 1, scenes.length - 1);
    const crossfade = segment < scenes.length - 1 ? smoothstep((local - 0.88) / 0.12) : 0;

    renderFallback(segment, local);
    promoteVideo(segment);
    promoteVideo(nextSegment);

    const segmentState = videoState[segment];
    const nextSegmentState = videoState[nextSegment];
    const segmentReady = Boolean(segmentState && segmentState.video && segmentState.ready && !segmentState.failed);
    const nextSegmentReady = Boolean(nextSegmentState && nextSegmentState.video && nextSegmentState.ready && !nextSegmentState.failed);

    videoState.forEach((state, index) => {
      state.target = index < segment ? 1 : index === segment ? local : 0;
      if (state.video && state.ready && !state.failed) {
        const lastFrame = Math.max(0, state.duration - 1 / 24);
        const destination = state.target * lastFrame;
        state.current = destination;
        if (Math.abs(state.video.currentTime - destination) > 1 / 48) {
          try {
            state.video.currentTime = destination;
          } catch (_error) {
            // The loadeddata handler retries after a metadata race.
          }
        }
      }
      let opacity = 0;
      if (segmentReady) {
        if (index === segment) opacity = nextSegmentReady ? 1 - crossfade : 1;
        if (index === nextSegment && nextSegment !== segment && nextSegmentReady) {
          opacity = crossfade;
        }
      }
      if (state.video) state.video.style.opacity = opacity.toFixed(4);
    });

    stage.classList.toggle("is-video-active", segmentReady);
    section.style.setProperty("--lv1-progress", progress.toFixed(4));
    updateLabels(crossfade >= 0.5 ? nextSegment : segment);
  };

  const requestRender = () => {
    if (!motionEnabled || renderQueued) return;
    renderQueued = true;
    window.requestAnimationFrame(render);
  };

  const updateMotionUI = () => {
    const hasMediaFallback = videoState.some((state) => state.failed);
    section.classList.toggle("has-media-fallback", hasMediaFallback);
    section.dataset.motion = motionEnabled ? "enabled" : "reduced";

    if (scrollLabel) {
      scrollLabel.textContent = motionEnabled ? "SCROLL TO JOURNEY" : "MOTION REDUCED";
    }

    if (!motionToggle) return;
    const actionLabel = motionEnabled ? "映像演出をオフにする" : "映像演出を有効にする";
    const fallbackNote = hasMediaFallback
      ? " 一部の動画は静止画のスクロール演出で表示します。"
      : "";
    motionToggle.hidden = false;
    motionToggle.textContent = motionEnabled ? "映像演出をOFF" : "映像演出をON";
    motionToggle.setAttribute("aria-pressed", String(motionEnabled));
    motionToggle.setAttribute("aria-label", actionLabel);
    motionToggle.title = motionEnabled
      ? `スクロール連動の映像演出は有効です。${fallbackNote}`
      : `動きを抑えた表示です。押すとスクロール連動の映像演出を有効にします。${fallbackNote}`;
  };

  const resetToStaticView = () => {
    stage.classList.remove("is-video-active");
    section.style.setProperty("--lv1-progress", "0");
    fallbackKey = "";
    currentImage.src = scenes[0].first;
    nextImage.src = scenes[0].last;
    currentImage.style.opacity = "1";
    currentImage.style.transform = "none";
    nextImage.style.opacity = "0";
    nextImage.style.transform = "none";
    videoState.forEach((state) => {
      if (state.video) state.video.style.opacity = "0";
    });
    activeChapter = -1;
    updateLabels(0);
  };

  const setMotionEnabled = (enabled, persistPreference) => {
    measure();
    const wasEnabled = motionEnabled;
    const currentScroll = getScrollY();
    const isInsideJourney = currentScroll > sectionTop && currentScroll < sectionTop + section.offsetHeight;

    if (wasEnabled && !enabled && isInsideJourney) {
      window.scrollTo(0, sectionTop);
    }

    motionEnabled = Boolean(enabled);
    document.body.classList.toggle("lv1-motion-enabled", motionEnabled);
    document.body.classList.toggle("lv1-motion-reduced", !motionEnabled);
    section.classList.toggle("is-enhanced", motionEnabled);

    if (persistPreference) {
      storedMotionPreference = motionEnabled ? "enabled" : "reduced";
      try {
        window.localStorage.setItem(motionPreferenceKey, storedMotionPreference);
      } catch (_error) {
        // The in-page choice still applies for this visit when storage is blocked.
      }
    }

    updateMotionUI();
    if (motionEnabled) {
      measure();
      promoteVideo(0);
      render();
    } else {
      resetToStaticView();
      measure();
    }
  };

  const jumpToChapter = (chapterIndex) => {
    if (!scenes[chapterIndex]) return;
    const progress = chapterIndex / scenes.length;
    window.scrollTo({
      top: sectionTop + progress * scrollDistance,
      behavior: motionEnabled ? "smooth" : "auto",
    });
  };

  railButtons.forEach((button) => {
    button.addEventListener("click", () => {
      jumpToChapter(Number(button.dataset.lv1Chapter));
    });
  });

  const revealReplayTarget = (targetId) => {
    const target = document.getElementById(targetId);
    if (!target) return false;

    const chapterPanel = target.classList.contains("scene-panel")
      ? target
      : target.closest(".scene-panel");
    if (chapterPanel) {
      chapterPanel.classList.add("open");
      const chapterToggle = document.querySelector(`.scene-toggle[data-target="${chapterPanel.id}"]`);
      if (chapterToggle) chapterToggle.setAttribute("aria-expanded", "true");
    }

    const groupPanel = target.classList.contains("scene-group-panel")
      ? target
      : target.closest(".scene-group-panel");
    if (groupPanel) {
      groupPanel.hidden = false;
      const groupToggle = document.querySelector(`.scene-group-toggle[data-target="${groupPanel.id}"]`);
      if (groupToggle) groupToggle.setAttribute("aria-expanded", "true");
    }

    const scrollTarget = groupPanel ? groupPanel.closest(".scene-group") : chapterPanel || target;
    scrollTarget.scrollIntoView({
      behavior: motionEnabled ? "smooth" : "auto",
      block: "start",
    });
    if (window.history && typeof window.history.pushState === "function") {
      try {
        window.history.pushState(null, "", `#${targetId}`);
      } catch (_error) {
        window.location.hash = targetId;
      }
    }
    return true;
  };

  if (chapterLink) {
    chapterLink.addEventListener("click", (event) => {
      const targetId = chapterLink.dataset.lv1Target;
      if (!targetId) return;
      event.preventDefault();
      if (!revealReplayTarget(targetId)) {
        window.location.hash = targetId;
      }
    });
  }

  videoState.forEach((state) => {
    if (!state.video) return;

    const markMetadata = () => {
      if (typeof state.video.duration === "number" && isFinite(state.video.duration) && state.video.duration > 0) {
        state.duration = state.video.duration;
      }
      requestRender();
    };
    const markReady = () => {
      markMetadata();
      state.ready = true;
      state.failed = false;
      state.video.pause();
      updateMotionUI();
      requestRender();
    };

    state.video.muted = true;
    state.video.defaultMuted = true;
    state.video.playsInline = true;
    state.video.setAttribute("muted", "");
    state.video.setAttribute("playsinline", "");
    state.video.addEventListener("loadedmetadata", markMetadata);
    state.video.addEventListener("loadeddata", markReady);
    state.video.addEventListener("canplay", markReady);
    state.video.addEventListener("error", () => {
      state.failed = true;
      state.ready = false;
      state.video.style.opacity = "0";
      updateMotionUI();
      requestRender();
    });

    const haveCurrentData = typeof HTMLMediaElement === "undefined"
      ? 2
      : HTMLMediaElement.HAVE_CURRENT_DATA;
    if (state.video.readyState >= haveCurrentData) markReady();
  });

  window.addEventListener("scroll", requestRender, { passive: true });
  window.addEventListener("resize", () => {
    measure();
    requestRender();
  });
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) requestRender();
  });

  if (motionToggle) {
    motionToggle.addEventListener("click", () => {
      setMotionEnabled(!motionEnabled, true);
    });
  }

  const handleSystemMotionChange = (event) => {
    if (storedMotionPreference === null) {
      setMotionEnabled(!event.matches, false);
    }
  };
  if (motionQuery) {
    if (typeof motionQuery.addEventListener === "function") {
      motionQuery.addEventListener("change", handleSystemMotionChange);
    } else if (typeof motionQuery.addListener === "function") {
      motionQuery.addListener(handleSystemMotionChange);
    }
  }

  const systemRequestsReducedMotion = Boolean(motionQuery && motionQuery.matches);
  const initialMotionEnabled = storedMotionPreference === "enabled"
    || (storedMotionPreference === null && !systemRequestsReducedMotion);
  setMotionEnabled(initialMotionEnabled, false);
})();
