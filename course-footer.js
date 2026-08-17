(() => {
  'use strict';

  const archiveUrl = 'https://archive.org/details/@aouss_gabash';
  const startYear = 2026;
  const currentYear = new Date().getFullYear();
  const yearText = currentYear > startYear ? `${startYear}–${currentYear}` : `${startYear}`;
  const page = location.pathname.split('/').pop() || 'index.html';
  const match = page.match(/^(lecture|lab)(\d{2})\.html$/i);
  const isHomePage = page === '' || page.toLowerCase() === 'index.html';

  let pageInfo = 'Version 1.0';
  if (match) {
    const type = match[1].toLowerCase();
    const number = match[2];
    pageInfo = type === 'lab'
      ? `MATLAB Lab ${number} • Lecture ${number} • Version 1.0`
      : `Lecture ${number} • MATLAB Lab ${number} • Version 1.0`;
  }

  if (isHomePage) {
    const navLinks = document.querySelector('.navlinks');
    if (navLinks && !navLinks.querySelector('[data-archive-link]')) {
      const navArchive = document.createElement('a');
      navArchive.href = '#digital-library';
      navArchive.dataset.archiveLink = 'true';
      navArchive.textContent = '📚 Digital Library';
      navLinks.appendChild(navArchive);
    }

    const heroButtons = document.querySelector('.hero .buttons');
    if (heroButtons && !heroButtons.querySelector('[data-archive-button]')) {
      const heroArchive = document.createElement('a');
      heroArchive.className = 'btn archive-button';
      heroArchive.href = '#digital-library';
      heroArchive.dataset.archiveButton = 'true';
      heroArchive.innerHTML = '📚 Digital Library & Archive';
      heroButtons.appendChild(heroArchive);
    }

    if (!document.getElementById('digital-library')) {
      const archiveSection = document.createElement('section');
      archiveSection.id = 'digital-library';
      archiveSection.className = 'digital-library-section';
      archiveSection.innerHTML = `
        <div class="section-title">
          <h2>Digital Library & Publications</h2>
          <div class="ar" lang="ar" dir="rtl">المكتبة الرقمية والمنشورات</div>
          <p>Open academic resources preserved and shared through Internet Archive.</p>
        </div>
        <div class="digital-library-card">
          <div class="digital-library-content">
            <span class="library-badge">📚 Open Academic Repository</span>
            <h3>Aouss Gabash Digital Library</h3>
            <p>
              Access books, lecture notes, research materials, archived publications,
              and educational resources related to artificial intelligence and electrical power systems.
            </p>
            <p class="library-ar" lang="ar" dir="rtl">
              الوصول إلى الكتب والملاحظات التعليمية والمواد البحثية والمنشورات المؤرشفة
              والمصادر العلمية المتعلقة بالذكاء الاصطناعي وأنظمة الطاقة الكهربائية.
            </p>
            <div class="library-resources" aria-label="Digital library resources">
              <span>📘 Books</span>
              <span>📄 Lecture Notes</span>
              <span>🧮 Engineering Resources</span>
              <span>🌐 Open Access</span>
            </div>
          </div>
          <div class="digital-library-action">
            <div class="library-symbol" aria-hidden="true">🏛️</div>
            <strong>Internet Archive Collection</strong>
            <span>External academic repository</span>
            <a href="${archiveUrl}" target="_blank" rel="noopener noreferrer">
              Open Digital Library ↗
            </a>
          </div>
        </div>`;

      const authorSection = document.getElementById('author');
      const container = document.querySelector('main > .container');
      if (authorSection && authorSection.parentNode) {
        authorSection.parentNode.insertBefore(archiveSection, authorSection);
      } else if (container) {
        container.appendChild(archiveSection);
      }
    }
  }

  const footer = document.createElement('footer');
  footer.className = 'site-footer course-footer';
  footer.innerHTML = `
    <div class="site-footer-inner">
      <div class="footer-title">AI Applications in Electrical Power Systems</div>
      <div class="footer-subtitle" lang="ar" dir="rtl">تطبيقات الذكاء الاصطناعي في أنظمة الطاقة الكهربائية</div>
      <div class="footer-links">
        <a href="index.html">Website</a>
        <a href="https://github.com/aoussgabash/AI-Electrical-Power-Systems" target="_blank" rel="noopener noreferrer">GitHub</a>
        <a href="${archiveUrl}" target="_blank" rel="noopener noreferrer">Internet Archive</a>
      </div>
      <div class="footer-info">${pageInfo}</div>
      <div class="footer-copy">© ${yearText} Aouss Gabash. All Rights Reserved.</div>
    </div>`;

  const existing = document.querySelector('footer');
  if (existing) existing.replaceWith(footer);
  else document.body.appendChild(footer);
})();
