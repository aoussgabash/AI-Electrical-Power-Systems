(() => {
  'use strict';

  const page = location.pathname.split('/').pop() || '';
  const match = page.match(/^(lecture|lab)(\d{2})\.html$/i);
  if (!match) return;

  const type = match[1].toLowerCase();
  const number = Number(match[2]);
  const maxNumber = 20;
  const num = String(number).padStart(2, '0');

  const track = document.createElement('div');
  track.id = 'reading-progress-track';
  track.setAttribute('aria-hidden', 'true');
  const bar = document.createElement('div');
  bar.id = 'reading-progress-bar';
  track.appendChild(bar);
  document.body.prepend(track);

  const updateProgress = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const percent = scrollable > 0
      ? Math.min(100, Math.max(0, window.scrollY / scrollable * 100))
      : 100;
    bar.style.width = `${percent}%`;
  };

  updateProgress();
  addEventListener('scroll', updateProgress, { passive: true });
  addEventListener('resize', updateProgress);

  const label = type === 'lecture'
    ? { en: 'Lecture', ar: 'المحاضرة' }
    : { en: 'Lab', ar: 'المخبر' };

  const fileName = n => `${type}${String(n).padStart(2, '0')}.html`;

  const difficulty = number <= 4
    ? ['Beginner', 'مبتدئ']
    : number <= 10
      ? ['Intermediate', 'متوسط']
      : ['Advanced', 'متقدم'];

  const duration = type === 'lecture'
    ? (number <= 8 ? 45 : number <= 16 ? 55 : 60)
    : (number <= 8 ? 60 : number <= 16 ? 75 : 90);

  const relatedType = type === 'lecture' ? 'lab' : 'lecture';
  const relatedLabel = type === 'lecture'
    ? `🧪 MATLAB Lab ${num} | المخبر ${num}`
    : `📘 Lecture ${num} | المحاضرة ${num}`;

  const metadata = document.createElement('div');
  metadata.className = 'course-metadata-bar';
  metadata.setAttribute('aria-label', 'Course page information');
  metadata.innerHTML = `
    <span class="course-meta-item">${type === 'lecture' ? '📖' : '🧪'} ${label.en} ${num} | ${label.ar} ${num}</span>
    <span class="course-meta-item">⏱ ${duration} min | ${duration} دقيقة</span>
    <span class="course-meta-item">📊 ${difficulty[0]} | ${difficulty[1]}</span>
    <a class="course-meta-item course-meta-link" href="${relatedType}${num}.html">${relatedLabel}</a>
    ${type === 'lecture' ? `<a class="course-meta-item course-meta-link" href="#quiz">📝 Quiz | الاختبار</a>` : ''}
  `;

  const hero = document.querySelector('.hero');
  const main = document.querySelector('main');
  if (hero?.parentNode) {
    hero.insertAdjacentElement('afterend', metadata);
  } else if (main) {
    main.prepend(metadata);
  } else {
    document.body.insertBefore(metadata, document.body.firstChild);
  }

  const quiz = document.querySelector('[data-course-quiz]');
  if (quiz) quiz.id = quiz.id || 'quiz';
  else metadata.querySelector('a[href="#quiz"]')?.classList.add('unavailable');

  const nav = document.createElement('nav');
  nav.className = 'course-page-navigation';
  nav.setAttribute('aria-label', 'Course page navigation');

  const makeLink = (className, href, mainText, smallText) => {
    const a = document.createElement('a');
    a.className = className;
    a.href = href;
    a.innerHTML = `<span>${mainText}<span class="course-nav-small">${smallText}</span></span>`;
    return a;
  };

  if (number > 1) {
    nav.appendChild(makeLink(
      'course-nav-link previous',
      fileName(number - 1),
      '← Previous | السابق',
      `${label.en} ${String(number - 1).padStart(2, '0')} | ${label.ar} ${String(number - 1).padStart(2, '0')}`
    ));
  } else {
    const placeholder = document.createElement('div');
    placeholder.className = 'course-nav-placeholder';
    nav.appendChild(placeholder);
  }

  const home = document.createElement('a');
  home.className = 'course-nav-home';
  home.href = 'index.html';
  home.textContent = '⌂ Home | الرئيسية';
  nav.appendChild(home);

  if (number < maxNumber) {
    nav.appendChild(makeLink(
      'course-nav-link next',
      fileName(number + 1),
      'Next | التالي →',
      `${label.en} ${String(number + 1).padStart(2, '0')} | ${label.ar} ${String(number + 1).padStart(2, '0')}`
    ));
  } else {
    const placeholder = document.createElement('div');
    placeholder.className = 'course-nav-placeholder';
    nav.appendChild(placeholder);
  }

  const footer = document.querySelector('footer');
  if (footer) footer.parentNode.insertBefore(nav, footer);
  else document.body.appendChild(nav);

  addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    const target = event.target;
    if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;
    if (event.key === 'ArrowLeft' && number > 1) location.href = fileName(number - 1);
    if (event.key === 'ArrowRight' && number < maxNumber) location.href = fileName(number + 1);
  });
})();
