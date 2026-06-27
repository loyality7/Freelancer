'use strict';

/* ═══════════════════════════════════════════════════════
   REDIRECT.JS — old portfolio → new sarath.os
   Shows terminal-style overlay with countdown.
   ═══════════════════════════════════════════════════════ */

const NEW_SITE_URL = 'https://loyality7.github.io/sarath/';
const COUNTDOWN_FROM = 10;

const overlay     = document.getElementById('redirect-overlay');
const btn         = document.getElementById('redirect-btn');
const countdownEl = document.getElementById('redirect-countdown');

if (!overlay) {
  console.warn('[REDIRECT] Overlay element not found');
} else {
  let remaining = COUNTDOWN_FROM;

  function updateCountdown() {
    countdownEl.textContent = remaining;
    if (remaining <= 3) {
      countdownEl.style.color = '#ff2d55';
    }
    remaining--;
    if (remaining < 0) {
      clearInterval(timer);
      window.location.href = NEW_SITE_URL;
    }
  }

  updateCountdown();
  const timer = setInterval(updateCountdown, 1000);

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    clearInterval(timer);
    window.location.href = NEW_SITE_URL;
  });
}
