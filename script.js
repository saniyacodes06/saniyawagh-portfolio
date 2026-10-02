// Swap in the real profile URL when available.
const LINKEDIN_URL = 'https://www.linkedin.com/in/saniya-wagh-4502a52a7';

document.querySelectorAll('.js-linkedin').forEach(a => { a.href = LINKEDIN_URL; });

// Accent swatches: red is the default (no data-accent); others recolour every accent.
const ACCENT_META = { red: '#E50914', purple: '#AC58E9', navy: '#27187E', yellow: '#F5B700' };
const swatches = document.querySelectorAll('.swatch');
const themeMeta = document.querySelector('meta[name="theme-color"]');
const setAccent = name => {
  if (!ACCENT_META[name]) name = 'red';
  if (name === 'red') delete document.documentElement.dataset.accent;
  else document.documentElement.dataset.accent = name;
  swatches.forEach(b => b.setAttribute('aria-pressed', b.dataset.accent === name));
  themeMeta.content = ACCENT_META[name];
  try { name === 'red' ? localStorage.removeItem('accent') : localStorage.setItem('accent', name); } catch (e) {}
};
swatches.forEach(b => b.addEventListener('click', () => {
  setAccent(b.dataset.accent);
}));
try { const saved = localStorage.getItem('accent'); if (ACCENT_META[saved]) setAccent(saved); } catch (e) {}

// Light / dark theme
const themeBtn = document.querySelector('.theme-toggle');
const themedImgs = document.querySelectorAll('img[data-dark-src]');
const setTheme = dark => {
  if (dark) document.documentElement.dataset.theme = 'dark';
  else delete document.documentElement.dataset.theme;
  themeBtn.setAttribute('aria-pressed', dark);
  themeBtn.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
  themedImgs.forEach(img => { img.src = dark ? img.dataset.darkSrc : img.dataset.lightSrc; });
  try { dark ? localStorage.setItem('theme', 'dark') : localStorage.removeItem('theme'); } catch (e) {}
};
themeBtn.addEventListener('click', () => setTheme(document.documentElement.dataset.theme !== 'dark'));
setTheme(document.documentElement.dataset.theme === 'dark');

// Project cards: "Project details" pins the overlay open (tap-friendly)
document.querySelectorAll('button.card-foot').forEach(btn => btn.addEventListener('click', () => {
  const open = btn.closest('.card').classList.toggle('is-open');
  btn.setAttribute('aria-expanded', open);
}));

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
