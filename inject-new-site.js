'use strict';

const NEW_SITE_HTML_URL = 'https://raw.githubusercontent.com/loyality7/sarath/main/index.html';
const NEW_CSS_URL       = 'https://loyality7.github.io/sarath/css/style.css';
const NEW_JS_URL        = 'https://loyality7.github.io/sarath/js/main.js';

function initSwitch() {
  const btn   = document.getElementById('switch-btn');
  const modal = document.getElementById('new-site-modal');

  if (!btn || !modal) {
    console.error('[INJECT] switch-btn or new-site-modal not found');
    return;
  }

  btn.addEventListener('click', () => {
    btn.style.display = 'none';

    /* Show loading */
    modal.style.display = 'block';
    modal.innerHTML = '<pre style="color:#00ff41;text-align:center;padding:40vh 20px;font-family:Share Tech Mono,monospace;font-size:14px;text-shadow:0 0 8px rgba(0,255,65,.6);">LOADING SARATH.OS...\n> initializing core modules</pre>';

    /* Step 1: Load CSS immediately so styles exist before HTML renders */
    const loadCSS = () => new Promise((resolve, reject) => {
      if (document.getElementById('new-site-css')) return resolve();
      const link = document.createElement('link');
      link.id = 'new-site-css';
      link.rel = 'stylesheet';
      link.href = NEW_CSS_URL;
      link.onload = resolve;
      link.onerror = () => reject(new Error('CSS load failed: ' + NEW_CSS_URL));
      document.head.appendChild(link);
    });

    /* Step 2: Load HTML */
    const loadHTML = () => fetch(NEW_SITE_HTML_URL)
      .then(r => {
        if (!r.ok) throw new Error('HTML fetch failed: ' + r.status);
        return r.text();
      })
      .then(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        return {
          bootScreen: doc.getElementById('boot-screen')?.cloneNode(true),
          app:        doc.getElementById('app')?.cloneNode(true),
        };
      });

    /* Step 3: Append HTML to modal */
    const injectHTML = ({ bootScreen, app }) => {
      modal.innerHTML = '';
      if (bootScreen) modal.appendChild(bootScreen);
      if (app)        modal.appendChild(app);
      /* Force hidden until boot finishes */
      const appEl = modal.querySelector('#app');
      if (appEl) appEl.style.opacity = '0';
    };

    /* Step 4: Load JS */
    const loadJS = () => new Promise((resolve, reject) => {
      if (document.getElementById('new-site-js')) return resolve();
      const s = document.createElement('script');
      s.id = 'new-site-js';
      s.src = NEW_JS_URL;
      s.onload = resolve;
      s.onerror = () => reject(new Error('JS load failed: ' + NEW_JS_URL));
      document.body.appendChild(s);
    });

    /* Step 5: Wire anchor links */
    const wireLinks = () => {
      modal.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
          e.preventDefault();
          const t = modal.querySelector(a.getAttribute('href'));
          if (t) t.scrollIntoView({ behavior: 'smooth' });
        });
      });
    };

    /* Chain: CSS first, then HTML, then JS */
    loadCSS()
      .then(loadHTML)
      .then(injectHTML)
      .then(loadJS)
      .then(wireLinks)
      .catch(err => {
        modal.innerHTML = `<pre style="color:#ff2d55;text-align:center;padding:40vh 20px;font-family:Share Tech Mono,monospace;font-size:13px;">ERROR: ${err.message}\n\n> FALLBACK LINK:\n> https://loyality7.github.io/sarath/</pre>`;
      });
  });
}

initSwitch();
