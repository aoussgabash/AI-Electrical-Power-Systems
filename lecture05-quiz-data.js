(() => {
  'use strict';

  const letters = ['a', 'b', 'c', 'd'];
  const Q = (en, ar, correctIndex, options, explanation) => ({
    en,
    ar,
    options: options.map((option, index) => [letters[index], option[0], option[1]]),
    correct: letters[correctIndex],
    explanation
  });

  const questions = [
    Q('What does an artificial neuron calculate before applying its activation function?', 'ماذا يحسب العصبون الاصطناعي قبل تطبيق دالة التنشيط؟', 1, [
      ['A cluster label', 'تسمية عنقود'],
      ['A weighted sum plus bias', 'مجموعًا موزونًا مضافًا إليه الانزياح'],
      ['Only the largest input', 'أكبر مدخل فقط'],
      ['A random output', 'خرجًا عشوائيًا']
    ], 'The neuron first computes z = Σwᵢxᵢ + b, then applies y = φ(z). | يحسب العصبون أولًا z = Σwᵢxᵢ + b ثم يطبق y = φ(z).'),

    Q('What is the main role of the bias b in z = Σwᵢxᵢ + b?', 'ما الدور الأساسي للانزياح b في العلاقة z = Σwᵢxᵢ + b؟', 2, [
      ['It removes all weights', 'يلغي جميع الأوزان'],
      ['It fixes every output at zero', 'يثبت كل خرج عند الصفر'],
      ['It shifts the neuron response', 'يزيح استجابة العصبون'],
      ['It selects the number of layers', 'يحدد عدد الطبقات']
    ], 'The bias shifts the activation threshold and permits a nonzero response even when inputs are zero. | يزيح الانزياح عتبة الاستجابة ويسمح بخرج غير صفري حتى عندما تكون المدخلات صفرًا.'),

    Q('Which expression is the Sigmoid activation function?', 'أي علاقة تمثل دالة التنشيط Sigmoid؟', 0, [
      ['σ(z) = 1/(1+e⁻ᶻ)', 'σ(z) = 1/(1+e⁻ᶻ)'],
      ['σ(z) = max(0,z)', 'σ(z) = max(0,z)'],
      ['σ(z) = z²', 'σ(z) = z²'],
      ['σ(z) = Σz', 'σ(z) = Σz']
    ], 'Sigmoid maps any real input to a value strictly between 0 and 1. | تحول Sigmoid أي دخل حقيقي إلى قيمة تقع بين 0 و1.'),

    Q('What is the derivative of the Sigmoid function?', 'ما مشتقة دالة Sigmoid؟', 3, [
      ['σ′(z) = 1', 'σ′(z) = 1'],
      ['σ′(z) = z(1-z)', 'σ′(z) = z(1-z)'],
      ['σ′(z) = eᶻ', 'σ′(z) = eᶻ'],
      ['σ′(z) = σ(z)[1-σ(z)]', 'σ′(z) = σ(z)[1-σ(z)]']
    ], 'The derivative can be written using the Sigmoid output itself: σ′(z)=σ(z)[1-σ(z)]. | يمكن كتابة المشتقة باستخدام خرج Sigmoid نفسه: σ′(z)=σ(z)[1-σ(z)].'),

    Q('What does forward propagation do?', 'ماذا يفعل الانتشار الأمامي؟', 1, [
      ['Updates weights before calculating an output', 'يحدث الأوزان قبل حساب الخرج'],
      ['Computes activations from inputs through hidden layers to the output', 'يحسب التفعيلات من المدخلات مرورًا بالطبقات المخفية حتى الخرج'],
      ['Removes the loss function', 'يلغي دالة الخطأ'],
      ['Chooses random targets', 'يختار أهدافًا عشوائية']
    ], 'Forward propagation evaluates the network from input to output using the current parameters. | يقيّم الانتشار الأمامي الشبكة من الدخل إلى الخرج باستخدام المعاملات الحالية.'),

    Q('For E = 1/2(y-t)², what is ∂E/∂y?', 'بالنسبة إلى E = 1/2(y-t)²، ما قيمة ∂E/∂y؟', 2, [
      ['t-y', 't-y'],
      ['(y-t)²', '(y-t)²'],
      ['y-t', 'y-t'],
      ['1/2', '1/2']
    ], 'Differentiating the squared-error loss gives ∂E/∂y = y-t. | باشتقاق دالة الخطأ التربيعية نحصل على ∂E/∂y = y-t.'),

    Q('Which expression is the output-layer error signal for a Sigmoid output neuron?', 'أي علاقة تمثل إشارة خطأ طبقة الخرج لعصبون خرج يستخدم Sigmoid؟', 0, [
      ['δ₃ = (y-t)y(1-y)', 'δ₃ = (y-t)y(1-y)'],
      ['δ₃ = y+t', 'δ₃ = y+t'],
      ['δ₃ = y/t', 'δ₃ = y/t'],
      ['δ₃ = 1-y', 'δ₃ = 1-y']
    ], 'By the chain rule, δ₃ = (∂E/∂y)(∂y/∂z₃) = (y-t)y(1-y). | وفق قاعدة السلسلة: δ₃ = (∂E/∂y)(∂y/∂z₃) = (y-t)y(1-y).'),

    Q('If z₃ = v₁h₁ + v₂h₂ + b₃, what is ∂E/∂v₁?', 'إذا كان z₃ = v₁h₁ + v₂h₂ + b₃، فما قيمة ∂E/∂v₁؟', 3, [
      ['δ₃/v₁', 'δ₃/v₁'],
      ['h₁-h₂', 'h₁-h₂'],
      ['v₁δ₃', 'v₁δ₃'],
      ['δ₃h₁', 'δ₃h₁']
    ], 'The gradient equals the output error signal multiplied by the input to that weight: ∂E/∂v₁ = δ₃h₁. | يساوي التدرج إشارة خطأ الخرج مضروبة بمدخل ذلك الوزن: ∂E/∂v₁ = δ₃h₁.'),

    Q('Why is the gradient subtracted in w(new) = w(old) - η∂E/∂w?', 'لماذا نطرح التدرج في w(new) = w(old) - η∂E/∂w؟', 1, [
      ['Because the gradient points toward decreasing error', 'لأن التدرج يشير إلى انخفاض الخطأ'],
      ['Because the gradient points toward increasing error', 'لأن التدرج يشير إلى ازدياد الخطأ'],
      ['To make the learning rate zero', 'لجعل معدل التعلم صفرًا'],
      ['To prevent forward propagation', 'لمنع الانتشار الأمامي']
    ], 'The gradient points in the direction of greatest increase, so moving in the negative-gradient direction reduces the loss. | يشير التدرج إلى اتجاه أكبر زيادة، لذلك يؤدي التحرك بعكسه إلى تقليل الخطأ.'),

    Q('Which is a power-system application of neural networks mentioned in the lecture?', 'أي مما يلي تطبيق للشبكات العصبية في نظم الطاقة ورد في المحاضرة؟', 2, [
      ['Changing physical constants', 'تغيير الثوابت الفيزيائية'],
      ['Eliminating all sensors', 'إلغاء جميع الحساسات'],
      ['Load forecasting and fault classification', 'التنبؤ بالحمل وتصنيف الأعطال'],
      ['Guaranteeing zero transmission losses', 'ضمان انعدام فواقد النقل']
    ], 'The lecture includes load, PV and wind forecasting, fault classification, voltage estimation, battery management, and smart-grid monitoring. | تتضمن المحاضرة التنبؤ بالحمل والطاقة الشمسية والرياح وتصنيف الأعطال وتقدير الجهد وإدارة البطاريات ومراقبة الشبكات الذكية.')
  ];

  const escapeHtml = value => String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

  const section = document.createElement('section');
  section.id = 'quiz';
  section.dataset.courseQuiz = '';
  section.dataset.storageKey = 'ai-power-systems:lecture05';

  section.innerHTML = `
    <div class="course-quiz-header">
      <h2>🧠 Lecture 05 Quiz</h2>
      <p dir="rtl">اختبار المحاضرة 05</p>
    </div>
    ${questions.map((question, index) => {
      const name = `lecture05-q${index + 1}`;
      return `
        <article class="quiz-question" data-correct="${question.correct}">
          <h3>${index + 1}. ${escapeHtml(question.en)}</h3>
          <p class="quiz-ar" dir="rtl">${index + 1}. ${escapeHtml(question.ar)}</p>
          ${question.options.map(option => `
            <label class="quiz-option">
              <input type="radio" name="${name}" value="${option[0]}">
              <span><strong>${escapeHtml(option[1])}</strong><br><span dir="rtl">${escapeHtml(option[2])}</span></span>
            </label>`).join('')}
          <div class="quiz-explanation">${escapeHtml(question.explanation)}</div>
        </article>`;
    }).join('')}
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
})();