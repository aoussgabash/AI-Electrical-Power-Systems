(() => {
  'use strict';

  const COURSE_THEME_VERSION = '20260824-7';
  const page = location.pathname.split('/').pop()?.toLowerCase() || 'index.html';
  const isLecturePage = /^lecture\d{2}\.html$/.test(page);
  const isLabPage = /^lab\d{2}\.html$/.test(page);
  const isCourseContentPage = isLecturePage || isLabPage;

  const removeLegacyMarkup = () => {
    if (!isCourseContentPage) return;

    if (isLecturePage) {
      document.head.querySelectorAll('style').forEach((style) => style.remove());
      document.documentElement.dataset.courseThemeCentralized = 'true';
    }

    document.querySelectorAll('footer').forEach((footer) => footer.remove());
    document.documentElement.dataset.courseFooterCentralized = 'true';
  };

  const loadCourseTheme = () => {
    const existing = document.querySelector(
      'link[data-course-theme], link[href^="course-theme.css"], link[href^="course-footer.css"]'
    );

    if (existing) {
      if (existing.sheet) removeLegacyMarkup();
      else existing.addEventListener('load', removeLegacyMarkup, { once: true });
      return;
    }

    const theme = document.createElement('link');
    theme.rel = 'stylesheet';
    theme.href = `course-theme.css?v=${COURSE_THEME_VERSION}`;
    theme.dataset.courseTheme = 'true';
    theme.addEventListener('load', removeLegacyMarkup, { once: true });
    document.head.appendChild(theme);
  };

  const loadCentralComponents = () => {
    if (document.querySelector('script[data-ag-loader]')) return;

    const loader = document.createElement('script');
    loader.src = 'https://aoussgabash.com/assets/shared/ag-loader.js?v=20260824-3';
    loader.defer = true;
    loader.dataset.agLoader = 'true';
    document.body.appendChild(loader);
  };

  const startCourseFeatures = () => {
    loadCourseTheme();

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
