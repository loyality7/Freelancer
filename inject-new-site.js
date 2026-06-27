'use strict';

const NEW_SITE_HTML_URL = 'https://raw.githubusercontent.com/loyality7/sarath/main/index.html';
const NEW_CSS_URL       = 'https://raw.githubusercontent.com/loyality7/sarath/main/css/style.css';
const NEW_JS_URL        = 'https://raw.githubusercontent.com/loyality7/sarath/main/js/main.js';
const ANIME_JS_URL      = 'https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.2/anime.min.js';

function injectStyleText(cssText) {
  return new Promise((resolve, reject) => {
    if (document.getElementById('new-site-style')) return resolve();
    const style = document.createElement('style');
    style.id = 'new-site-style';
    style.textContent = cssText;
    document.head.appendChild(style);
    resolve();
  });
}

function injectScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = () => reject(new Error('JS failed: ' + src));
    document.body.appendChild(s);
  });
}

function pickNodes(html) {
  const parser = new DOMParser();
  const doc    = parser.parseFromString(html, 'text/html');
  const ids    = ['boot-screen','app','scanlines','noise-canvas','matrix-canvas','konami-flash','cursor-art','bg-canvas'];
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
    console.error('[INJECT] switch-btn or new-site-modal not found');
    return;
  }

  btn.addEventListener('click', () => {
    btn.style.display = 'none';
    modal.style.display = 'block';
    modal.style.overflowY = 'auto';
    modal.innerHTML = '<pre style="color:#00ff41;text-align:center;padding:40vh 20px;font-family:Share Tech Mono,monospace;font-size:13px;text-shadow:0 0 6px rgba(0,255,65,.5);">LOADING SARATH.OS...\n> FETCHING CORE MODULES</pre>';

    Promise.resolve()
      .then(() => fetch(NEW_CSS_URL))
      .then(r => {
        if (!r.ok) throw new Error('CSS fetch failed: ' + r.status);
        return r.text();
      })
      .then(css => injectStyleText(css))
      .then(() => injectScript(ANIME_JS_URL))
      .then(() => fetch(NEW_SITE_HTML_URL))
      .then(r => {
        if (!r.ok) throw new Error('HTML fetch failed: ' + r.status);
        return r.text();
      })
      .then(html => {
        const nodes = pickNodes(html);
        modal.innerHTML = '';
        const order = ['boot-screen','app','scanlines','noise-canvas','matrix-canvas','konami-flash','cursor-art','bg-canvas'];
        order.forEach(id => { if (nodes[id]) modal.appendChild(nodes[id]); });
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
        modal.innerHTML = '<pre style="color:#ff2d55;text-align:center;padding:40vh 20px;font-family:Share Tech Mono,monospace;font-size:13px;">ERROR: ' + err.message + '\n\n> sarath repo files must be at:\n> main/css/style.css\n> main/js/main.js\n> main/index.html\n\n> OPEN MANUALLY: https://github.com/loyality7/sarath</pre>';
      });
  });
}

initSwitch();
