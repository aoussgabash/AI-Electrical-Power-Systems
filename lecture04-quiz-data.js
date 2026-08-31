(() => {
  'use strict';

  const questions = [
    { en:'What is the basic idea of Machine Learning?', ar:'ما الفكرة الأساسية للتعلم الآلي؟', correct:'b', options:[['a','Programming every rule manually','برمجة كل قاعدة يدويًا'],['b','Learning patterns and relationships from data','تعلم الأنماط والعلاقات من البيانات'],['c','Replacing measurements with guesses','استبدال القياسات بالتخمين'],['d','Using fixed lookup tables only','استخدام جداول ثابتة فقط']], explanation:'Machine Learning learns useful relationships from examples instead of requiring every rule to be written explicitly. | يتعلم التعلم الآلي العلاقات من الأمثلة بدل كتابة جميع القواعد يدويًا.' },
    { en:'Which statement correctly compares supervised and unsupervised learning?', ar:'أي عبارة تقارن بصورة صحيحة بين التعلم الخاضع وغير الخاضع للإشراف؟', correct:'d', options:[['a','Both always require known targets','كلاهما يتطلب أهدافًا معروفة دائمًا'],['b','Unsupervised learning uses labels only','التعلم غير الخاضع يستخدم الوسوم فقط'],['c','Supervised learning contains inputs only','التعلم الخاضع يحتوي مدخلات فقط'],['d','Supervised learning uses known outputs, while unsupervised learning does not','التعلم الخاضع يستخدم مخرجات معروفة، بينما غير الخاضع لا يستخدمها']], explanation:'Regression and classification are supervised tasks, while clustering is a common unsupervised task. | يعد الانحدار والتصنيف من التعلم الخاضع، بينما التجميع من التعلم غير الخاضع.' },
    { en:'For next-hour load forecasting, which choice correctly identifies features and target?', ar:'في التنبؤ بحمل الساعة القادمة، أي خيار يحدد الميزات والهدف بصورة صحيحة؟', correct:'a', options:[['a','Features: temperature, hour, day type, previous load; Target: next-hour load','الميزات: الحرارة والساعة ونوع اليوم والحمل السابق؛ الهدف: حمل الساعة القادمة'],['b','Features: next-hour load; Target: temperature only','الميزات: حمل الساعة القادمة؛ الهدف: الحرارة فقط'],['c','Features: certificate number; Target: page title','الميزات: رقم الشهادة؛ الهدف: عنوان الصفحة'],['d','Features and target are always identical','الميزات والهدف متطابقان دائمًا']], explanation:'The lecture defines weather, time, day type, and historical load as possible inputs, with next-hour load as the target. | تحدد المحاضرة الطقس والزمن ونوع اليوم والحمل التاريخي كمدخلات، وحمل الساعة القادمة كهدف.' },
    { en:'Which pair correctly distinguishes regression from classification?', ar:'أي زوج يميز بصورة صحيحة بين الانحدار والتصنيف؟', correct:'c', options:[['a','Regression predicts categories; classification predicts continuous values','الانحدار يتنبأ بفئات والتصنيف بقيم مستمرة'],['b','Both predict continuous values only','كلاهما يتنبأ بقيم مستمرة فقط'],['c','Regression predicts continuous values; classification predicts categories','الانحدار يتنبأ بقيم مستمرة والتصنيف بفئات'],['d','Neither uses targets','كلاهما لا يستخدم أهدافًا']], explanation:'Load in MW is a regression target, while Healthy/Faulty or Normal/Warning/Emergency are classification targets. | الحمل بالميغاواط هدف انحدار، بينما سليم/معطّل أو طبيعي/تحذير/طوارئ أهداف تصنيف.' },
    { en:'What is the linear-regression model presented in the lecture?', ar:'ما نموذج الانحدار الخطي المعروض في المحاضرة؟', correct:'a', options:[['a','ŷ = wx + b','ŷ = wx + b'],['b','ŷ = x/w','ŷ = x/w'],['c','ŷ = w + x²','ŷ = w + x²'],['d','ŷ = b only','ŷ = b فقط']], explanation:'The parameter w is the slope and b is the bias or intercept. | يمثل w الميل ويمثل b الانزياح أو المقطع.' },
    { en:'Why are errors squared in Mean Squared Error?', ar:'لماذا تُربّع الأخطاء في متوسط مربع الخطأ؟', correct:'d', options:[['a','To make every error negative','لجعل كل خطأ سالبًا'],['b','To remove large errors','لحذف الأخطاء الكبيرة'],['c','To avoid optimization','لتجنب التحسين'],['d','To prevent cancellation and penalize large errors more strongly','لمنع إلغاء الأخطاء ومعاقبة الأخطاء الكبيرة بقوة أكبر']], explanation:'Squaring prevents positive and negative errors from canceling and gives larger deviations a stronger penalty. | يمنع التربيع إلغاء الأخطاء الموجبة والسالبة ويعطي الانحرافات الكبيرة عقوبة أكبر.' },
    { en:'What does the gradient update w(new) = w(old) − η dJ/dw do?', ar:'ماذا يحقق تحديث التدرج w(new) = w(old) − η dJ/dw؟', correct:'b', options:[['a','Moves w in the direction that increases the loss','يحرك w باتجاه زيادة الخطأ'],['b','Moves w opposite the loss gradient to reduce the loss','يحرك w بعكس تدرج الخطأ لتقليل الخطأ'],['c','Deletes the training data','يحذف بيانات التدريب'],['d','Sets the learning rate to zero automatically','يجعل معدل التعلم صفرًا تلقائيًا']], explanation:'Gradient descent changes parameters in the opposite direction of the derivative, scaled by the learning rate η. | يغيّر الانحدار المتدرج المعاملات بعكس اتجاه المشتقة وبمقدار يحدده معدل التعلم η.' },
    { en:'Which dataset split is used for final unbiased model evaluation?', ar:'أي جزء من البيانات يُستخدم للتقييم النهائي غير المتحيز للنموذج؟', correct:'c', options:[['a','Training set','بيانات التدريب'],['b','Validation set','بيانات التحقق'],['c','Test set','بيانات الاختبار'],['d','All sets must always be merged','يجب دمج جميع الأجزاء دائمًا']], explanation:'Training learns parameters, validation tunes model choices, and the test set provides the final evaluation. | تتعلم معاملات النموذج من التدريب، وتضبط الخيارات بالتحقق، ويُستخدم الاختبار للتقييم النهائي.' },
    { en:'Which statement best describes underfitting?', ar:'أي عبارة تصف نقص المطابقة بصورة أفضل؟', correct:'a', options:[['a','The model is too simple to capture the important relationship','النموذج بسيط جدًا ولا يلتقط العلاقة المهمة'],['b','The model memorizes training data but fails on new data','يحفظ النموذج بيانات التدريب ويفشل مع بيانات جديدة'],['c','The model has perfect generalization','يعمم النموذج بصورة مثالية'],['d','The test set is used for training','تُستخدم بيانات الاختبار للتدريب']], explanation:'Underfitting means insufficient model capacity, whereas memorizing training data is overfitting. | يعني نقص المطابقة أن قدرة النموذج غير كافية، بينما حفظ بيانات التدريب هو فرط مطابقة.' },
    { en:'Which regression metric has the same physical unit as the target, such as MW?', ar:'أي مقياس انحدار يملك نفس الوحدة الفيزيائية للمتغير الهدف مثل MW؟', correct:'c', options:[['a','MSE','MSE'],['b','Squared error only','مربع الخطأ فقط'],['c','RMSE','RMSE'],['d','Classification accuracy','دقة التصنيف']], explanation:'RMSE is the square root of MSE, so it returns to the original physical unit of the target. | بما أن RMSE هو الجذر التربيعي لـMSE فإنه يعود إلى وحدة المتغير الهدف الأصلية.' }
  ];

  const escapeHtml = value => String(value).replace(/[&<>\"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[char]));
  document.querySelector('[data-course-quiz]')?.remove();

  const section = document.createElement('section');
  section.className = 'course-quiz';
  section.id = 'quiz';
  section.dataset.courseQuiz = '';
  section.dataset.storageKey = 'ai-power-systems:lecture04';

  const questionsHtml = questions.map((question,index) => {
    const name = `lecture04-q${index+1}`;
    const options = question.options.map(option => `<label class="quiz-option"><input type="radio" name="${name}" value="${escapeHtml(option[0])}"><span><strong>${escapeHtml(option[1])}</strong><br><span dir="rtl">${escapeHtml(option[2])}</span></span></label>`).join('');
    return `<article class="quiz-question" data-correct="${escapeHtml(question.correct)}"><h3>${index+1}. ${escapeHtml(question.en)}</h3><p class="quiz-ar">${index+1}. ${escapeHtml(question.ar)}</p>${options}<div class="quiz-explanation">${escapeHtml(question.explanation)}</div></article>`;
  }).join('');

  section.innerHTML = `<div class="course-quiz-header"><h2>🧠 Lecture Quiz: Machine Learning</h2><p dir="rtl">اختبار المحاضرة: التعلم الآلي</p></div>${questionsHtml}<div class="quiz-actions"><button type="button" class="quiz-btn" data-quiz-submit>Check Answers | تحقق من الإجابات</button><button type="button" class="quiz-btn secondary" data-quiz-reset>Try Again | إعادة المحاولة</button></div><div class="quiz-result" data-quiz-result><strong data-quiz-score></strong><span data-quiz-message></span></div><div class="quiz-progress-note">Your result is stored only in this browser. | تُحفظ نتيجتك في هذا المتصفح فقط.</div>`;

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
