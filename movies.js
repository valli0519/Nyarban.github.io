document.addEventListener("DOMContentLoaded", function() {
    // 動画データ：各動画に名前とYouTube共有リンクを指定
    const videos = {
      "vid0": {
        name: "わすれもの",
        shareUrl: "https://youtu.be/uP2uKl8tI9w"
      },
      "vid1": {
        name: "ここはどこ？",
        shareUrl: "https://youtu.be/kbsksOGr8mY"
      },
      "vid2": {
        name: "罪の身代わり",
        shareUrl: "https://youtu.be/t9tY08cGcGI"
      },
    //   "vid3": {
    //     name: "牧場物語　予告",
    //     shareUrl: "https://youtu.be/xE5vMKj0x-g"
    //   },
      "vid4": {
        name: "籠島　導入",
        shareUrl: "https://youtu.be/AdYosXf1vIg"
      },
      "vid5": {
        name: "籠島 Part2",
        shareUrl: "https://youtu.be/Zkf4YwWT61k"
      },
      "vid6": {
        name: "稲荷村",
        shareUrl: "https://youtu.be/Vcuq8U5DC5c"
      },
      "vid7": {
        name: "行けば　前編",
        shareUrl: "https://youtu.be/5zQ6ITn2sMA"
      },
      "vid8": {
        name: "行けば　後編",
        shareUrl: "https://youtu.be/VnJdSOrDXmo"
      },
    //   "vid9": {
    //     name: "行けば　エピローグ",
    //     shareUrl: "https://youtu.be/nIavJfGlRig"
    //   },
    //   "vid10": {
    //     name: "ロアナプラ",
    //     shareUrl: "https://youtu.be/NT5VgxUPPcs"
    //   },
      "vid11": {
        name: "R type",
        shareUrl: "https://youtu.be/Gh93kg3RiwM"
      },
      "vid12": {
        name: "アズマ病院 PART1",
        shareUrl: "https://youtu.be/zEgQxCuyMcc"
      },
      "vid13": {
        name: "止まらない肉の虫",
        shareUrl: "https://youtu.be/JY6QbqOhfpQ"
      },
      "vid14": {
        name: "竜退治予告",
        shareUrl: "https://youtu.be/_8gM_dbYoAk"
      },
      "vid15": {
        name: "憎悪の神予告",
        shareUrl: "https://youtu.be/3KS8nPRH0M8"
      },
      "vid16": {
        name: "オルたその昔話",
        shareUrl: "https://youtu.be/fJv19Y40s7s"
      },
      "vid17": {
        name: "2018年の断片",
        shareUrl: "https://youtu.be/m6NBFf9PZ6s"
      },
      "vid18": {
        name: "君との明日",
        shareUrl: "https://youtu.be/zMr7vTEqS1I"
      },
      "vid19": {
        name: "【MAD】最果ての水晶塔",
        shareUrl: "https://youtu.be/FtoWw67r0uE"
      },
      "vid20": {
        name: "核融合炉に飛び込んでみた光太郎",
        shareUrl: "https://youtu.be/NrkNoUd3P0o"
      },
      "vid21": {
        name: "かいしゲロ",
        shareUrl: "https://youtu.be/QTyBCq4bkVc"
      },
      "vid22": {
        name: "馬鹿な男アーサー",
        shareUrl: "https://youtu.be/4E5JwCV7Oxg"
      },
      "vid23": {
        name: "Arthur's Story",
        shareUrl: "https://youtu.be/Xz0GFmRVk58"
      },
      "vid24": {
        name: "アーサーへのマエストロたちの反応集",
        shareUrl: "https://youtu.be/c0UiPZ0SA6A"
      },
      "vid25": {
        name: "ウルトラヴァイオレットに熱いものを覚えたソムリエ達の反応集",
        shareUrl: "https://youtu.be/Lg5mEqKDyrc"
      },
      "vid26": {
        name: "ゴジータ呼び名・罵倒集＋α",
        shareUrl: "https://youtu.be/N_Aej-6Y-qQ"
      },
      "vid27": {
        name: "white1",
        shareUrl: "https://youtu.be/lAJr-wtddQE"
      },
      "vid28": {
        name: "white2",
        shareUrl: "https://youtu.be/hTUYHeOBuNo"
      },
      "vid29": {
        name: "フロルブリッジ号、甲板",
        shareUrl: "https://youtu.be/N6qDp2bhuRI"
      },
      "vid30": {
        name: "俺が無事でよかった",
        shareUrl: "https://youtu.be/UqVowP4gSQ0"
      },
      "vid31": {
        name: "下劣竜前半",
        shareUrl: "https://youtu.be/ar9DHZWbK6A"
      },
      "vid32": {
        name: "下劣竜後半",
        shareUrl: "https://youtu.be/xl65NJyoX2I"
      },
      "vid33": {
        name: "ノンデリクラさん",
        shareUrl: "https://youtu.be/RXeD5Hkn8PY"
      },
      "vid34": {
        name: "ある日のフリーレン",
        shareUrl: "https://youtu.be/Li0Cnkjp31g"
      },
      "vid35": {
        name: "一口フリーレン",
        shareUrl: "https://youtu.be/7caJJl7kOt0"
      },
      "vid36": {
        name: "一口ケーちゃん",
        shareUrl: "https://youtu.be/oSYTpBrUZrk"
      },
      "vid37": {
        name: "一口モーさん",
        shareUrl: "https://youtu.be/eLjCOiPEtKY"
      },
      "vid38": {
        name: "一口呪術高専",
        shareUrl: "https://youtu.be/z4TOog3282k"
      },
      "vid39": {
        name: "インクレディブルと見る過去の敵一覧",
        shareUrl: "https://youtu.be/I-I6MA8WGDI"
      },
      "vid40": {
        name: "インクレディブルと見るアルダニスの冒険者",
        shareUrl: "https://youtu.be/a6eORULwz5w"
      },
      "vid41": {
        name: "デビル同盟_スカサハ視点",
        shareUrl: "https://youtu.be/mPlJh-eKK-I"
      },
      "vid42": {
        name: "Lv1_2nd女キャラに対するピストンの違い",
        shareUrl: "https://youtu.be/SVPKxYSL16s"
      },
      "vid43": {
        name: "【楽曲】俺の名はクラウド",
        shareUrl: "https://www.youtube.com/watch?v=zD65-TDeAD8"
      },
      "vid44": {
        name: "Lv1_2nd 1章前半",
        shareUrl: "https://youtu.be/PYBNu29iBXs"
      },
      "vid45": {
        name: "いろ+の最強持ちキャラランク 66位まで",
        shareUrl: "https://youtu.be/uNYTlNHCjmU"
      },
      "vid46": {
        name: "わえ/天の最強持ちキャラランク Part1",
        shareUrl: "https://youtu.be/ytyN5HXkScU"
      },
      "vid48": {
        name: "わえ/天の最強持ちキャラランク Part2",
        shareUrl: "https://youtu.be/w4cQPybe8o8"
      },
      "vid49": {
        name: "わえ/天の最強持ちキャラランク Part3",
        shareUrl: "https://youtu.be/xM1r_jBXpU4"
      },
      "vid50": {
        name: "わえ/天の最強持ちキャラランク Part4",
        shareUrl: "https://youtu.be/A1vpka5T9kw"
      },
      "vid51": {
        name: "わえ/天の最強持ちキャラランク Part5",
        shareUrl: "https://youtu.be/LFD3yozPi-Y"
      },
      "vid52": {
        name: "わえ/天の最強持ちキャラランク Part6",
        shareUrl: "aaa"
      },
      "vidX": {
        name: "movieName",
        shareUrl: "aaa"
      },
    };
  
    const videoList = document.getElementById("video-list");
    const videoPopup = document.getElementById("video-popup");
    const videoPopupContainer = document.getElementById("video-popup-container");
    const videoPopupTitle = document.getElementById("video-popup-title");
    const closeVideoPopup = document.getElementById("close-video-popup");
  
    // 動画カードの自動生成
    Object.entries(videos).forEach(([id, data]) => {
      // 共有リンクから動画IDを抽出
      let videoId = "";
      if (data.shareUrl.includes("youtu.be/")) {
        videoId = data.shareUrl.split("youtu.be/")[1];
      } else if (data.shareUrl.includes("watch?v=")) {
        videoId = data.shareUrl.split("watch?v=")[1].split("&")[0];
      }
      // サムネイルURLと埋め込み用URLの生成
      const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      const embedUrl = `https://www.youtube.com/embed/${videoId}`;
  
      // 動画カードの作成
      const card = document.createElement("div");
      card.classList.add("video-card");
  
      // サムネイル画像
      const img = document.createElement("img");
      img.src = thumbnailUrl;
      img.alt = data.name;
  
      // タイトル
      const title = document.createElement("h3");
      title.textContent = data.name;
  
      // カードに画像とタイトルを追加
      card.appendChild(img);
      card.appendChild(title);
      videoList.appendChild(card);
  
      // カードクリックでポップアップ表示
      card.addEventListener("click", function() {
        // 既存のiframeをクリア
        videoPopupContainer.innerHTML = "";
        // iframe作成（autoplayパラメータ付き）
        const iframe = document.createElement("iframe");
        iframe.src = embedUrl + "?autoplay=1";
        iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        iframe.allowFullscreen = true;
        videoPopupContainer.appendChild(iframe);
        videoPopupTitle.textContent = data.name;
        videoPopup.classList.add("visible");
      });
      
    });
  
    // ポップアップ閉じる処理
    const closePopup = () => {
      videoPopup.classList.remove("visible");
      videoPopupContainer.innerHTML = "";
    };
  
    closeVideoPopup.addEventListener("click", closePopup);
    videoPopup.addEventListener("click", function(e) {
      if (e.target === videoPopup) {
        closePopup();
      }
    });
  });