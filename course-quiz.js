(() => {
  'use strict';

  const quiz = document.querySelector('[data-course-quiz]');
  if (!quiz) return;

  const questions = [...quiz.querySelectorAll('.quiz-question')];
  const submitButton = quiz.querySelector('[data-quiz-submit]');
  const resetButton = quiz.querySelector('[data-quiz-reset]');
  const result = quiz.querySelector('[data-quiz-result]');
  const scoreText = quiz.querySelector('[data-quiz-score]');
  const messageText = quiz.querySelector('[data-quiz-message]');
  const storageKey = quiz.dataset.storageKey || `course-quiz:${location.pathname}`;

  const messages = {
    excellent: 'Excellent work! | عمل ممتاز!',
    good: 'Good result. Review the explanations and try again. | نتيجة جيدة، راجع الشرح ثم حاول مجددًا.',
    review: 'Please review the lecture and retry the quiz. | يرجى مراجعة المحاضرة ثم إعادة الاختبار.',
    incomplete: 'Please answer all questions first. | يرجى الإجابة عن جميع الأسئلة أولًا.'
  };

  function selectedAnswer(question) {
    const selected = question.querySelector('input[type="radio"]:checked');
    return selected ? selected.value : null;
  }

  function clearVisualState() {
    questions.forEach(question => {
      question.classList.remove('graded');
      question.querySelectorAll('.quiz-option').forEach(option => {
        option.classList.remove('correct', 'incorrect');
      });
    });
  }

  function gradeQuiz() {
    clearVisualState();

    const answers = questions.map(selectedAnswer);
    if (answers.some(answer => answer === null)) {
      result.classList.add('show');
      scoreText.textContent = '—';
      messageText.textContent = messages.incomplete;
      messageText.classList.remove('quiz-complete');
      result.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    let score = 0;
    questions.forEach((question, index) => {
      const correct = question.dataset.correct;
      const selected = answers[index];
      question.classList.add('graded');

      question.querySelectorAll('.quiz-option').forEach(option => {
        const input = option.querySelector('input[type="radio"]');
        if (!input) return;
        if (input.value === correct) option.classList.add('correct');
        if (input.checked && input.value !== correct) option.classList.add('incorrect');
      });

      if (selected === correct) score += 1;
    });

    const percent = Math.round((score / questions.length) * 100);
    scoreText.textContent = `${score}/${questions.length} — ${percent}%`;
    messageText.classList.toggle('quiz-complete', percent >= 80);
    messageText.textContent = percent >= 80 ? messages.excellent : percent >= 60 ? messages.good : messages.review;
    result.classList.add('show');

    try {
      localStorage.setItem(storageKey, JSON.stringify({ score, total: questions.length, percent, completedAt: new Date().toISOString() }));
    } catch (_) {}

    result.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function resetQuiz() {
    quiz.querySelectorAll('input[type="radio"]').forEach(input => { input.checked = false; });
    clearVisualState();
    result.classList.remove('show');
    scoreText.textContent = '';
    messageText.textContent = '';
    try { localStorage.removeItem(storageKey); } catch (_) {}
    quiz.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  submitButton?.addEventListener('click', gradeQuiz);
  resetButton?.addEventListener('click', resetQuiz);
})();
