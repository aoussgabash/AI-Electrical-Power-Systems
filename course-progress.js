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
  const attempted = results.filter(Boolean);
  const completed = results.filter(result => Number(result?.percent) >= passMark);
  const average = attempted.length
    ? Math.round(attempted.reduce((sum, result) => sum + Number(result.percent || 0), 0) / attempted.length)
    : 0;
  const courseProgress = Math.round((completed.length / totalLectures) * 100);

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
    if (caption) {
      caption.textContent = `${completed.length} of ${totalLectures} lectures completed | ${completed.length} من ${totalLectures} محاضرة مكتملة`;
    }

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
  }

  // Add progress state to each lecture card on the homepage.
  document.querySelectorAll('.course-card[data-type="lecture"]').forEach(card => {
    const href = card.getAttribute('href') || '';
    const match = href.match(/lecture(\d{2})\.html/i);
    if (!match) return;

    const number = Number(match[1]);
    const result = results[number - 1];
    const percent = Number(result?.percent || 0);

    let state = 'not-started';
    let label = 'Not Started | لم يبدأ';
    let icon = '○';

    if (result && percent >= passMark) {
      state = 'completed';
      label = `Completed ${percent}% | مكتملة`;
      icon = '✓';
    } else if (result) {
      state = 'in-progress';
      label = `In Progress ${percent}% | قيد التقدم`;
      icon = '●';
    }

    card.classList.remove('progress-completed', 'progress-in-progress', 'progress-not-started');
    card.classList.add(`progress-${state}`);

    let badge = card.querySelector('.card-progress-status');
    if (!badge) {
      badge = document.createElement('span');
      badge.className = 'card-progress-status';
      const cardTop = card.querySelector('.card-top');
      if (cardTop) cardTop.insertAdjacentElement('afterend', badge);
      else card.prepend(badge);
    }

    badge.className = `card-progress-status ${state}`;
    badge.textContent = `${icon} ${label}`;
    badge.setAttribute('aria-label', label);
  });
})();
