(() => {
  'use strict';

  const ensureCanonicalStyles = () => {
    document.querySelectorAll('link[href^="course-footer.css"]').forEach((link) => link.remove());
    if (document.querySelector('link[data-canonical-footer]')) return;

    const styles = document.createElement('link');
    styles.rel = 'stylesheet';
    styles.href = 'course-footer.css?v=20260823-4';
    styles.dataset.canonicalFooter = 'true';
    document.head.appendChild(styles);
  };

  const renderCanonicalFooter = () => {
    const footer = document.createElement('footer');
    footer.className = 'site-footer course-footer ag-canonical-footer';
    footer.innerHTML = `
      <div class="container ag-footer-inner">
        <p class="ag-footer-line">
          <span class="footer-en">© 2026 Dr.-Ing. Aouss Gabash</span>
          <span class="footer-separator" aria-hidden="true">|</span>
          <span class="footer-ar" lang="ar" dir="rtl">الدكتور المهندس أوس غباش</span>
        </p>
        <p class="ag-footer-line">
          <span class="footer-en">AG Academic Ecosystem</span>
          <span class="footer-separator" aria-hidden="true">|</span>
          <span class="footer-ar" lang="ar" dir="rtl">منظومة AG الأكاديمية</span>
        </p>
        <p class="ag-footer-line">
          <span class="footer-en">Germany</span>
          <span class="footer-separator" aria-hidden="true">|</span>
          <span class="footer-ar" lang="ar" dir="rtl">ألمانيا</span>
          <span class="footer-separator footer-dot" aria-hidden="true">•</span>
          <span class="footer-en">Syria</span>
          <span class="footer-separator" aria-hidden="true">|</span>
          <span class="footer-ar" lang="ar" dir="rtl">سوريا</span>
        </p>
      </div>`;

    document.querySelectorAll('footer').forEach((oldFooter) => oldFooter.remove());
    document.body.appendChild(footer);
  };

  const loadLegacyFeatures = () => {
    ensureCanonicalStyles();

    if (document.querySelector('script[data-course-legacy]')) {
      renderCanonicalFooter();
      return;
    }

    const legacy = document.createElement('script');
    legacy.src = 'course-footer-legacy.js?v=20260823-2';
    legacy.defer = true;
    legacy.dataset.courseLegacy = 'true';
    legacy.addEventListener('load', () => {
      renderCanonicalFooter();
      requestAnimationFrame(renderCanonicalFooter);
    });
    legacy.addEventListener('error', renderCanonicalFooter);
    document.head.appendChild(legacy);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadLegacyFeatures, { once: true });
  } else {
    loadLegacyFeatures();
  }
})();
