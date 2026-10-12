/**
 * Gallery lightbox with keyboard support.
 */

let lastFocused = null;

function trapFocus(container, e) {
  const focusables = Array.from(container.querySelectorAll('a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'))
    .filter((el) => !el.hasAttribute('disabled') && el.tabIndex !== -1);

  if (!focusables.length) return;

  const first = focusables[0];
  const last = focusables[focusables.length - 1];

  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}

export function initGalleryLightbox() {
  const modal = document.getElementById('lightbox');
  if (!modal) return;

  const img = modal.querySelector('[data-lightbox-img="1"]');
  const title = modal.querySelector('[data-lightbox-title="1"]');
  const closeBtn = modal.querySelector('[data-lightbox-close="1"]');

  const open = (src, alt, t) => {
    lastFocused = document.activeElement;
    modal.classList.add('open');
    img.src = src;
    img.alt = alt || '';
    if (title) title.textContent = t || '';
    modal.setAttribute('aria-hidden', 'false');
    closeBtn?.focus();
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    img.src = '';
    document.body.style.overflow = '';
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  };

  document.addEventListener('click', (e) => {
    const target = e.target;
    const btn = target instanceof HTMLElement ? target.closest('[data-lightbox-open="1"]') : null;
    if (!btn) return;

    e.preventDefault();
    const src = btn.getAttribute('data-src') || '';
    const alt = btn.getAttribute('data-alt') || '';
    const t = btn.getAttribute('data-title') || '';
    if (!src) return;

    open(src, alt, t);
  });

  if (closeBtn) closeBtn.addEventListener('click', close);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) close();
  });

  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('open')) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
    }
    if (e.key === 'Tab') trapFocus(modal, e);
  });
}

