(() => {
  'use strict';

  const initCourseNavigation = () => {
    if (document.documentElement.dataset.courseNavigationReady === 'true') return;
    const page = location.pathname.split('/').pop() || '';
    const match = page.match(/^(lecture|lab)(\d{2})\.html$/i);
    if (!match) return;

    document.documentElement.dataset.courseNavigationReady = 'true';
    const type = match[1].toLowerCase();
    const number = Number(match[2]);
    const num = String(number).padStart(2, '0');
    const authorName = 'Dr.-Ing. Aouss Gabash';
    if (number < 1 || number > 20) return;

    const style = document.createElement('style');
    style.id = 'course-navigation-runtime-style';
    style.textContent = `
      .course-author-signature{display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:7px;width:fit-content;max-width:100%;margin:20px auto 0;padding:8px 14px;border:1px solid rgba(56,189,248,.28);border-radius:999px;background:rgba(8,31,51,.72);color:#eaf7ff;font-size:.9rem;line-height:1.4;box-shadow:0 8px 22px rgba(0,0,0,.16)}
      .course-author-label{color:#9fc7df;font-weight:600}.course-author-name{color:#fff;font-weight:800}
      main .course-action-panel{width:min(100%,820px)!important;margin:28px auto 34px!important;padding:20px!important;display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:14px!important;align-items:stretch!important;border:1px solid rgba(56,189,248,.24)!important;border-radius:24px!important;background:linear-gradient(145deg,rgba(9,38,62,.96),rgba(5,24,42,.96))!important;box-shadow:0 18px 42px rgba(0,0,0,.24)!important}
      main .course-action-card{min-height:122px!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:8px!important;padding:16px 14px!important;border:1px solid rgba(255,255,255,.14)!important;border-radius:17px!important;background:linear-gradient(145deg,#123652,#0b2238)!important;color:#f8fbff!important;text-decoration:none!important;text-align:center!important;box-shadow:0 10px 24px rgba(0,0,0,.18)!important;transition:transform .2s ease,border-color .2s ease,box-shadow .2s ease,background .2s ease!important;overflow:hidden!important}
      main .course-action-card:hover,main .course-action-card:focus-visible{transform:translateY(-4px)!important;border-color:rgba(56,189,248,.78)!important;box-shadow:0 16px 32px rgba(0,0,0,.3)!important;outline:none!important;background:linear-gradient(145deg,#174567,#0d2b46)!important}
      main .course-action-current{cursor:default!important;border-color:rgba(56,189,248,.38)!important;background:linear-gradient(145deg,#102f49,#0a2035)!important}
      main .course-action-current:hover{transform:none!important}
      main .course-action-icon{width:46px!important;height:46px!important;min-width:46px!important;min-height:46px!important;max-width:46px!important;max-height:46px!important;display:flex!important;align-items:center!important;justify-content:center!important;border:1px solid rgba(56,189,248,.32)!important;border-radius:14px!important;background:rgba(3,18,32,.42)!important;color:#38bdf8!important;font-family:Arial,Tahoma,sans-serif!important;font-size:25px!important;font-weight:800!important;line-height:1!important;overflow:hidden!important}
      main .course-action-icon-book::before{content:'▥';display:block;transform:scaleX(1.15)}
      main .course-action-icon-power::before{content:'⚡';display:block;font-size:26px}
      main .course-action-icon-download::before{content:'↓';display:block;font-size:31px;font-weight:400}
      main .course-action-related .course-action-icon{color:#facc15!important}
      main .course-action-download .course-action-icon{color:#7dd3fc!important}
      main .course-action-content{display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;width:100%!important}
      main .course-action-content strong{font-size:1.04rem!important;color:#fff!important}
      main .course-action-subtitle{direction:rtl!important;color:#dceaf6!important;font-size:.9rem!important}
      main .course-action-meta{color:#9fb7ca!important;font-size:.76rem!important;margin-top:4px!important}
      main .course-action-arrow{width:24px!important;height:24px!important;display:flex!important;align-items:center!important;justify-content:center!important;color:#fde047!important;font-size:24px!important;line-height:1!important}
      main .course-action-arrow::before{content:'→'}
      main .course-action-related{border-color:rgba(250,204,21,.38)!important}
      main .course-action-download{border-color:rgba(56,189,248,.58)!important;background:linear-gradient(145deg,#0d527e,#0a304e)!important}
      @media(max-width:760px){main .course-action-panel{grid-template-columns:1fr!important;width:calc(100% - 24px)!important;padding:14px!important}main .course-action-card{min-height:104px!important}}
      @media print{main .course-action-panel{display:none!important}}
    `;
    document.getElementById(style.id)?.remove();
    document.head.appendChild(style);

    const difficulty = number <= 4 ? ['Beginner','مبتدئ'] : number <= 10 ? ['Intermediate','متوسط'] : ['Advanced','متقدم'];
    const duration = type === 'lecture' ? (number <= 8 ? 45 : number <= 16 ? 55 : 60) : (number <= 8 ? 60 : number <= 16 ? 75 : 90);
    const relatedType = type === 'lecture' ? 'lab' : 'lecture';

    const card = ({className='',href='',iconClass,title,subtitle,meta='',tag='a'}) => {
      const element = document.createElement(tag);
      element.className = `course-action-card ${className}`.trim();
      if (href) element.href = href;
      element.innerHTML = `<span class="course-action-icon ${iconClass}" aria-hidden="true"></span><span class="course-action-content"><strong>${title}</strong><span class="course-action-subtitle">${subtitle}</span>${meta?`<span class="course-action-meta">${meta}</span>`:''}</span>${tag!=='div'?'<span class="course-action-arrow" aria-hidden="true"></span>':''}`;
      return element;
    };

    const hero = document.querySelector('.hero');
    const main = document.querySelector('main');
    if (!hero && !main) return;

    if (hero && !hero.querySelector('.course-author-signature')) {
      const author = document.createElement('div');
      author.className = 'course-author-signature';
      author.innerHTML = `<span class="course-author-label">Prepared by | إعداد:</span><span class="course-author-name">${authorName}</span>`;
      hero.appendChild(author);
    }

    document.querySelectorAll('.course-action-panel').forEach(panel => panel.remove());
    const actions = document.createElement('section');
    actions.className = 'course-action-panel';
    actions.setAttribute('aria-label','Course actions');

    actions.appendChild(card({
      tag:'div',
      className:'course-action-current',
      iconClass:type==='lecture'?'course-action-icon-book':'course-action-icon-power',
      title:type==='lecture'?`Lecture ${num}`:`MATLAB Lab ${num}`,
      subtitle:type==='lecture'?`المحاضرة ${num}`:`المختبر ${num}`,
      meta:`${duration} min · ${difficulty[0]} | ${difficulty[1]}`
    }));

    actions.appendChild(card({
      className:'course-action-related',
      href:`${relatedType}${num}.html`,
      iconClass:type==='lecture'?'course-action-icon-power':'course-action-icon-book',
      title:type==='lecture'?`MATLAB Lab ${num}`:`Lecture ${num}`,
      subtitle:type==='lecture'?`فتح مختبر الطاقة الكهربائية ${num}`:`فتح المحاضرة ${num}`,
      meta:type==='lecture'?'Electrical Power Lab | مخبر طاقة كهربائية':'Read Lesson | قراءة المحاضرة'
    }));

    const download = card({
      className:'course-action-download',
      href:`pdf/${type}${num}.pdf`,
      iconClass:'course-action-icon-download',
      title:type==='lecture'?'Download Lecture PDF':'Download Lab PDF',
      subtitle:type==='lecture'?'تحميل المحاضرة بصيغة PDF':'تحميل المختبر بصيغة PDF',
      meta:`Prepared by ${authorName}`
    });
    download.setAttribute('download',`${type}_${num}.pdf`);
    actions.appendChild(download);

    if (hero?.parentNode) hero.insertAdjacentElement('afterend',actions); else main.prepend(actions);
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',initCourseNavigation,{once:true});
  else initCourseNavigation();
})();
