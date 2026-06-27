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

function injectBlobScript(text) {
  return new Promise((resolve, reject) => {
    try {
      const blob = new Blob([text], { type: 'application/javascript' });
      const url  = URL.createObjectURL(blob);
      const s    = document.createElement('script');
      s.src = url;
      s.onload = () => { URL.revokeObjectURL(url); resolve(); };
      s.onerror = () => { URL.revokeObjectURL(url); reject(new Error('script blob load failed')); };
      document.body.appendChild(s);
    } catch (e) {
      reject(new Error('blob create failed: ' + e.message));
    }
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
      .then(css => injectStyle(css))
      .then(() => injectBlobScript(ANIME_JS_URL))
      .then(() => loadText(NEW_SITE_HTML_URL))
      .then(html => {
        const nodes = pickNodes(html);
        modal.innerHTML = '';
        ['boot-screen','app','scanlines','noise-canvas','matrix-canvas','konami-flash','bg-canvas'].forEach(id => {
          if (nodes[id]) modal.appendChild(nodes[id]);
        });
      })
      .then(() => loadText(NEW_JS_URL))
      .then(jsText => injectBlobScript(jsText))
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
        modal.innerHTML = '<pre style="color:#ff2d55;text-align:center;padding:30vh 20px;font-family:Share Tech Mono,monospace;font-size:12px;">ERROR: ' + err.message + '\n\n> sarath repo needs:\n>   main/css/style.css\n>   main/js/main.js\n>   main/index.html\n\n> https://github.com/loyality7/sarath</pre>';
        console.error('[INJECT]', err);
      });
  });
}

initSwitch();
