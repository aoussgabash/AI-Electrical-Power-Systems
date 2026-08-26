(() => {
  'use strict';

  const COURSE_THEME_VERSION = '20260826-11';
  const COURSE_NAV_VERSION = '20260826-11';
  const page = location.pathname.split('/').pop()?.toLowerCase() || 'index.html';
  const isLecturePage = /^lecture\d{2}\.html$/.test(page);
  const isLabPage = /^lab\d{2}\.html$/.test(page);
  const isCourseContentPage = isLecturePage || isLabPage;

  const cleanText = value => (value || '').replace(/\s+/g, ' ').trim();

  const synchronizeHomepageCatalog = async () => {
    if (page !== 'index.html' && page !== '') return;

    const cards = [...document.querySelectorAll('.course-card[href]')];
    await Promise.all(cards.map(async card => {
      const href = card.getAttribute('href') || '';
      if (!/^(lecture|lab)\d{2}\.html$/i.test(href)) return;

      try {
        const response = await fetch(`${href}?catalog-sync=20260826-11`, { cache: 'no-store' });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const html = await response.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const pageTitle = cleanText(doc.querySelector('h1')?.textContent);
        const arabicTitle = cleanText(
          doc.querySelector('.hero-ar')?.textContent ||
          doc.querySelector('[lang="ar"].hero-subtitle')?.textContent ||
          doc.querySelector('.subtitle-ar')?.textContent
        );
        const summary = cleanText(
          doc.querySelector('.hero .subtitle')?.textContent ||
          doc.querySelector('.hero p:not([lang="ar"])')?.textContent ||
          doc.querySelector('meta[name="description"]')?.getAttribute('content')
        );

        if (!pageTitle) return;

        const titleNode = card.querySelector('h3');
        const arabicNode = card.querySelector('.arabic');
        const descriptionNode = card.querySelector('p');
        if (titleNode) titleNode.textContent = pageTitle;
        if (arabicNode && arabicTitle) arabicNode.textContent = arabicTitle;
        if (descriptionNode && summary) descriptionNode.textContent = summary;

        card.dataset.search = `${pageTitle} ${arabicTitle} ${summary}`.toLowerCase();
        card.dataset.catalogVerified = 'true';
      } catch (error) {
        console.warn(`Could not synchronize ${href}:`, error);
        card.dataset.catalogVerified = 'false';
      }
    }));
  };

  const removeLegacyMarkup = () => {
    if (!isCourseContentPage) return;
    document.querySelectorAll('footer').forEach((footer) => footer.remove());
    document.documentElement.dataset.courseFooterCentralized = 'true';
  };

  const loadCourseTheme = () => {
    document.querySelectorAll('link[href^="course-theme.css"]').forEach(link => {
      link.href = `course-theme.css?v=${COURSE_THEME_VERSION}`;
      link.dataset.courseTheme = 'true';
    });

    if (!document.querySelector('link[data-course-theme]')) {
      const theme = document.createElement('link');
      theme.rel = 'stylesheet';
      theme.href = `course-theme.css?v=${COURSE_THEME_VERSION}`;
      theme.dataset.courseTheme = 'true';
      document.head.appendChild(theme);
    }

    removeLegacyMarkup();
  };

  const loadCentralComponents = () => {
    if (document.querySelector('script[data-ag-loader]')) return;
    const loader = document.createElement('script');
    loader.src = 'https://aoussgabash.com/assets/shared/ag-loader.js?v=20260824-3';
    loader.defer = true;
    loader.dataset.agLoader = 'true';
    document.body.appendChild(loader);
  };

  const reloadCourseNavigation = () => {
    if (!isCourseContentPage) return;

    document.querySelectorAll('.academic-course-banner,.course-action-panel,.course-metadata-bar,.academic-overview').forEach(panel => panel.remove());
    delete document.documentElement.dataset.courseNavigationReady;
    document.querySelectorAll('script[data-course-navigation-fresh],script[data-academic-overview]').forEach(script => script.remove());

    const navigation = document.createElement('script');
    navigation.src = `course-navigation.js?v=${COURSE_NAV_VERSION}`;
    navigation.defer = true;
    navigation.dataset.courseNavigationFresh = 'true';
    navigation.addEventListener('load', () => {
      const overview = document.createElement('script');
      overview.src = `academic-overview.js?v=${COURSE_NAV_VERSION}`;
      overview.defer = true;
      overview.dataset.academicOverview = 'true';
      document.body.appendChild(overview);
    }, {once:true});
    document.body.appendChild(navigation);
  };

  const startCourseFeatures = () => {
    void synchronizeHomepageCatalog();
    if (!isCourseContentPage) return;

    loadCourseTheme();
    const finish = () => {
      loadCentralComponents();
      reloadCourseNavigation();
    };

    const existingLegacy = document.querySelector('script[data-course-legacy]');
    if (existingLegacy) {
      if (existingLegacy.dataset.loaded === 'true') finish();
      else {
        existingLegacy.addEventListener('load', finish, { once: true });
        existingLegacy.addEventListener('error', finish, { once: true });
      }
      return;
    }

    const courseFeatures = document.createElement('script');
    courseFeatures.src = 'course-footer-legacy.js?v=20260826-11';
    courseFeatures.defer = true;
    courseFeatures.dataset.courseLegacy = 'true';
    courseFeatures.addEventListener('load', () => {
      courseFeatures.dataset.loaded = 'true';
      finish();
    }, { once: true });
    courseFeatures.addEventListener('error', finish, { once: true });
    document.head.appendChild(courseFeatures);
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', startCourseFeatures, { once: true });
  else startCourseFeatures();
})();
