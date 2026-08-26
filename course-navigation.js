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

    const isCourseOne = number <= 10;
    const accent = isCourseOne ? '#38bdf8' : '#fbbf24';
    const accentSoft = isCourseOne ? 'rgba(56,189,248,.38)' : 'rgba(251,191,36,.42)';
    const courseNumber = isCourseOne ? 1 : 2;
    const courseTitle = isCourseOne ? 'Artificial Intelligence and Machine Learning Fundamentals' : 'AI Applications in Electrical Power Systems';
    const courseTitleAr = isCourseOne ? 'أساسيات الذكاء الاصطناعي وتعلم الآلة' : 'تطبيقات الذكاء الاصطناعي في أنظمة الطاقة الكهربائية';
    const academicYear = isCourseOne ? 'Fourth Year Undergraduate' : 'Fifth Year Undergraduate';
    const academicYearAr = isCourseOne ? 'السنة الجامعية الرابعة' : 'السنة الجامعية الخامسة';
    const localNumber = isCourseOne ? number : number - 10;
    const localNum = String(localNumber).padStart(2, '0');
    const difficulty = number <= 4 ? ['Beginner','مبتدئ'] : number <= 10 ? ['Intermediate','متوسط'] : ['Advanced','متقدم'];
    const duration = type === 'lecture' ? (isCourseOne ? 50 : 60) : (isCourseOne ? 75 : 90);
    const relatedType = type === 'lecture' ? 'lab' : 'lecture';
    const documentKind = type === 'lecture' ? 'Lecture' : 'MATLAB Laboratory';
    const documentKindAr = type === 'lecture' ? 'محاضرة' : 'مخبر MATLAB';

    const panelStyle = [
      'width:min(100%,820px)','margin:20px auto 34px','padding:20px','display:grid','grid-template-columns:1fr','gap:14px','align-items:stretch',
      `border:1px solid ${isCourseOne ? 'rgba(56,189,248,.24)' : 'rgba(251,191,36,.34)'}`,'border-radius:24px',
      `background:${isCourseOne ? 'linear-gradient(145deg,rgba(9,38,62,.96),rgba(5,24,42,.96))' : 'radial-gradient(circle at 88% 8%,rgba(251,191,36,.12),transparent 34%),linear-gradient(145deg,#252116,#171a20)'}`,
      `box-shadow:${isCourseOne ? '0 18px 42px rgba(0,0,0,.24)' : '0 18px 46px rgba(245,158,11,.14)'}`,'box-sizing:border-box','visibility:visible','opacity:1'
    ].join(';');

    const baseCardStyle = [
      'min-height:122px','display:flex','flex-direction:column','align-items:center','justify-content:center','gap:8px','padding:16px 14px',
      `border:1px solid ${isCourseOne ? 'rgba(255,255,255,.14)' : 'rgba(251,191,36,.24)'}`,'border-radius:17px',
      `background:${isCourseOne ? 'linear-gradient(145deg,#123652,#0b2238)' : 'linear-gradient(145deg,#292516,#1a1d24)'}`,
      'color:#f8fbff','text-decoration:none','text-align:center','box-shadow:0 10px 24px rgba(0,0,0,.18)','overflow:hidden','box-sizing:border-box'
    ].join(';');

    const iconStyle = [
      'width:46px','height:46px','min-width:46px','min-height:46px','max-width:46px','max-height:46px','display:flex','align-items:center','justify-content:center',
      `border:1px solid ${isCourseOne ? 'rgba(56,189,248,.32)' : 'rgba(251,191,36,.42)'}`,'border-radius:14px',
      `background:${isCourseOne ? 'rgba(3,18,32,.42)' : 'rgba(74,52,12,.30)'}`,'font-family:Arial,Tahoma,sans-serif','font-size:26px','font-weight:800','line-height:1','overflow:hidden','box-sizing:border-box'
    ].join(';');

    const contentStyle = 'display:flex;flex-direction:column;align-items:center;justify-content:center;width:100%;gap:3px';
    const titleStyle = `font-size:1.04rem;color:${isCourseOne ? '#fff' : '#fff7d6'};line-height:1.35;font-weight:800`;
    const subtitleStyle = `direction:rtl;color:${isCourseOne ? '#dceaf6' : '#fff0b3'};font-size:.9rem;line-height:1.45;text-align:center`;
    const metaStyle = `color:${isCourseOne ? '#9fb7ca' : '#d6c58e'};font-size:.76rem;line-height:1.4;margin-top:4px;text-align:center`;
    const arrowStyle = `width:24px;height:24px;display:flex;align-items:center;justify-content:center;color:${isCourseOne ? '#fde047' : '#fbbf24'};font-size:24px;line-height:1`;

    const card = ({href='',icon,title,subtitle,meta='',kind='default',tag='a'}) => {
      const element = document.createElement(tag);
      element.className = `course-action-card course-action-${kind} course-${courseNumber}-action`;
      if (href) element.href = href;
      let cardStyle = baseCardStyle;
      if (kind === 'current') cardStyle += `;cursor:default;border-color:${accentSoft};background:${isCourseOne ? 'linear-gradient(145deg,#102f49,#0a2035)' : 'linear-gradient(145deg,#302915,#1b1d21)'}`;
      if (kind === 'related') cardStyle += `;border-color:${isCourseOne ? 'rgba(250,204,21,.38)' : 'rgba(251,191,36,.54)'}`;
      if (kind === 'download') cardStyle += `;border-color:${isCourseOne ? 'rgba(56,189,248,.58)' : 'rgba(251,191,36,.68)'};background:${isCourseOne ? 'linear-gradient(145deg,#0d527e,#0a304e)' : 'linear-gradient(145deg,#6b4d0d,#31240d)'}`;
      if (kind === 'agent') cardStyle += ';border-color:rgba(52,211,153,.58);background:linear-gradient(145deg,#0f4b46,#0a2b31)';
      element.setAttribute('style', cardStyle);

      const iconElement = document.createElement('span');
      iconElement.setAttribute('style', `${iconStyle};color:${kind === 'agent' ? '#6ee7b7' : isCourseOne ? (kind === 'related' ? '#facc15' : kind === 'download' ? '#7dd3fc' : '#38bdf8') : '#fbbf24'}`);
      iconElement.setAttribute('aria-hidden','true');
      iconElement.textContent = icon;

      const content = document.createElement('span');
      content.setAttribute('style', contentStyle);
      const strong = document.createElement('strong');
      strong.setAttribute('style', titleStyle);
      strong.textContent = title;
      const sub = document.createElement('span');
      sub.setAttribute('style', subtitleStyle);
      sub.textContent = subtitle;
      content.append(strong, sub);
      if (meta) {
        const metaElement = document.createElement('span');
        metaElement.setAttribute('style', metaStyle);
        metaElement.textContent = meta;
        content.appendChild(metaElement);
      }

      element.append(iconElement, content);
      if (tag !== 'div') {
        const arrow = document.createElement('span');
        arrow.setAttribute('style', arrowStyle);
        arrow.setAttribute('aria-hidden','true');
        arrow.textContent = '→';
        element.appendChild(arrow);
      }
      return element;
    };

    const hero = document.querySelector('.hero');
    const main = document.querySelector('main');
    if (!hero && !main) return;

    if (hero && !hero.querySelector('.course-author-signature')) {
      const author = document.createElement('div');
      author.className = 'course-author-signature';
      author.setAttribute('style',`display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:7px;width:fit-content;max-width:100%;margin:20px auto 0;padding:8px 14px;border:1px solid ${isCourseOne ? 'rgba(56,189,248,.28)' : 'rgba(251,191,36,.32)'};border-radius:999px;background:${isCourseOne ? 'rgba(8,31,51,.72)' : 'rgba(53,39,12,.55)'};color:${isCourseOne ? '#eaf7ff' : '#fff7d6'};font-size:.9rem;line-height:1.4;box-shadow:0 8px 22px rgba(0,0,0,.16)`);
      author.innerHTML = `<span style="color:${isCourseOne ? '#9fc7df' : '#d6c58e'};font-weight:600">Prepared by | إعداد:</span><span style="color:#fff;font-weight:800">${authorName}</span>`;
      hero.appendChild(author);
    }

    document.querySelectorAll('.academic-course-banner,.course-action-panel,.course-metadata-bar').forEach(panel => panel.remove());

    const banner = document.createElement('section');
    banner.className = `academic-course-banner academic-course-${courseNumber}`;
    banner.setAttribute('aria-label',`Course ${courseNumber} academic information`);
    banner.setAttribute('style',[
      'width:min(100%,1100px)','margin:26px auto 18px','padding:20px','display:grid','grid-template-columns:minmax(0,1.45fr) minmax(280px,.55fr)','gap:18px','align-items:center',
      `border:1px solid ${isCourseOne ? 'rgba(56,189,248,.42)' : 'rgba(251,191,36,.52)'}`,'border-radius:22px',
      `background:${isCourseOne ? 'linear-gradient(135deg,rgba(8,55,87,.96),rgba(7,28,48,.96))' : 'radial-gradient(circle at 88% 8%,rgba(251,191,36,.14),transparent 34%),linear-gradient(135deg,#403313,#171b22)'}`,
      `box-shadow:${isCourseOne ? '0 18px 40px rgba(0,0,0,.22)' : '0 18px 48px rgba(245,158,11,.16)'}`,'box-sizing:border-box','color:#fff'
    ].join(';'));

    const identity = document.createElement('div');
    identity.setAttribute('style','min-width:0');
    identity.innerHTML = `
      <div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-bottom:10px">
        <span style="display:inline-flex;align-items:center;min-height:30px;padding:5px 11px;border-radius:999px;background:${isCourseOne ? 'rgba(56,189,248,.14)' : 'rgba(251,191,36,.18)'};border:1px solid ${isCourseOne ? 'rgba(56,189,248,.45)' : 'rgba(251,191,36,.58)'};color:${isCourseOne ? '#dff7ff' : '#fff3b0'};font-size:.78rem;font-weight:800;letter-spacing:.04em">COURSE ${courseNumber} · ${isCourseOne ? '4TH YEAR' : '5TH YEAR'}</span>
        <span style="color:${isCourseOne ? '#b8ccdc' : '#d6c58e'};font-size:.84rem">${academicYear} | ${academicYearAr}</span>
      </div>
      <h2 style="margin:0 0 5px;color:${isCourseOne ? '#fff' : '#fff7d6'};font-size:clamp(1.25rem,3vw,1.75rem);line-height:1.25">${courseTitle}</h2>
      <div lang="ar" dir="rtl" style="color:${isCourseOne ? '#e5edf5' : '#fff0b3'};font-size:1.08rem;line-height:1.7;text-align:right">${courseTitleAr}</div>`;

    const facts = document.createElement('div');
    facts.setAttribute('style','display:grid;grid-template-columns:1fr 1fr;gap:9px');
    const fact = (label,value,accented=false) => `<div style="min-height:62px;padding:10px;border:1px solid ${accented ? accentSoft : (isCourseOne ? 'rgba(255,255,255,.12)' : 'rgba(251,191,36,.18)')};border-radius:12px;background:${isCourseOne ? 'rgba(3,18,32,.34)' : 'rgba(54,40,14,.30)'};text-align:center;display:flex;flex-direction:column;justify-content:center"><span style="color:${isCourseOne ? '#98b1c5' : '#d6c58e'};font-size:.72rem;line-height:1.3">${label}</span><strong style="color:${isCourseOne ? '#fff' : '#fff7d6'};font-size:.9rem;line-height:1.35;margin-top:3px">${value}</strong></div>`;
    facts.innerHTML = fact(`${documentKind} | ${documentKindAr}`,`${localNum} / 10`,true) + fact('Global Number | الرقم العام',num) + fact('Study Time | زمن الدراسة',`${duration} min`) + fact('Level | المستوى',`${difficulty[0]} | ${difficulty[1]}`);

    banner.append(identity,facts);

    const actions = document.createElement('section');
    actions.className = `course-action-panel course-${courseNumber}-actions`;
    actions.setAttribute('style', panelStyle);
    actions.setAttribute('aria-label','Course actions');

    actions.appendChild(card({tag:'div',kind:'current',icon:type === 'lecture' ? '▥' : '⚡',title:type === 'lecture' ? `Lecture ${num}` : `MATLAB Lab ${num}`,subtitle:type === 'lecture' ? `المحاضرة ${num}` : `المختبر ${num}`,meta:`Course ${courseNumber} · ${duration} min · ${difficulty[0]} | ${difficulty[1]}`}));
    actions.appendChild(card({kind:'related',href:`${relatedType}${num}.html`,icon:type === 'lecture' ? '⚡' : '▥',title:type === 'lecture' ? `MATLAB Lab ${num}` : `Lecture ${num}`,subtitle:type === 'lecture' ? `فتح مختبر الطاقة الكهربائية ${num}` : `فتح المحاضرة ${num}`,meta:type === 'lecture' ? 'Electrical Power Lab | مخبر طاقة كهربائية' : 'Read Lesson | قراءة المحاضرة'}));

    if (type === 'lecture' && number === 2) {
      actions.appendChild(card({kind:'agent',href:'python-ai-agent.html',icon:'🤖',title:'Build Your First AI Agent with Python',subtitle:'ابنِ أول وكيل ذكي باستخدام بايثون',meta:'Interactive bilingual beginner lesson | درس تفاعلي ثنائي اللغة للمبتدئين'}));
    }

    const download = card({kind:'download',href:`pdf/${type}${num}.pdf`,icon:'↓',title:type === 'lecture' ? 'Download Lecture PDF' : 'Download Lab PDF',subtitle:type === 'lecture' ? 'تحميل المحاضرة بصيغة PDF' : 'تحميل المختبر بصيغة PDF',meta:`Course ${courseNumber} · Prepared by ${authorName}`});
    download.setAttribute('download',`${type}_${num}.pdf`);
    actions.appendChild(download);

    const anchor = hero || main.firstElementChild;
    if (anchor?.parentNode) {
      anchor.insertAdjacentElement('afterend',banner);
      banner.insertAdjacentElement('afterend',actions);
    } else {
      main.prepend(actions);
      main.prepend(banner);
    }

    const responsiveStyle = document.createElement('style');
    responsiveStyle.id = 'academic-course-banner-responsive';
    responsiveStyle.textContent = '@media(max-width:760px){.academic-course-banner{grid-template-columns:1fr!important;width:calc(100% - 24px)!important;padding:16px!important}.academic-course-banner>div:last-child{grid-template-columns:1fr 1fr!important}}@media(max-width:430px){.academic-course-banner>div:last-child{grid-template-columns:1fr!important}}@media print{.academic-course-banner,.course-action-panel{display:none!important}}';
    document.getElementById(responsiveStyle.id)?.remove();
    document.head.appendChild(responsiveStyle);
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initCourseNavigation, {once:true});
  else initCourseNavigation();
})();