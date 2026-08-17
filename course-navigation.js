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
    : { en: 'MATLAB Lab', ar: 'المخبر' };

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

  const card = ({ className = '', href = '', icon, title, subtitle, meta, tag = 'a' }) => {
    const element = document.createElement(tag);
    element.className = `course-action-card ${className}`.trim();
    if (href) element.href = href;
    element.innerHTML = `
      <span class="course-action-icon" aria-hidden="true">${icon}</span>
      <span class="course-action-content">
        <strong>${title}</strong>
        <span class="course-action-subtitle">${subtitle}</span>
        ${meta ? `<span class="course-action-meta">${meta}</span>` : ''}
      </span>
      ${tag === 'a' ? '<span class="course-action-arrow" aria-hidden="true">→</span>' : ''}
    `;
    return element;
  };

  const actions = document.createElement('section');
  actions.className = 'course-metadata-bar course-action-panel';
  actions.setAttribute('aria-label', 'Course actions');

  actions.appendChild(card({
    tag: 'div',
    className: 'course-action-current',
    icon: type === 'lecture' ? '📖' : '🧪',
    title: `${label.en} ${num}`,
    subtitle: `${label.ar} ${num}`,
    meta: `⏱ ${duration} min · 📊 ${difficulty[0]} | ${difficulty[1]}`
  }));

  actions.appendChild(card({
    className: 'course-action-related',
    href: `${relatedType}${num}.html`,
    icon: type === 'lecture' ? '🧪' : '📖',
    title: type === 'lecture' ? `MATLAB Lab ${num}` : `Lecture ${num}`,
    subtitle: type === 'lecture' ? `فتح المخبر ${num}` : `فتح المحاضرة ${num}`,
    meta: type === 'lecture' ? 'Programming Exercise | تمرين برمجي' : 'Read Lesson | قراءة المحاضرة'
  }));

  const hero = document.querySelector('.hero');
  const main = document.querySelector('main');
  if (hero?.parentNode) hero.insertAdjacentElement('afterend', actions);
  else if (main) main.prepend(actions);
  else document.body.insertBefore(actions, document.body.firstChild);

  setTimeout(() => {
    const quiz = document.querySelector('[data-course-quiz]');
    if (!quiz || type !== 'lecture') return;
    quiz.id = quiz.id || 'quiz';
    const quizLink = card({
      className: 'course-action-quiz',
      href: '#quiz',
      icon: '📝',
      title: 'Quiz',
      subtitle: 'ابدأ الاختبار',
      meta: 'Start Assessment | بدء التقييم'
    });
    quizLink.addEventListener('click', event => {
      event.preventDefault();
      quiz.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', '#quiz');
    });
    actions.appendChild(quizLink);
  }, 0);

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
      'course-nav-link previous', fileName(number - 1), '← Previous | السابق',
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
      'course-nav-link next', fileName(number + 1), 'Next | التالي →',
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
