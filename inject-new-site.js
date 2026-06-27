'use strict';

const NEW_SITE_HTML_URL = 'https://raw.githubusercontent.com/loyality7/sarath/main/index.html';
const NEW_CSS_URL       = 'https://raw.githubusercontent.com/loyality7/sarath/main/css/style.css';
const NEW_JS_URL        = 'https://raw.githubusercontent.com/loyality7/sarath/main/js/main.js';
const ANIME_JS_URL      = 'https://cdn.jsdelivr.net/npm/animejs@3.2.2/lib/anime.min.js';

function loadText(url) {
  return fetch(url).then(r => {
    if (!r.ok) throw new Error('fetch ' + r.status + ' @ ' + url);
    return r.text();
  });
}

function injectStyle(cssText) {
  const style = document.createElement('style');
  style.id = 'new-site-css';
  style.textContent = cssText;
  document.head.appendChild(style);
}

function injectScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = () => reject(new Error('script blocked: ' + src + ' (check CORS or URL)'));
    document.body.appendChild(s);
  });
}

function pickNodes(html) {
  const parser = new DOMParser();
  const doc    = parser.parseFromString(html, 'text/html');
  const ids    = ['boot-screen','app','scanlines','noise-canvas','matrix-canvas','konami-flash','bg-canvas'];
  const picked = {};
  ids.forEach(id => {
    const el = doc.getElementById(id);
    if (el) picked[id] = el.cloneNode(true);
  });
  return picked;
}

function initSwitch() {
  const btn   = document.getElementById('switch-btn');
  const modal = document.getElementById('new-site-modal');
  if (!btn || !modal) {
    console.error('[INJECT] button or modal not found');
    return;
  }

  btn.addEventListener('click', () => {
    btn.style.display = 'none';
    modal.style.display = 'block';
    modal.style.overflowY = 'auto';
    modal.innerHTML = '<pre style="color:#00ff41;text-align:center;padding:40vh 20px;font-family:Share Tech Mono,monospace;font-size:13px;text-shadow:0 0 6px rgba(0,255,65,.5);">LOADING SARATH.OS...\n> FETCHING CORE MODULES</pre>';

    Promise.resolve()
      .then(() => loadText(NEW_CSS_URL))
      .then(css => { injectStyle(css); })
      .then(() => injectScript(ANIME_JS_URL))
      .then(() => loadText(NEW_SITE_HTML_URL))
      .then(html => {
        const nodes = pickNodes(html);
        modal.innerHTML = '';
        ['boot-screen','app','scanlines','noise-canvas','matrix-canvas','konami-flash','bg-canvas'].forEach(id => {
          if (nodes[id]) modal.appendChild(nodes[id]);
        });
      })
      .then(() => injectScript(NEW_JS_URL))
      .then(() => {
        modal.querySelectorAll('a[href^="#"]').forEach(a => {
          a.addEventListener('click', e => {
            e.preventDefault();
            const t = modal.querySelector(a.getAttribute('href'));
            if (t) t.scrollIntoView({ behavior: 'smooth' });
          });
        });
      })
      .catch(err => {
        modal.innerHTML = '<pre style="color:#ff2d55;text-align:center;padding:30vh 20px;font-family:Share Tech Mono,monospace;font-size:12px;">ERROR: ' + err.message + '\n\n> REQUIRED FILES IN sarath REPO:\n>   main/css/style.css\n>   main/js/main.js\n>   main/index.html\n\n> CHECK: https://github.com/loyality7/sarath\n> RAW:   https://github.com/loyality7/sarath/tree/main</pre>';
        console.error('[INJECT]', err);
      });
  });
}

initSwitch();
