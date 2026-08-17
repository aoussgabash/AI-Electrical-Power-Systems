(() => {
  'use strict';

  const startYear = 2026;
  const currentYear = new Date().getFullYear();
  const yearText = currentYear > startYear ? `${startYear}–${currentYear}` : `${startYear}`;

  const footer = document.createElement('footer');
  footer.className = 'site-footer';
  footer.innerHTML = `
    <div class="site-footer-inner">
      <strong>AI Applications in Electrical Power Systems</strong>
      <span class="site-footer-ar">تطبيقات الذكاء الاصطناعي في أنظمة الطاقة الكهربائية</span>
      <span class="site-footer-tagline">Artificial Intelligence for Modern Power Engineering</span>
      <span class="site-footer-version">Version 1.0</span>
      <span class="site-footer-copy">© ${yearText} Aouss Gabash. All Rights Reserved.</span>
    </div>`;

  const existing = document.querySelector('footer');
  if (existing) existing.replaceWith(footer);
  else document.body.appendChild(footer);
})();
