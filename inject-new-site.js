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

        const pick = (id) => {
          const el = doc.getElementById(id);
          if (!el) return null;
          return el.cloneNode(true);
        };

        const nodes = [
          pick('boot-screen'),
          pick('app'),
          pick('scanlines'),
          pick('noise-canvas'),
          pick('matrix-canvas'),
          pick('konami-flash'),
          pick('cursor-art'),
          pick('bg-canvas'),
        ].filter(Boolean);

        nodes.forEach(n => modal.appendChild(n));

        doc.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
          if (!document.querySelector(`link[href="${link.href}"]`)) {
            const c = document.createElement('link');
            c.rel = 'stylesheet';
            c.href = link.href;
            document.head.appendChild(c);
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
}

initSwitch();
