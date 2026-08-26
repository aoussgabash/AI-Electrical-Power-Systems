(() => {
  'use strict';

  const COURSE_THEME_VERSION = '20260826-13';
  const COURSE_NAV_VERSION = '20260826-13';
  const CATALOG_VERSION = '20260826-13';
  const page = location.pathname.split('/').pop()?.toLowerCase() || 'index.html';
  const isLecturePage = /^lecture\d{2}\.html$/.test(page);
  const isLabPage = /^lab\d{2}\.html$/.test(page);
  const isCourseContentPage = isLecturePage || isLabPage;

  const cleanText = value => (value || '').replace(/\s+/g, ' ').trim();

  const synchronizeHomepageCatalog = async () => {
    if (page !== 'index.html' && page !== '') return;

    const cards = [...document.querySelectorAll('.course-card[href]')];
    if (!cards.length) return;

    const syncStyle = document.createElement('style');
    syncStyle.id = 'course-catalog-sync-style';
    syncStyle.textContent = `
      .course-card[data-catalog-state="loading"],
      .course-card[data-catalog-state="error"]{pointer-events:none!important}
      .course-card[data-catalog-state="loading"]{opacity:.62;filter:saturate(.72)}
      .course-card[data-catalog-state="error"]{opacity:.55;filter:grayscale(.3)}
      .course-card[data-catalog-state="verified"]{opacity:1;filter:none}
    `;
    document.getElementById(syncStyle.id)?.remove();
    document.head.appendChild(syncStyle);

    const verifyCard = async card => {
      const href = card.getAttribute('href') || '';
      const match = href.match(/^(lecture|lab)(\d{2})\.html$/i);
      if (!match) return;

      const type = match[1].toLowerCase();
      const number = match[2];
      const titleNode = card.querySelector('h3');
      const arabicNode = card.querySelector('.arabic');
      const descriptionNode = card.querySelector('p');
      const fallbackLabel = type === 'lecture' ? `Lecture ${number}` : `MATLAB Lab ${number}`;
      const fallbackArabic = type === 'lecture' ? `المحاضرة ${number}` : `المخبر ${number}`;

      card.dataset.catalogState = 'loading';
      card.setAttribute('aria-disabled', 'true');
      card.setAttribute('tabindex', '-1');
      if (titleNode) titleNode.textContent = `${fallbackLabel} — Verifying title…`;
      if (arabicNode) arabicNode.textContent = `${fallbackArabic} — جارٍ التحقق من العنوان`;
      if (descriptionNode) descriptionNode.textContent = 'Reading the verified title from the linked course page.';

      try {
        const response = await fetch(`${href}?catalog-sync=${CATALOG_VERSION}`, { cache: 'no-store' });
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

        if (!pageTitle) throw new Error('Missing H1 title');

        if (titleNode) titleNode.textContent = pageTitle;
        if (arabicNode) arabicNode.textContent = arabicTitle || fallbackArabic;
        if (descriptionNode) descriptionNode.textContent = summary || 'Open the verified course page for complete scientific content.';

        card.dataset.search = `${pageTitle} ${arabicTitle} ${summary}`.toLowerCase();
        card.dataset.catalogState = 'verified';
        card.removeAttribute('aria-disabled');
        card.removeAttribute('tabindex');
      } catch (error) {
        console.error(`Catalog verification failed for ${href}:`, error);
        if (titleNode) titleNode.textContent = `${fallbackLabel} — Temporarily unavailable`;
        if (arabicNode) arabicNode.textContent = `${fallbackArabic} — تعذر التحقق من العنوان`;
        if (descriptionNode) descriptionNode.textContent = 'This card is disabled because its title could not be verified against the linked page.';
        card.dataset.catalogState = 'error';
        card.dataset.search = `${fallbackLabel} ${fallbackArabic}`.toLowerCase();
      }
    };

    await Promise.allSettled(cards.map(verifyCard));
  };

  const removeLegacyMarkup = () => {
    if (!isCourseContentPage) return;
    document.querySelectorAll('footer').forEach(footer => footer.remove());
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
    }, { once: true });
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
    courseFeatures.src = `course-footer-legacy.js?v=${COURSE_THEME_VERSION}`;
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
