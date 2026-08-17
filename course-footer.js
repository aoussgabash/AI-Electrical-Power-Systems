(() => {
  'use strict';

  const startYear = 2026;
  const currentYear = new Date().getFullYear();
  const yearText = currentYear > startYear ? `${startYear}–${currentYear}` : `${startYear}`;
  const page = location.pathname.split('/').pop() || '';
  const match = page.match(/^(lecture|lab)(\d{2})\.html$/i);

  let pageInfo = 'Version 1.0';
  if (match) {
    const type = match[1].toLowerCase();
    const number = match[2];
    pageInfo = type === 'lab'
      ? `MATLAB Lab ${number} • Lecture ${number} • Version 1.0`
      : `Lecture ${number} • MATLAB Lab ${number} • Version 1.0`;
  }

  const footer = document.createElement('footer');
  footer.className = 'site-footer course-footer';
  footer.innerHTML = `
    <div class="site-footer-inner">
      <div class="footer-title">AI Applications in Electrical Power Systems</div>
      <div class="footer-subtitle" lang="ar" dir="rtl">تطبيقات الذكاء الاصطناعي في أنظمة الطاقة الكهربائية</div>
      <div class="footer-info">${pageInfo}</div>
      <div class="footer-copy">© ${yearText} Aouss Gabash. All Rights Reserved.</div>
    </div>`;

  const existing = document.querySelector('footer');
  if (existing) existing.replaceWith(footer);
  else document.body.appendChild(footer);
})();
