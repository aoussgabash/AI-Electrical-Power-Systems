(() => {
  'use strict';

  const page = location.pathname.split('/').pop() || '';
  const match = page.match(/^(lecture|lab)(\d{2})\.html$/i);
  if (!match) return;

  const type = match[1].toLowerCase();
  const number = Number(match[2]);
  const maxNumber = 20;
  const num = String(number).padStart(2, '0');
  const authorName = 'Dr.-Ing. Aouss Gabash';

  const sharedStyle = document.createElement('style');
  sharedStyle.textContent = `
    .course-author-signature{
      display:flex;
      align-items:center;
      justify-content:center;
      flex-wrap:wrap;
      gap:7px;
      width:fit-content;
      max-width:100%;
      margin:20px auto 0;
      padding:8px 14px;
      border:1px solid rgba(56,189,248,.28);
      border-radius:999px;
      background:rgba(8,31,51,.72);
      color:#eaf7ff;
      font-size:.9rem;
      line-height:1.4;
      box-shadow:0 8px 22px rgba(0,0,0,.16);
    }
    .course-author-label{color:#9fc7df;font-weight:600}
    .course-author-name{color:#fff;font-weight:800;letter-spacing:.01em}
    .course-action-panel{
      display:grid!important;
      grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
      gap:14px!important;
      align-items:stretch!important;
    }
    .course-action-card{
      min-height:128px;
      display:grid;
      grid-template-columns:auto 1fr auto;
      align-items:center;
      gap:13px;
      padding:16px;
      border:1px solid rgba(255,255,255,.13);
      border-radius:15px;
      background:linear-gradient(145deg,#102d48,#0a1d31);
      color:#f8fbff!important;
      text-decoration:none!important;
      text-align:left;
      box-shadow:0 10px 24px rgba(0,0,0,.18);
      transition:transform .2s ease,border-color .2s ease,box-shadow .2s ease;
      cursor:pointer;
    }
    .course-action-card:hover,.course-action-card:focus-visible{
      transform:translateY(-3px);
      border-color:rgba(56,189,248,.65);
      box-shadow:0 16px 32px rgba(0,0,0,.28);
      outline:none;
    }
    .course-action-current{cursor:default;border-color:rgba(56,189,248,.38)}
    .course-action-current:hover{transform:none}
    .course-action-icon{font-size:2rem;line-height:1}
    .course-action-content{display:flex;flex-direction:column;min-width:0}
    .course-action-content strong{font-size:1.08rem;color:#fff;line-height:1.35}
    .course-action-subtitle{direction:rtl;text-align:left;color:#dceaf6;font-size:.94rem;line-height:1.5}
    .course-action-meta{color:#9fb7ca;font-size:.78rem;line-height:1.45;margin-top:5px}
    .course-action-arrow{font-size:1.3rem;color:#fde047}
    .course-action-related{border-color:rgba(250,204,21,.35)}
    .course-action-quiz{border-color:rgba(34,197,94,.4)}
    .course-action-download{border-color:rgba(56,189,248,.5);background:linear-gradient(145deg,#0d4770,#0a2944)}
    @media(max-width:620px){
      .course-author-signature{border-radius:13px;text-align:center;padding:9px 12px}
      .course-action-panel{grid-template-columns:1fr!important}
      .course-action-card{min-height:108px}
    }
    @page{size:A4 portrait;margin:14mm 14mm 18mm}
    @media print{
      html,body{background:#fff!important;color:#000!important;font-family:Arial,Tahoma,sans-serif!important}
      header,.course-action-panel,.course-page-navigation,#reading-progress-track,
      [data-course-quiz],footer,.site-footer,.course-footer,.back,.to-top{display:none!important}
      main,.container{width:100%!important;max-width:none!important;margin:0!important;padding:0!important}
      .hero{padding:0 0 8mm!important;margin:0!important;border-bottom:1px solid #888!important}
      .course-author-signature{
        display:flex!important;
        margin:5mm auto 0!important;
        padding:2.5mm 4mm!important;
        border:1px solid #777!important;
        background:#fff!important;
        color:#000!important;
        box-shadow:none!important;
      }
      .course-author-label,.course-author-name{color:#000!important}
      h1,h2,h3,strong{color:#000!important}
      p,li,.subtitle,.hero-ar,.ar,.en{color:#000!important}
      section{background:#fff!important;color:#000!important;border:1px solid #aaa!important;box-shadow:none!important;margin:7mm 0!important;padding:7mm!important;break-inside:auto}
      .mini-card,.highlight,.note,.warning,.research,.task,.formula,pre,.svg-wrap{
        background:#fff!important;color:#000!important;border:1px solid #aaa!important;box-shadow:none!important;break-inside:avoid
      }
      .ar{direction:rtl!important;text-align:right!important}
      .en{direction:ltr!important;text-align:left!important}
      a{color:#000!important;text-decoration:none!important}
      table{break-inside:avoid}
      img,svg{max-width:100%!important;page-break-inside:avoid}
    }
  `;
  document.head.appendChild(sharedStyle);

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
    if (tag === 'button') element.type = 'button';
    element.innerHTML = `
      <span class="course-action-icon" aria-hidden="true">${icon}</span>
      <span class="course-action-content">
        <strong>${title}</strong>
        <span class="course-action-subtitle">${subtitle}</span>
        ${meta ? `<span class="course-action-meta">${meta}</span>` : ''}
      </span>
      ${tag !== 'div' ? '<span class="course-action-arrow" aria-hidden="true">→</span>' : ''}
    `;
    return element;
  };

  const hero = document.querySelector('.hero');
  const main = document.querySelector('main');

  if (hero && !hero.querySelector('.course-author-signature')) {
    const author = document.createElement('div');
    author.className = 'course-author-signature';
    author.setAttribute('aria-label', `Prepared by ${authorName}`);
    author.innerHTML = `
      <span class="course-author-label">Prepared by | إعداد:</span>
      <span class="course-author-name">${authorName}</span>`;
    hero.appendChild(author);
  }

  const actions = document.createElement('section');
  actions.className = 'course-metadata-bar course-action-panel';
  actions.setAttribute('aria-label', 'Course actions');

  actions.appendChild(card({
    tag: 'div',
    className: 'course-action-current',
    icon: type === 'lecture' ? '📖' : '⚡',
    title: `${label.en} ${num}`,
    subtitle: `${label.ar} ${num}`,
    meta: `⏱ ${duration} min · 📊 ${difficulty[0]} | ${difficulty[1]}`
  }));

  actions.appendChild(card({
    className: 'course-action-related',
    href: `${relatedType}${num}.html`,
    icon: type === 'lecture' ? '⚡' : '📖',
    title: type === 'lecture' ? `MATLAB Lab ${num}` : `Lecture ${num}`,
    subtitle: type === 'lecture' ? `فتح المخبر ${num}` : `فتح المحاضرة ${num}`,
    meta: type === 'lecture' ? 'Programming Exercise | تمرين برمجي' : 'Read Lesson | قراءة المحاضرة'
  }));

  const downloadButton = card({
    className: 'course-action-download',
    href: `pdf/${type}${num}.pdf`,
    icon: '📥',
    title: type === 'lecture' ? 'Download Lecture PDF' : 'Download Lab PDF',
    subtitle: type === 'lecture' ? 'تحميل المحاضرة بصيغة PDF' : 'تحميل المخبر بصيغة PDF',
    meta: `Prepared by ${authorName}`
  });
  downloadButton.setAttribute(
    'download',
    `${type === 'lecture' ? 'Lecture' : 'MATLAB_Lab'}_${num}_AI_Power_Systems_Aouss_Gabash.pdf`
  );
  actions.appendChild(downloadButton);

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
