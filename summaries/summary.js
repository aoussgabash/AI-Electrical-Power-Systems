(() => {
  'use strict';

  const root = document.getElementById('summary-root');
  const backLink = document.getElementById('back-link');
  const params = new URLSearchParams(location.search);
  const type = params.get('type') === 'lab' ? 'lab' : 'lecture';
  const number = String(Math.max(1, Math.min(20, Number(params.get('number') || 1)))).padStart(2, '0');
  const sourcePath = `../${type}${number}.html`;
  const sourceUrl = new URL(sourcePath, location.href).href;
  const kindEn = type === 'lecture' ? 'Lecture' : 'MATLAB Laboratory';
  const kindAr = type === 'lecture' ? 'المحاضرة' : 'المختبر';

  backLink.href = sourcePath;

  const references = [
    'A. Gabash, <em>Flexible Optimal Operations of Energy Supply Networks with Renewable Energy Generation and Battery Storage</em>. Saarbrücken, Germany: Südwestdeutscher Verlag für Hochschulschriften, 2014.',
    'S. J. Russell and P. Norvig, <em>Artificial Intelligence: A Modern Approach</em>, 4th Global ed. Harlow, U.K.: Pearson Education Limited, 2022.',
    'A. Gabash, “Energy Market Transition and Climate Change: A Review of TSOs–DSOs C+++ Framework from 1800 to Present,” <em>Energies</em>, vol. 16, no. 17, Art. no. 6139, 2023, doi: 10.3390/en16176139.',
    'S. J. D. Prince, <em>Understanding Deep Learning</em>. Cambridge, MA, USA: The MIT Press, 2023.',
    'A. Gabash, <em>AI Applications in Electrical Power Systems</em>, Version 1.0, 2026. [Online]. Available: https://aoussgabash.com'
  ];

  const clean = value => (value || '').replace(/\s+/g, ' ').trim();
  const html = node => node ? node.innerHTML : '';
  const text = node => clean(node?.textContent);
  const stripNumber = value => clean(value).replace(/^\d+\.?\s*/, '').replace(/^[^\p{L}\p{N}]+/u, '');
  const pageNo = n => `<span class="page-no">${n}</span>`;
  const sectionTitle = (en, ar) => `<div class="section-title"><h2>${en}</h2><div class="ar" lang="ar" dir="rtl">${ar}</div></div>`;

  function getPair(section) {
    return {
      en: section?.querySelector('.en') || null,
      ar: section?.querySelector('.ar') || null
    };
  }

  function findSection(sections, enTerms, arTerms = []) {
    return sections.find(section => {
      const pair = getPair(section);
      const enHeading = text(pair.en?.querySelector('h2')).toLowerCase();
      const arHeading = text(pair.ar?.querySelector('h2'));
      return enTerms.some(term => enHeading.includes(term.toLowerCase())) || arTerms.some(term => arHeading.includes(term));
    });
  }

  function listItems(container, limit = 6) {
    return [...(container?.querySelectorAll('li') || [])].slice(0, limit).map(item => `<li>${item.innerHTML}</li>`).join('');
  }

  function firstParagraphs(container, limit = 2) {
    return [...(container?.querySelectorAll(':scope > p') || [])].slice(0, limit).map(p => `<p>${p.innerHTML}</p>`).join('');
  }

  function highlights(container, limit = 1) {
    return [...(container?.querySelectorAll('.highlight') || [])].slice(0, limit).map(item => `<div class="callout">${item.innerHTML}</div>`).join('');
  }

  function conceptCards(container, limit = 6, isArabic = false) {
    const cards = [...(container?.querySelectorAll('.mini-card,.pair') || [])].slice(0, limit);
    return cards.map(card => {
      const strong = card.querySelector('strong,.tag');
      const p = card.querySelector('p');
      return `<div class="concept${isArabic ? ' ar' : ''}"><strong>${html(strong)}</strong>${p ? `<span>${p.innerHTML}</span>` : ''}</div>`;
    }).join('');
  }

  function renderError(message) {
    root.innerHTML = `<section class="page" style="display:grid;place-items:center;text-align:center"><div><h1>Summary unavailable</h1><p>${message}</p><p class="rtl">تعذر إنشاء الملخص من صفحة المصدر.</p></div></section>`;
  }

  async function build() {
    try {
      const response = await fetch(sourcePath, {cache: 'no-store'});
      if (!response.ok) throw new Error(`Source page returned ${response.status}`);
      const sourceText = await response.text();
      const doc = new DOMParser().parseFromString(sourceText, 'text/html');
      const hero = doc.querySelector('.hero');
      const titleEn = text(hero?.querySelector('h1')) || `${kindEn} ${number}`;
      const titleAr = text(hero?.querySelector('.hero-ar')) || `${kindAr} ${number}`;
      const subtitle = html(hero?.querySelector('.subtitle'));
      const sections = [...doc.querySelectorAll('main > section')];

      const objectives = findSection(sections, ['learning objectives','learning outcomes'], ['أهداف التعلم','مخرجات التعلم']) || sections[0];
      const definition = findSection(sections, ['what is artificial intelligence','introduction'], ['ما هو الذكاء الاصطناعي','مقدمة']);
      const comparison = findSection(sections, ['machine learning, and deep learning','ai, machine learning'], ['التعلم الآلي والتعلم العميق']);
      const methods = findSection(sections, ['main ai methods','methods'], ['طرائق الذكاء الاصطناعي']);
      const agents = findSection(sections, ['intelligent agents'], ['الوكلاء الأذكياء']);
      const motivation = findSection(sections, ['why ai in electrical power systems'], ['لماذا نستخدم الذكاء الاصطناعي']);
      const applications = findSection(sections, ['applications in electrical power systems'], ['تطبيقات الذكاء الاصطناعي']);
      const example = findSection(sections, ['example:','worked example'], ['مثال:','مثال محلول']);
      const advantages = findSection(sections, ['advantages'], ['مزايا']);
      const challenges = findSection(sections, ['challenges','limitations'], ['التحديات','القيود']);
      const summary = findSection(sections, ['summary'], ['الخلاصة']);
      const review = findSection(sections, ['review questions'], ['أسئلة المراجعة']);

      const objPair = getPair(objectives);
      const defPair = getPair(definition);
      const compPair = getPair(comparison);
      const methodsPair = getPair(methods);
      const agentsPair = getPair(agents);
      const motivationPair = getPair(motivation);
      const applicationsPair = getPair(applications);
      const examplePair = getPair(example);
      const advantagesPair = getPair(advantages);
      const challengesPair = getPair(challenges);
      const summaryPair = getPair(summary);
      const reviewPair = getPair(review);

      document.title = `${kindEn} ${number} Summary - ${titleEn}`;

      root.innerHTML = `
        <section class="page cover">
          <div>
            <div class="brand"><span>AI</span> Power Systems</div>
            <div class="kicker">${kindEn} Summary | ملخص ${kindAr}</div>
            <h1>${titleEn}</h1>
            <div class="ar-title" lang="ar" dir="rtl">${titleAr}</div>
            <div class="subtitle">${subtitle || 'AI Applications in Electrical Power Systems<br>تطبيقات الذكاء الاصطناعي في أنظمة الطاقة الكهربائية'}</div>
            <div class="meta-grid">
              <div class="meta"><small>Document | الوثيقة</small><strong>${kindEn} ${number} Summary</strong></div>
              <div class="meta"><small>Source | المصدر</small><strong>Interactive course website</strong></div>
              <div class="meta"><small>Language | اللغة</small><strong>English & Arabic</strong></div>
              <div class="meta"><small>Version | الإصدار</small><strong>1.0 · 2026</strong></div>
            </div>
          </div>
          <div class="cover-footer">
            <div><div>Prepared by | إعداد</div><div class="author">Dr.-Ing. Aouss Gabash</div></div>
            <div style="text-align:right"><div>Full interactive content</div><a href="${sourceUrl}">${sourceUrl}</a></div>
          </div>
          ${pageNo(1)}
        </section>

        <section class="page">
          ${sectionTitle('Learning Outcomes and Foundation','مخرجات التعلم والأساس العلمي')}
          <div class="bilingual">
            <div class="panel"><h3>Learning Outcomes</h3><ul>${listItems(objPair.en, 6)}</ul></div>
            <div class="panel ar" lang="ar" dir="rtl"><h3>مخرجات التعلم</h3><ul>${listItems(objPair.ar, 6)}</ul></div>
          </div>
          <div style="height:14px"></div>
          <div class="bilingual">
            <div class="panel"><h3>${stripNumber(text(defPair.en?.querySelector('h2'))) || 'Artificial Intelligence'}</h3>${firstParagraphs(defPair.en, 2)}${highlights(defPair.en)}</div>
            <div class="panel ar" lang="ar" dir="rtl"><h3>${stripNumber(text(defPair.ar?.querySelector('h2'))) || 'الذكاء الاصطناعي'}</h3>${firstParagraphs(defPair.ar, 2)}${highlights(defPair.ar)}</div>
          </div>
          <div style="height:14px"></div>
          ${sectionTitle('AI, Machine Learning, and Deep Learning','الذكاء الاصطناعي والتعلم الآلي والتعلم العميق')}
          <div class="concept-grid">
            ${conceptCards(compPair.en, 3)}
            ${conceptCards(compPair.ar, 3, true)}
          </div>
          ${pageNo(2)}
        </section>

        <section class="page">
          ${sectionTitle('Methods and Intelligent Agents','الطرائق والوكلاء الأذكياء')}
          <div class="concept-grid">
            ${conceptCards(methodsPair.en, 6)}
            ${conceptCards(methodsPair.ar, 6, true)}
          </div>
          <div style="height:16px"></div>
          <div class="bilingual">
            <div class="panel"><h3>${stripNumber(text(agentsPair.en?.querySelector('h2'))) || 'Intelligent Agents'}</h3>${firstParagraphs(agentsPair.en, 2)}${highlights(agentsPair.en)}</div>
            <div class="panel ar" lang="ar" dir="rtl"><h3>${stripNumber(text(agentsPair.ar?.querySelector('h2'))) || 'الوكلاء الأذكياء'}</h3>${firstParagraphs(agentsPair.ar, 2)}${highlights(agentsPair.ar)}</div>
          </div>
          ${pageNo(3)}
        </section>

        <section class="page">
          ${sectionTitle('AI in Electrical Power Systems','الذكاء الاصطناعي في أنظمة الطاقة الكهربائية')}
          <div class="bilingual">
            <div class="panel"><h3>${stripNumber(text(motivationPair.en?.querySelector('h2'))) || 'Why AI?'}</h3>${firstParagraphs(motivationPair.en, 2)}${highlights(motivationPair.en)}</div>
            <div class="panel ar" lang="ar" dir="rtl"><h3>${stripNumber(text(motivationPair.ar?.querySelector('h2'))) || 'لماذا الذكاء الاصطناعي؟'}</h3>${firstParagraphs(motivationPair.ar, 2)}${highlights(motivationPair.ar)}</div>
          </div>
          <div style="height:14px"></div>
          <div class="concept-grid">
            ${conceptCards(applicationsPair.en, 6)}
            ${conceptCards(applicationsPair.ar, 6, true)}
          </div>
          ${pageNo(4)}
        </section>

        <section class="page">
          ${sectionTitle('Worked Example','مثال محلول')}
          <div class="example bilingual">
            <div><h3>${stripNumber(text(examplePair.en?.querySelector('h2'))) || 'AI-Based Power-System Decision'}</h3>${firstParagraphs(examplePair.en, 3)}<ul>${listItems(examplePair.en, 5)}</ul>${highlights(examplePair.en)}</div>
            <div class="ar" lang="ar" dir="rtl"><h3>${stripNumber(text(examplePair.ar?.querySelector('h2'))) || 'قرار في نظام الطاقة باستخدام الذكاء الاصطناعي'}</h3>${firstParagraphs(examplePair.ar, 3)}<ul>${listItems(examplePair.ar, 5)}</ul>${highlights(examplePair.ar)}</div>
          </div>
          <div style="height:16px"></div>
          ${sectionTitle('Advantages and Limitations','المزايا والقيود')}
          <div class="bilingual">
            <div class="panel"><h3>Advantages</h3><ul>${listItems(advantagesPair.en, 6)}</ul><h3>Challenges</h3><ul>${listItems(challengesPair.en, 5)}</ul>${highlights(challengesPair.en)}</div>
            <div class="panel ar" lang="ar" dir="rtl"><h3>المزايا</h3><ul>${listItems(advantagesPair.ar, 6)}</ul><h3>التحديات</h3><ul>${listItems(challengesPair.ar, 5)}</ul>${highlights(challengesPair.ar)}</div>
          </div>
          ${pageNo(5)}
        </section>

        <section class="page">
          ${sectionTitle('Key Takeaways and Review','أهم النقاط والمراجعة')}
          <div class="takeaways">
            <div class="takeaway"><h3>Key Takeaways</h3><ul>${listItems(summaryPair.en, 6)}</ul></div>
            <div class="takeaway ar" lang="ar" dir="rtl"><h3>أهم النقاط</h3><ul>${listItems(summaryPair.ar, 6)}</ul></div>
          </div>
          <div style="height:16px"></div>
          <div class="bilingual">
            <div class="panel"><h3>Review Questions</h3><ol>${listItems(reviewPair.en, 7)}</ol></div>
            <div class="panel ar" lang="ar" dir="rtl"><h3>أسئلة المراجعة</h3><ol>${listItems(reviewPair.ar, 7)}</ol></div>
          </div>
          ${pageNo(6)}
        </section>

        <section class="page">
          ${sectionTitle('References','المراجع')}
          <ol class="references">${references.map(ref => `<li>${ref}</li>`).join('')}</ol>
          <div style="height:20px"></div>
          <div class="online">
            <h2>Continue Learning Online</h2>
            <h2 class="ar" lang="ar" dir="rtl">تابع التعلم عبر الموقع</h2>
            <p>The website is the complete, current, and interactive academic reference.</p>
            <p class="ar" lang="ar" dir="rtl">الموقع هو المرجع الأكاديمي الكامل والمحدّث والتفاعلي.</p>
            <p><a href="${sourceUrl}">${sourceUrl}</a></p>
          </div>
          <p class="source-note">This summary was generated from the corresponding website page. Content updates should be made in the source page first. | تم إنشاء هذا الملخص من صفحة الموقع المقابلة، ويجب إجراء تحديثات المحتوى في صفحة المصدر أولًا.</p>
          ${pageNo(7)}
        </section>`;
    } catch (error) {
      console.error(error);
      renderError(error.message);
    }
  }

  build();
})();
