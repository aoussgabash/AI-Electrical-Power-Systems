(() => {
  'use strict';

  const page = location.pathname.split('/').pop() || '';
  const match = page.match(/^(lecture|lab)(\d{2})\.html$/i);
  if (!match) return;

  const type = match[1].toLowerCase();
  const number = Number(match[2]);
  const maxNumber = 20;

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

  const fileName = n => `${type}${String(n).padStart(2,'0')}.html`;
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
      `${label.en} ${String(number - 1).padStart(2,'0')} | ${label.ar} ${String(number - 1).padStart(2,'0')}`
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
      `${label.en} ${String(number + 1).padStart(2,'0')} | ${label.ar} ${String(number + 1).padStart(2,'0')}`
    ));
  } else {
    const placeholder = document.createElement('div');
    placeholder.className = 'course-nav-placeholder';
    nav.appendChild(placeholder);
  }

  const footer = document.querySelector('footer');
  if (footer) {
    footer.parentNode.insertBefore(nav, footer);
  } else {
    document.body.appendChild(nav);
  }

  addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    const target = event.target;
    if (target && ['INPUT','TEXTAREA','SELECT'].includes(target.tagName)) return;
    if (event.key === 'ArrowLeft' && number > 1) location.href = fileName(number - 1);
    if (event.key === 'ArrowRight' && number < maxNumber) location.href = fileName(number + 1);
  });
})();
