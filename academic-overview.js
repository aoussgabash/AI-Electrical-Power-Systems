(() => {
  'use strict';

  const page = location.pathname.split('/').pop() || '';
  const match = page.match(/^(lecture|lab)(\d{2})\.html$/i);
  if (!match || document.querySelector('.academic-overview')) return;

  const type = match[1].toLowerCase();
  const number = Number(match[2]);
  if (number < 1 || number > 20) return;

  const topics = [
    ['Artificial Intelligence Foundations','أسس الذكاء الاصطناعي'],
    ['Intelligent Agents and Search','الوكلاء الأذكياء وخوارزميات البحث'],
    ['Fuzzy Logic','المنطق الضبابي'],
    ['Supervised Machine Learning','التعلم الآلي المراقَب'],
    ['Unsupervised Machine Learning','التعلم الآلي غير المراقَب'],
    ['Artificial Neural Networks','الشبكات العصبية الاصطناعية'],
    ['Genetic Algorithms','الخوارزميات الجينية'],
    ['AI Ethics','أخلاقيات الذكاء الاصطناعي'],
    ['Deep Learning for Power Systems','التعلم العميق في أنظمة الطاقة'],
    ['Transformer Models and Attention','نماذج المحوّل وآلية الانتباه'],
    ['Smart Grids and AI Integration','الشبكات الذكية وتكامل الذكاء الاصطناعي'],
    ['AI-Based Load Forecasting','التنبؤ بالأحمال القائم على الذكاء الاصطناعي'],
    ['AI-Based Renewable Energy Forecasting','التنبؤ بالطاقة المتجددة القائم على الذكاء الاصطناعي'],
    ['Intelligent Fault Diagnosis','التشخيص الذكي للأعطال'],
    ['AI-Based Economic Dispatch','التوزيع الاقتصادي القائم على الذكاء الاصطناعي'],
    ['AI for Power Quality','الذكاء الاصطناعي لجودة الطاقة'],
    ['Intelligent Control and Fuzzy Logic','التحكم الذكي والمنطق الضبابي'],
    ['AI-Driven Microgrid Management','الإدارة الذكية للشبكات المصغرة'],
    ['AI-Based Predictive Maintenance','الصيانة التنبؤية القائمة على الذكاء الاصطناعي'],
    ['AI-Enabled Grid Cybersecurity','الأمن السيبراني الذكي لشبكات الطاقة']
  ];

  const prerequisites = [
    ['Basic mathematics and introductory electrical engineering.','الرياضيات الأساسية ومبادئ الهندسة الكهربائية.'],
    ['Lecture 01 and basic graph concepts.','المحاضرة 01 والمفاهيم الأساسية للرسوم البيانية.'],
    ['Basic set theory and algebra.','أساسيات نظرية المجموعات والجبر.'],
    ['Basic statistics, vectors, and MATLAB fundamentals.','الإحصاء الأساسي والمتجهات ومبادئ MATLAB.'],
    ['Lecture 04 and elementary linear algebra.','المحاضرة 04 والجبر الخطي الأولي.'],
    ['Lectures 04–05, derivatives, and matrix operations.','المحاضرتان 04–05 والمشتقات وعمليات المصفوفات.'],
    ['Basic optimization and probability.','أساسيات التحسين والاحتمالات.'],
    ['General understanding of AI models and engineering responsibility.','فهم عام لنماذج الذكاء الاصطناعي والمسؤولية الهندسية.'],
    ['Lecture 06 and time-series fundamentals.','المحاضرة 06 وأساسيات السلاسل الزمنية.'],
    ['Lecture 09, vectors, matrices, and sequence modelling.','المحاضرة 09 والمتجهات والمصفوفات ونمذجة التسلسلات.'],
    ['Course 1 fundamentals and introductory power-system analysis.','أساسيات المقرر الأول ومقدمة في تحليل أنظمة القدرة.'],
    ['Time-series analysis, regression, and load characteristics.','تحليل السلاسل الزمنية والانحدار وخصائص الأحمال.'],
    ['Lecture 12 and basic solar/wind generation concepts.','المحاضرة 12 ومبادئ التوليد الشمسي والرياح.'],
    ['Signals, measurements, classification, and electrical faults.','الإشارات والقياسات والتصنيف والأعطال الكهربائية.'],
    ['Optimization, generation cost curves, and power balance.','التحسين ومنحنيات كلفة التوليد وتوازن القدرة.'],
    ['Power-quality indices, signal processing, and classification.','مؤشرات جودة الطاقة ومعالجة الإشارة والتصنيف.'],
    ['Fuzzy logic, control systems, and dynamic models.','المنطق الضبابي وأنظمة التحكم والنماذج الديناميكية.'],
    ['Economic dispatch, storage models, and microgrid fundamentals.','التوزيع الاقتصادي ونماذج التخزين وأساسيات الشبكات المصغرة.'],
    ['Condition monitoring, probability, and anomaly detection.','مراقبة الحالة والاحتمالات وكشف الشذوذ.'],
    ['Communication networks, cyber-physical systems, and anomaly detection.','شبكات الاتصالات والأنظمة السيبرانية الفيزيائية وكشف الشذوذ.']
  ];

  const outcomeTemplates = [
    ['Define core AI concepts and distinguish major AI paradigms.','تعريف مفاهيم الذكاء الاصطناعي الأساسية والتمييز بين مدارسه الرئيسة.'],
    ['Formulate engineering problems as state-space search tasks.','صياغة المسائل الهندسية على شكل مسائل بحث في فضاء الحالات.'],
    ['Construct membership functions and explain fuzzy inference.','بناء دوال الانتماء وشرح الاستدلال الضبابي.'],
    ['Prepare labelled data and evaluate regression or classification models.','تهيئة البيانات الموسومة وتقييم نماذج الانحدار أو التصنيف.'],
    ['Apply clustering and dimensionality-reduction methods to engineering data.','تطبيق التجميع وخفض الأبعاد على البيانات الهندسية.'],
    ['Explain forward propagation, backpropagation, and neural-network training.','شرح الانتشار الأمامي والخلفي وتدريب الشبكات العصبية.'],
    ['Formulate and solve an optimization problem using a genetic algorithm.','صياغة مسألة تحسين وحلها باستخدام خوارزمية جينية.'],
    ['Assess fairness, transparency, safety, and accountability in AI systems.','تقييم العدالة والشفافية والسلامة والمساءلة في أنظمة الذكاء الاصطناعي.'],
    ['Select suitable deep-learning architectures for power-system data.','اختيار بنى التعلم العميق المناسبة لبيانات أنظمة الطاقة.'],
    ['Explain attention and apply transformer concepts to sequence data.','شرح آلية الانتباه وتطبيق مفاهيم المحولات على البيانات المتسلسلة.'],
    ['Relate smart-grid architecture to AI data and decision layers.','ربط بنية الشبكة الذكية بطبقات البيانات والقرار في الذكاء الاصطناعي.'],
    ['Design and evaluate an AI load-forecasting workflow.','تصميم وتقييم سير عمل للتنبؤ الذكي بالأحمال.'],
    ['Develop forecasting models for solar and wind generation.','تطوير نماذج للتنبؤ بالتوليد الشمسي والرياح.'],
    ['Extract diagnostic features and classify electrical faults.','استخراج خصائص التشخيص وتصنيف الأعطال الكهربائية.'],
    ['Formulate economic dispatch with operational constraints and AI solvers.','صياغة التوزيع الاقتصادي مع القيود التشغيلية وحلّه بأدوات الذكاء الاصطناعي.'],
    ['Detect and classify power-quality disturbances using data-driven models.','كشف اضطرابات جودة الطاقة وتصنيفها باستخدام نماذج معتمدة على البيانات.'],
    ['Design an intelligent controller and compare it with conventional control.','تصميم متحكم ذكي ومقارنته بالتحكم التقليدي.'],
    ['Coordinate generation, storage, and demand in a microgrid.','تنسيق التوليد والتخزين والطلب في شبكة مصغرة.'],
    ['Estimate equipment health and remaining useful life from measurements.','تقدير صحة المعدات والعمر التشغيلي المتبقي من القياسات.'],
    ['Identify cyber threats and design resilient AI-based detection strategies.','تحديد التهديدات السيبرانية وتصميم استراتيجيات كشف ذكية ومرنة.']
  ];

  const topic = topics[number - 1];
  const prerequisite = prerequisites[number - 1];
  const primaryOutcome = outcomeTemplates[number - 1];
  const isLab = type === 'lab';

  const outcomes = isLab ? [
    [`Implement a MATLAB workflow for ${topic[0].toLowerCase()}.`,`تنفيذ سير عمل في MATLAB حول ${topic[1]}.`],
    ['Interpret numerical results, plots, and engineering implications.','تفسير النتائج العددية والرسوم والدلالات الهندسية.'],
    ['Validate the implementation and discuss limitations.','التحقق من صحة التنفيذ ومناقشة حدوده.']
  ] : [
    primaryOutcome,
    ['Interpret the governing mathematical or algorithmic principles.','تفسير المبادئ الرياضية أو الخوارزمية الحاكمة.'],
    ['Connect the topic to practical electrical-power-engineering applications.','ربط الموضوع بتطبيقات عملية في هندسة الطاقة الكهربائية.']
  ];

  const overview = document.createElement('section');
  overview.className = 'academic-overview';
  overview.setAttribute('aria-label','Learning outcomes and prerequisites');
  overview.innerHTML = `
    <div class="academic-overview-card academic-outcomes">
      <div class="academic-overview-heading">
        <span class="academic-overview-icon" aria-hidden="true">✓</span>
        <div><h2>Learning Outcomes</h2><p lang="ar" dir="rtl">مخرجات التعلم</p></div>
      </div>
      <ol>${outcomes.map(item => `<li><span>${item[0]}</span><span lang="ar" dir="rtl">${item[1]}</span></li>`).join('')}</ol>
    </div>
    <div class="academic-overview-card academic-prerequisites">
      <div class="academic-overview-heading">
        <span class="academic-overview-icon" aria-hidden="true">↗</span>
        <div><h2>Prerequisites</h2><p lang="ar" dir="rtl">المتطلبات السابقة</p></div>
      </div>
      <p>${prerequisite[0]}</p>
      <p lang="ar" dir="rtl">${prerequisite[1]}</p>
      <div class="academic-topic-chip">${topic[0]} | <span lang="ar" dir="rtl">${topic[1]}</span></div>
    </div>`;

  const style = document.createElement('style');
  style.id = 'academic-overview-style';
  style.textContent = `
    .academic-overview{width:min(1100px,92%);margin:0 auto 28px!important;padding:0!important;display:grid!important;grid-template-columns:1.35fr .65fr;gap:16px;border:0!important;background:transparent!important;box-shadow:none!important}
    .academic-overview-card{padding:20px;border:1px solid rgba(255,255,255,.12);border-radius:18px;background:linear-gradient(145deg,#10263d,#0a1b2d);box-shadow:0 14px 30px rgba(0,0,0,.18)}
    .academic-overview-heading{display:flex;align-items:center;gap:12px;margin-bottom:14px}.academic-overview-heading h2{margin:0!important;padding:0!important;border:0!important;color:#fff!important;font-size:1.25rem!important}.academic-overview-heading p{margin:2px 0 0!important;color:#b9cddd!important;font-size:.96rem}
    .academic-overview-icon{width:42px;height:42px;display:grid;place-items:center;border:1px solid rgba(56,189,248,.4);border-radius:13px;background:rgba(56,189,248,.1);color:#7dd3fc;font-size:1.25rem;font-weight:900}
    .academic-overview ol{margin:0;padding-left:22px}.academic-overview li{margin:0 0 12px;color:#dbe7f1}.academic-overview li:last-child{margin-bottom:0}.academic-overview li span{display:block}.academic-overview li span[lang="ar"]{margin-top:3px;color:#c9d8e5;text-align:right;line-height:1.8}
    .academic-prerequisites>p{margin:0 0 9px;color:#d7e3ed}.academic-prerequisites>p[lang="ar"]{text-align:right;line-height:1.8}.academic-topic-chip{margin-top:14px;padding:9px 11px;border:1px solid rgba(250,204,21,.35);border-radius:10px;background:rgba(250,204,21,.08);color:#fff1a8;font-size:.82rem;font-weight:700}
    @media(max-width:760px){.academic-overview{grid-template-columns:1fr}.academic-overview-card{padding:16px}}
    @media print{.academic-overview{display:grid!important;grid-template-columns:1.35fr .65fr!important;width:100%!important;margin:4mm 0!important}.academic-overview-card{background:#fff!important;color:#172033!important;border-color:#cbd5e1!important;box-shadow:none!important}.academic-overview-heading h2,.academic-overview li,.academic-prerequisites>p{color:#172033!important}.academic-overview-heading p,.academic-overview li span[lang="ar"]{color:#334155!important}.academic-topic-chip{color:#172033!important;background:#fffbeb!important;border-color:#d6b84c!important}}
  `;
  document.getElementById(style.id)?.remove();
  document.head.appendChild(style);

  const actions = document.querySelector('.course-action-panel');
  const banner = document.querySelector('.academic-course-banner');
  if (actions) actions.insertAdjacentElement('afterend', overview);
  else if (banner) banner.insertAdjacentElement('afterend', overview);
  else (document.querySelector('main') || document.body).prepend(overview);
})();
