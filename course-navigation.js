(() => {
  'use strict';

  const page = location.pathname.split('/').pop() || '';
  const match = page.match(/^(lecture|lab)(\d{2})\.html$/i);
  if (!match) return;

  const type = match[1].toLowerCase();
  const number = Number(match[2]);
  const maxNumber = 20;

  const style = document.createElement('style');
  style.textContent = `
    #reading-progress-track {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 4px;
      background: rgba(255,255,255,.08);
      z-index: 9999;
      pointer-events: none;
    }
    #reading-progress-bar {
      width: 0;
      height: 100%;
      background: linear-gradient(90deg,#38bdf8,#2563eb,#fbbf24);
      box-shadow: 0 0 12px rgba(56,189,248,.55);
      transition: width .08s linear;
    }
    .course-page-navigation {
      width: min(1100px,92%);
      margin: 28px auto 8px;
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      gap: 12px;
      align-items: center;
    }
    .course-nav-link,
    .course-nav-home {
      min-height: 54px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 7px;
      padding: 10px 14px;
      border: 1px solid rgba(255,255,255,.12);
      border-radius: 12px;
      background: #0b1b2c;
      color: #eef7ff;
      text-decoration: none;
      font-weight: 700;
      text-align: center;
      transition: transform .18s ease,border-color .18s ease;
    }
    .course-nav-link:hover,
    .course-nav-home:hover {
      transform: translateY(-2px);
      border-color: rgba(56,189,248,.55);
    }
    .course-nav-link.next { justify-self: stretch; }
    .course-nav-link.previous { justify-self: stretch; }
    .course-nav-placeholder { min-height: 54px; }
    .course-nav-small {
      display: block;
      color: #a9bfd2;
      font-size: .74rem;
      font-weight: 400;
      line-height: 1.2;
    }
    @media (max-width: 680px) {
      .course-page-navigation {
        grid-template-columns: 1fr 1fr;
      }
      .course-nav-home {
        grid-column: 1 / -1;
        grid-row: 1;
      }
      .course-nav-link.previous { grid-column: 1; }
      .course-nav-link.next { grid-column: 2; }
      .course-nav-placeholder { display:none; }
    }
  `;
  document.head.appendChild(style);

  const track = document.createElement('div');
  track.id = 'reading-progress-track';
  track.setAttribute('aria-hidden', 'true');
  const bar = document.createElement('div');
  bar.id = 'reading-progress-bar';
  track.appendChild(bar);
  document.body.prepend(track);

  const updateProgress = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const percent = scrollable > 0 ? Math.min(100, Math.max(0, window.scrollY / scrollable * 100)) : 100;
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
