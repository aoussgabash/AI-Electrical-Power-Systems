(() => {
  'use strict';

  if (document.documentElement.dataset.courseNavigationReady === 'true') return;
  document.documentElement.dataset.courseNavigationReady = 'true';

  const page = location.pathname.split('/').pop() || '';
  const match = page.match(/^(lecture|lab)(\d{2})\.html$/i);
  if (!match) return;

  const type = match[1].toLowerCase();
  const number = Number(match[2]);
  const maxNumber = 20;
  const num = String(number).padStart(2, '0');
  const authorName = 'Dr.-Ing. Aouss Gabash';

  if (number < 1 || number > maxNumber) return;

  const style = document.createElement('style');
  style.id = 'course-navigation-runtime-style';
  style.textContent = `
    .course-author-signature{display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:7px;width:fit-content;max-width:100%;margin:20px auto 0;padding:8px 14px;border:1px solid rgba(56,189,248,.28);border-radius:999px;background:rgba(8,31,51,.72);color:#eaf7ff;font-size:.9rem;line-height:1.4;box-shadow:0 8px 22px rgba(0,0,0,.16)}
    .course-author-label{color:#9fc7df;font-weight:600}.course-author-name{color:#fff;font-weight:800;letter-spacing:.01em}

    .course-action-panel{width:min(100%,820px)!important;margin:28px auto 34px!important;padding:20px!important;display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:14px!important;align-items:stretch!important;border:1px solid rgba(56,189,248,.24)!important;border-radius:24px!important;background:linear-gradient(145deg,rgba(9,38,62,.96),rgba(5,24,42,.96))!important;box-shadow:0 18px 42px rgba(0,0,0,.24)!important}
    .course-action-card{min-height:122px;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:8px!important;padding:16px 14px!important;border:1px solid rgba(255,255,255,.14)!important;border-radius:17px!important;background:linear-gradient(145deg,#123652,#0b2238)!important;color:#f8fbff!important;text-decoration:none!important;text-align:center!important;box-shadow:0 10px 24px rgba(0,0,0,.18)!important;transition:transform .2s ease,border-color .2s ease,box-shadow .2s ease,background .2s ease!important;cursor:pointer!important;overflow:hidden!important}
    .course-action-card:hover,.course-action-card:focus-visible{transform:translateY(-4px)!important;border-color:rgba(56,189,248,.78)!important;box-shadow:0 16px 32px rgba(0,0,0,.3)!important;outline:none!important;background:linear-gradient(145deg,#174567,#0d2b46)!important}
    .course-action-current{cursor:default!important;border-color:rgba(56,189,248,.38)!important;background:linear-gradient(145deg,#102f49,#0a2035)!important}.course-action-current:hover{transform:none!important}
    .course-action-icon{font-size:2rem!important;line-height:1!important}.course-action-content{display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;min-width:0!important;width:100%!important}
    .course-action-content strong{font-size:1.04rem!important;color:#fff!important;line-height:1.35!important}.course-action-subtitle{direction:rtl!important;text-align:center!important;color:#dceaf6!important;font-size:.9rem!important;line-height:1.45!important}.course-action-meta{color:#9fb7ca!important;font-size:.76rem!important;line-height:1.4!important;margin-top:4px!important}
    .course-action-arrow{font-size:1.25rem!important;color:#fde047!important;line-height:1!important}.course-action-related{border-color:rgba(250,204,21,.38)!important}.course-action-quiz{border-color:rgba(34,197,94,.45)!important}.course-action-download{border-color:rgba(56,189,248,.58)!important;background:linear-gradient(145deg,#0d527e,#0a304e)!important}

    @media(max-width:760px){.course-action-panel{grid-template-columns:1fr!important;width:calc(100% - 24px)!important;padding:14px!important;gap:12px!important;border-radius:20px!important}.course-action-card{min-height:94px!important;padding:14px 16px!important}.course-author-signature{border-radius:13px;text-align:center;padding:9px 12px}}
    @page{size:A4 portrait;margin:14mm 14mm 18mm}
    @media print{html,body{background:#fff!important;color:#000!important;font-family:Arial,Tahoma,sans-serif!important}header,.course-action-panel,.course-page-navigation,#reading-progress-track,[data-course-quiz],footer,.site-footer,.course-footer,.back,.to-top{display:none!important}main,.container{width:100%!important;max-width:none!important;margin:0!important;padding:0!important}.hero{padding:0 0 8mm!important;margin:0!important;border-bottom:1px solid #888!important}.course-author-signature{display:flex!important;margin:5mm auto 0!important;padding:2.5mm 4mm!important;border:1px solid #777!important;background:#fff!important;color:#000!important;box-shadow:none!important}.course-author-label,.course-author-name,h1,h2,h3,strong,p,li,.subtitle,.hero-ar,.ar,.en{color:#000!important}section{background:#fff!important;color:#000!important;border:1px solid #aaa!important;box-shadow:none!important;margin:7mm 0!important;padding:7mm!important;break-inside:auto}.mini-card,.highlight,.note,.warning,.research,.task,.formula,pre,.svg-wrap,.svg-box{background:#fff!important;color:#000!important;border:1px solid #aaa!important;box-shadow:none!important;break-inside:avoid}.ar{direction:rtl!important;text-align:right!important}.en{direction:ltr!important;text-align:left!important}a{color:#000!important;text-decoration:none!important}table,img,svg{break-inside:avoid;page-break-inside:avoid;max-width:100%!important}}
  `;
  document.getElementById(style.id)?.remove();
  document.head.appendChild(style);

  const label = type === 'lecture'
    ? { en: 'Lecture', ar: 'المحاضرة' }
    : { en: 'MATLAB Lab', ar: 'المختبر' };
  const relatedType = type === 'lecture' ? 'lab' : 'lecture';
  const fileName = n => `${type}${String(n).padStart(2, '0')}.html`;
  const relatedFileName = n => `${relatedType}${String(n).padStart(2, '0')}.html`;
  const difficulty = number <= 4 ? ['Beginner', 'مبتدئ'] : number <= 10 ? ['Intermediate', 'متوسط'] : ['Advanced', 'متقدم'];
  const duration = type === 'lecture' ? (number <= 8 ? 45 : number <= 16 ? 55 : 60) : (number <= 8 ? 60 : number <= 16 ? 75 : 90);

  const card = ({ className = '', href = '', icon, title, subtitle, meta = '', tag = 'a' }) => {
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
      ${tag !== 'div' ? '<span class="course-action-arrow" aria-hidden="true">→</span>' : ''}`;
    return element;
  };

  if (!document.getElementById('reading-progress-track')) {
    const track = document.createElement('div');
    track.id = 'reading-progress-track';
    track.setAttribute('aria-hidden', 'true');
    const bar = document.createElement('div');
    bar.id = 'reading-progress-bar';
    track.appendChild(bar);
    document.body.prepend(track);
    let scheduled = false;
    const updateProgress = () => {
      scheduled = false;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const percent = scrollable > 0 ? Math.min(100, Math.max(0, window.scrollY / scrollable * 100)) : 100;
      bar.style.width = `${percent}%`;
    };
    const scheduleProgress = () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(updateProgress);
    };
    updateProgress();
    addEventListener('scroll', scheduleProgress, { passive: true });
    addEventListener('resize', scheduleProgress, { passive: true });
  }

  const hero = document.querySelector('.hero');
  const main = document.querySelector('main');

  if (hero && !hero.querySelector('.course-author-signature')) {
    const author = document.createElement('div');
    author.className = 'course-author-signature';
    author.setAttribute('aria-label', `Prepared by ${authorName}`);
    author.innerHTML = `<span class="course-author-label">Prepared by | إعداد:</span><span class="course-author-name">${authorName}</span>`;
    hero.appendChild(author);
  }

  document.querySelectorAll('.course-action-panel').forEach(panel => panel.remove());

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
    href: relatedFileName(number),
    icon: type === 'lecture' ? '⚡' : '📖',
    title: type === 'lecture' ? `MATLAB Lab ${num}` : `Lecture ${num}`,
    subtitle: type === 'lecture' ? `فتح المختبر ${num}` : `فتح المحاضرة ${num}`,
    meta: type === 'lecture' ? 'Programming Exercise | تمرين برمجي' : 'Read Lesson | قراءة المحاضرة'
  }));

  const download = card({
    className: 'course-action-download',
    href: `pdf/${type}${num}.pdf`,
    icon: '📥',
    title: type === 'lecture' ? 'Download Lecture PDF' : 'Download Lab PDF',
    subtitle: type === 'lecture' ? 'تحميل المحاضرة بصيغة PDF' : 'تحميل المختبر بصيغة PDF',
    meta: `Prepared by ${authorName}`
  });
  download.setAttribute('download', `${type === 'lecture' ? 'Lecture' : 'MATLAB_Lab'}_${num}_AI_Power_Systems_Aouss_Gabash.pdf`);
  actions.appendChild(download);

  if (hero?.parentNode) hero.insertAdjacentElement('afterend', actions);
  else if (main) main.prepend(actions);

  queueMicrotask(() => {
    const quiz = document.querySelector('[data-course-quiz]');
    if (!quiz || type !== 'lecture') return;
    quiz.id ||= 'quiz';
    const quizLink = card({className:'course-action-quiz',href:'#quiz',icon:'📝',title:'Quiz',subtitle:'ابدأ الاختبار',meta:'Start Assessment | بدء التقييم'});
    quizLink.addEventListener('click', event => {
      event.preventDefault();
      quiz.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', '#quiz');
    });
    actions.appendChild(quizLink);
  });

  if (!document.querySelector('.course-page-navigation')) {
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
    if (number > 1) nav.appendChild(makeLink('course-nav-link previous', fileName(number - 1), '← Previous | السابق', `${label.en} ${String(number - 1).padStart(2, '0')} | ${label.ar} ${String(number - 1).padStart(2, '0')}`));
    else nav.appendChild(Object.assign(document.createElement('div'), { className: 'course-nav-placeholder' }));
    const home = document.createElement('a');
    home.className = 'course-nav-home';
    home.href = 'index.html';
    home.textContent = '⌂ Home | الرئيسية';
    nav.appendChild(home);
    if (number < maxNumber) nav.appendChild(makeLink('course-nav-link next', fileName(number + 1), 'Next | التالي →', `${label.en} ${String(number + 1).padStart(2, '0')} | ${label.ar} ${String(number + 1).padStart(2, '0')}`));
    else nav.appendChild(Object.assign(document.createElement('div'), { className: 'course-nav-placeholder' }));
    const footer = document.querySelector('footer');
    if (footer) footer.parentNode.insertBefore(nav, footer);
    else document.body.appendChild(nav);
  }

  addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.target?.closest('input,textarea,select,button,[contenteditable="true"]')) return;
    if (event.key === 'ArrowLeft' && number > 1) location.href = fileName(number - 1);
    if (event.key === 'ArrowRight' && number < maxNumber) location.href = fileName(number + 1);
  });
})();
