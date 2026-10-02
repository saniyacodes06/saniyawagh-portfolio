// Swap in the real profile URL when available.
const LINKEDIN_URL = 'https://www.linkedin.com/';

document.querySelectorAll('.js-linkedin').forEach(a => { a.href = LINKEDIN_URL; });

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

// Page-load reveal (hero stagger driven by --i in CSS)
requestAnimationFrame(() => document.body.classList.add('loaded'));

// Header rule on scroll
const header = document.querySelector('.site-header');
const onScroll = () => header.classList.toggle('scrolled', scrollY > 8);
addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Mobile nav
const toggle = document.querySelector('.nav-toggle');
const menu = document.getElementById('nav-menu');
const setMenu = open => {
  toggle.setAttribute('aria-expanded', open);
  toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  menu.classList.toggle('open', open);
};
toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
menu.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
addEventListener('keydown', e => {
  if (e.key === 'Escape' && menu.classList.contains('open')) { setMenu(false); toggle.focus(); }
});

// Scroll reveal
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
    revealObs.unobserve(entry.target);
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// Stat count-up
const countUp = el => {
  const to = +el.dataset.to;
  const suffix = el.dataset.suffix || '';
  if (reduceMotion) { el.textContent = to + suffix; return; }
  const start = performance.now();
  const dur = 1300;
  const tick = now => {
    const t = Math.min((now - start) / dur, 1);
    el.textContent = Math.round(to * (1 - Math.pow(1 - t, 3))) + suffix;
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};
const statObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll('.count').forEach(countUp);
    statObs.unobserve(entry.target);
  });
}, { threshold: 0.4 });
const stats = document.querySelector('.stats');
if (stats) statObs.observe(stats);

// Active nav link
const navLinks = [...document.querySelectorAll('.nav-links a')];
const sections = navLinks.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
const navObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const id = '#' + entry.target.id;
    navLinks.forEach(a => {
      if (a.getAttribute('href') === id) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
  });
}, { rootMargin: '-45% 0px -50% 0px' });
sections.forEach(s => navObs.observe(s));
