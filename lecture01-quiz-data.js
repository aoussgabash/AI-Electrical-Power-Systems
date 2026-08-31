(() => {
  'use strict';

  const questions = [
    {
      en: 'Which statement best describes Artificial Intelligence?',
      ar: 'أي عبارة تصف الذكاء الاصطناعي بصورة أفضل؟',
      correct: 'b',
      options: [
        ['a', 'Only numerical calculation', 'الحسابات العددية فقط'],
        ['b', 'Systems performing tasks associated with human intelligence', 'أنظمة تنفذ مهام مرتبطة بالذكاء البشري'],
        ['c', 'A type of electrical generator', 'نوع من المولدات الكهربائية'],
        ['d', 'A passive database', 'قاعدة بيانات سلبية']
      ],
      explanation: 'AI includes capabilities such as learning, reasoning, perception, and decision-making. | يشمل الذكاء الاصطناعي قدرات مثل التعلم والاستدلال والإدراك واتخاذ القرار.'
    },
    {
      en: 'What is the correct relationship among AI, Machine Learning, and Deep Learning?',
      ar: 'ما العلاقة الصحيحة بين الذكاء الاصطناعي والتعلم الآلي والتعلم العميق؟',
      correct: 'b',
      options: [
        ['a', 'AI is a subset of Deep Learning', 'الذكاء الاصطناعي جزء من التعلم العميق'],
        ['b', 'Deep Learning is within Machine Learning, and Machine Learning is within AI', 'التعلم العميق ضمن التعلم الآلي، والتعلم الآلي ضمن الذكاء الاصطناعي'],
        ['c', 'The three fields are unrelated', 'المجالات الثلاثة غير مترابطة'],
        ['d', 'The three terms are identical', 'المصطلحات الثلاثة متطابقة']
      ],
      explanation: 'Deep Learning is a specialized branch of Machine Learning, which is part of AI. | التعلم العميق فرع متخصص من التعلم الآلي، والتعلم الآلي جزء من الذكاء الاصطناعي.'
    },
    {
      en: 'Which ability is most closely associated with an intelligent system?',
      ar: 'أي قدرة ترتبط أكثر بالنظام الذكي؟',
      correct: 'c',
      options: [
        ['a', 'Repeating one fixed output regardless of input', 'تكرار خرج ثابت بغض النظر عن الدخل'],
        ['b', 'Storing data without using it', 'تخزين البيانات دون استخدامها'],
        ['c', 'Perceiving information and selecting an appropriate action', 'إدراك المعلومات واختيار فعل مناسب'],
        ['d', 'Disconnecting itself from the environment', 'الانفصال عن البيئة']
      ],
      explanation: 'An intelligent system uses observations to make decisions or select actions toward a goal. | يستخدم النظام الذكي الملاحظات لاتخاذ القرارات أو اختيار الأفعال لتحقيق هدف.'
    },
    {
      en: 'What is an intelligent agent?',
      ar: 'ما الوكيل الذكي؟',
      correct: 'a',
      options: [
        ['a', 'A system that perceives its environment and acts toward a goal', 'نظام يدرك بيئته ويتصرف لتحقيق هدف'],
        ['b', 'A disconnected wire', 'سلك غير موصول'],
        ['c', 'A fixed label in a database', 'تسمية ثابتة في قاعدة بيانات'],
        ['d', 'A passive electrical component', 'عنصر كهربائي سلبي']
      ],
      explanation: 'An agent receives percepts from its environment and chooses actions that support its objective. | يستقبل الوكيل مدركات من البيئة ويختار أفعالًا تدعم هدفه.'
    },
    {
      en: 'In an intelligent-agent model, what provides information about the environment?',
      ar: 'في نموذج الوكيل الذكي، ما الذي يوفر معلومات عن البيئة؟',
      correct: 'b',
      options: [
        ['a', 'Actuators only', 'المشغلات فقط'],
        ['b', 'Sensors or observations', 'الحساسات أو الملاحظات'],
        ['c', 'The final certificate', 'الشهادة النهائية'],
        ['d', 'A random number without context', 'عدد عشوائي بلا سياق']
      ],
      explanation: 'Sensors provide observations that allow the agent to perceive the environment. | توفر الحساسات ملاحظات تمكّن الوكيل من إدراك البيئة.'
    },
    {
      en: 'Why is AI useful in electrical power systems?',
      ar: 'لماذا يفيد الذكاء الاصطناعي في أنظمة القدرة الكهربائية؟',
      correct: 'c',
      options: [
        ['a', 'Power systems contain no uncertainty', 'أنظمة القدرة لا تحتوي عدم يقين'],
        ['b', 'AI removes the need for all measurements', 'يلغي الذكاء الاصطناعي الحاجة إلى جميع القياسات'],
        ['c', 'It can support complex, nonlinear, uncertain, and data-rich decisions', 'يمكنه دعم القرارات المعقدة واللاخطية وغير المؤكدة والغنية بالبيانات'],
        ['d', 'It guarantees perfect results in every case', 'يضمن نتائج مثالية في كل حالة']
      ],
      explanation: 'AI can complement physical models when problems are nonlinear, uncertain, or rich in operational data. | يمكن للذكاء الاصطناعي أن يكمل النماذج الفيزيائية في المسائل اللاخطية أو غير المؤكدة أو الغنية بالبيانات التشغيلية.'
    },
    {
      en: 'Which is a realistic AI application in power engineering?',
      ar: 'أي مما يلي تطبيق واقعي للذكاء الاصطناعي في هندسة القدرة؟',
      correct: 'a',
      options: [
        ['a', 'Load forecasting and fault detection', 'التنبؤ بالحمل وكشف الأعطال'],
        ['b', 'Changing the physical speed of light', 'تغيير سرعة الضوء الفيزيائية'],
        ['c', 'Eliminating every network loss by software alone', 'إلغاء جميع فواقد الشبكة بالبرمجيات فقط'],
        ['d', 'Operating accurately without any data', 'العمل بدقة دون أي بيانات']
      ],
      explanation: 'Forecasting, fault detection, state estimation, and predictive maintenance are realistic AI applications. | يعد التنبؤ وكشف الأعطال وتقدير الحالة والصيانة التنبؤية تطبيقات واقعية للذكاء الاصطناعي.'
    },
    {
      en: 'Which statement best compares AI with conventional numerical methods?',
      ar: 'أي عبارة تقارن بصورة أفضل بين الذكاء الاصطناعي والطرائق العددية التقليدية؟',
      correct: 'd',
      options: [
        ['a', 'AI always replaces physical equations', 'يستبدل الذكاء الاصطناعي المعادلات الفيزيائية دائمًا'],
        ['b', 'Conventional methods never use data', 'الطرائق التقليدية لا تستخدم البيانات مطلقًا'],
        ['c', 'AI needs no validation', 'لا يحتاج الذكاء الاصطناعي إلى تحقق'],
        ['d', 'AI can complement conventional models rather than automatically replace them', 'يمكن للذكاء الاصطناعي أن يكمل النماذج التقليدية بدل استبدالها تلقائيًا']
      ],
      explanation: 'Engineering AI is strongest when data-driven methods and physical knowledge are used together appropriately. | يكون الذكاء الاصطناعي الهندسي أقوى عند استخدام الطرائق المعتمدة على البيانات والمعرفة الفيزيائية معًا بصورة مناسبة.'
    },
    {
      en: 'A controller measures voltage, evaluates the condition, and changes a control signal. Which AI concept does this most closely resemble?',
      ar: 'يقيس متحكم الجهد ويقيّم الحالة ثم يغيّر إشارة التحكم. أي مفهوم في الذكاء الاصطناعي يشبه ذلك أكثر؟',
      correct: 'b',
      options: [
        ['a', 'A passive database', 'قاعدة بيانات سلبية'],
        ['b', 'An agent that perceives and acts', 'وكيل يدرك ويتصرف'],
        ['c', 'An unlabeled image only', 'صورة غير موسومة فقط'],
        ['d', 'A fixed text document', 'مستند نصي ثابت']
      ],
      explanation: 'The measurement is a percept and the control command is an action, matching the agent concept. | يمثل القياس إدراكًا وتمثل إشارة التحكم فعلًا، وهذا يطابق مفهوم الوكيل.'
    },
    {
      en: 'Which sequence best represents the operation of an intelligent system?',
      ar: 'أي تسلسل يمثل بصورة أفضل عمل النظام الذكي؟',
      correct: 'c',
      options: [
        ['a', 'Action → no observation → random goal', 'فعل ← دون ملاحظة ← هدف عشوائي'],
        ['b', 'Database → certificate → resistor', 'قاعدة بيانات ← شهادة ← مقاومة'],
        ['c', 'Perceive → reason or learn → decide → act', 'إدراك ← استدلال أو تعلم ← قرار ← فعل'],
        ['d', 'Ignore environment → repeat output', 'تجاهل البيئة ← تكرار الخرج']
      ],
      explanation: 'A typical intelligent cycle starts with perception, processes information, selects a decision, and then acts. | تبدأ الدورة الذكية عادة بالإدراك ثم معالجة المعلومات واختيار القرار ثم تنفيذ الفعل.'
    }
  ];

  const escapeHtml = value => String(value).replace(/[&<>\"]/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;'
  }[char]));

  document.querySelector('[data-course-quiz]')?.remove();

  const section = document.createElement('section');
  section.className = 'course-quiz';
  section.id = 'quiz';
  section.dataset.courseQuiz = '';
  section.dataset.storageKey = 'ai-power-systems:lecture01';

  const questionsHtml = questions.map((question, index) => {
    const name = `lecture01-q${index + 1}`;
    const options = question.options.map(option => `
      <label class="quiz-option">
        <input type="radio" name="${name}" value="${escapeHtml(option[0])}">
        <span><strong>${escapeHtml(option[1])}</strong><br><span dir="rtl">${escapeHtml(option[2])}</span></span>
      </label>`).join('');

    return `
      <article class="quiz-question" data-correct="${escapeHtml(question.correct)}">
        <h3>${index + 1}. ${escapeHtml(question.en)}</h3>
        <p class="quiz-ar">${index + 1}. ${escapeHtml(question.ar)}</p>
        ${options}
        <div class="quiz-explanation">${escapeHtml(question.explanation)}</div>
      </article>`;
  }).join('');

  section.innerHTML = `
    <div class="course-quiz-header">
      <h2>🧠 Lecture Quiz: Introduction to Artificial Intelligence</h2>
      <p dir="rtl">اختبار المحاضرة: مقدمة في الذكاء الاصطناعي</p>
    </div>
    ${questionsHtml}
    <div class="quiz-actions">
      <button type="button" class="quiz-btn" data-quiz-submit>Check Answers | تحقق من الإجابات</button>
      <button type="button" class="quiz-btn secondary" data-quiz-reset>Try Again | إعادة المحاولة</button>
    </div>
    <div class="quiz-result" data-quiz-result>
      <strong data-quiz-score></strong>
      <span data-quiz-message></span>
    </div>
    <div class="quiz-progress-note">Your result is stored only in this browser. | تُحفظ نتيجتك في هذا المتصفح فقط.</div>`;

  const nav = document.querySelector('.course-page-navigation');
  const footer = document.querySelector('footer');
  if (nav?.parentNode) nav.parentNode.insertBefore(section, nav);
  else if (footer?.parentNode) footer.parentNode.insertBefore(section, footer);
  else document.body.appendChild(section);

  const grader = document.createElement('script');
  grader.src = 'course-quiz.js?v=20260831-lecture01';
  grader.defer = true;
  document.head.appendChild(grader);
})();
