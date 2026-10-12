/**
 * Central data access layer.
 * All reads go through this file so a future backend only changes here.
 */

const CONTENT_PATH = '../data/content.json';

/**
 * @returns {Promise<any>}
 */
export async function loadContent() {
  const res = await fetch(CONTENT_PATH, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to load content.json (${res.status})`);
  return res.json();
}

/**
 * @returns {Promise<{brand: any, contact: any, nav: any, hero: any, gallery: any, works: any, videos: any, press: any, meta: any}>}
 */
export async function getProfile() {
  const content = await loadContent();
  return {
    brand: content.brand,
    contact: content.contact,
    nav: content.nav,
    meta: content.meta,
    hero: content.hero,
    press: content.press,
    gallery: content.gallery,
    videos: content.videos,
    works: content.works
  };
}

/**
 * @returns {Promise<Array<any>>}
 */
export async function getWorks() {
  const content = await loadContent();
  return content.works || [];
}

/**
 * @returns {Promise<any>}
 */
export async function getGallery() {
  const content = await loadContent();
  return content.gallery || {};
}

/**
 * Mailto-based contact submission (no fake success).
 * @param {{name: string, email: string, topic: string, message: string}} payload
 * @returns {{href: string}}
 */
export function submitContact(payload) {
  const to = '[REPLACED_IN_JS: email from content.json]';
  const subject = `Portfolio contact: ${payload.topic || 'Message'}`;
  const body = [
    `Name: ${payload.name || ''}`,
    `Email: ${payload.email || ''}`,
    `Topic: ${payload.topic || ''}`,
    '',
    payload.message || ''
  ].join('\n');

  // We'll replace recipient in site.js after loading content.
  const href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  return { href };
}

