(() => {
  'use strict';
  if (!/lecture08\.html$/i.test(location.pathname) || document.querySelector('[data-course-quiz]')) return;

  const letters = ['a','b','c','d'];
  const Q = (en, ar, correctIndex, options, explanation) => ({
    en, ar,
    options: options.map((option, index) => [letters[index], option[0], option[1]]),
    correct: letters[correctIndex], explanation
  });
  const questions = [
    Q('Why can an accurate AI model still be unsuitable for engineering use?','لماذا قد يكون نموذج ذكاء اصطناعي دقيق غير مناسب للاستخدام الهندسي؟',1,[['Accuracy guarantees safety','الدقة تضمن السلامة'],['It may still be unsafe, unfair, or misleading','قد يبقى غير آمن أو غير عادل أو مضلل'],['It never uses data','لا يستخدم البيانات أبدًا'],['Engineering needs no validation','الهندسة لا تحتاج إلى تحقق']],'Accuracy alone does not guarantee safe, fair, or appropriate real-world behavior. | الدقة وحدها لا تضمن سلوكًا آمنًا أو عادلًا أو مناسبًا في الواقع.'),
    Q('What can biased or incomplete training data cause?','ماذا قد تسبب بيانات التدريب المنحازة أو غير المكتملة؟',2,[['Guaranteed fairness','عدالة مضمونة'],['Zero uncertainty','انعدام عدم اليقين'],['Biased predictions','تنبؤات منحازة'],['Automatic cybersecurity','أمنًا سيبرانيًا تلقائيًا']],'A model learns patterns from its training data, so systematic data bias can propagate into predictions. | يتعلم النموذج الأنماط من بيانات التدريب، لذلك قد ينتقل تحيز البيانات المنهجي إلى التنبؤات.'),
    Q('What does dataset shift mean?','ماذا يعني تغير توزيع البيانات Dataset Shift؟',0,[['Real-world input distribution differs from training conditions','يختلف توزيع مدخلات الواقع عن ظروف التدريب'],['The model has more layers','يحتوي النموذج طبقات أكثر'],['The voltage is always constant','الجهد ثابت دائمًا'],['The dataset is encrypted','مجموعة البيانات مشفرة']],'Dataset shift occurs when deployment conditions differ from the distribution represented during training. | يحدث تغير توزيع البيانات عندما تختلف ظروف التشغيل عن التوزيع الممثل أثناء التدريب.'),
    Q('What is the purpose of explainability?','ما هدف قابلية التفسير؟',3,[['Hide model decisions','إخفاء قرارات النموذج'],['Increase file size','زيادة حجم الملف'],['Remove human responsibility','إلغاء المسؤولية البشرية'],['Provide understandable reasons for predictions or recommendations','تقديم أسباب مفهومة للتنبؤات أو التوصيات']],'Explainability helps engineers and stakeholders understand and audit AI-supported decisions. | تساعد قابلية التفسير المهندسين وأصحاب المصلحة على فهم القرارات المدعومة بالذكاء الاصطناعي ومراجعتها.'),
    Q('What is automation bias?','ما المقصود بالتحيز نحو الأتمتة؟',1,[['Rejecting every automated result','رفض كل نتيجة آلية'],['Trusting an automated recommendation simply because a computer produced it','الثقة بتوصية آلية لمجرد أن الحاسوب أنتجها'],['Encrypting measurements','تشفير القياسات'],['Testing extreme conditions','اختبار الحالات المتطرفة']],'Automation bias is excessive trust in automated recommendations without sufficient independent judgment. | التحيز نحو الأتمتة هو الثقة المفرطة بالتوصيات الآلية دون حكم مستقل كافٍ.'),
    Q('Which practice best supports data privacy?','أي ممارسة تدعم خصوصية البيانات بصورة أفضل؟',0,[['Data minimization and controlled access','تقليل البيانات والتحكم بالوصول'],['Publishing all customer data','نشر جميع بيانات العملاء'],['Removing access controls','إلغاء ضوابط الوصول'],['Collecting data without purpose limits','جمع البيانات دون تحديد الغرض']],'Privacy requires collecting necessary data only and controlling storage, access, and use. | تتطلب الخصوصية جمع البيانات الضرورية فقط وضبط تخزينها والوصول إليها واستخدامها.'),
    Q('Which is a cybersecurity risk mentioned in the lecture?','أي مما يلي خطر سيبراني ورد في المحاضرة؟',2,[['Using validation data','استخدام بيانات التحقق'],['Human review','المراجعة البشرية'],['Manipulation of measurements or model parameters','التلاعب بالقياسات أو معاملات النموذج'],['Applying safety limits','تطبيق قيود السلامة']],'The lecture identifies data manipulation, model manipulation, adversarial inputs, and unauthorized access as risks. | تذكر المحاضرة التلاعب بالبيانات والنموذج والمدخلات الخصومية والوصول غير المصرح به كمخاطر.'),
    Q('How should AI optimization operate in a power system?','كيف يجب أن يعمل تحسين الذكاء الاصطناعي في نظام القدرة؟',3,[['Without voltage limits','دون حدود للجهد'],['Without current limits','دون حدود للتيار'],['By replacing all protection','باستبدال جميع الحمايات'],['Inside an explicit engineering safety envelope','ضمن غلاف سلامة هندسي واضح']],'Physical limits such as voltage, current, and SOC constraints must remain enforced. | يجب فرض الحدود الفيزيائية مثل قيود الجهد والتيار وحالة الشحن.'),
    Q('What should happen if an AI output is unsafe or invalid?','ماذا يجب أن يحدث إذا كان خرج الذكاء الاصطناعي غير آمن أو غير صالح؟',1,[['Apply it immediately','يطبق فورًا'],['Reject it and use a safe fallback mechanism','يرفض ويستخدم نظامًا احتياطيًا آمنًا'],['Disable all monitoring','تعطل كل المراقبة'],['Ignore physical constraints','تتجاهل القيود الفيزيائية']],'Fail-safe design checks AI outputs and falls back to a trusted controller or safe operating point when necessary. | يفحص التصميم الآمن خرج AI ويعود إلى متحكم موثوق أو نقطة تشغيل آمنة عند الحاجة.'),
    Q('Why must an AI model be monitored after deployment?','لماذا يجب مراقبة نموذج الذكاء الاصطناعي بعد التشغيل؟',0,[['Performance may deteriorate as operating conditions change','قد يتدهور الأداء مع تغير ظروف التشغيل'],['Deployment makes validation unnecessary','التشغيل يلغي الحاجة للتحقق'],['Models never experience dataset shift','النماذج لا تواجه تغير توزيع البيانات'],['Monitoring removes accountability','المراقبة تلغي المساءلة']],'Deployment is not the end of validation; changing conditions can degrade performance and require revalidation. | التشغيل ليس نهاية التحقق؛ فقد تؤدي الظروف المتغيرة إلى تدهور الأداء والحاجة إلى إعادة التحقق.')
  ];

  const escapeHtml = value => String(value).replace(/[&<>\"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[char]));
  const section = document.createElement('section');
  section.className = 'course-quiz';
  section.id = 'quiz';
  section.dataset.courseQuiz = '';
  section.dataset.storageKey = 'ai-power-systems:lecture08';
  const questionsHtml = questions.map((q, index) => {
    const options = q.options.map(o => `<label class="quiz-option"><input type="radio" name="lecture08-q${index+1}" value="${o[0]}"><span><strong>${escapeHtml(o[1])}</strong><br><span dir="rtl">${escapeHtml(o[2])}</span></span></label>`).join('');
    return `<article class="quiz-question" data-correct="${q.correct}"><h3>${index+1}. ${escapeHtml(q.en)}</h3><p class="quiz-ar">${index+1}. ${escapeHtml(q.ar)}</p>${options}<div class="quiz-explanation">${escapeHtml(q.explanation)}</div></article>`;
  }).join('');
  section.innerHTML = `<div class="course-quiz-header"><h2>🧠 Interactive Quiz — Lecture 08</h2><p dir="rtl">اختبار تفاعلي — المحاضرة 08</p></div>${questionsHtml}<div class="quiz-actions"><button type="button" class="quiz-btn" data-quiz-submit>Check Answers | تحقق من الإجابات</button><button type="button" class="quiz-btn secondary" data-quiz-reset>Try Again | إعادة المحاولة</button></div><div class="quiz-result" data-quiz-result><strong data-quiz-score></strong><span data-quiz-message></span></div><div class="quiz-progress-note">Your result is stored only in this browser. | تُحفظ نتيجتك في هذا المتصفح فقط.</div>`;
  const nav = document.querySelector('.course-page-navigation');
  const footer = document.querySelector('footer');
  if (nav?.parentNode) nav.parentNode.insertBefore(section, nav);
  else if (footer?.parentNode) footer.parentNode.insertBefore(section, footer);
  else document.body.appendChild(section);
})();