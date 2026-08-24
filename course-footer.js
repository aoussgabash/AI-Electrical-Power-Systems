(() => {
  'use strict';

  const loadCentralComponents = () => {
    if (document.querySelector('script[data-ag-loader]')) return;
    const loader = document.createElement('script');
    loader.src = 'https://aoussgabash.com/assets/shared/ag-loader.js?v=20260824-1';
    loader.defer = true;
    loader.dataset.agLoader = 'true';
    document.body.appendChild(loader);
  };

  const loadLegacyFeatures = () => {
    document.querySelectorAll('link[href^="course-footer.css"]').forEach((link) => link.remove());

    if (document.querySelector('script[data-course-legacy]')) {
      loadCentralComponents();
      return;
    }

    const legacy = document.createElement('script');
    legacy.src = 'course-footer-legacy.js?v=20260823-2';
    legacy.defer = true;
    legacy.dataset.courseLegacy = 'true';
    legacy.addEventListener('load', loadCentralComponents);
    legacy.addEventListener('error', loadCentralComponents);
    document.head.appendChild(legacy);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadLegacyFeatures, { once: true });
  } else {
    loadLegacyFeatures();
  }
})();
