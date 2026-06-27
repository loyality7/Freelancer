'use strict';

/* ═══════════════════════════════════════════════════════
   INJECT-NEW-SITE.JS
   Old portfolio: click [SWITCH_OS] → loads SARATH.OS in-place
   ═══════════════════════════════════════════════════════ */

const NEW_SITE_HTML_URL = 'https://raw.githubusercontent.com/loyality7/sarath/main/index.html';
const NEW_CSS_URL       = 'https://loyality7.github.io/sarath/css/style.css';
const NEW_JS_URL        = 'https://loyality7.github.io/sarath/js/main.js';

const btn     = document.getElementById('switch-btn');
const modal   = document.getElementById('new-site-modal');

btn.addEventListener('click', () => {
  btn.style.display = 'none';
  modal.style.display = 'block';
  modal.innerHTML = '<pre style="color:#00ff41;text-align:center;padding:40vh 20px;font-family:Share Tech Mono,monospace;font-size:13px;">LOADING SARATH.OS...</pre>';

  const loadStyle = () => {
    return new Promise((resolve, reject) => {
      if (document.getElementById('new-site-css')) return resolve();
      const link = document.createElement('link');
      link.id = 'new-site-css';
      link.rel = 'stylesheet';
      link.href = NEW_CSS_URL;
      link.onload = resolve;
      link.onerror = reject;
      document.head.appendChild(link);
    });
  };

  const loadJS = () => {
    return new Promise((resolve, reject) => {
      if (document.getElementById('new-site-js')) return resolve();
      const s = document.createElement('script');
      s.id = 'new-site-js';
      s.src = NEW_JS_URL;
      s.onload = resolve;
      s.onerror = reject;
      document.body.appendChild(s);
    });
  };

  fetch(NEW_SITE_HTML_URL)
    .then(r => r.text())
    .then(html => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      const bootScreen = doc.getElementById('boot-screen');
      const app        = doc.getElementById('app');
      const scanlines  = doc.getElementById('scanlines');
      const noiseC     = doc.getElementById('noise-canvas');
      const matrixC    = doc.getElementById('matrix-canvas');
      const konamiF    = doc.getElementById('konami-flash');
      const cursorA    = doc.getElementById('cursor-art');
      const bgC        = doc.getElementById('bg-canvas');

      [bootScreen, app, scanlines, noiseC, matrixC, konamiF, cursorA, bgC].forEach(el => {
        if (el) modal.appendChild(el.cloneNode(true));
      });

      const newStyles = doc.querySelectorAll('link[rel="stylesheet"]');
      newStyles.forEach(link => {
        const href = link.href;
        if (!document.querySelector(`link[href="${href}"]`)) {
          const clone = document.createElement('link');
          clone.rel = 'stylesheet';
          clone.href = href;
          document.head.appendChild(clone);
        }
      });

      const scripts = doc.querySelectorAll('script[src]');
      scripts.forEach(s => {
        const src = s.src;
        if (!document.querySelector(`script[src="${src}"]`)) {
          const clone = document.createElement('script');
          clone.src = src;
          document.body.appendChild(clone);
        }
      });

      return loadStyle().then(loadJS);
    })
    .then(() => {
      modal.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
          e.preventDefault();
          const target = document.querySelector(a.getAttribute('href'));
          if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
      });
    })
    .catch(err => {
      modal.innerHTML = `<pre style="color:#ff2d55;text-align:center;padding:40vh 20px;font-family:Share Tech Mono,monospace;font-size:13px;">ERROR LOADING NEW SITE\n\n${err.message}\n\n> OPEN MANUALLY: https://loyality7.github.io/sarath/</pre>`;
    });
});
