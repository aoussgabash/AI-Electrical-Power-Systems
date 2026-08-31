(() => {
  'use strict';

  const questions = [
    {
      en: 'Which sequence best describes the operation of an intelligent agent?',
      ar: 'أي تسلسل يصف بصورة أفضل عمل الوكيل الذكي؟',
      correct: 'b',
      options: [
        ['a', 'Act → ignore → stop', 'تنفيذ فعل ← تجاهل ← توقف'],
        ['b', 'Perceive → decide → act', 'استشعار ← اتخاذ قرار ← تنفيذ فعل'],
        ['c', 'Store → print → disconnect', 'تخزين ← طباعة ← فصل'],
        ['d', 'Guess → repeat → delete', 'تخمين ← تكرار ← حذف']
      ],
      explanation: 'An intelligent agent observes its environment, processes information, and selects an action. | يراقب الوكيل الذكي بيئته ويعالج المعلومات ثم يختار فعلًا.'
    },
    {
      en: 'What is the main role of sensors in an intelligent agent?',
      ar: 'ما الدور الأساسي للحساسات في الوكيل الذكي؟',
      correct: 'a',
      options: [
        ['a', 'Observe the environment', 'مراقبة البيئة'],
        ['b', 'Execute control actions', 'تنفيذ أفعال التحكم'],
        ['c', 'Define the goal cost only', 'تحديد كلفة الهدف فقط'],
        ['d', 'Replace the agent', 'استبدال الوكيل']
      ],
      explanation: 'Sensors provide observations about the environment, while actuators execute actions. | توفر الحساسات ملاحظات عن البيئة، بينما تنفذ المشغلات الأفعال.'
    },
    {
      en: 'In the PEAS framework, what does the letter A represent?',
      ar: 'في إطار PEAS، ماذا يمثل الحرف A؟',
      correct: 'c',
      options: [
        ['a', 'Algorithm', 'الخوارزمية'],
        ['b', 'Accuracy', 'الدقة'],
        ['c', 'Actuators', 'المشغلات'],
        ['d', 'Alternatives', 'البدائل']
      ],
      explanation: 'PEAS stands for Performance, Environment, Actuators, and Sensors. | يشير PEAS إلى معيار الأداء والبيئة والمشغلات والحساسات.'
    },
    {
      en: 'Which set correctly defines a search problem?',
      ar: 'أي مجموعة تعرّف مسألة البحث بصورة صحيحة؟',
      correct: 'd',
      options: [
        ['a', 'Only a goal state', 'حالة هدف فقط'],
        ['b', 'Only actions and costs', 'الأفعال والكلف فقط'],
        ['c', 'Sensors and actuators only', 'الحساسات والمشغلات فقط'],
        ['d', 'States, actions, transition model, goal, and cost', 'الحالات والأفعال ونموذج الانتقال والهدف والكلفة']
      ],
      explanation: 'A complete search formulation includes S, A, T, G, and C. | تتضمن صياغة البحث الكاملة S وA وT وG وC.'
    },
    {
      en: 'What does the transition equation s(k+1) = T(s(k), a(k)) mean?',
      ar: 'ماذا تعني معادلة الانتقال s(k+1) = T(s(k), a(k))؟',
      correct: 'b',
      options: [
        ['a', 'The next state is always equal to the goal', 'الحالة التالية تساوي الهدف دائمًا'],
        ['b', 'The next state depends on the current state and selected action', 'تعتمد الحالة التالية على الحالة الحالية والفعل المختار'],
        ['c', 'The action is independent of the state', 'الفعل مستقل عن الحالة'],
        ['d', 'The cost is always zero', 'الكلفة تساوي صفرًا دائمًا']
      ],
      explanation: 'The transition model maps a current state and action to the next state. | يربط نموذج الانتقال الحالة الحالية والفعل بالحالة التالية.'
    },
    {
      en: 'How does Breadth-First Search explore a search tree?',
      ar: 'كيف تستكشف خوارزمية البحث بالعرض شجرة البحث؟',
      correct: 'a',
      options: [
        ['a', 'Level by level', 'مستوى بعد مستوى'],
        ['b', 'Along one branch as deeply as possible first', 'على فرع واحد إلى أكبر عمق أولًا'],
        ['c', 'Only by lowest heuristic value', 'فقط وفق أصغر قيمة إرشادية'],
        ['d', 'Randomly', 'عشوائيًا']
      ],
      explanation: 'BFS visits all nodes at one depth before moving to the next depth. | تزور BFS جميع عقد المستوى الحالي قبل الانتقال إلى المستوى التالي.'
    },
    {
      en: 'What is a typical disadvantage of Depth-First Search?',
      ar: 'ما أحد العيوب الشائعة للبحث بالعمق؟',
      correct: 'c',
      options: [
        ['a', 'It always uses too much memory', 'يستخدم ذاكرة كبيرة دائمًا'],
        ['b', 'It cannot expand any node', 'لا يستطيع توسيع أي عقدة'],
        ['c', 'It may follow a deep unproductive path and miss a shallow solution', 'قد يتبع مسارًا عميقًا غير منتج ويتأخر عن حل قريب'],
        ['d', 'It requires a heuristic function', 'يتطلب دالة إرشادية']
      ],
      explanation: 'DFS can go deeply along an unsuitable branch before exploring alternatives. | قد يتعمق DFS في فرع غير مناسب قبل استكشاف البدائل.'
    },
    {
      en: 'In A* search, what is the evaluation function?',
      ar: 'في بحث A*، ما دالة التقييم؟',
      correct: 'd',
      options: [
        ['a', 'f(n) = h(n) − g(n)', 'f(n) = h(n) − g(n)'],
        ['b', 'f(n) = g(n) only', 'f(n) = g(n) فقط'],
        ['c', 'f(n) = h(n) only', 'f(n) = h(n) فقط'],
        ['d', 'f(n) = g(n) + h(n)', 'f(n) = g(n) + h(n)']
      ],
      explanation: 'A* combines the path cost so far g(n) with the estimated remaining cost h(n). | تجمع A* كلفة المسار الحالية g(n) مع تقدير الكلفة المتبقية h(n).'
    },
    {
      en: 'What condition makes a heuristic admissible?',
      ar: 'ما الشرط الذي يجعل الدالة الإرشادية مقبولة؟',
      correct: 'a',
      options: [
        ['a', 'It never overestimates the true remaining cost', 'ألا تبالغ في تقدير الكلفة الحقيقية المتبقية'],
        ['b', 'It is always negative', 'أن تكون سالبة دائمًا'],
        ['c', 'It equals the path cost', 'أن تساوي كلفة المسار'],
        ['d', 'It changes randomly', 'أن تتغير عشوائيًا']
      ],
      explanation: 'An admissible heuristic does not overestimate the actual cost to reach the goal. | لا تبالغ الدالة الإرشادية المقبولة في تقدير الكلفة الفعلية للوصول إلى الهدف.'
    },
    {
      en: 'Which state description is appropriate for battery scheduling in a power system?',
      ar: 'أي توصيف للحالة مناسب لجدولة البطارية في نظام قدرة؟',
      correct: 'c',
      options: [
        ['a', 'Battery color only', 'لون البطارية فقط'],
        ['b', 'Page title and logo', 'عنوان الصفحة والشعار'],
        ['c', 'Time, state of charge, load, and electricity price', 'الزمن وحالة الشحن والحمل وسعر الكهرباء'],
        ['d', 'A random integer only', 'عدد صحيح عشوائي فقط']
      ],
      explanation: 'A useful state must contain the variables needed to select meaningful actions. | يجب أن تحتوي الحالة المفيدة المتغيرات اللازمة لاختيار أفعال ذات معنى.'
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
  section.dataset.storageKey = 'ai-power-systems:lecture02';

  const questionsHtml = questions.map((question, index) => {
    const name = `lecture02-q${index + 1}`;
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
      <h2>🧠 Lecture Quiz: Intelligent Agents & Search</h2>
      <p dir="rtl">اختبار المحاضرة: الوكلاء الأذكياء وخوارزميات البحث</p>
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
  grader.src = 'course-quiz.js?v=20260831-rtlfix';
  grader.defer = true;
  document.head.appendChild(grader);
})();
