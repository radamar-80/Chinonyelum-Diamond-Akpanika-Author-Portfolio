import { getProfile, submitContact } from './api.js';
import { initCarousel } from './carousel.js';
import { initGalleryLightbox } from './gallery-lightbox.js';

const HEADER_ID = 'site-header';
const FOOTER_ID = 'site-footer';

let contentCache = null;

/**
 * Inline SVG icons (no external deps).
 * @param {string} name
 * @returns {string}
 */
function iconSVG(name) {
  const common = `fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"`;
  switch (name) {
    case 'instagram':
      return `<svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18">
        <rect x="3.5" y="3.5" width="17" height="17" rx="4" ${common}/>
        <path d="M16 11.37a4 4 0 1 1-7.93 1.26 4 4 0 0 1 7.93-1.26Z" ${common}/>
        <path d="M17.5 6.5h.01" ${common}/>
      </svg>`;
    case 'x':
      return `<svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18">
        <path d="M4 4l16 16M20 4L4 20" ${common}/>
      </svg>`;
    case 'linkedin':
      return `<svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18">
        <path d="M6 9v13" ${common}/>
        <path d="M6 6.5h.01" ${common}/>
        <path d="M10 22V9" ${common}/>
        <path d="M10 14c0-3 5-3 5 0v8" ${common}/>
      </svg>`;
    default:
      return `<svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18">
        <circle cx="12" cy="12" r="9" ${common}/>
      </svg>`;
  }
}

/**
 * @param {any} brand
 */
function applyTheme(brand) {
  const root = document.documentElement;
  const colors = brand.colors;
  root.style.setProperty('--bg', colors.bg);
  root.style.setProperty('--panel', colors.panel);
  root.style.setProperty('--text', colors.text);
  root.style.setProperty('--muted', colors.muted);
  root.style.setProperty('--accent', colors.accent);
  root.style.setProperty('--accent2', colors.accent2);
  root.style.setProperty('--ring', colors.ring);
  root.style.setProperty('--font-ui', brand.fonts.ui);
}

/**
 * @param {any} content
 */
function renderHeader(content) {
  const { nav, contact, brand } = content;
  const social = contact.social || [];

  const header = document.getElementById(HEADER_ID);
  if (!header) return;

  header.innerHTML = `
    <a class="skip-link" href="#main">Skip to content</a>

    <div class="topbar" role="navigation" aria-label="Top bar social links">
      <div class="container topbar-inner">
        <div class="brand-mini" aria-hidden="true">${brand.name}</div>
        <div class="social-links">
          ${social
            .map(
              (s) => `
            <a class="icon-link" href="${s.href}" target="_blank" rel="noopener noreferrer" aria-label="${s.label}">
              ${iconSVG(s.icon)}
            </a>`
            )
            .join('')}
        </div>
      </div>
    </div>

    <div class="headerbar">
      <div class="container header-inner">
        <a class="brand" href="index.html" aria-label="${brand.name} home">
          <span class="brand-name">${brand.name}</span>
        </a>

        <nav class="nav" aria-label="Primary">
          <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="nav-menu">
            <span class="sr-only">Toggle navigation</span>
            <span class="hamburger" aria-hidden="true"></span>
          </button>

          <ul id="nav-menu" class="nav-menu" data-dropdown-root>
            ${nav.items
              .map((item) => {
                if (item.dropdown && nav.galleryCategoriesFromContent) {
                  const categories = (content.gallery?.categories || []).map((c) => c);
                  return `
                    <li class="nav-item has-dropdown">
                      <button class="nav-link nav-dropdown-toggle" type="button" aria-haspopup="true" aria-expanded="false">
                        ${item.label}
                        <span class="chevron" aria-hidden="true"></span>
                      </button>
                      <div class="dropdown" role="menu" aria-label="Gallery categories">
                        <a class="dropdown-item" href="gallery.html?cat=all" role="menuitem">All</a>
                        ${categories
                          .map(
                            (c) => `
                          <a class="dropdown-item" href="gallery.html?cat=${encodeURIComponent(c.id)}" role="menuitem">
                            ${c.name}
                          </a>`
                          )
                          .join('')}
                      </div>
                    </li>`;
                }
                return `
                  <li class="nav-item">
                    <a class="nav-link" href="${item.href}">${item.label}</a>
                  </li>`;
              })
              .join('')}
          </ul>
        </nav>
      </div>
    </div>

    <div class="header-spacer" aria-hidden="true"></div>
  `;

  // Reserve header height for layout stability (mobile + desktop tuned in CSS).
  // (Spacer element is always present)
}

