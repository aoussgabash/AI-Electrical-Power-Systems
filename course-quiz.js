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
    certificateButton.textContent = '📄 Download PDF Certificate | تنزيل شهادة PDF';
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

  function loadScript(src, globalCheck) {
    if (globalCheck()) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[src="${src}"]`);
      if (existing) {
        existing.addEventListener('load', resolve, { once: true });
        existing.addEventListener('error', reject, { once: true });
        return;
      }
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = resolve;
      script.onerror = () => reject(new Error(`Failed to load ${src}`));
      document.head.appendChild(script);
    });
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

  async function downloadCertificatePDF() {
    const stored = readStoredResult();
    if (!stored || Number(stored.percent) < passMark) return;

    const studentName = prompt('Student name for the certificate | اسم الطالب في الشهادة');
    if (!studentName?.trim()) return;

    const originalLabel = certificateButton.textContent;
    certificateButton.disabled = true;
    certificateButton.textContent = '⏳ Creating PDF... | جارٍ إنشاء PDF...';

    try {
      await loadScript(
        'https://unpkg.com/html2canvas@1.4.1/dist/html2canvas.min.js',
        () => typeof window.html2canvas === 'function'
      );
      await loadScript(
        'https://unpkg.com/jspdf@4.2.1/dist/jspdf.umd.min.js',
        () => Boolean(window.jspdf?.jsPDF)
      );

      const completedDate = stored.completedAt
        ? new Date(stored.completedAt).toLocaleDateString()
        : new Date().toLocaleDateString();
      const [levelEn, levelAr] = performanceLevel(Number(stored.percent));

      const certificate = document.createElement('div');
      certificate.style.cssText = [
        'position:fixed','left:-10000px','top:0','width:1123px','height:794px',
        'background:#f8fbff','padding:36px','font-family:Arial,Tahoma,sans-serif',
        'color:#0b1b2c','z-index:-1'
      ].join(';');
      certificate.innerHTML = `
        <div style="height:100%;border:12px double #0b6fa4;background:white;padding:44px;text-align:center;display:flex;flex-direction:column;justify-content:center;position:relative;box-shadow:inset 0 0 0 4px #dbeafe;">
          <div style="position:absolute;top:24px;left:32px;font-size:42px;color:#facc15;">⚡</div>
          <div style="position:absolute;bottom:24px;right:32px;font-size:42px;color:#facc15;">⚡</div>
          <div style="font-size:18px;color:#0ea5e9;font-weight:700;letter-spacing:2px;">AI POWER SYSTEMS</div>
          <h1 style="font-size:46px;color:#075985;margin:14px 0 6px;">Certificate of Lecture Completion</h1>
          <div dir="rtl" style="font-size:28px;color:#334155;margin-bottom:16px;">شهادة إتمام المحاضرة</div>
          <p style="font-size:20px;margin:8px 0;">This certifies that</p>
          <div style="font-size:38px;font-weight:700;color:#111827;margin:10px auto 20px;padding:0 42px 10px;border-bottom:3px solid #94a3b8;max-width:850px;">${studentName.trim().replace(/[&<>"']/g, '')}</div>
          <p style="font-size:22px;line-height:1.7;margin:4px 0;">has successfully completed <strong>Lecture ${lectureNumber}</strong></p>
          <div style="font-size:28px;font-weight:700;color:#0f172a;margin:8px 0 18px;">AI Applications in Electrical Power Systems</div>
          <div dir="rtl" style="font-size:22px;color:#334155;margin-bottom:18px;">تطبيقات الذكاء الاصطناعي في أنظمة الطاقة الكهربائية</div>
          <div style="display:flex;justify-content:center;gap:18px;flex-wrap:wrap;margin:10px 0 20px;">
            <div style="min-width:210px;padding:12px 18px;border-radius:12px;background:#ecfdf5;border:1px solid #86efac;font-size:24px;font-weight:700;color:#15803d;">Score: ${stored.percent}%</div>
            <div style="min-width:210px;padding:12px 18px;border-radius:12px;background:#eff6ff;border:1px solid #93c5fd;font-size:24px;font-weight:700;color:#1d4ed8;">${levelEn} | ${levelAr}</div>
          </div>
          <div style="font-size:18px;color:#475569;margin-top:8px;">Completion Date: ${completedDate}</div>
          <div style="margin-top:30px;font-size:21px;font-weight:700;color:#0f172a;">Dr.-Ing. Aouss Gabash</div>
          <div style="font-size:15px;color:#64748b;margin-top:8px;">Version 1.0</div>
        </div>`;
      document.body.appendChild(certificate);

      const canvas = await window.html2canvas(certificate, {
        scale: 2,
        backgroundColor: '#f8fbff',
        useCORS: true,
        logging: false
      });

      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
      const image = canvas.toDataURL('image/jpeg', 0.96);
      pdf.addImage(image, 'JPEG', 0, 0, 297, 210);

      const safeName = studentName.trim().replace(/[^\p{L}\p{N}_-]+/gu, '_').replace(/^_+|_+$/g, '') || 'Student';
      pdf.save(`${safeName}_Lecture_${lectureNumber}_Certificate.pdf`);
      certificate.remove();
    } catch (error) {
      console.error(error);
      alert('The PDF could not be created. Please check the internet connection and try again. | تعذر إنشاء ملف PDF. تحقق من اتصال الإنترنت ثم حاول مجددًا.');
    } finally {
      certificateButton.disabled = false;
      certificateButton.textContent = originalLabel;
    }
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
  certificateButton?.addEventListener('click', downloadCertificatePDF);
})();
