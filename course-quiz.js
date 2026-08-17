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
  const pageMatch = location.pathname.split('/').pop()?.match(/lecture(\d{2})\.html/i);
  const lectureNumber = pageMatch ? pageMatch[1] : '';
  const passMark = 80;

  let certificateButton = quiz.querySelector('[data-quiz-certificate]');
  if (!certificateButton) {
    certificateButton = document.createElement('button');
    certificateButton.type = 'button';
    certificateButton.className = 'quiz-btn certificate';
    certificateButton.dataset.quizCertificate = '';
    certificateButton.textContent = '🏅 Print Certificate | طباعة شهادة';
    certificateButton.hidden = true;
    quiz.querySelector('.quiz-actions')?.appendChild(certificateButton);
  }

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

  function performanceLevel(percent) {
    if (percent >= 90) return ['Excellent', 'ممتاز'];
    if (percent >= 80) return ['Very Good', 'جيد جدًا'];
    if (percent >= 60) return ['Good', 'جيد'];
    return ['Needs Review', 'يحتاج إلى مراجعة'];
  }

  function readStoredResult() {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : null;
    } catch (_) {
      return null;
    }
  }

  function showCertificateAvailability(percent) {
    certificateButton.hidden = percent < passMark;
  }

  function gradeQuiz() {
    clearVisualState();

    const answers = questions.map(selectedAnswer);
    if (answers.some(answer => answer === null)) {
      result.classList.add('show');
      scoreText.textContent = '—';
      messageText.textContent = 'Please answer all questions first. | يرجى الإجابة عن جميع الأسئلة أولًا.';
      messageText.classList.remove('quiz-complete');
      certificateButton.hidden = true;
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
    const [levelEn, levelAr] = performanceLevel(percent);
    const passed = percent >= passMark;

    scoreText.textContent = `${score}/${questions.length} — ${percent}%`;
    messageText.classList.toggle('quiz-complete', passed);
    messageText.textContent = `${levelEn} | ${levelAr}${passed ? ' — Lecture Completed | اكتملت المحاضرة' : ''}`;
    result.classList.add('show');
    showCertificateAvailability(percent);

    const previous = readStoredResult();
    const bestPercent = Math.max(Number(previous?.percent || 0), percent);
    const bestScore = bestPercent === percent ? score : Number(previous?.score || 0);

    try {
      localStorage.setItem(storageKey, JSON.stringify({
        score: bestScore,
        total: questions.length,
        percent: bestPercent,
        latestPercent: percent,
        performance: performanceLevel(bestPercent)[0],
        passed: bestPercent >= passMark,
        completedAt: bestPercent >= passMark
          ? (previous?.completedAt || new Date().toISOString())
          : null,
        lastAttemptAt: new Date().toISOString()
      }));
    } catch (_) {}

    result.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function printCertificate() {
    const stored = readStoredResult();
    if (!stored || Number(stored.percent) < passMark) return;

    const studentName = prompt('Student name for the certificate | اسم الطالب في الشهادة');
    if (!studentName?.trim()) return;

    const completedDate = stored.completedAt
      ? new Date(stored.completedAt).toLocaleDateString()
      : new Date().toLocaleDateString();
    const [levelEn, levelAr] = performanceLevel(Number(stored.percent));
    const certificateWindow = window.open('', '_blank', 'width=1000,height=760');
    if (!certificateWindow) {
      alert('Please allow pop-ups to print the certificate. | يرجى السماح بالنوافذ المنبثقة لطباعة الشهادة.');
      return;
    }

    certificateWindow.document.write(`<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Lecture Certificate</title>
<style>
@page{size:A4 landscape;margin:12mm}*{box-sizing:border-box}body{margin:0;font-family:Arial,Tahoma,sans-serif;background:#eef5fb;color:#0b1b2c}.certificate{min-height:185mm;border:10px double #0b6fa4;background:#fff;padding:34px;text-align:center;display:flex;flex-direction:column;justify-content:center;position:relative}.certificate:before,.certificate:after{content:'⚡';position:absolute;font-size:44px;color:#eab308}.certificate:before{top:24px;left:30px}.certificate:after{bottom:24px;right:30px}h1{font-size:40px;color:#075985;margin:0 0 16px}.course{font-size:24px;font-weight:700}.student{font-size:34px;color:#111827;margin:24px 0;border-bottom:2px solid #cbd5e1;display:inline-block;padding:0 30px 8px}.details{font-size:20px;line-height:1.8}.score{font-size:30px;color:#15803d;font-weight:700}.arabic{direction:rtl;font-size:20px}.signature{margin-top:30px;font-weight:700}.version{margin-top:16px;color:#64748b}@media print{body{background:#fff}}
</style></head><body><main class="certificate">
<h1>Certificate of Lecture Completion</h1>
<div class="arabic">شهادة إتمام المحاضرة</div>
<p>This certifies that</p><div class="student">${studentName.trim().replace(/[&<>"']/g, '')}</div>
<p class="details">has successfully completed <strong>Lecture ${lectureNumber}</strong><br><span class="course">AI Applications in Electrical Power Systems</span></p>
<p class="score">Score: ${stored.percent}% — ${levelEn}</p>
<p class="arabic">النتيجة: ${stored.percent}% — ${levelAr}</p>
<p>Date: ${completedDate}</p>
<div class="signature">Dr.-Ing. Aouss Gabash</div>
<div class="version">Version 1.0</div>
</main><script>window.onload=()=>window.print();<\/script></body></html>`);
    certificateWindow.document.close();
  }

  function resetQuiz() {
    quiz.querySelectorAll('input[type="radio"]').forEach(input => { input.checked = false; });
    clearVisualState();
    result.classList.remove('show');
    scoreText.textContent = '';
    messageText.textContent = '';
    certificateButton.hidden = true;
    try { localStorage.removeItem(storageKey); } catch (_) {}
    quiz.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  const stored = readStoredResult();
  if (stored) showCertificateAvailability(Number(stored.percent || 0));

  submitButton?.addEventListener('click', gradeQuiz);
  resetButton?.addEventListener('click', resetQuiz);
  certificateButton?.addEventListener('click', printCertificate);
})();
