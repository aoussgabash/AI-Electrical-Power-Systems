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

    const difficulty = number <= 4 ? ['Beginner','مبتدئ'] : number <= 10 ? ['Intermediate','متوسط'] : ['Advanced','متقدم'];
    const duration = type === 'lecture' ? (number <= 8 ? 45 : number <= 16 ? 55 : 60) : (number <= 8 ? 60 : number <= 16 ? 75 : 90);
    const relatedType = type === 'lecture' ? 'lab' : 'lecture';

    const panelStyle = [
      'width:min(100%,820px)','margin:28px auto 34px','padding:20px','display:grid',
      'grid-template-columns:1fr','gap:14px','align-items:stretch',
      'border:1px solid rgba(56,189,248,.24)','border-radius:24px',
      'background:linear-gradient(145deg,rgba(9,38,62,.96),rgba(5,24,42,.96))',
      'box-shadow:0 18px 42px rgba(0,0,0,.24)','box-sizing:border-box','visibility:visible','opacity:1'
    ].join(';');

    const baseCardStyle = [
      'min-height:122px','display:flex','flex-direction:column','align-items:center','justify-content:center',
      'gap:8px','padding:16px 14px','border:1px solid rgba(255,255,255,.14)','border-radius:17px',
      'background:linear-gradient(145deg,#123652,#0b2238)','color:#f8fbff','text-decoration:none',
      'text-align:center','box-shadow:0 10px 24px rgba(0,0,0,.18)','overflow:hidden','box-sizing:border-box'
    ].join(';');

    const iconStyle = [
      'width:46px','height:46px','min-width:46px','min-height:46px','max-width:46px','max-height:46px',
      'display:flex','align-items:center','justify-content:center','border:1px solid rgba(56,189,248,.32)',
      'border-radius:14px','background:rgba(3,18,32,.42)','font-family:Arial,Tahoma,sans-serif',
      'font-size:26px','font-weight:800','line-height:1','overflow:hidden','box-sizing:border-box'
    ].join(';');

    const contentStyle = 'display:flex;flex-direction:column;align-items:center;justify-content:center;width:100%;gap:3px';
    const titleStyle = 'font-size:1.04rem;color:#fff;line-height:1.35;font-weight:800';
    const subtitleStyle = 'direction:rtl;color:#dceaf6;font-size:.9rem;line-height:1.45;text-align:center';
    const metaStyle = 'color:#9fb7ca;font-size:.76rem;line-height:1.4;margin-top:4px;text-align:center';
    const arrowStyle = 'width:24px;height:24px;display:flex;align-items:center;justify-content:center;color:#fde047;font-size:24px;line-height:1';

    const card = ({href='',icon,title,subtitle,meta='',kind='default',tag='a'}) => {
      const element = document.createElement(tag);
      element.className = `course-action-card course-action-${kind}`;
      if (href) element.href = href;
      let cardStyle = baseCardStyle;
      if (kind === 'current') cardStyle += ';cursor:default;border-color:rgba(56,189,248,.38);background:linear-gradient(145deg,#102f49,#0a2035)';
      if (kind === 'related') cardStyle += ';border-color:rgba(250,204,21,.38)';
      if (kind === 'download') cardStyle += ';border-color:rgba(56,189,248,.58);background:linear-gradient(145deg,#0d527e,#0a304e)';
      element.setAttribute('style', cardStyle);

      const iconElement = document.createElement('span');
      iconElement.setAttribute('style', `${iconStyle};color:${kind === 'related' ? '#facc15' : kind === 'download' ? '#7dd3fc' : '#38bdf8'}`);
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
      author.setAttribute('style','display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:7px;width:fit-content;max-width:100%;margin:20px auto 0;padding:8px 14px;border:1px solid rgba(56,189,248,.28);border-radius:999px;background:rgba(8,31,51,.72);color:#eaf7ff;font-size:.9rem;line-height:1.4;box-shadow:0 8px 22px rgba(0,0,0,.16)');
      author.innerHTML = `<span style="color:#9fc7df;font-weight:600">Prepared by | إعداد:</span><span style="color:#fff;font-weight:800">${authorName}</span>`;
      hero.appendChild(author);
    }

    document.querySelectorAll('.course-action-panel,.course-metadata-bar').forEach(panel => panel.remove());

    const actions = document.createElement('section');
    actions.className = 'course-action-panel';
    actions.setAttribute('style', panelStyle);
    actions.setAttribute('aria-label','Course actions');

    actions.appendChild(card({
      tag:'div',kind:'current',icon:type === 'lecture' ? '▥' : '⚡',
      title:type === 'lecture' ? `Lecture ${num}` : `MATLAB Lab ${num}`,
      subtitle:type === 'lecture' ? `المحاضرة ${num}` : `المختبر ${num}`,
      meta:`${duration} min · ${difficulty[0]} | ${difficulty[1]}`
    }));

    actions.appendChild(card({
      kind:'related',href:`${relatedType}${num}.html`,icon:type === 'lecture' ? '⚡' : '▥',
      title:type === 'lecture' ? `MATLAB Lab ${num}` : `Lecture ${num}`,
      subtitle:type === 'lecture' ? `فتح مختبر الطاقة الكهربائية ${num}` : `فتح المحاضرة ${num}`,
      meta:type === 'lecture' ? 'Electrical Power Lab | مخبر طاقة كهربائية' : 'Read Lesson | قراءة المحاضرة'
    }));

    const download = card({
      kind:'download',href:`pdf/${type}${num}.pdf`,icon:'↓',
      title:type === 'lecture' ? 'Download Lecture PDF' : 'Download Lab PDF',
      subtitle:type === 'lecture' ? 'تحميل المحاضرة بصيغة PDF' : 'تحميل المختبر بصيغة PDF',
      meta:`Prepared by ${authorName}`
    });
    download.setAttribute('download',`${type}_${num}.pdf`);
    actions.appendChild(download);

    if (hero?.parentNode) hero.insertAdjacentElement('afterend', actions);
    else main.prepend(actions);
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initCourseNavigation, {once:true});
  else initCourseNavigation();
})();
