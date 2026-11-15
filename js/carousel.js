/**
 * Hero image carousel: accessible, keyboardable, pausable, prefers-reduced-motion aware.
 */

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

/**
 * @param {any[]} slides
 * @param {{reducedMotion?: boolean}} [options]
 */
export function initCarousel(slides, options = {}) {
  const reducedMotion = options.reducedMotion === true;
  const root = document.querySelector('[data-hero-carousel="1"]');
  if (!root) return;

  const track = root.querySelector('[data-carousel-track="1"]');
  const indicators = root.querySelector('[data-carousel-indicators="1"]');
  const prevBtn = root.querySelector('[data-carousel-prev="1"]');
  const nextBtn = root.querySelector('[data-carousel-next="1"]');
  const pauseBtn = root.querySelector('[data-carousel-pause="1"]');

  if (!track || !indicators) return;

  const items = slides
    .map((s, idx) => {
      return `
        <div class="carousel-slide" role="group" aria-roledescription="slide" aria-label="${idx + 1} of ${slides.length}">
          <img
            loading="lazy"
            decoding="async"
            width="1600"
            height="720"
            src="${s.imageSrc}"
            alt="${s.alt || ''}"
          />
          <div class="carousel-caption">
            <div class="carousel-caption-title">${s.captionTitle || ''}</div>
            <div class="carousel-caption-text">${s.captionText || ''}</div>
          </div>
        </div>`;
    })
    .join('');

  track.innerHTML = items;

  indicators.innerHTML = slides
    .map((_, idx) => {
      const active = idx === 0 ? 'true' : 'false';
      return `
        <button class="indicator" type="button" aria-label="Go to slide ${idx + 1}" aria-current="${active}" data-carousel-go="${idx}">
          <span class="sr-only">Slide ${idx + 1}</span>
        </button>`;
    })
    .join('');

  let index = 0;
  let timer = null;
  const intervalMs = 5500;
  let paused = false;

  function render() {
    const translate = `translateX(${-index * 100}%)`;
    track.style.transform = translate;

    const btns = Array.from(indicators.querySelectorAll('[data-carousel-go]'));
    btns.forEach((b) => b.setAttribute('aria-current', b.dataset.carouselGo == String(index) ? 'true' : 'false'));
  }

  function goTo(i) {
    index = clamp(i, 0, slides.length - 1);
    render();
  }

  function start() {
    if (reducedMotion) return;
    if (timer) return;
    timer = window.setInterval(() => {
      if (paused) return;
      goTo((index + 1) % slides.length);
    }, intervalMs);
  }

  function stop() {
    if (timer) {
      window.clearInterval(timer);
      timer = null;
    }
  }

  indicators.addEventListener('click', (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    const btn = target.closest('[data-carousel-go]');
    if (!btn) return;
    const i = Number(btn.dataset.carouselGo);
    if (Number.isFinite(i)) goTo(i);
  });

  if (prevBtn) prevBtn.addEventListener('click', () => goTo((index - 1 + slides.length) % slides.length));
  if (nextBtn) nextBtn.addEventListener('click', () => goTo((index + 1) % slides.length));

  // Pause on hover/focus for keyboard users
  root.addEventListener('mouseenter', () => {
    paused = true;
  });
  root.addEventListener('mouseleave', () => {
    paused = false;
  });
  root.addEventListener('focusin', () => {
    paused = true;
  });
  root.addEventListener('focusout', () => {
    paused = false;
  });

  if (pauseBtn) {
    pauseBtn.addEventListener('click', () => {
      paused = !paused;
      pauseBtn.setAttribute('aria-pressed', String(paused));
      pauseBtn.textContent = paused ? 'Resume carousel' : 'Pause carousel';
    });
  }

  // Keyboard: left/right when focus is within carousel
  root.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goTo((index - 1 + slides.length) % slides.length);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      goTo((index + 1) % slides.length);
    }
  });

  // Initial
  render();
  if (!reducedMotion) start();

  // Respect reduced motion if user changes preference mid-session
  const mq = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
  if (mq) {
    mq.addEventListener?.('change', () => {
      stop();
      paused = false;
      if (mq.matches) return;
      start();
    });
  }
}

