(() => {
  'use strict';

  const COURSE_THEME_VERSION = '20260826-17';
  const COURSE_NAV_VERSION = '20260826-17';
  const CATALOG_VERSION = '20260826-17';
  const page = location.pathname.split('/').pop()?.toLowerCase() || 'index.html';
  const pageMatch = page.match(/^(lecture|lab)(\d{2})\.html$/);
  const isLecturePage = /^lecture\d{2}\.html$/.test(page);
  const isLabPage = /^lab\d{2}\.html$/.test(page);
  const isCourseContentPage = isLecturePage || isLabPage;

  const cleanText = value => (value || '').replace(/\s+/g, ' ').trim();

  const enhanceBackNavigation = () => {
    if (page !== 'ai-solutions.html') return;
    const back = document.querySelector('header .back');
    if (!back) return;

    back.setAttribute('aria-label', 'Back to previous page | العودة إلى الصفحة السابقة');
    back.setAttribute('title', 'Back | عودة');
    back.innerHTML = `
      <svg aria-hidden="true" viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
        <path d="M19 12H5"></path>
        <path d="m12 19-7-7 7-7"></path>
      </svg>
      <span>Back | عودة</span>
    `;
    back.addEventListener('click', event => {
      if (history.length > 1) {
        event.preventDefault();
        history.back();
      }
    });

    const style = document.createElement('style');
    style.id = 'ai-solutions-back-navigation';
    style.textContent = `
      body header .back{
        min-width:128px!important;
        min-height:48px!important;
        display:inline-flex!important;
        align-items:center!important;
        justify-content:center!important;
        gap:9px!important;
        padding:10px 15px!important;
        border:1px solid rgba(56,189,248,.48)!important;
        border-radius:14px!important;
        background:rgba(56,189,248,.09)!important;
        color:#e8f8ff!important;
        font-weight:800!important;
        white-space:nowrap!important;
      }
      body header .back svg{display:block!important;flex:0 0 auto!important}
      body header .back span{display:inline!important;font-size:.92rem!important}
      body header .back:hover,
      body header .back:focus-visible{
        border-color:#67e8f9!important;
        background:rgba(34,211,238,.16)!important;
        color:#fff!important;
        box-shadow:0 0 0 3px rgba(34,211,238,.10)!important;
      }
      @media(max-width:620px){
        body header .back{min-width:50px!important;width:50px!important;padding:10px!important;border-radius:14px!important}
        body header .back span{position:absolute!important;width:1px!important;height:1px!important;padding:0!important;margin:-1px!important;overflow:hidden!important;clip:rect(0,0,0,0)!important;white-space:nowrap!important;border:0!important}
      }
    `;
    document.getElementById(style.id)?.remove();
    document.head.appendChild(style);
  };

  const injectHomepageCourseButtonStyles = () => {
    if (page !== 'index.html' && page !== '') return;
    const style = document.createElement('style');
    style.id = 'homepage-course-button-identity';
    style.textContent = `
      .buttons .btn[href="#course-1"]{background:linear-gradient(135deg,#0284c7,#2563eb)!important;border-color:rgba(56,189,248,.72)!important;color:#fff!important;box-shadow:0 12px 30px rgba(37,99,235,.22)!important}
      .buttons .btn[href="#course-2"]{background:linear-gradient(135deg,#9a6700 0%,#d97706 52%,#fbbf24 100%)!important;border-color:#fbbf24!important;color:#fff8dc!important;box-shadow:0 14px 34px rgba(245,158,11,.34),inset 0 1px 0 rgba(255,255,255,.18)!important}
      .buttons .btn[href="#course-2"]:hover,.buttons .btn[href="#course-2"]:focus-visible{background:linear-gradient(135deg,#b7791f 0%,#f59e0b 55%,#fde047 100%)!important;border-color:#fde68a!important;color:#211707!important;box-shadow:0 18px 44px rgba(245,158,11,.42),0 0 22px rgba(251,191,36,.15)!important;transform:translateY(-2px)}
    `;
    document.getElementById(style.id)?.remove();
    document.head.appendChild(style);
  };

  const applyCourseIdentity = () => {
    if (pageMatch) {
      const number = Number(pageMatch[2]);
      document.documentElement.classList.toggle('course-one-page', number <= 10);
      document.documentElement.classList.toggle('course-two-page', number >= 11);
      document.body?.classList.toggle('course-one-page', number <= 10);
      document.body?.classList.toggle('course-two-page', number >= 11);
    }
    document.querySelectorAll('.course-card[href]').forEach(card => {
      const match = (card.getAttribute('href') || '').match(/^(lecture|lab)(\d{2})\.html$/i);
      if (!match) return;
      const number = Number(match[2]);
      card.classList.toggle('course-one-card', number <= 10);
      card.classList.toggle('course-two-card', number >= 11);
      card.dataset.course = number <= 10 ? '1' : '2';
    });
  };

  const synchronizeHomepageCatalog = async () => {
    if (page !== 'index.html' && page !== '') return;
    applyCourseIdentity();
    const cards = [...document.querySelectorAll('.course-card[href]')];
    if (!cards.length) return;
    const syncStyle = document.createElement('style');
    syncStyle.id = 'course-catalog-sync-style';
    syncStyle.textContent = `.course-card[data-catalog-state="loading"],.course-card[data-catalog-state="error"]{pointer-events:none!important}.course-card[data-catalog-state="loading"]{opacity:.62;filter:saturate(.72)}.course-card[data-catalog-state="error"]{opacity:.55;filter:grayscale(.3)}.course-card[data-catalog-state="verified"]{opacity:1;filter:none}`;
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
        const doc = new DOMParser().parseFromString(await response.text(), 'text/html');
        const pageTitle = cleanText(doc.querySelector('h1')?.textContent);
        const arabicTitle = cleanText(doc.querySelector('.hero-ar')?.textContent || doc.querySelector('[lang="ar"].hero-subtitle')?.textContent || doc.querySelector('.subtitle-ar')?.textContent);
        const summary = cleanText(doc.querySelector('.hero .subtitle')?.textContent || doc.querySelector('.hero p:not([lang="ar"])')?.textContent || doc.querySelector('meta[name="description"]')?.getAttribute('content'));
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
    injectHomepageCourseButtonStyles();
    enhanceBackNavigation();
    applyCourseIdentity();
    void synchronizeHomepageCatalog();
    removeLegacyMarkup();
    loadCentralComponents();
    if (!isCourseContentPage) return;
    loadCourseTheme();
    const finish = () => { loadCentralComponents(); reloadCourseNavigation(); };
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
    courseFeatures.addEventListener('load', () => { courseFeatures.dataset.loaded = 'true'; finish(); }, { once: true });
    courseFeatures.addEventListener('error', finish, { once: true });
    document.head.appendChild(courseFeatures);
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', startCourseFeatures, { once: true });
  else startCourseFeatures();
})();