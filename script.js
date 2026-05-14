/* ================================================================
   ZOMI  |  Website JS
   ================================================================ */

/* ─── Navbar scroll effect ─────────────────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ─── Mobile nav toggle ────────────────────────────────────────── */
document.getElementById('navToggle').addEventListener('click', () => {
  document.querySelector('.nav-links').classList.toggle('open');
});
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    document.querySelector('.nav-links').classList.remove('open');
  });
});

/* ─── Smooth scroll for anchor links ──────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ─── Reveal elements on scroll ───────────────────────────────── */
const revealClasses = [
  { sel: '.act-card',        cls: 'reveal' },
  { sel: '.feature-card',    cls: 'reveal' },
  { sel: '.char-card',       cls: 'reveal' },
  { sel: '.tech-item',       cls: 'reveal-scale' },
  { sel: '.team-card',       cls: 'reveal' },
  { sel: '.controls-section',cls: 'reveal' },
  { sel: '.about-text',      cls: 'reveal-left' },
  { sel: '.about-visual',    cls: 'reveal-right' },
  { sel: '.about-stats .stat', cls: 'reveal' },
  { sel: '.section-header',  cls: 'reveal' },
];

const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const delay = (parseInt(e.target.dataset.revealIndex) || 0) * 0.06;
      e.target.style.transitionDelay = `${delay}s`;
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

function initReveal() {
  revealClasses.forEach(({ sel, cls }) => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.classList.add(cls);
      el.dataset.revealIndex = i;
      observer.observe(el);
    });
  });
}

/* ─── Section line animation ───────────────────────────────────── */
const sectionLineObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    e.target.classList.toggle('section-visible', e.isIntersecting);
  });
}, { threshold: 0.1 });
document.querySelectorAll('section[id]').forEach(s => sectionLineObserver.observe(s));

/* ─── Stat bar animation on scroll ────────────────────────────── */
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.bar div').forEach((bar, i) => {
        const w = bar.style.width;
        bar.style.width = '0';
        setTimeout(() => {
          bar.style.transition = 'width 0.9s cubic-bezier(0.22, 1, 0.36, 1)';
          bar.style.width = w;
        }, 150 + i * 80);
      });
      barObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });

/* ─── Active nav link highlight ───────────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
const activeObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(a => a.classList.remove('nav-active'));
      const active = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
      if (active) active.classList.add('nav-active');
    }
  });
}, { threshold: 0.45 });
sections.forEach(s => activeObserver.observe(s));

/* ─── Parallax hero on mouse move ──────────────────────────────── */
const heroBg = document.querySelector('.hero-bg');
if (heroBg) {
  let tX = 0, tY = 0, cX = 0, cY = 0;
  document.addEventListener('mousemove', (e) => {
    tX = (e.clientX / window.innerWidth  - 0.5) * 14;
    tY = (e.clientY / window.innerHeight - 0.5) * 10;
  }, { passive: true });
  (function lerp() {
    cX += (tX - cX) * 0.05;
    cY += (tY - cY) * 0.05;
    heroBg.style.transform = `translate(${cX}px, ${cY}px)`;
    requestAnimationFrame(lerp);
  })();
}

/* ─── Hero logo entrance ───────────────────────────────────────── */
function heroEntrance() {
  const logo  = document.querySelector('.hero-logo');
  const title = document.querySelector('.hero-title');
  const tag   = document.querySelector('.hero-tagline');
  const badges = document.querySelector('.hero-badges');
  const btn   = document.querySelector('.btn-primary');

  const items = [logo, title, tag, badges, btn].filter(Boolean);
  items.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `opacity 0.8s ease ${i * 0.15 + 0.2}s,
                           transform 0.8s cubic-bezier(0.22, 1, 0.36, 1) ${i * 0.15 + 0.2}s`;
    setTimeout(() => {
      el.style.opacity = '';
      el.style.transform = '';
    }, 50);
  });
}

/* ─── Number counter animation for stats ───────────────────────── */
function animateCounters() {
  document.querySelectorAll('.about-stats .stat span').forEach(el => {
    const target = parseInt(el.textContent, 10);
    if (isNaN(target)) return;
    let current = 0;
    const step = Math.ceil(target / 20);
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current;
      if (current >= target) clearInterval(timer);
    }, 40);
  });
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { animateCounters(); statsObserver.disconnect(); }
  });
}, { threshold: 0.5 });
const statsEl = document.querySelector('.about-stats');
if (statsEl) statsObserver.observe(statsEl);

/* ─── Card tilt on hover ───────────────────────────────────────── */
document.querySelectorAll('.act-card, .char-card, .feature-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    card.style.transform = `translateY(-6px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
    card.style.transition = 'transform 0.1s ease';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.4s ease';
  });
});

/* ─── Nav active style ─────────────────────────────────────────── */
const style = document.createElement('style');
style.textContent = `.nav-links a.nav-active { color: var(--gold) !important; }`;
document.head.appendChild(style);

/* ─── Init ─────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initReveal();
  heroEntrance();
  document.querySelectorAll('.char-card').forEach(card => barObserver.observe(card));
});
