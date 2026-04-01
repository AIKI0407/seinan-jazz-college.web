/* =========================================
   西南ジャズカレッジ 公式サイト
   script.js
   ========================================= */

// ─── ナビゲーション スクロールエフェクト ─────────────────────────
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });


// ─── ハンバーガーメニュー ─────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navMobile = document.getElementById('navMobile');

hamburger.addEventListener('click', () => {
  const isOpen = navMobile.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', isOpen);
});

// モバイルメニューのリンクをタップしたら閉じる
navMobile.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navMobile.classList.remove('open');
    hamburger.setAttribute('aria-expanded', false);
  });
});


// ─── スクロールアニメーション (Intersection Observer) ────────────
const fadeEls = document.querySelectorAll('.fade-up');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

fadeEls.forEach(el => observer.observe(el));

// 動的生成された要素にも適用できるようグローバルに公開
window._fadeObserver = observer;


// ─── ヒーロー 読み込み時フェードイン ────────────────────────────
window.addEventListener('load', () => {
  document.querySelectorAll('.hero .fade-up').forEach((el, i) => {
    setTimeout(() => {
      el.classList.add('visible');
    }, 180 + i * 160);
  });
});


// ─── アクティブなナビリンクをハイライト ──────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav__links a');

const highlightNav = () => {
  const scrollY = window.scrollY + 120;

  sections.forEach(section => {
    const top = section.offsetTop;
    const bottom = top + section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav__links a[href="#${id}"]`);

    if (link) {
      if (scrollY >= top && scrollY < bottom) {
        link.style.color = 'var(--gold)';
      } else {
        link.style.color = '';
      }
    }
  });
};

window.addEventListener('scroll', highlightNav, { passive: true });


// ─── 動画プレイヤー（YouTube対応）────────────────────────────────
// ▼ 動画を追加・変更する場合はこの配列を編集してください
// youtubeId：YouTubeのURLの末尾にある動画ID（例: https://youtu.be/【ここ】）
const videos = [
  {
    youtubeId: '4VYuk1N_qTQ',
    title: '定期演奏会 2026',
    desc: '2月、西南チャペルを貸し切り開催。ビッグバンドによる本格的な演奏会。'
  },
  {
    youtubeId: 'tazuhvS-IsY',
    title: '卒業コンパ セッション',
    desc: '卒業生を送る打ち上げでの即興演奏。ジャズ・スタンダードをみんなで自由にセッション。'
  },
  {
    youtubeId: '7fJcufKLDOo',
    title: '練習風景',
    desc: '空き時間にワイワイと。様々な楽器でのびのびと音楽を楽しむ日常の一コマ。'
  },
  {
    youtubeId: 'neNQP90k3cE',
    title: '学祭ライブ',
    desc: '五重奏による演奏。ジャズだけではなくいろんなジャンルも演奏できます！！'
  },
  {
    youtubeId: 'SFz1otf_GgM',
    title: 'ホームカミングデー',
    desc: '年に一度、西南のOB・OGが集まるイベントでの演奏の様子。各楽器のソロなどもジャズの魅力です。'
  },
  {
    youtubeId: 'cZCG1uj8FiI',
    title: '定期演奏会に向けたビッグバンド練習',
    desc: 'ボーカルの演奏もあります！ジャズボーカルにあこがれる人も是非！'
  },

  // 動画を追加する場合はここに追記（youtubeIdはYouTubeのURLの末尾の文字列）
  // { youtubeId: 'XXXXXXXXXXXXXXX', title: 'タイトル', desc: '説明文' },
];

const mainVideo = document.getElementById('mainVideo');
const mainLabel = document.getElementById('mainLabel');
const carouselDesc = document.getElementById('carouselDesc');
const carouselCounter = document.getElementById('carouselCounter');
const playlist = document.getElementById('videoPlaylist');
let current = 0;

// プレイリストアイテムを動的生成
// 初期表示：最初の動画をiframeにセット
mainVideo.src = `https://www.youtube.com/embed/${videos[0].youtubeId}?rel=0&modestbranding=1`;

videos.forEach((v, i) => {
  const item = document.createElement('div');
  item.className = 'video-player__item' + (i === 0 ? ' active' : '');
  item.dataset.index = i;
  // サムネイルはYouTube公式のサムネイルURL（mqdefault = 320x180）
  item.innerHTML = `
    <div class="video-player__item-thumb">
      <img
        src="https://img.youtube.com/vi/${v.youtubeId}/mqdefault.jpg"
        alt="${v.title}"
        loading="lazy"
      >
      <div class="video-player__item-play">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
      </div>
    </div>
    <div class="video-player__item-info">
      <p class="video-player__item-num">${String(i + 1).padStart(2, '0')}</p>
      <p class="video-player__item-title">${v.title}</p>
    </div>
  `;
  item.addEventListener('click', () => goTo(i));
  playlist.appendChild(item);
});

function goTo(index) {
  current = (index + videos.length) % videos.length;
  const v = videos[current];

  // iframeのsrcを切り替える（?autoplay=1 で自動再生）
  mainVideo.classList.add('fade-out');
  setTimeout(() => {
    mainVideo.src = `https://www.youtube.com/embed/${v.youtubeId}?rel=0&modestbranding=1&autoplay=1`;
    mainVideo.classList.remove('fade-out');
  }, 200);

  mainLabel.textContent = v.title;
  carouselDesc.textContent = v.desc;
  carouselCounter.textContent = String(current + 1).padStart(2, '0') + ' / ' + String(videos.length).padStart(2, '0');

  playlist.querySelectorAll('.video-player__item').forEach((el, i) => {
    el.classList.toggle('active', i === current);
  });

  // アクティブアイテムをプレイリスト内にスクロール
  const active = playlist.querySelector('.video-player__item.active');
  if (active) active.scrollIntoView({ block: 'nearest' });
}


// ─── スムーズスクロール（nav-height 分オフセット）────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navH = parseInt(getComputedStyle(document.documentElement)
      .getPropertyValue('--nav-h'), 10) || 72;
    const top = target.getBoundingClientRect().top + window.scrollY - navH;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