/**
 * @param {any} content
 */
function renderFooter(content) {
  const footer = document.getElementById(FOOTER_ID);
  if (!footer) return;

  const social = content.contact.social || [];

  footer.innerHTML = `
    <div class="footer">
      <div class="container footer-inner">
        <div class="footer-brand">
          <div class="footer-title">${content.brand.name}</div>
          <div class="footer-muted">© ${new Date().getFullYear()} ${content.brand.name}. All rights reserved.</div>
        </div>

        <div class="footer-social" aria-label="Footer social links">
          ${social
            .map(
              (s) => `
            <a class="icon-link icon-link-footer" href="${s.href}" target="_blank" rel="noopener noreferrer" aria-label="${s.label}">
              ${iconSVG(s.icon)}
            </a>`
            )
            .join('')}
        </div>
      </div>
    </div>
  `;
}

/**
 * Setup header behaviors: mobile nav and dropdown.
 */
function initHeaderInteractions() {
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.getElementById('nav-menu');
  const dropdownToggle = document.querySelector('.nav-dropdown-toggle');
  const dropdown = document.querySelector('.dropdown');
  const dropdownLinks = dropdown ? Array.from(dropdown.querySelectorAll('a')) : [];

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      menu.classList.toggle('open', !expanded);
    });
  }

  if (dropdownToggle && dropdown) {
    const close = () => {
      dropdownToggle.setAttribute('aria-expanded', 'false');
      dropdown.classList.remove('open');
      dropdownToggle.focus();
    };

    const open = () => {
      dropdownToggle.setAttribute('aria-expanded', 'true');
      dropdown.classList.add('open');
      // focus first item for keyboard users
      if (dropdownLinks[0]) dropdownLinks[0].focus();
    };

    dropdownToggle.addEventListener('click', () => {
      const expanded = dropdownToggle.getAttribute('aria-expanded') === 'true';
      if (expanded) {
        dropdownToggle.setAttribute('aria-expanded', 'false');
        dropdown.classList.remove('open');
      } else {
        open();
      }
    });

    dropdownToggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const expanded = dropdownToggle.getAttribute('aria-expanded') === 'true';
        if (!expanded) open();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        close();
      }
    });

    document.addEventListener('click', (e) => {
      if (!dropdown) return;
      const target = e.target;
      const isInside = dropdown.contains(target) || dropdownToggle.contains(target);
      if (!isInside) {
        dropdownToggle.setAttribute('aria-expanded', 'false');
        dropdown.classList.remove('open');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && dropdown.classList.contains('open')) {
        e.preventDefault();
        dropdownToggle.setAttribute('aria-expanded', 'false');
        dropdown.classList.remove('open');
      }
    });
  }
}

/**
 * Contact form submit handler (mailto).
 */
function initContactForm(content) {
  const form = document.querySelector('form[data-contact-form="1"]');
  if (!form) return;

  const emailInContent = content.contact?.email || '';
  const submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const getVal = (name) => (form.elements.namedItem(name) ? form.elements.namedItem(name).value : '');
    const payload = {
      name: getVal('name'),
      email: getVal('email'),
      topic: getVal('topic'),
      message: getVal('message')
    };

    const { href } = submitContact(payload);
    const mailto = href.replace('[REPLACED_IN_JS: email from content.json]', encodeURIComponent(emailInContent).includes('%40') ? emailInContent : emailInContent);

    // Replace recipient placeholder more robustly
    const finalHref = mailto.replace('mailto:%5BREPLACED_IN_JS%3A%20email%20from%20content.json%5D', `mailto:${emailInContent}`);

    // Open mail client; never show fake "sent".
    if (submitBtn) submitBtn.textContent = 'Opening email client…';
    window.location.href = finalHref;
  });
}

/**
 * Init everything for a page.
 */
export async function initSite() {
  contentCache = await getProfile();
  applyTheme(contentCache.brand);
  renderHeader(contentCache);
  renderFooter(contentCache);

  initHeaderInteractions();

  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Carousel
  if (!reduceMotion) initCarousel(contentCache.hero?.slides || []);
  else {
    // Still render first slide as static
    initCarousel(contentCache.hero?.slides || [], { reducedMotion: true });
  }

  initGalleryLightbox();

  initContactForm(contentCache);

  // Page-specific content hydration
  const page = document.body.dataset.page;
  const mod = await import('./pages.js');
  if (page && typeof mod.initPage === 'function') {
    mod.initPage(page, contentCache);
  }
}

