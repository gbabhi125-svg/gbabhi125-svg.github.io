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

// ── REDUCED MOTION ────────────────────────────────────────────
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ── LAPTOP MOCKUP: cycling slides + mouse tilt ─────────────────
(function initLaptop() {
  const slides = document.querySelectorAll('.l-slide');
  if (slides.length) {
    let si = 0;
    setInterval(() => {
      slides[si].classList.remove('active');
      si = (si + 1) % slides.length;
      slides[si].classList.add('active');
    }, 3200);
  }
  const wrap = document.getElementById('laptopWrap'), laptop = document.getElementById('laptop');
  if (wrap && laptop && !reducedMotion) {
    wrap.addEventListener('mousemove', e => {
      const r = wrap.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      laptop.style.transform = `rotateX(${8 - y * 14}deg) rotateY(${-16 + x * 20}deg)`;
    });
    wrap.addEventListener('mouseleave', () => { laptop.style.transform = 'rotateX(8deg) rotateY(-16deg)'; });
  }
})();

// ── WEBGL PARTICLE FIELD BEHIND HERO (Three.js) ────────────────
(function initHeroParticles() {
  if (typeof THREE === 'undefined' || reducedMotion) return;
  const canvas = document.getElementById('heroCanvas');
  const heroEl = document.getElementById('hero');
  if (!canvas || !heroEl) return;
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true }); }
  catch (e) { return; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
  camera.position.z = 18;

  function size() {
    renderer.setSize(heroEl.clientWidth, heroEl.clientHeight, false);
    camera.aspect = heroEl.clientWidth / heroEl.clientHeight;
    camera.updateProjectionMatrix();
  }
  size();

  const COUNT = 1400;
  const positions = new Float32Array(COUNT * 3);
  for (let i = 0; i < COUNT; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 44;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 26;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 22;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const mat = new THREE.PointsMaterial({
    color: 0xc8ff00, size: 0.07, transparent: true, opacity: 0.55,
    blending: THREE.AdditiveBlending, depthWrite: false
  });
  const points = new THREE.Points(geo, mat);
  scene.add(points);

  let mx = 0, my = 0;
  window.addEventListener('mousemove', e => {
    mx = (e.clientX / window.innerWidth - 0.5); my = (e.clientY / window.innerHeight - 0.5);
  });

  function animate() {
    points.rotation.y += 0.0008;
    points.rotation.x += 0.00018;
    camera.position.x += (mx * 3 - camera.position.x) * 0.02;
    camera.position.y += (-my * 2 - camera.position.y) * 0.02;
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
  window.addEventListener('resize', size);
})();

// ── GSAP SCROLL CHOREOGRAPHY (progressive enhancement) ─────────
(function initGsapReveal() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reducedMotion) return;
  gsap.registerPlugin(ScrollTrigger);
  gsap.utils.toArray('.projects-row').forEach(row => {
    gsap.fromTo(row.children, { y: 24 }, {
      y: 0, duration: .7, stagger: .12, ease: 'power3.out',
      scrollTrigger: { trigger: row, start: 'top 88%' }
    });
  });
  gsap.from('.laptop-wrap', { y: 40, opacity: 0, duration: 1, ease: 'power4.out', delay: .3 });
})();