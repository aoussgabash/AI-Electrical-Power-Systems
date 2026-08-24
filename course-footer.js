(() => {
  'use strict';

  const loadCentralFooter = () => {
    if (document.querySelector('script[data-ag-central-footer]')) return;
    const centralFooter = document.createElement('script');
    centralFooter.src = 'https://aoussgabash.com/assets/shared/ag-footer.js?v=20260824-1';
    centralFooter.defer = true;
    centralFooter.dataset.agCentralFooter = 'true';
    document.body.appendChild(centralFooter);
  };

  const loadLegacyFeatures = () => {
    document.querySelectorAll('link[href^="course-footer.css"]').forEach((link) => link.remove());

    if (document.querySelector('script[data-course-legacy]')) {
      loadCentralFooter();
      return;
    }

    const legacy = document.createElement('script');
    legacy.src = 'course-footer-legacy.js?v=20260823-2';
    legacy.defer = true;
    legacy.dataset.courseLegacy = 'true';
    legacy.addEventListener('load', loadCentralFooter);
    legacy.addEventListener('error', loadCentralFooter);
    document.head.appendChild(legacy);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadLegacyFeatures, { once: true });
  } else {
    loadLegacyFeatures();
  }
})();
