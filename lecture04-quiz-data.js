(() => {
  'use strict';

  const questions = [
    { en:'What is the basic idea of Machine Learning?', ar:'ما الفكرة الأساسية للتعلم الآلي؟', correct:'b', options:[['a','Programming every rule manually','برمجة كل قاعدة يدويًا'],['b','Learning patterns and relationships from data','تعلم الأنماط والعلاقات من البيانات'],['c','Replacing all measurements with guesses','استبدال جميع القياسات بالتخمين'],['d','Using only fixed lookup tables','استخدام جداول ثابتة فقط']], explanation:'Machine Learning builds models from examples instead of requiring every rule to be written explicitly. | يبني التعلم الآلي نماذج من الأمثلة بدل كتابة جميع القواعد يدويًا.' },
    { en:'In supervised learning, what is a feature?', ar:'في التعلم الخاضع للإشراف، ما المقصود بالميزة Feature؟', correct:'a', options:[['a','An input variable used by the model','متغير دخل يستخدمه النموذج'],['b','The final certificate','الشهادة النهائية'],['c','The loss value only','قيمة الخطأ فقط'],['d','A random output label','وسم خرج عشوائي']], explanation:'Features are the input variables supplied to the model, such as temperature, hour, or historical load. | الميزات هي متغيرات الدخل مثل درجة الحرارة والساعة والحمل التاريخي.' },
    { en:'What is the target in supervised learning?', ar:'ما المتغير الهدف في التعلم الخاضع للإشراف؟', correct:'c', options:[['a','A hidden folder','مجلد مخفي'],['b','The number of features','عدد الميزات'],['c','The value the model should predict','القيمة التي يجب على النموذج التنبؤ بها'],['d','The learning rate only','معدل التعلم فقط']], explanation:'The target is the known output used during training and the quantity to be predicted. | الهدف هو الخرج المعروف أثناء التدريب والقيمة المطلوب التنبؤ بها.' },
    { en:'Which statement correctly compares supervised and unsupervised learning?', ar:'أي عبارة تقارن بصورة صحيحة بين التعلم الخاضع وغير الخاضع للإشراف؟', correct:'d', options:[['a','Both always require known targets','كلاهما يتطلب أهدافًا معروفة دائمًا'],['b','Unsupervised learning uses labels only','التعلم غير الخاضع يستخدم الوسوم فقط'],['c','Supervised learning has inputs only','التعلم الخاضع يحتوي مدخلات فقط'],['d','Supervised learning uses known outputs, while unsupervised learning does not','التعلم الخاضع يستخدم مخرجات معروفة، بينما غير الخاضع لا يستخدمها']], explanation:'Regression and classification are supervised, while clustering is a common unsupervised task. | يعد الانحدار والتصنيف من التعلم الخاضع، بينما التجميع من التعلم غير الخاضع.' },
    { en:'When should regression be used?', ar:'متى يُستخدم الانحدار؟', correct:'b', options:[['a','When the target is a category only','عندما يكون الهدف فئة فقط'],['b','When the target is a continuous numerical value','عندما يكون الهدف قيمة عددية مستمرة'],['c','When no data are available','عندما لا تتوفر بيانات'],['d','When only text formatting is needed','عند الحاجة إلى تنسيق النص فقط']], explanation:'Regression predicts continuous values such as electrical load in MW. | يتنبأ الانحدار بقيم مستمرة مثل الحمل الكهربائي بالميغاواط.' },
    { en:'What is the linear-regression model used in the lecture?', ar:'ما نموذج الانحدار الخطي المستخدم في المحاضرة؟', correct:'a', options:[['a','ŷ = wx + b','ŷ = wx + b'],['b','ŷ = x/w','ŷ = x/w'],['c','ŷ = w + x²','ŷ = w + x²'],['d','ŷ = b only','ŷ = b فقط']], explanation:'The parameter w is the slope and b is the intercept or bias. | يمثل w الميل ويمثل b الانزياح أو المقطع.' },
    { en:'How is the prediction error for sample i defined?', ar:'كيف يُعرّف خطأ التنبؤ للعينة i؟', correct:'c', options:[['a','eᵢ = yᵢ + ŷᵢ','eᵢ = yᵢ + ŷᵢ'],['b','eᵢ = yᵢ / ŷᵢ','eᵢ = yᵢ / ŷᵢ'],['c','eᵢ = ŷᵢ − yᵢ','eᵢ = ŷᵢ − yᵢ'],['d','eᵢ = 1 always','eᵢ = 1 دائمًا']], explanation:'Prediction error is the difference between predicted and true output. | خطأ التنبؤ هو الفرق بين القيمة المتنبأ بها والقيمة الحقيقية.' },
    { en:'Why are errors squared in Mean Squared Error?', ar:'لماذا تُربّع الأخطاء في متوسط مربع الخطأ؟', correct:'d', options:[['a','To make all errors negative','لجعل جميع الأخطاء سالبة'],['b','To remove large errors','لحذف الأخطاء الكبيرة'],['c','To avoid using data','لتجنب استخدام البيانات'],['d','To prevent cancellation and penalize large errors more strongly','لمنع إلغاء الأخطاء لبعضها ومعاقبة الأخطاء الكبيرة أكثر']], explanation:'MSE uses squared errors so positive and negative errors do not cancel and large deviations receive greater penalty. | يستخدم MSE مربعات الأخطاء لمنع الإلغاء وإعطاء عقوبة أكبر للانحرافات الكبيرة.' },
    { en:'What does training mean in linear regression?', ar:'ماذا يعني التدريب في الانحدار الخطي؟', correct:'a', options:[['a','Finding w and b that minimize the loss','إيجاد w وb اللذين يصغّران دالة الخطأ'],['b','Keeping w and b fixed forever','إبقاء w وb ثابتين دائمًا'],['c','Deleting the target values','حذف القيم الهدف'],['d','Using test data to update the model','استخدام بيانات الاختبار لتحديث النموذج']], explanation:'Training is an optimization problem that adjusts model parameters to reduce prediction error. | التدريب مسألة تحسين تعدّل معاملات النموذج لتقليل خطأ التنبؤ.' },
    { en:'Which situation best describes overfitting?', ar:'أي حالة تصف فرط المطابقة بصورة أفضل؟', correct:'b', options:[['a','The model performs poorly on both training and test data','أداء النموذج ضعيف على بيانات التدريب والاختبار'],['b','The model performs very well on training data but poorly on unseen data','أداء النموذج ممتاز على التدريب وضعيف على بيانات جديدة'],['c','The model has no parameters','لا يملك النموذج معاملات'],['d','The model always predicts the mean by design','يتنبأ النموذج بالمتوسط دائمًا حسب التصميم']], explanation:'Overfitting occurs when a model memorizes training details and does not generalize well. | يحدث فرط المطابقة عندما يحفظ النموذج تفاصيل التدريب ولا يعمم جيدًا.' }
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
