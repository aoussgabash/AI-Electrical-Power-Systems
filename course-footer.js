(() => {
  'use strict';

  const loadCentralComponents = () => {
    if (document.querySelector('script[data-ag-loader]')) return;

    const loader = document.createElement('script');
    loader.src = 'https://aoussgabash.com/assets/shared/ag-loader.js?v=20260824-3';
    loader.defer = true;
    loader.dataset.agLoader = 'true';
    document.body.appendChild(loader);
  };

  const startCourseFeatures = () => {
    document.querySelectorAll('link[href^="course-footer.css"]').forEach((link) => link.remove());

    if (document.querySelector('script[data-course-legacy]')) {
      loadCentralComponents();
      return;
    }

    const courseFeatures = document.createElement('script');
    courseFeatures.src = 'course-footer-legacy.js?v=20260823-2';
    courseFeatures.defer = true;
    courseFeatures.dataset.courseLegacy = 'true';
    courseFeatures.addEventListener('load', loadCentralComponents, { once: true });
    courseFeatures.addEventListener('error', loadCentralComponents, { once: true });
    document.head.appendChild(courseFeatures);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startCourseFeatures, { once: true });
  } else {
    startCourseFeatures();
  }
})();
