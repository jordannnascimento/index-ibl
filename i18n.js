(function () {
  const LANGS = ['en', 'pt', 'es'];
  const KEY = 'indexibl_lang';
  const SEL = 'h1,h2,h3,h4,h5,p,li,span,a,label,option,div.list-label';

  const norm = s => s.replace(/&nbsp;|\u00A0/g, ' ').replace(/\s+/g, ' ').trim();

  function current() {
    const url = new URLSearchParams(location.search).get('lang');
    if (LANGS.includes(url)) return url;
    const saved = localStorage.getItem(KEY);
    if (LANGS.includes(saved)) return saved;
    const nav = (navigator.language || 'en').slice(0, 2);
    return LANGS.includes(nav) ? nav : 'en';
  }

  function index() {
    document.querySelectorAll(SEL).forEach(el => {
      if (el.dataset.i18n) return;
      const k = norm(el.innerHTML);
      if (k && window.T && window.T[k]) el.dataset.i18n = k;
    });
  }

  function apply(lang) {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const entry = window.T[el.dataset.i18n];
      const val = lang === 'en' ? el.dataset.i18n : (entry && entry[lang]);
      if (val) el.innerHTML = val;
    });
    document.querySelectorAll('[data-lang]').forEach(b => {
      b.classList.toggle('active', b.dataset.lang === lang);
    });
  }

  function switcher() {
    const host = document.querySelector('.header-inner');
    if (!host) return;
    const box = document.createElement('div');
    box.className = 'langswitch';
    LANGS.forEach(l => {
      const b = document.createElement('button');
      b.type = 'button';
      b.dataset.lang = l;
      b.textContent = l.toUpperCase();
      b.addEventListener('click', () => {
        localStorage.setItem(KEY, l);
        apply(l);
      });
      box.appendChild(b);
    });
    host.insertBefore(box, host.querySelector('.header-cta'));
  }


  function mobileMenu() {
    const header = document.querySelector('.header');
    const inner = document.querySelector('.header-inner');
    const nav = document.querySelector('.nav');
    if (!header || !inner || !nav) return;

    const toggle = document.createElement('button');
    toggle.className = 'navtoggle';
    toggle.type = 'button';
    toggle.setAttribute('aria-label', 'Menu');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.innerHTML = '<span></span><span></span><span></span>';
    inner.appendChild(toggle);

    const panel = document.createElement('div');
    panel.className = 'navpanel';
    const list = nav.querySelector('ul').cloneNode(true);
    const navEl = document.createElement('nav');
    navEl.appendChild(list);
    panel.appendChild(navEl);

    const langs = document.createElement('div');
    langs.className = 'navpanel-langs';
    LANGS.forEach(l => {
      const b = document.createElement('button');
      b.type = 'button';
      b.dataset.lang = l;
      b.textContent = l.toUpperCase();
      b.addEventListener('click', () => {
        localStorage.setItem(KEY, l);
        apply(l);
      });
      langs.appendChild(b);
    });
    panel.appendChild(langs);

    const cta = document.querySelector('.header-cta');
    if (cta) {
      const a = document.createElement('a');
      a.className = 'navpanel-cta';
      a.href = cta.getAttribute('href');
      const span = document.createElement('span');
      span.textContent = (cta.querySelector('span') || cta).textContent.trim();
      a.appendChild(span);
      panel.appendChild(a);
    }
    header.appendChild(panel);

    function close() {
      document.body.classList.remove('nav-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
    toggle.addEventListener('click', () => {
      const open = document.body.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    panel.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
    window.addEventListener('resize', () => { if (innerWidth > 1100) close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  }

  document.addEventListener('DOMContentLoaded', () => {
    mobileMenu();
    switcher();
    index();
    apply(current());
  });
})();