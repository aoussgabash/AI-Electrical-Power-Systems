(() => {
  'use strict';

  const totalLectures = 20;
  const passMark = 80;

  const getResult = number => {
    const key = `ai-power-systems:lecture${String(number).padStart(2,'0')}`;
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (_) {
      return null;
    }
  };

  const results = Array.from({ length: totalLectures }, (_, index) => getResult(index + 1));
  const attemptedEntries = results.map((result, index) => ({ result, number: index + 1 })).filter(entry => entry.result);
  const completedEntries = attemptedEntries.filter(entry => Number(entry.result.percent) >= passMark);
  const attempted = attemptedEntries.map(entry => entry.result);
  const completed = completedEntries.map(entry => entry.result);
  const average = attempted.length ? Math.round(attempted.reduce((sum, result) => sum + Number(result.percent || 0), 0) / attempted.length) : 0;
  const courseProgress = Math.round((completed.length / totalLectures) * 100);
  const nextLectureNumber = results.findIndex(result => Number(result?.percent || 0) < passMark) + 1 || totalLectures;
  const nextLecture = String(nextLectureNumber).padStart(2, '0');
  const bestEntry = attemptedEntries.length ? [...attemptedEntries].sort((a, b) => Number(b.result.percent || 0) - Number(a.result.percent || 0))[0] : null;
  const latestEntry = attemptedEntries.length ? [...attemptedEntries].sort((a, b) => {
    const aDate = new Date(a.result.lastAttemptAt || a.result.completedAt || 0).getTime();
    const bDate = new Date(b.result.lastAttemptAt || b.result.completedAt || 0).getTime();
    return bDate - aDate;
  })[0] : null;

  const dashboard = document.querySelector('[data-learning-dashboard]');
  if (dashboard) {
    const setText = (selector, value) => {
      const element = dashboard.querySelector(selector);
      if (element) element.textContent = value;
    };

    setText('[data-progress-completed]', `${completed.length}/${totalLectures}`);
    setText('[data-progress-attempted]', `${attempted.length}/${totalLectures}`);
    setText('[data-progress-average]', attempted.length ? `${average}%` : '—');
    setText('[data-progress-course]', `${courseProgress}%`);

    const fill = dashboard.querySelector('[data-progress-fill]');
    if (fill) requestAnimationFrame(() => { fill.style.width = `${courseProgress}%`; });

    const caption = dashboard.querySelector('[data-progress-caption]');
    if (caption) caption.textContent = `${completed.length} of ${totalLectures} lectures completed | ${completed.length} من ${totalLectures} محاضرة مكتملة`;

    const list = dashboard.querySelector('[data-progress-list]');
    if (list) {
      list.innerHTML = results.map((result, index) => {
        const number = index + 1;
        const num = String(number).padStart(2,'0');
        const percent = Number(result?.percent || 0);
        const state = percent >= passMark ? 'completed' : result ? 'attempted' : '';
        const symbol = percent >= passMark ? '✓' : result ? `${percent}%` : num;
        const title = result ? `Lecture ${num}: ${percent}%` : `Lecture ${num}: not attempted`;
        const style = state === 'completed'
          ? 'border-color:#22c55e!important;background:linear-gradient(135deg,rgba(34,197,94,.42),rgba(21,128,61,.34))!important;color:#dcfce7!important;box-shadow:0 0 0 1px rgba(34,197,94,.25),0 8px 18px rgba(22,163,74,.16)!important;'
          : state === 'attempted'
            ? 'border-color:#facc15!important;background:linear-gradient(135deg,rgba(250,204,21,.34),rgba(202,138,4,.28))!important;color:#fef3c7!important;box-shadow:0 0 0 1px rgba(250,204,21,.22),0 8px 18px rgba(202,138,4,.12)!important;'
            : 'border-color:rgba(56,189,248,.48)!important;background:linear-gradient(180deg,#10283f,#0c2135)!important;color:#7dd3fc!important;';
        return `<a class="progress-item ${state}" style="${style}" href="lecture${num}.html" title="${title}">${symbol}</a>`;
      }).join('');
    }

    let smartPanel = dashboard.querySelector('.continue-learning-panel');
    if (!smartPanel) {
      smartPanel = document.createElement('div');
      smartPanel.className = 'continue-learning-panel';
      dashboard.querySelector('.progress-panel')?.prepend(smartPanel);
    }

    if (smartPanel) {
      const bestText = bestEntry ? `Lecture ${String(bestEntry.number).padStart(2, '0')} — ${Number(bestEntry.result.percent)}%` : 'No result yet | لا توجد نتيجة بعد';
      const latestText = latestEntry ? `Lecture ${String(latestEntry.number).padStart(2, '0')} — ${Number(latestEntry.result.percent)}%` : 'No attempt yet | لا توجد محاولة بعد';
      const allDone = completed.length === totalLectures;
      smartPanel.innerHTML = `
        <div class="continue-learning-copy">
          <span class="continue-eyebrow">${allDone ? '🏆 Course Completed' : '▶ Continue Learning'} | ${allDone ? 'اكتمل المقرر' : 'تابع التعلم'}</span>
          <h3>${allDone ? 'You completed all 20 lectures.' : `Continue with Lecture ${nextLecture}`}</h3>
          <p>${allDone ? 'Review any lecture or print your lecture certificates.' : `المحاضرة التالية المقترحة: ${nextLecture}`}</p>
        </div>
        <a class="continue-learning-button" href="lecture${allDone ? '01' : nextLecture}.html">${allDone ? 'Review Course | مراجعة المقرر' : `Open Lecture ${nextLecture} | فتح المحاضرة ${nextLecture}`}</a>
        <div class="continue-learning-details">
          <span><strong>Best Result | أفضل نتيجة</strong>${bestText}</span>
          <span><strong>Latest Attempt | آخر محاولة</strong>${latestText}</span>
        </div>`;
    }

    [
      { selector: '[data-achievement-first]', unlocked: completed.length >= 1 },
      { selector: '[data-achievement-five]', unlocked: completed.length >= 5 },
      { selector: '[data-achievement-half]', unlocked: completed.length >= 10 },
      { selector: '[data-achievement-expert]', unlocked: completed.length >= totalLectures }
    ].forEach(({ selector, unlocked }) => {
      const element = dashboard.querySelector(selector);
      if (element) element.classList.toggle('locked', !unlocked);
    });

    dashboard.querySelector('[data-progress-reset]')?.addEventListener('click', () => {
      if (!confirm('Reset all locally stored quiz results? | حذف جميع نتائج الاختبارات المحفوظة محليًا؟')) return;
      for (let number = 1; number <= totalLectures; number += 1) localStorage.removeItem(`ai-power-systems:lecture${String(number).padStart(2,'0')}`);
      location.reload();
    });
  }

  document.querySelectorAll('.course-card[data-type="lecture"]').forEach(card => {
    const match = (card.getAttribute('href') || '').match(/lecture(\d{2})\.html/i);
    if (!match) return;
    const number = Number(match[1]);
    const result = results[number - 1];
    const percent = Number(result?.percent || 0);
    let state = 'not-started';
    let label = 'Not Started | لم يبدأ';
    let icon = '○';
    if (result && percent >= passMark) { state = 'completed'; label = `Completed ${percent}% | مكتملة`; icon = '✓'; }
    else if (result) { state = 'in-progress'; label = `In Progress ${percent}% | قيد التقدم`; icon = '●'; }
    card.classList.remove('progress-completed', 'progress-in-progress', 'progress-not-started');
    card.classList.add(`progress-${state}`);
    let badge = card.querySelector('.card-progress-status');
    if (!badge) {
      badge = document.createElement('span');
      badge.className = 'card-progress-status';
      const cardTop = card.querySelector('.card-top');
      if (cardTop) cardTop.insertAdjacentElement('afterend', badge); else card.prepend(badge);
    }
    badge.className = `card-progress-status ${state}`;
    badge.textContent = `${icon} ${label}`;
    badge.setAttribute('aria-label', label);
  });

  const nav = document.querySelector('header nav');
  const brand = nav?.querySelector('.brand');
  const menu = nav?.querySelector('.navlinks');

  if (nav && brand && !nav.querySelector('.ag-home-button')) {
    const left = document.createElement('div');
    left.className = 'ag-header-left';
    const home = document.createElement('a');
    home.className = 'ag-home-button';
    home.href = 'https://aoussgabash.com';
    home.setAttribute('aria-label', 'AG Home | الموقع الأم');
    home.title = 'AG Home | الموقع الأم';
    home.innerHTML = '<span aria-hidden="true">⌂</span>';
    brand.before(left);
    left.append(home, brand);
  }

  let homeLink = menu?.querySelector('.ag-home-menu-link');
  if (menu && !homeLink) {
    homeLink = document.createElement('a');
    homeLink.className = 'ag-home-menu-link';
    homeLink.href = 'https://aoussgabash.com';
    homeLink.innerHTML = '⌂ AG Home | الموقع الأم';
    menu.appendChild(homeLink);
  }

  let contactSection = document.querySelector('#contact');
  if (!contactSection) {
    contactSection = document.createElement('section');
    contactSection.id = 'contact';
    contactSection.innerHTML = `
      <div class="section-title">
        <h2>AI Platform Enquiries</h2>
        <div class="ar" lang="ar" dir="rtl">استفسارات منصة الذكاء الاصطناعي</div>
      </div>
      <div class="author-box ai-contact-box">
        <div>
          <h3>Teaching and course enquiries</h3>
          <p>For questions related to lectures, MATLAB laboratories, course content, and supervised educational use.</p>
          <a class="btn primary" href="mailto:aoussgabash@ieee.org?subject=AI%20Power%20Systems%20Inquiry">aoussgabash@ieee.org</a>
        </div>
        <div class="ar" lang="ar" dir="rtl">
          <h3>استفسارات التدريس والمقرر</h3>
          <p>للاستفسارات المتعلقة بالمحاضرات ومخابر MATLAB ومحتوى المقرر والاستخدام التعليمي تحت الإشراف.</p>
        </div>
      </div>`;
    const mainContainer = document.querySelector('main .container');
    if (mainContainer) mainContainer.appendChild(contactSection);
  }

  let contactLink = menu?.querySelector('.ag-contact-menu-link');
  if (menu && !contactLink) {
    contactLink = document.createElement('a');
    contactLink.className = 'ag-contact-menu-link';
    contactLink.innerHTML = '✉ Contact | التواصل';
    menu.insertBefore(contactLink, homeLink || null);
  }
  if (contactLink) contactLink.href = '#contact';

  if (!document.getElementById('ag-ai-unified-header-style')) {
    const style = document.createElement('style');
    style.id = 'ag-ai-unified-header-style';
    style.textContent = `
      nav{position:relative}.ag-header-left{display:flex;align-items:center;gap:10px;min-width:0}.ag-home-button{display:inline-flex;align-items:center;justify-content:center;width:46px;height:46px;flex:0 0 46px;border:1px solid rgba(255,255,255,.18);border-radius:50%;background:#0b1d30;color:#fff!important;text-decoration:none;font-size:1.55rem;line-height:1}.ag-home-button span{color:#fff!important;line-height:1}.ag-home-button:hover,.ag-home-button:focus-visible{border-color:rgba(56,189,248,.7);background:#0d2943;outline:none}.ag-home-menu-link,.ag-contact-menu-link{margin-top:0;padding-top:11px!important;border-top:0!important}.ai-contact-box{scroll-margin-top:96px}
      @media(max-width:620px){.ag-header-left{gap:8px}.ag-home-button{width:42px;height:42px;flex-basis:42px;font-size:1.35rem}.brand img{width:42px!important;height:42px!important}.brand span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}}
    `;
    document.head.appendChild(style);
  }
})();
