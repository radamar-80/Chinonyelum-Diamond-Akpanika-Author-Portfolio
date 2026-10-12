import { getGallery } from './api.js';

function el(tag, text) {
  const x = document.createElement(tag);
  x.textContent = text;
  return x;
}

/**
 * @param {string} page
 * @param {any} content
 */
export function initPage(page, content) {
  if (page === 'index') initIndex(content);
  if (page === 'about') initAbout(content);
  if (page === 'works') initWorks(content);
  if (page === 'gallery') initGallery(content);
  if (page === 'contact') initContact(content);
}

function initIndex(content) {
  // Welcome block
  const welcome = document.getElementById('welcome');
  if (welcome) {
    welcome.innerHTML = `
      <h1 class="page-title">${content.brand.name}</h1>
      <p class="lead">${content.brand.professionTagline || '[PLACEHOLDER: tagline]'}</p>
      <p class="muted">${content.brand.bio || '[PLACEHOLDER: short bio]'}</p>
    `;
  }

  // Works grid (featured)
  const grid = document.getElementById('featured-works');
  if (grid) {
    const works = content.works || [];
    grid.innerHTML = works
      .map((w) => {
        return `
          <article class="card">
            <a class="card-media" href="${w.link}" target="_blank" rel="noopener noreferrer" aria-label="Open work: ${w.title}">
              <img loading="lazy" decoding="async" width="800" height="540" src="${w.imageSrc}" alt="${w.alt || ''}">
            </a>
            <div class="card-body">
              <div class="card-meta"><span>${w.year || ''}</span></div>
              <h2 class="card-title">${w.title || ''}</h2>
              <p class="card-text">${w.description || ''}</p>
              <a class="card-link" href="${w.link}" target="_blank" rel="noopener noreferrer">View</a>
            </div>
          </article>
        `;
      })
      .join('');
  }

  // Gallery teaser strip
  const strip = document.getElementById('gallery-teaser');
  if (strip) {
    const cats = content.gallery?.categories || [];
    strip.innerHTML = `
      <div class="section-head">
        <h2 class="section-title">Gallery</h2>
        <a class="section-link" href="gallery.html">Browse all</a>
      </div>
      <div class="teaser-row" role="list">
        ${cats
          .slice(0, 5)
          .map(
            (c) => `
          <a class="teaser-pill" href="gallery.html?cat=${encodeURIComponent(c.id)}" role="listitem">
            ${c.name}
          </a>`
          )
          .join('')}
      </div>
    `;
  }

  // Videos
  const videoWrap = document.getElementById('videos');
  if (videoWrap) {
    const vids = content.videos || [];
    videoWrap.innerHTML = `
      <div class="section-head">
        <h2 class="section-title">Videos</h2>
      </div>
      <div class="video-grid">
        ${vids
          .slice(0, 2)
          .map((v) => {
            return `
              <section class="video-card" aria-label="${v.title}">
                <h3 class="sr-only">${v.title}</h3>
                <div class="video-frame">
                  <iframe
                    loading="lazy"
                    title="${v.title}"
                    width="560"
                    height="315"
                    src="${v.embedSrc}"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                  ></iframe>
                </div>
              </section>
            `;
          })
          .join('')}
      </div>
    `;
  }

  // Press
  const press = document.getElementById('press');
  if (press) {
    const items = content.press?.items || [];
    press.innerHTML = `
      <div class="section-head">
        <h2 class="section-title">Press / Recognition</h2>
      </div>
      <div class="press-list">
        ${items
          .map((p) => {
            return `
              <article class="press-item">
                <div class="press-title">${p.title || ''}</div>
                <div class="press-detail">${p.detail || ''}</div>
              </article>`;
          })
          .join('')}
      </div>
    `;
  }
}

function initAbout(content) {
  const about = document.getElementById('about');
  if (about) {
    about.innerHTML = `
      <h1 class="page-title">${content.brand.name}</h1>
      <p class="lead">${content.brand.professionTagline || '[PLACEHOLDER: tagline]'}</p>
      <p class="muted">${content.brand.bio || '[PLACEHOLDER: short bio]'}</p>

      <div class="split-grid">
        <section class="panel">
          <h2 class="panel-title">Highlights</h2>
          <ul class="list">
            <li><span class="bullet" aria-hidden="true"></span><span>[PLACEHOLDER: highlight 1]</span></li>
            <li><span class="bullet" aria-hidden="true"></span><span>[PLACEHOLDER: highlight 2]</span></li>
            <li><span class="bullet" aria-hidden="true"></span><span>[PLACEHOLDER: highlight 3]</span></li>
          </ul>
        </section>

        <section class="panel">
          <h2 class="panel-title">Contact</h2>
          <div class="kv">
            <div class="kv-row"><span class="kv-k">Email</span><span class="kv-v">${content.contact.email || '[PLACEHOLDER: email]'}</span></div>
            <div class="kv-row"><span class="kv-k">Phone</span><span class="kv-v">${content.contact.phone || '[PLACEHOLDER: phone]'}</span></div>
            <div class="kv-row"><span class="kv-k">Location</span><span class="kv-v">${content.contact.location || '[PLACEHOLDER: location]'}</span></div>
          </div>
          <a class="button" href="contact.html">Contact form</a>
        </section>
      </div>
    `;
  }
}

