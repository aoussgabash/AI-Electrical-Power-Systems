(() => {
  'use strict';

  const quizBank = {
    lecture01: {
      titleEn: 'Interactive Quiz — Lecture 01',
      titleAr: 'اختبار تفاعلي — المحاضرة 01',
      questions: [
        {
          en: 'Which statement best describes Artificial Intelligence?',
          ar: 'أي عبارة تصف الذكاء الاصطناعي بصورة أفضل؟',
          options: [
            ['a','A method used only for numerical calculation','طريقة تُستخدم فقط للحسابات العددية'],
            ['b','A field that develops systems capable of tasks associated with human intelligence','مجال يطوّر أنظمة قادرة على تنفيذ مهام مرتبطة بالذكاء البشري'],
            ['c','A type of electrical generator','نوع من المولدات الكهربائية'],
            ['d','A database without learning capability','قاعدة بيانات دون قدرة على التعلم']
          ],
          correct: 'b',
          explanation: 'AI includes learning, reasoning, pattern recognition, decision-making, and adaptation. | يشمل الذكاء الاصطناعي التعلم والاستدلال والتعرف على الأنماط واتخاذ القرار والتكيف.'
        },
        {
          en: 'What is the correct relationship among AI, Machine Learning, and Deep Learning?',
          ar: 'ما العلاقة الصحيحة بين الذكاء الاصطناعي والتعلم الآلي والتعلم العميق؟',
          options: [
            ['a','AI is part of Deep Learning','الذكاء الاصطناعي جزء من التعلم العميق'],
            ['b','Deep Learning is part of Machine Learning, which is part of AI','التعلم العميق جزء من التعلم الآلي، والتعلم الآلي جزء من الذكاء الاصطناعي'],
            ['c','They are completely unrelated','لا توجد علاقة بينها'],
            ['d','Machine Learning and AI are identical in all cases','التعلم الآلي والذكاء الاصطناعي متطابقان دائمًا']
          ],
          correct: 'b',
          explanation: 'Deep Learning is a subset of Machine Learning, and Machine Learning is a subset of AI. | التعلم العميق فرع من التعلم الآلي، والتعلم الآلي فرع من الذكاء الاصطناعي.'
        },
        {
          en: 'Why is AI useful in electrical power systems?',
          ar: 'لماذا يُعد الذكاء الاصطناعي مفيدًا في أنظمة القدرة الكهربائية؟',
          options: [
            ['a','Because power systems never change','لأن أنظمة القدرة لا تتغير'],
            ['b','Because AI can address complex, uncertain, and data-rich problems','لأن الذكاء الاصطناعي يستطيع معالجة المسائل المعقدة وغير المؤكدة والغنية بالبيانات'],
            ['c','Because it removes the need for measurements','لأنه يلغي الحاجة إلى القياسات'],
            ['d','Because it guarantees perfect predictions','لأنه يضمن تنبؤات مثالية']
          ],
          correct: 'b',
          explanation: 'Power-system operation involves nonlinear, uncertain, and data-intensive problems where AI can complement physical models. | تتضمن أنظمة القدرة مسائل لاخطية وغير مؤكدة وغنية بالبيانات، ويمكن للذكاء الاصطناعي أن يكمّل النماذج الفيزيائية.'
        },
        {
          en: 'Which of the following is an example of an intelligent agent?',
          ar: 'أي مما يلي يُعد مثالًا على وكيل ذكي؟',
          options: [
            ['a','A controller that senses system conditions and selects an action','متحكم يستشعر حالة النظام ويختار فعلًا مناسبًا'],
            ['b','A disconnected wire','سلك غير موصول'],
            ['c','A fixed label on a diagram','تسمية ثابتة على مخطط'],
            ['d','A passive resistor with no sensing or decision-making','مقاومة سلبية دون استشعار أو اتخاذ قرار']
          ],
          correct: 'a',
          explanation: 'An intelligent agent perceives its environment and acts to achieve a goal. | يستشعر الوكيل الذكي بيئته ويتخذ أفعالًا لتحقيق هدف.'
        },
        {
          en: 'Which task is a realistic AI application in power engineering?',
          ar: 'أي مهمة تُعد تطبيقًا واقعيًا للذكاء الاصطناعي في هندسة القدرة؟',
          options: [
            ['a','Load forecasting and fault detection','التنبؤ بالحمل وكشف الأعطال'],
            ['b','Changing the physical value of the speed of light','تغيير القيمة الفيزيائية لسرعة الضوء'],
            ['c','Eliminating all electrical losses by software alone','إلغاء جميع الفواقد الكهربائية بالبرمجيات وحدها'],
            ['d','Operating without any data or model','التشغيل دون بيانات أو نموذج']
          ],
          correct: 'a',
          explanation: 'Forecasting, fault detection, state estimation, and energy management are established AI application areas. | يُعد التنبؤ وكشف الأعطال وتقدير الحالة وإدارة الطاقة من مجالات تطبيق الذكاء الاصطناعي المعروفة.'
        }
      ]
    }
  };

  function escapeHtml(value) {
    return String(value).replace(/[&<>"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[char]));
  }

  function renderQuiz(key) {
    const data = quizBank[key];
    if (!data || document.querySelector('[data-course-quiz]')) return;

    const section = document.createElement('section');
    section.className = 'course-quiz';
    section.dataset.courseQuiz = '';
    section.dataset.storageKey = `ai-power-systems:${key}`;

    const questionsHtml = data.questions.map((question, index) => {
      const name = `${key}-q${index + 1}`;
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
        <h2>🧠 ${escapeHtml(data.titleEn)}</h2>
        <p dir="rtl">${escapeHtml(data.titleAr)}</p>
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
      <div class="quiz-progress-note">Your best result is stored only in this browser. | تُحفظ نتيجتك في هذا المتصفح فقط.</div>`;

    const footer = document.querySelector('footer');
    const main = document.querySelector('main');
    if (footer && footer.parentNode) footer.parentNode.insertBefore(section, footer);
    else if (main) main.appendChild(section);
    else document.body.appendChild(section);
  }

  const pageKey = (location.pathname.split('/').pop() || '').replace(/\.html$/i, '').toLowerCase();
  if (quizBank[pageKey]) renderQuiz(pageKey);
})();
