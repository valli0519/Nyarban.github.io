// ウマ娘世界編のスクロール動画。lv1-scroll.js と同じ仕組みで、scenes だけ差し替えている。
// 生成元: _umamusume_work/work/video/build_scroll_page.py（手で直さず、スクリプトを直すこと）
(() => {
  "use strict";

  const scenes = [
    {
      number: "01",
      title: "序幕：しっとりテイオー事変",
      summary: "温泉旅行のあと、アーサーはオルガのもとへ。ひとりでは抱えきれない相談があるらしい。",
      first: "img/cinematic-scenes/umamusume/scroll/opening-01.webp",
      last: "img/cinematic-scenes/umamusume/scroll/opening-03.webp",
      target: "panel-uma-opening",
    },
    {
      number: "02",
      title: "URAうまぴょい伝説宣伝編",
      summary: "URAの知名度を上げるため、トレーナー達はモールでイベントを開催することになった──",
      first: "img/cinematic-scenes/umamusume/scroll/ura_publicity-01.webp",
      last: "img/cinematic-scenes/umamusume/scroll/ura_publicity-03.webp",
      target: "panel-uma-ura",
    },
    {
      number: "03",
      title: "アーサー初来校編（前日譚）",
      summary: "新人トレーナーのアーサーが、幻月とオルガへ挨拶にやって来る。初めて会うはずの相手に、なぜか覚えがある。",
      first: "img/cinematic-scenes/umamusume/scroll/arthur_arrival-01.webp",
      last: "img/cinematic-scenes/umamusume/scroll/arthur_arrival-03.webp",
      target: "panel-uma-arrival",
    },
    {
      number: "04",
      title: "アイドルウマ娘編",
      summary: "売れっ子ウマドル四人を一週間で鍛え、テレビの無茶ぶりごと舞台へ送り出す。夕暮れの並木道を歩く四人から、アイドルウマ娘編は始まる。",
      first: "img/cinematic-scenes/umamusume/scroll/idol-01.webp",
      last: "img/cinematic-scenes/umamusume/scroll/idol-03.webp",
      target: "panel-uma-idol",
    },
    {
      number: "05",
      title: "アリーヌ来日編",
      summary: "府中で出会った迷子は、ブロワイエのトレーナー。アーサーが求めた答えは、凱旋門賞の先へ預けられる。",
      first: "img/cinematic-scenes/umamusume/scroll/france_visit-01.webp",
      last: "img/cinematic-scenes/umamusume/scroll/france_visit-03.webp",
      target: "panel-uma-france",
    },
    {
      number: "06",
      title: "温泉サバイバル編",
      summary: "ご褒美の旅は千尋温泉へ。偶然の合流は重なり、部屋割りから卓球まで、休暇にも負けられない勝負が待っている。",
      first: "img/cinematic-scenes/umamusume/scroll/onsen_survival-01.webp",
      last: "img/cinematic-scenes/umamusume/scroll/onsen_survival-03.webp",
      target: "panel-uma-onsen",
    },
    {
      number: "07",
      title: "球技大会編",
      summary: "チームの予算を懸け、トレーナーたちが球技大会で競い合う。大会後の別日には、新人を交えて仕事や暮らしを語り合う。",
      first: "img/cinematic-scenes/umamusume/scroll/ballgame-01.webp",
      last: "img/cinematic-scenes/umamusume/scroll/ballgame-03.webp",
      target: "panel-uma-ballgame-afterword",
    },
    {
      number: "08",
      title: "SAO編",
      summary: "新しいゲームの安全確認が、百層を踏破する脱出行へ変わる。帰りを待つ仲間と街を守る人々のため、攻略の足は止まらない。",
      first: "img/cinematic-scenes/umamusume/scroll/sao-01.webp",
      last: "img/cinematic-scenes/umamusume/scroll/sao-03.webp",
      target: "panel-uma-sao",
    },
    {
      number: "09",
      title: "プロトコンプレックス編",
      summary: "連休前の依頼が、白い地下都市へ三人を招く。幸福を義務づける国で社員証を手にした彼らは、仕事も身分も命がけの日々へ踏み込んでいく。",
      first: "img/cinematic-scenes/umamusume/scroll/protcomplex-01.webp",
      last: "img/cinematic-scenes/umamusume/scroll/protcomplex-03.webp",
      target: "panel-uma-protcomplex",
    },
    {
      number: "10",
      title: "一方その頃編",
      summary: "三人が何も告げずに渡米した日の夕方。日本に残されたV2は、引き出しの奥に遺書を見つける。学園にはオルガと同じジャケットの中尉が現れ、トレーナーたちの夜は掃除と身の上話で更けていく。",
      first: "img/cinematic-scenes/umamusume/scroll/meanwhile_home-01.webp",
      last: "img/cinematic-scenes/umamusume/scroll/meanwhile_home-03.webp",
      target: "panel-uma-c-meanwhile",
    },
    {
      number: "11",
      title: "一週間バンド編",
      summary: "一週間後のライブへ向け、四人のトレーナーがバンドを組む。名前を決めたら楽器選び、そして初めての合奏へ。音が重なる楽しさに、練習の夜も短くなる。",
      first: "img/cinematic-scenes/umamusume/scroll/band-01.webp",
      last: "img/cinematic-scenes/umamusume/scroll/band-03.webp",
      target: "panel-uma-a-band",
    },
    {
      number: "12",
      title: "夏合宿編",
      summary: "ライブ翌朝から始まる夏合宿。賑やかな道中の先で幻月が姿を消し、アーサーとオルガは救出へ向かう。残った仲間たちも、それぞれの場所で帰還を待つ。",
      first: "img/cinematic-scenes/umamusume/scroll/summer_camp-01.webp",
      last: "img/cinematic-scenes/umamusume/scroll/summer_camp-03.webp",
      target: "panel-uma-a-summer-camp",
    },
    {
      number: "13",
      title: "ニトリ・新生活編",
      summary: "クイーンを迎えた一行は、ニトリで新居の家具を選ぶ。引っ越しを終えた家に仲間が集まり、姉妹との暮らしや、それぞれの家族について話す。",
      first: "img/cinematic-scenes/umamusume/scroll/new_life-01.webp",
      last: "img/cinematic-scenes/umamusume/scroll/new_life-03.webp",
      target: "panel-uma-new-life",
    },
    {
      number: "14",
      title: "私服ランウェイ編",
      summary: "ライブの最終打ち合わせと聞いて、青星の庭の四人が番組の会場へ来る。待っていたのは、芸能人たちとの私服ファッション対決だった。",
      first: "img/cinematic-scenes/umamusume/scroll/casual_runway-01.webp",
      last: "img/cinematic-scenes/umamusume/scroll/casual_runway-03.webp",
      target: "panel-uma-casual-runway",
    },
    {
      number: "15",
      title: "シルバーウィークのデート編",
      summary: "シルバーウィークに、アリーヌが幻月を訪ねて来る。二人は仲間と街を歩き、食べ歩きや遊びを楽しむ。",
      first: "img/cinematic-scenes/umamusume/scroll/silver_week_date-01.webp",
      last: "img/cinematic-scenes/umamusume/scroll/silver_week_date-03.webp",
      target: "panel-uma-silver-week-date",
    },
    {
      number: "16",
      title: "ウルトラマンZ IF編",
      summary: "甘い休日を裂いて、渋谷に怪獣が現れる。オルガはウルトラマンZと命をつなぎ、街を守る巨人になる。",
      first: "img/cinematic-scenes/umamusume/scroll/ultraman_z_if-01.webp",
      last: "img/cinematic-scenes/umamusume/scroll/ultraman_z_if-03.webp",
      target: "panel-uma-ultraman-z-if",
    },
    {
      number: "17",
      title: "新メンバー歓迎編",
      summary: "鉄華団の新人タイシンと、アーサーのチームに加わったシービー。顔合わせはカラオケへ、さらに自宅のゲームと鍋へと広がる。",
      first: "img/cinematic-scenes/umamusume/scroll/new_member_welcome-01.webp",
      last: "img/cinematic-scenes/umamusume/scroll/new_member_welcome-03.webp",
      target: "panel-uma-new-member-welcome",
    },
    {
      number: "18",
      title: "ある日のルブラン編",
      summary: "十一月下旬のルブランに、常連も意外な客も顔を出す。働くアーサーの一日は、珈琲と世間話で過ぎていく。",
      first: "img/cinematic-scenes/umamusume/scroll/leblanc_day-01.webp",
      last: "img/cinematic-scenes/umamusume/scroll/leblanc_day-03.webp",
      target: "panel-uma-leblanc-day",
    },
    {
      number: "19",
      title: "昼下がりの相席編",
      summary: "満席の喫茶店で、カフェ、ブルボン、マヤノ、V2が相席になる。競走の夢を語るはずが、恋の悩みも止まらなくなった。",
      first: "img/cinematic-scenes/umamusume/scroll/cafe_afternoon-01.webp",
      last: "img/cinematic-scenes/umamusume/scroll/cafe_afternoon-03.webp",
      target: "panel-uma-cafe-afternoon",
    },
    {
      number: "20",
      title: "大学受験編",
      summary: "午前四時の思いつきから、二人の東大受験が始まった。見学、勉強、試験を越えて迎える春も、祝杯だけでは終わらない。",
      first: "img/cinematic-scenes/umamusume/scroll/university_exam-01.webp",
      last: "img/cinematic-scenes/umamusume/scroll/university_exam-03.webp",
      target: "panel-uma-university-exam",
    },
    {
      number: "21",
      title: "英国デビュタント編",
      summary: "UVの社交界デビューを祝いに、舞台はキャメロットへ。華やかな衣装と笑顔の裏で、王族と騎士たちは迫る襲撃に備えていた。",
      first: "img/cinematic-scenes/umamusume/scroll/uk_debutant-01.webp",
      last: "img/cinematic-scenes/umamusume/scroll/uk_debutant-03.webp",
      target: "panel-uma-uk-debutant",
    },
    {
      number: "22",
      title: "オルガ出産編",
      summary: "V2の陣痛に、仲間たちが病院へ駆けつける。長い待ち時間を越え、オルガは父親として最初の言葉を娘へ贈る。",
      first: "img/cinematic-scenes/umamusume/scroll/orga_birth-01.webp",
      last: "img/cinematic-scenes/umamusume/scroll/orga_birth-03.webp",
      target: "panel-uma-orga-birth",
    },
    {
      number: "23",
      title: "魔法指輪編",
      summary: "科学で指輪を調べたいUVと、早く魔法を試したいマーリン。実験の先には、何でも知っている本棚と、知られたくなかった秘密が待っていた。",
      first: "img/cinematic-scenes/umamusume/scroll/magic_ring-01.webp",
      last: "img/cinematic-scenes/umamusume/scroll/magic_ring-03.webp",
      target: "panel-uma-magic-ring",
    },
    {
      number: "24",
      title: "アンダーワールド編",
      summary: "リリィたちが戦争を生き抜いた前日譚から、仲間の消失を追う救助行へ。アーサーたちは、知っている世界によく似た異世界へ足を踏み入れる。",
      first: "img/cinematic-scenes/umamusume/scroll/underworld-01.webp",
      last: "img/cinematic-scenes/umamusume/scroll/underworld-03.webp",
      target: "panel-uma-b-uw-lily",
    },
    {
      number: "25",
      title: "無人島編",
      summary: "休暇の命令は、一週間の無人島生活だった。撮影機材だけを持った一行が、海で魚を捕り、島の材料で住まいを作る。頼れる先輩たちといても、初日は驚くことばかり。",
      first: "img/cinematic-scenes/umamusume/scroll/island_survival-01.webp",
      last: "img/cinematic-scenes/umamusume/scroll/island_survival-03.webp",
      target: "panel-uma-island",
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
