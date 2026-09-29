// ── THEME TOGGLE ──────────────────────────────────────────────
(function initTheme() {
  const root = document.documentElement;
  const toggle = document.getElementById('themeToggle');
  let saved = null;
  try { saved = localStorage.getItem('theme'); } catch (e) {}
  if (saved === 'light') root.setAttribute('data-theme', 'light');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const isLight = root.getAttribute('data-theme') === 'light';
      if (isLight) root.removeAttribute('data-theme');
      else root.setAttribute('data-theme', 'light');
      try { localStorage.setItem('theme', isLight ? 'dark' : 'light'); } catch (e) {}
    });
  }
})();

// ── MOBILE MENU ─────────────────────────────────────────────────
(function initMobileMenu() {
  const burger = document.getElementById('navBurger');
  const menu = document.getElementById('mobileMenu');
  if (!burger || !menu) return;
  function close() {
    menu.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  burger.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    burger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  });
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
})();

// ── CURSOR ──────────────────────────────────────────────────
const dot = document.querySelector('.cursor-dot');
const circle = document.querySelector('.cursor-circle');
let mx = 0, my = 0, cx = 0, cy = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  dot.style.left = mx + 'px';
  dot.style.top = my + 'px';
});
(function animCursor() {
  cx += (mx - cx) * 0.1;
  cy += (my - cy) * 0.1;
  circle.style.left = cx + 'px';
  circle.style.top = cy + 'px';
  requestAnimationFrame(animCursor);
})();

// ── SCROLL PROGRESS ─────────────────────────────────────────
const bar = document.querySelector('.progress-bar');
window.addEventListener('scroll', () => {
  const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight);
  bar.style.width = (pct * 100) + '%';
  document.querySelector('nav').classList.toggle('stuck', window.scrollY > 60);
});

// ── SCROLL REVEAL ────────────────────────────────────────────
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal, .reveal-left, .reveal-right')
  .forEach(el => revealObs.observe(el));

// ── TYPEWRITER ───────────────────────────────────────────────
const words = ['Full-Stack Developer', 'AI/ML Engineer', 'System Builder', 'Full-Stack Developer'];
let wi = 0, ci = 0, deleting = false;
const tw = document.getElementById('typewriter');
if (tw) {
  function type() {
    const word = words[wi];
    if (!deleting) {
      tw.textContent = word.slice(0, ci + 1);
      ci++;
      if (ci === word.length) { deleting = true; setTimeout(type, 2200); return; }
    } else {
      tw.textContent = word.slice(0, ci - 1);
      ci--;
      if (ci === 0) { deleting = false; wi = (wi + 1) % words.length; }
    }
    setTimeout(type, deleting ? 40 : 80);
  }
  setTimeout(type, 1000);
}

// ── COUNTER ANIMATION ────────────────────────────────────────
function animCount(el, target, decimals = 0, suffix = '') {
  let start = 0, startTime = null, duration = 1800;
  function step(ts) {
    if (!startTime) startTime = ts;
    const p = Math.min((ts - startTime) / duration, 1);
    const ease = 1 - Math.pow(1 - p, 4);
    const val = start + (target - start) * ease;
    el.textContent = (decimals ? val.toFixed(decimals) : Math.floor(val).toLocaleString()) + suffix;
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const countObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const raw = el.dataset.count;
    const dec = parseInt(el.dataset.dec || '0');
    const suf = el.dataset.suffix || '';
    if (raw) { animCount(el, parseFloat(raw), dec, suf); countObs.unobserve(el); }
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-count]').forEach(el => countObs.observe(el));

// ── SMOOTH HOVER TILT on project featured ───────────────────
const featured = document.querySelector('.project-preview-inner');
if (featured) {
  const wrap = featured.closest('.project-preview');
  if (wrap) {
    wrap.addEventListener('mousemove', e => {
      const r = wrap.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      featured.style.transform =
        `perspective(800px) rotateY(${x * 16}deg) rotateX(${-y * 8}deg)`;
    });
    wrap.addEventListener('mouseleave', () => {
      featured.style.transform = 'perspective(800px) rotateY(-8deg) rotateX(4deg)';
    });
  }
}

// ── MARQUEE DUPLICATE ────────────────────────────────────────
const track = document.querySelector('.marquee-track');
if (track) {
  track.innerHTML += track.innerHTML;
}

// ── MAGNETIC BUTTONS ─────────────────────────────────────────
document.querySelectorAll('.btn-lime, .btn-ghost, .nav-cta').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * 0.3;
    const y = (e.clientY - r.top - r.height / 2) * 0.3;
    btn.style.transform = `translate(${x}px, ${y}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

// ── GLITCH EFFECT on hero name ───────────────────────────────
const heroName = document.querySelector('.hero-headline');
if (heroName) {
  setInterval(() => {
    heroName.style.textShadow =
      `${(Math.random()-0.5)*4}px 0 rgba(200,255,0,0.8),
       ${(Math.random()-0.5)*4}px 0 rgba(255,59,59,0.5)`;
    setTimeout(() => { heroName.style.textShadow = 'none'; }, 80);
  }, 4000);
}

// ── ACTIVE NAV LINKS ─────────────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
const sectionObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(a => {
        a.style.color = '';
        if (a.getAttribute('href') === '#' + e.target.id) a.style.color = 'var(--accent2)';
      });
    }
  });
}, { threshold: 0.5 });
sections.forEach(s => sectionObs.observe(s));

console.log('%c GB Abhilash — Portfolio v2.0 ', 'background:#c8ff00;color:#080808;font-weight:bold;padding:8px 16px;font-family:monospace');