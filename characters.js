document.addEventListener("DOMContentLoaded", () => {
  const characters = {
    "char01": {
      name: "檀　黎　斗",
      img: "img/char01.png",
      description: "ニャルラトホテプ万歳を革命させた男、自称神・檀黎斗その人。",
      campaign: "CoC"
    },
    "char02": {
      name: "織斑一夏",
      img: "img/char02.jpg",
      description: "ニャルラトホテプの細胞を喰らい適合し、ネクロノミコンの正気喪失に耐えて魔術を操るやべーやつ。",
      campaign: "CoC"
    },
    // 追加キャラクターをここに記述
    "char03": {
      name: "やる夫",
      img: "img/char03.jpg",
      description: "行動派ニート。何の命運なのかニャルラトホテプの所有するロンゴミニアドを手にし、所持している間はアルトリアっぽくなる愉快な白饅頭。",
      campaign: "CoC"
    },
    "char04": {
      name: "キャラ名4",
      img: "img/char04.jpg",
      description: "止まらねぇ男",
      campaign: "CoC"
    },
    "char03": {
      name: "キャラ名3",
      img: "img/char03.jpg",
      description: "キャラクターの説明",
      campaign: "所属キャンペーン名"
    },
    "char04": {
      name: "キャラ名4",
      img: "img/char04.jpg",
      description: "キャラクターの説明",
      campaign: "所属キャンペーン名"
    },
    "char03": {
      name: "キャラ名3",
      img: "img/char03.jpg",
      description: "キャラクターの説明",
      campaign: "所属キャンペーン名"
    },
    "char04": {
      name: "キャラ名4",
      img: "img/char04.jpg",
      description: "キャラクターの説明",
      campaign: "所属キャンペーン名"
    },
    "char03": {
      name: "キャラ名3",
      img: "img/char03.jpg",
      description: "キャラクターの説明",
      campaign: "所属キャンペーン名"
    },
    "char04": {
      name: "キャラ名4",
      img: "img/char04.jpg",
      description: "キャラクターの説明",
      campaign: "所属キャンペーン名"
    },
    "char03": {
      name: "キャラ名3",
      img: "img/char03.jpg",
      description: "キャラクターの説明",
      campaign: "所属キャンペーン名"
    },
    "char04": {
      name: "キャラ名4",
      img: "img/char04.jpg",
      description: "キャラクターの説明",
      campaign: "所属キャンペーン名"
    },
    "char03": {
      name: "キャラ名3",
      img: "img/char03.jpg",
      description: "キャラクターの説明",
      campaign: "所属キャンペーン名"
    },
    "char04": {
      name: "キャラ名4",
      img: "img/char04.jpg",
      description: "キャラクターの説明",
      campaign: "所属キャンペーン名"
    },
    "char03": {
      name: "キャラ名3",
      img: "img/char03.jpg",
      description: "キャラクターの説明",
      campaign: "所属キャンペーン名"
    },
    "char04": {
      name: "キャラ名4",
      img: "img/char04.jpg",
      description: "キャラクターの説明",
      campaign: "所属キャンペーン名"
    },
    "char03": {
      name: "キャラ名3",
      img: "img/char03.jpg",
      description: "キャラクターの説明",
      campaign: "所属キャンペーン名"
    },
    "char04": {
      name: "キャラ名4",
      img: "img/char04.jpg",
      description: "キャラクターの説明",
      campaign: "所属キャンペーン名"
    },
    "char03": {
      name: "キャラ名3",
      img: "img/char03.jpg",
      description: "キャラクターの説明",
      campaign: "所属キャンペーン名"
    },
    "char04": {
      name: "キャラ名4",
      img: "img/char04.jpg",
      description: "キャラクターの説明",
      campaign: "所属キャンペーン名"
    },
  };

  const popup = document.getElementById('char-popup');
  const popupImg = document.getElementById('popup-img');
  const popupName = document.getElementById('popup-name');
  const popupDescription = document.getElementById('popup-description');
  const popupCampaign = document.getElementById('popup-campaign');
  const closePopup = document.getElementById('close-popup');

  document.querySelectorAll('.character-card').forEach(card => {
    card.addEventListener('click', () => {
      const charId = card.dataset.char;
      const char = characters[charId];
      popupImg.src = char.img;
      popupName.textContent = char.name;
      popupDescription.textContent = char.description;
      popupCampaign.textContent = "キャンペーン：" + char.campaign;
      popup.classList.add('visible');  // フェードイン表示
    });
  });

  const closeFunc = () => popup.classList.remove('visible');  // フェードアウト表示

  closePopup.addEventListener('click', closeFunc);
  popup.addEventListener('click', (e) => {
    if (e.target === popup) {
      closeFunc();
    }
  });
});
