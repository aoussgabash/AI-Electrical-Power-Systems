(() => {
  'use strict';

  const loadScript = (src, onload) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = false;
    if (onload) script.addEventListener('load', onload, { once: true });
    document.head.appendChild(script);
  };

  loadScript('course-footer-core.js?v=20260827-1', () => {
    loadScript('lecture-covers.js?v=20260827-1');
  });
})();
