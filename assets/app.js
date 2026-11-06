(() => {
  'use strict';
  document.documentElement.classList.add('js-ready');
  const channel = 'https://www.youtube.com/@MrXuthar';
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.getElementById('main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
      nav.classList.toggle('is-open', open);
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open navigation');
    }));
  }
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px 20px 0px' });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  } else document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
  const notes = [
    '“What the tide takes away, the heart learns to carry.”',
    '“We do not return to the sea. We return to the person we were beside it.”',
    '“Even the loneliest shore is visited by the waves.”',
    '“Every horizon is a promise the water never has to keep.”',
    '“The sea knows the art of leaving without saying goodbye.”',
    '“In the language of waves, nothing is ever truly still.”',
    '“Some memories are made of salt. They never quite fade.”'
  ];
  const quote = document.getElementById('tide-quote');
  const another = document.getElementById('another-tide');
  if (quote && another) another.addEventListener('click', () => {
    const available = notes.filter(note => note !== quote.textContent);
    quote.textContent = available[Math.floor(Math.random() * available.length)];
  });
  // Never show a broken remote image: use a locally bundled ocean photograph.
  document.querySelectorAll('img[data-fallback]').forEach(img => {
    img.addEventListener('error', () => {
      if (img.dataset.fallback && !img.dataset.failed) {
        img.dataset.failed = '1';
        img.src = img.dataset.fallback;
      }
    });
  });
  const safeId = id => typeof id === 'string' && /^[a-zA-Z0-9_-]{11}$/.test(id);
  const safeTitle = str => typeof str === 'string' ? str.slice(0, 150) : 'An ocean moment';
  const el = (tag, className, text) => {
    const e = document.createElement(tag);
    if (className) e.className = className;
    if (text != null) e.textContent = text;
    return e;
  };
  const dialog = document.getElementById('video-dialog');
  const frame = document.getElementById('video-dialog-frame');
  const dialogLink = document.getElementById('video-dialog-link');
  function openVideo(id, shorts) {
    if (!safeId(id)) return;
    const url = `https://www.youtube.com/watch?v=${encodeURIComponent(id)}`;
    if (!dialog || !frame || typeof dialog.showModal !== 'function') {
      window.open(url, '_blank', 'noopener,noreferrer');
      return;
    }
    frame.classList.toggle('vertical', !!shorts);
    const iframe = el('iframe');
    iframe.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0`;
    iframe.title = 'YouTube player';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    frame.replaceChildren(iframe);
    dialogLink.href = url;
    dialog.showModal();
  }
  function closeVideo() {
    if (dialog?.open) dialog.close();
    if (frame) frame.replaceChildren();
  }
  dialog?.querySelector('.dialog-close')?.addEventListener('click', closeVideo);
  dialog?.addEventListener('close', () => frame?.replaceChildren());
  dialog?.addEventListener('click', e => { if (e.target === dialog) closeVideo(); });
  function makeVideoCard(video, shorts = false) {
    const card = el('button', shorts ? 'short-card' : 'video-card');
    card.type = 'button';
    card.setAttribute('aria-label', `Play ${safeTitle(video.title)} on YouTube`);
    const cover = el('div', shorts ? '' : 'video-cover');
    const img = el('img');
    img.src = `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`;
    img.alt = '';
    img.loading = 'lazy';
    img.addEventListener('error', () => { img.src = 'assets/afterglow.webp'; });
    cover.append(img);
    if (shorts) {
      const overlay = el('div', 'short-card-overlay');
      const logo = el('span', 'small-label', 'SHORT FILM / YOUTUBE');
      const title = el('h3', '', safeTitle(video.title));
      overlay.append(logo, title);
      cover.append(overlay);
    } else {
      const play = el('span', 'video-play');
      play.append(el('span', '', '▶'));
      cover.append(play);
      const meta = el('div', 'video-meta');
      meta.append(el('span', 'small-label', 'A FILM BY MRXUTHAR'), el('h3', '', safeTitle(video.title)));
      card.append(cover, meta);
    }
    if (shorts) card.append(cover);
    card.addEventListener('click', () => openVideo(video.id, shorts));
    return card;
  }
  function renderArchive(data) {
    const videos = Array.isArray(data.videos) ? data.videos.filter(v => safeId(v.id)) : [];
    const shorts = Array.isArray(data.shorts) ? data.shorts.filter(v => safeId(v.id)) : [];
    const vid = document.getElementById('video-grid');
    const short = document.getElementById('shorts-grid');
    if (vid && videos.length) {
      vid.replaceChildren(...videos.slice(0, document.body.dataset.page === 'archive' ? videos.length : 6).map(v => makeVideoCard(v)));
      const status = document.getElementById('film-status');
      if (status) status.firstChild.textContent = 'LATEST VIDEOS FROM THE YOUTUBE CHANNEL';
    }
    if (short && shorts.length) {
      short.style.gridTemplateColumns = '';
      short.replaceChildren(...shorts.slice(0, document.body.dataset.page === 'archive' ? shorts.length : 4).map(v => makeVideoCard(v, true)));
      short.classList.add('populated');
    }
    const count = document.getElementById('archive-count');
    if (count) count.textContent = videos.length || shorts.length
      ? `${videos.length} videos · ${shorts.length} shorts in this synced selection`
      : 'The video archive will populate automatically after the first successful channel sync.';
    const filters = document.querySelectorAll('[data-filter]');
    if (filters.length) {
      filters.forEach(button => button.addEventListener('click', () => {
        filters.forEach(b => b.classList.toggle('active', b === button));
        const choice = button.dataset.filter;
        document.querySelectorAll('[data-section-type]').forEach(section => {
          section.hidden = choice !== 'all' && section.dataset.sectionType !== choice;
        });
      }));
    }
  }
  if (document.getElementById('video-grid') || document.getElementById('shorts-grid')) {
    fetch('content/videos.json', { cache: 'no-store' })
      .then(res => { if (!res.ok) throw new Error('Feed unavailable'); return res.json(); })
      .then(renderArchive)
      .catch(() => { /* Plain YouTube channel links remain fully usable. */ });
  }
})();