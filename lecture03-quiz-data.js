(() => {
  'use strict';

  const questions = [
    { en:'What is the main difference between a crisp set and a fuzzy set?', ar:'ما الفرق الأساسي بين المجموعة التقليدية والمجموعة الضبابية؟', correct:'b', options:[['a','A crisp set uses values from 0 to 100','تستخدم المجموعة التقليدية قيمًا من 0 إلى 100'],['b','A crisp set uses 0 or 1, while a fuzzy set allows any value in [0,1]','تستخدم المجموعة التقليدية 0 أو 1، بينما تسمح الضبابية بأي قيمة ضمن [0,1]'],['c','A fuzzy set has no membership function','لا تملك المجموعة الضبابية دالة عضوية'],['d','There is no difference','لا يوجد فرق']], explanation:'Fuzzy logic permits partial membership, unlike binary crisp classification. | يسمح المنطق الضبابي بالانتماء الجزئي بخلاف التصنيف الثنائي التقليدي.' },
    { en:'What does μA(x)=0.8 mean?', ar:'ماذا تعني μA(x)=0.8؟', correct:'c', options:[['a','x is outside every set','القيمة x خارج جميع المجموعات'],['b','x is fully rejected','القيمة x مرفوضة بالكامل'],['c','x belongs to fuzzy set A with degree 0.8','تنتمي x إلى المجموعة الضبابية A بدرجة 0.8'],['d','The input equals 80 volts','الدخل يساوي 80 فولتًا']], explanation:'A membership value quantifies the degree to which an element belongs to a fuzzy set. | تقيس قيمة العضوية درجة انتماء العنصر إلى المجموعة الضبابية.' },
    { en:'A triangular membership function is defined by which parameters?', ar:'بأي معاملات تُعرّف دالة العضوية المثلثية؟', correct:'a', options:[['a','(a,b,c)','(a,b,c)'],['b','(a,b,c,d)','(a,b,c,d)'],['c','(x,y)','(x,y)'],['d','One parameter only','معامل واحد فقط']], explanation:'The points a and c mark zero membership, while b marks full membership. | تمثل a وc انتماءً صفريًا، بينما تمثل b الانتماء الكامل.' },
    { en:'For a triangular membership function, what is μA(b)?', ar:'في دالة العضوية المثلثية، ما قيمة μA(b)؟', correct:'d', options:[['a','0','0'],['b','0.5','0.5'],['c','Undefined','غير معرّفة'],['d','1','1']], explanation:'The central point b is the peak of the triangle and has full membership. | تمثل النقطة b قمة المثلث ودرجة الانتماء الكاملة.' },
    { en:'Between a and b, which equation describes the rising side of a triangular membership function?', ar:'بين a وb، أي معادلة تصف الجزء الصاعد من دالة العضوية المثلثية؟', correct:'b', options:[['a','(b-x)/(b-a)','(b-x)/(b-a)'],['b','(x-a)/(b-a)','(x-a)/(b-a)'],['c','x²','x²'],['d','1/(x-a)','1/(x-a)']], explanation:'The rising side is a straight line from (a,0) to (b,1). | الجزء الصاعد خط مستقيم من (a,0) إلى (b,1).' },
    { en:'What distinguishes a trapezoidal membership function?', ar:'ما الذي يميز دالة العضوية شبه المنحرفة؟', correct:'c', options:[['a','It has no region of full membership','ليس لها مجال انتماء كامل'],['b','It uses only two parameters','تستخدم معاملين فقط'],['c','It has membership equal to 1 between b and c','تساوي العضوية فيها 1 بين b وc'],['d','It is always discontinuous','هي غير مستمرة دائمًا']], explanation:'A trapezoidal function uses four points (a,b,c,d) and has a flat top between b and c. | تستخدم الدالة شبه المنحرفة أربع نقاط ولها قمة مستوية بين b وc.' },
    { en:'Using Mamdani operators, what is AND for membership values 0.4 and 0.7?', ar:'باستخدام مؤثرات Mamdani، ما ناتج AND للقيمتين 0.4 و0.7؟', correct:'a', options:[['a','0.4','0.4'],['b','0.7','0.7'],['c','1.1','1.1'],['d','0.28','0.28']], explanation:'Mamdani AND commonly uses the minimum operator: min(0.4,0.7)=0.4. | تستخدم AND في Mamdani مؤثر القيمة الصغرى.' },
    { en:'Using Mamdani operators, what is OR for membership values 0.4 and 0.7?', ar:'باستخدام مؤثرات Mamdani، ما ناتج OR للقيمتين 0.4 و0.7؟', correct:'b', options:[['a','0.4','0.4'],['b','0.7','0.7'],['c','0.3','0.3'],['d','1.0','1.0']], explanation:'Mamdani OR commonly uses the maximum operator: max(0.4,0.7)=0.7. | تستخدم OR في Mamdani مؤثر القيمة الكبرى.' },
    { en:'Which sequence correctly describes a fuzzy inference system?', ar:'أي تسلسل يصف نظام الاستدلال الضبابي بصورة صحيحة؟', correct:'d', options:[['a','Defuzzification → sensors → deletion','إزالة الضبابية ← الحساسات ← الحذف'],['b','Aggregation → no rules → random output','التجميع ← دون قواعد ← خرج عشوائي'],['c','Crisp output → fuzzification only','خرج محدد ← التضييب فقط'],['d','Fuzzification → rule evaluation → aggregation → defuzzification','التضييب ← تقييم القواعد ← التجميع ← إزالة الضبابية']], explanation:'A fuzzy controller converts crisp inputs to memberships, evaluates rules, aggregates results, and produces a crisp output. | يحول المتحكم الضبابي المدخلات إلى درجات عضوية ثم يقيّم القواعد ويجمع النتائج ويولد خرجًا محددًا.' },
    { en:'Which fuzzy rule is suitable for voltage control?', ar:'أي قاعدة ضبابية مناسبة للتحكم بالجهد؟', correct:'c', options:[['a','IF voltage is low THEN reduce reactive support','إذا كان الجهد منخفضًا فقلل دعم القدرة الردية'],['b','IF voltage is normal THEN force maximum correction','إذا كان الجهد طبيعيًا فطبّق أقصى تصحيح'],['c','IF voltage is low THEN increase reactive support','إذا كان الجهد منخفضًا فزد دعم القدرة الردية'],['d','IF voltage is high THEN ignore all measurements','إذا كان الجهد مرتفعًا فتجاهل جميع القياسات']], explanation:'Increasing reactive support can help raise a low bus voltage, making this a meaningful control rule. | يمكن لزيادة دعم القدرة الردية أن ترفع الجهد المنخفض، لذا تعد هذه قاعدة تحكم منطقية.' }
  ];

  const escapeHtml = value => String(value).replace(/[&<>\"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[char]));
  document.querySelector('[data-course-quiz]')?.remove();

  const section = document.createElement('section');
  section.className = 'course-quiz';
  section.id = 'quiz';
  section.dataset.courseQuiz = '';
  section.dataset.storageKey = 'ai-power-systems:lecture03';

  const questionsHtml = questions.map((question,index) => {
    const name = `lecture03-q${index+1}`;
    const options = question.options.map(option => `<label class="quiz-option"><input type="radio" name="${name}" value="${escapeHtml(option[0])}"><span><strong>${escapeHtml(option[1])}</strong><br><span dir="rtl">${escapeHtml(option[2])}</span></span></label>`).join('');
    return `<article class="quiz-question" data-correct="${escapeHtml(question.correct)}"><h3>${index+1}. ${escapeHtml(question.en)}</h3><p class="quiz-ar">${index+1}. ${escapeHtml(question.ar)}</p>${options}<div class="quiz-explanation">${escapeHtml(question.explanation)}</div></article>`;
  }).join('');

  section.innerHTML = `<div class="course-quiz-header"><h2>🧠 Lecture Quiz: Fuzzy Logic</h2><p dir="rtl">اختبار المحاضرة: المنطق الضبابي</p></div>${questionsHtml}<div class="quiz-actions"><button type="button" class="quiz-btn" data-quiz-submit>Check Answers | تحقق من الإجابات</button><button type="button" class="quiz-btn secondary" data-quiz-reset>Try Again | إعادة المحاولة</button></div><div class="quiz-result" data-quiz-result><strong data-quiz-score></strong><span data-quiz-message></span></div><div class="quiz-progress-note">Your result is stored only in this browser. | تُحفظ نتيجتك في هذا المتصفح فقط.</div>`;

  const nav = document.querySelector('.course-page-navigation');
  const footer = document.querySelector('footer');
  if (nav?.parentNode) nav.parentNode.insertBefore(section,nav);
  else if (footer?.parentNode) footer.parentNode.insertBefore(section,footer);
  else document.body.appendChild(section);

  const grader = document.createElement('script');
  grader.src = 'course-quiz.js?v=20260831-rtlfix';
  grader.defer = true;
  document.head.appendChild(grader);
})();
