function hasValue(value) {
  return typeof value === 'string' && value.trim() && !/^\[PLACEHOLDER:/i.test(value.trim());
}

function isExternalUrl(value) {
  try {
    return new URL(value).protocol === 'https:' && !value.includes('[PLACEHOLDER:');
  } catch {
    return false;
  }
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
      ${hasValue(content.brand.professionTagline) ? `<p class="lead">${content.brand.professionTagline}</p>` : ''}
      ${hasValue(content.brand.bio) ? `<p class="muted">${content.brand.bio}</p>` : ''}
    `;
  }

  // Works grid (featured)
  const grid = document.getElementById('featured-works');
  if (grid) {
    const works = (content.works || []).filter((w) => hasValue(w.title) && hasValue(w.imageSrc) && isExternalUrl(w.link));
    if (!works.length) grid.closest('.section').hidden = true;
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
    const cats = (content.gallery?.categories || []).filter((c) => hasValue(c.name));
    if (!cats.length) {
      strip.closest('.section').hidden = true;
    } else strip.innerHTML = `
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
    const vids = (content.videos || []).filter((v) => {
      if (!hasValue(v.title) || !isExternalUrl(v.embedSrc)) return false;
      try {
        const url = new URL(v.embedSrc);
        return (url.hostname === 'www.youtube.com' && url.pathname.startsWith('/embed/')) ||
          (url.hostname === 'player.vimeo.com' && url.pathname.startsWith('/video/'));
      } catch {
        return false;
      }
    });
    if (!vids.length) {
      videoWrap.closest('.section').hidden = true;
    } else videoWrap.innerHTML = `
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
    const items = (content.press?.items || []).filter((p) => hasValue(p.title) && hasValue(p.detail));
    if (!items.length) {
      press.closest('.section').hidden = true;
    } else press.innerHTML = `
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
    const contactLines = [
      ['Email', content.contact.email],
      ['Phone', content.contact.phone],
      ['Location', content.contact.location]
    ].filter(([, value]) => hasValue(value));
    about.innerHTML = `
      <h1 class="page-title">${content.brand.name}</h1>
      ${hasValue(content.brand.professionTagline) ? `<p class="lead">${content.brand.professionTagline}</p>` : ''}
      ${hasValue(content.brand.bio) ? `<p class="muted">${content.brand.bio}</p>` : ''}

      ${contactLines.length ? `<section class="panel">
          <h2 class="panel-title">Contact</h2>
          <div class="kv">
            ${contactLines.map(([label, value]) => `<div class="kv-row"><span class="kv-k">${label}</span><span class="kv-v">${value}</span></div>`).join('')}
          </div>
          <a class="button" href="contact.html">Contact form</a>
        </section>` : ''}
    `;
  }
}

function initWorks(content) {
  const wrap = document.getElementById('works');
  if (wrap) {
    const works = (content.works || []).filter((w) => hasValue(w.title) && hasValue(w.imageSrc) && isExternalUrl(w.link));
    wrap.innerHTML = `
      <h1 class="page-title">Works</h1>
      ${works.length ? `<p class="muted">Selected projects and collaborations.</p><div class="works-grid">
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
      </div>` : '<p class="muted">Selected work will appear here.</p>'}
    `;
  }
}

function initGallery(content) {
  const cat = new URLSearchParams(location.search).get('cat') || 'all';
  const cats = (content.gallery?.categories || []).filter((c) => hasValue(c.name));
  const items = (content.gallery?.items || []).filter((it) => hasValue(it.title) && hasValue(it.imageSrc));

  const aside = document.getElementById('gallery-filters');
  if (aside && !cats.length) aside.hidden = true;
  if (aside && cats.length) {
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
    if (!cats.length) gallery.closest('.filters')?.classList.add('filters-full');
    const filtered = cat === 'all' ? items : items.filter((it) => it.categoryId === cat);
    gallery.innerHTML = `
      <div class="section-head">
        <h1 class="page-title">Gallery</h1>
        ${filtered.length ? `<p class="muted">${filtered.length} item(s)</p>` : ''}
      </div>
      ${filtered.length ? `<div class="gallery-grid" role="list">
        ${filtered
          .map((it) => {
            return `
              <div class="gallery-tile" role="listitem">
                <a
                  class="gallery-thumb"
                  href="#"
                  data-lightbox-open="1"
                  data-src="${it.imageSrc}"
                  data-alt="${hasValue(it.alt) ? it.alt : ''}"
                  data-title="${it.title || ''}"
                  aria-label="Open image: ${it.title || ''}"
                >
                  <img loading="lazy" decoding="async" width="800" height="600" src="${it.imageSrc}" alt="${hasValue(it.alt) ? it.alt : ''}">
                </a>
                <div class="gallery-cap">${it.title || ''}</div>
              </div>
            `;
          })
          .join('')}
      </div>` : '<p class="muted">Gallery items will appear here.</p>'}
    `;
  }
}

function initContact(content) {
  // Render contact details panel only; form stays in HTML for semantics
  const box = document.getElementById('contact-details');
  if (!box) return;

  const details = [
    ['Email', content.contact.email],
    ['Phone', content.contact.phone],
    ['Location', content.contact.location]
  ].filter(([, value]) => hasValue(value));
  const social = (content.contact.social || []).filter((s) => hasValue(s.label) && isExternalUrl(s.href));
  if (!details.length && !social.length) {
    box.hidden = true;
    return;
  }
  box.innerHTML = `
    ${details.length ? `<h2 class="panel-title">Reach out</h2><div class="kv">
      ${details.map(([label, value]) => `<div class="kv-row"><span class="kv-k">${label}</span><span class="kv-v">${value}</span></div>`).join('')}
    </div>` : ''}
    ${social.length ? `${details.length ? '<div class="divider"></div>' : ''}<h3 class="panel-title">Social</h3><div class="social-row">
      ${social
        .map(
          (s) => `
        <a class="social-chip" href="${s.href}" target="_blank" rel="noopener noreferrer">${s.label}</a>`
        )
        .join('')}
    </div>` : ''}
  `;
}