function initWorks(content) {
  const wrap = document.getElementById('works');
  if (wrap) {
    const works = content.works || [];
    wrap.innerHTML = `
      <h1 class="page-title">Works</h1>
      <p class="muted">Selected projects and collaborations.</p>
      <div class="works-grid">
        ${works
          .map((w) => {
            return `
              <article class="card">
                <a class="card-media" href="${w.link}" target="_blank" rel="noopener noreferrer">
                  <img loading="lazy" decoding="async" width="800" height="540" src="${w.imageSrc}" alt="${w.alt || ''}">
                </a>
                <div class="card-body">
                  <div class="card-meta"><span>${w.year || ''}</span></div>
                  <h2 class="card-title">${w.title || ''}</h2>
                  <p class="card-text">${w.description || ''}</p>
                  <a class="card-link" href="${w.link}" target="_blank" rel="noopener noreferrer">Open</a>
                </div>
              </article>`;
          })
          .join('')}
      </div>
    `;
  }
}

function initGallery(content) {
  const cat = new URLSearchParams(location.search).get('cat') || 'all';
  const cats = content.gallery?.categories || [];
  const items = content.gallery?.items || [];

  const aside = document.getElementById('gallery-filters');
  if (aside) {
    aside.innerHTML = `
      <h2 class="panel-title">Categories</h2>
      <div class="filter-list" role="list">
        <a class="filter-link ${cat === 'all' ? 'active' : ''}" href="gallery.html?cat=all" role="listitem">All</a>
        ${cats
          .map((c) => {
            const active = cat === c.id ? 'active' : '';
            return `<a class="filter-link ${active}" href="gallery.html?cat=${encodeURIComponent(c.id)}" role="listitem">${c.name}</a>`;
          })
          .join('')}
      </div>
    `;
  }

  const gallery = document.getElementById('gallery-items');
  if (gallery) {
    const filtered = cat === 'all' ? items : items.filter((it) => it.categoryId === cat);
    gallery.innerHTML = `
      <div class="section-head">
        <h1 class="page-title">Gallery</h1>
        <p class="muted">${filtered.length} item(s)</p>
      </div>
      <div class="gallery-grid" role="list">
        ${filtered
          .map((it) => {
            return `
              <div class="gallery-tile" role="listitem">
                <a
                  class="gallery-thumb"
                  href="#"
                  data-lightbox-open="1"
                  data-src="${it.imageSrc}"
                  data-alt="${it.alt || ''}"
                  data-title="${it.title || ''}"
                  aria-label="Open image: ${it.title || ''}"
                >
                  <img loading="lazy" decoding="async" width="800" height="600" src="${it.imageSrc}" alt="${it.alt || ''}">
                </a>
                <div class="gallery-cap">${it.title || ''}</div>
              </div>
            `;
          })
          .join('')}
      </div>
    `;
  }
}

function initContact(content) {
  // Render contact details panel only; form stays in HTML for semantics
  const box = document.getElementById('contact-details');
  if (!box) return;

  box.innerHTML = `
    <h2 class="panel-title">Reach out</h2>
    <div class="kv">
      <div class="kv-row"><span class="kv-k">Email</span><span class="kv-v">${content.contact.email || '[PLACEHOLDER: email]'}</span></div>
      <div class="kv-row"><span class="kv-k">Phone</span><span class="kv-v">${content.contact.phone || '[PLACEHOLDER: phone]'}</span></div>
      <div class="kv-row"><span class="kv-k">Location</span><span class="kv-v">${content.contact.location || '[PLACEHOLDER: location]'}</span></div>
    </div>

    <div class="divider"></div>
    <h3 class="panel-title">Social</h3>
    <div class="social-row">
      ${(content.contact.social || [])
        .map(
          (s) => `
        <a class="social-chip" href="${s.href}" target="_blank" rel="noopener noreferrer">${s.label}</a>`
        )
        .join('')}
    </div>
  `;
}

