(() => {
  'use strict';

  const ensureHeadLink = (rel, href, attributes = {}) => {
    const existing = [...document.head.querySelectorAll(`link[rel="${rel}"]`)]
      .find(link => link.getAttribute('href') === href);

    if (existing) return existing;

    const link = document.createElement('link');
    link.rel = rel;
    link.href = href;

    Object.entries(attributes).forEach(([name, value]) => {
      link.setAttribute(name, value);
    });

    document.head.appendChild(link);
    return link;
  };

  // Unified AG visual identity for all AI website pages.
  document.head.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]')
    .forEach(link => link.remove());

  ensureHeadLink('icon', '/favicon.ico', { sizes: 'any' });
  ensureHeadLink('icon', '/favicon-32x32.png', { type: 'image/png', sizes: '32x32' });
  ensureHeadLink('icon', '/favicon-16x16.png', { type: 'image/png', sizes: '16x16' });
  ensureHeadLink('icon', '/favicon-192x192.png', { type: 'image/png', sizes: '192x192' });
  ensureHeadLink('icon', '/favicon-512x512.png', { type: 'image/png', sizes: '512x512' });
  ensureHeadLink('apple-touch-icon', '/favicon-192x192.png', { sizes: '192x192' });

  const loadScript = (src, onload) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = false;
    if (onload) script.addEventListener('load', onload, { once: true });
    document.head.appendChild(script);
  };

  const pageName = (location.pathname.split('/').pop() || '').toLowerCase();

  loadScript('course-footer-core.js?v=20260828-1', () => {
    loadScript('lecture-covers.js?v=20260827-1');

    // Load the reviewed 10-question bank only on Lecture 01.
    if (pageName === 'lecture01.html') {
      loadScript('lecture01-quiz-data.js?v=20260831-1');
    }
  });
})();
