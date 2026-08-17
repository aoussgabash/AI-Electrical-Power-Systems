(() => {
  'use strict';

  const dashboard = document.querySelector('[data-learning-dashboard]');
  if (!dashboard) return;

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
  const attempted = results.filter(Boolean);
  const completed = results.filter(result => Number(result?.percent) >= passMark);
  const average = attempted.length
    ? Math.round(attempted.reduce((sum, result) => sum + Number(result.percent || 0), 0) / attempted.length)
    : 0;
  const courseProgress = Math.round((completed.length / totalLectures) * 100);

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
      const title = result
        ? `Lecture ${num}: ${percent}%`
        : `Lecture ${num}: not attempted`;
      return `<a class="progress-item ${state}" href="lecture${num}.html" title="${title}">${symbol}</a>`;
    }).join('');
  }

  const achievements = [
    { selector: '[data-achievement-first]', unlocked: completed.length >= 1 },
    { selector: '[data-achievement-five]', unlocked: completed.length >= 5 },
    { selector: '[data-achievement-half]', unlocked: completed.length >= 10 },
    { selector: '[data-achievement-expert]', unlocked: completed.length >= totalLectures }
  ];

  achievements.forEach(({ selector, unlocked }) => {
    const element = dashboard.querySelector(selector);
    if (element) element.classList.toggle('locked', !unlocked);
  });

  const reset = dashboard.querySelector('[data-progress-reset]');
  reset?.addEventListener('click', () => {
    const confirmed = confirm('Reset all locally stored quiz results? | حذف جميع نتائج الاختبارات المحفوظة محليًا؟');
    if (!confirmed) return;
    for (let number = 1; number <= totalLectures; number += 1) {
      localStorage.removeItem(`ai-power-systems:lecture${String(number).padStart(2,'0')}`);
    }
    location.reload();
  });
})();
