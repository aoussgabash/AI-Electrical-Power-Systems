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

  async function fetchAsBase64(url) {
    const response = await fetch(url, { cache: 'force-cache' });
    if (!response.ok) throw new Error(`Font request failed: ${response.status}`);
    const buffer = await response.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    let binary = '';
    const chunk = 0x8000;
    for (let index = 0; index < bytes.length; index += chunk) {
      binary += String.fromCharCode(...bytes.subarray(index, index + chunk));
    }
    return btoa(binary);
  }

  function toArabicIndicDigits(value) {
    const digits = '٠١٢٣٤٥٦٧٨٩';
    return String(value).replace(/\d/g, digit => digits[Number(digit)]);
  }

  function makeCertificateId(studentName, completedAt) {
    const source = `${studentName}|${lectureNumber}|${completedAt || ''}|${location.hostname}`;
    let hash = 2166136261;
    for (let i = 0; i < source.length; i += 1) {
      hash ^= source.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    const code = (hash >>> 0).toString(36).toUpperCase().padStart(7, '0');
    return `APS-${new Date().getFullYear()}-L${lectureNumber}-${code}`;
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
        'https://cdn.jsdelivr.net/npm/pdfmake@0.2.20/build/pdfmake.min.js',
        () => Boolean(window.pdfMake)
      );

      const fontFile = 'DejaVuSans.ttf';
      const fontBoldFile = 'DejaVuSans-Bold.ttf';
      window.pdfMake.vfs = window.pdfMake.vfs || {};

      if (!window.pdfMake.vfs?.[fontFile]) {
        window.pdfMake.vfs[fontFile] = await fetchAsBase64('assets/fonts/DejaVuSans.ttf');
      }
      if (!window.pdfMake.vfs?.[fontBoldFile]) {
        window.pdfMake.vfs[fontBoldFile] = await fetchAsBase64('assets/fonts/DejaVuSans-Bold.ttf');
      }

      window.pdfMake.fonts = {
        DejaVuSans: {
          normal: fontFile,
          bold: fontBoldFile,
          italics: fontFile,
          bolditalics: fontBoldFile
        }
      };

      const completed = stored.completedAt ? new Date(stored.completedAt) : new Date();
      const completedDate = completed.toLocaleDateString('en-GB');
      const [levelEn, levelAr] = performanceLevel(Number(stored.percent));
      const certificateId = makeCertificateId(studentName.trim(), stored.completedAt);
      const verificationUrl = `https://aoussgabash.com/?certificate=${encodeURIComponent(certificateId)}`;
      const safeName = studentName.trim().replace(/[^\p{L}\p{N}_-]+/gu, '_').replace(/^_+|_+$/g, '') || 'Student';

      const docDefinition = {
        pageSize: 'A4',
        pageOrientation: 'landscape',
        pageMargins: [34, 30, 34, 28],
        defaultStyle: {
          font: 'DejaVuSans',
          color: '#0f172a',
          fontSize: 12
        },
        background(currentPage, pageSize) {
          return {
            canvas: [
              { type: 'rect', x: 14, y: 14, w: pageSize.width - 28, h: pageSize.height - 28, lineWidth: 3, lineColor: '#075985' },
              { type: 'rect', x: 22, y: 22, w: pageSize.width - 44, h: pageSize.height - 44, lineWidth: 1, lineColor: '#38bdf8' }
            ]
          };
        },
        content: [
          { text: 'AI POWER SYSTEMS', alignment: 'center', color: '#0284c7', bold: true, fontSize: 15, characterSpacing: 2, margin: [0, 2, 0, 2] },
          { text: 'Certificate of Lecture Completion', alignment: 'center', color: '#075985', bold: true, fontSize: 31, margin: [0, 2, 0, 0] },
          { text: 'شهادة إتمام المحاضرة', alignment: 'center', color: '#334155', bold: true, fontSize: 22, margin: [0, 0, 0, 8] },
          { text: 'This certifies that', alignment: 'center', fontSize: 14, margin: [0, 2, 0, 0] },
          { text: studentName.trim(), alignment: 'center', bold: true, fontSize: 28, color: '#111827', margin: [25, 3, 25, 3], decoration: 'underline', decorationColor: '#94a3b8' },
          { text: `has successfully completed Lecture ${lectureNumber}`, alignment: 'center', fontSize: 15, margin: [0, 4, 0, 1] },
          { text: 'AI Applications in Electrical Power Systems', alignment: 'center', bold: true, fontSize: 21, margin: [0, 3, 0, 0] },
          { text: 'تطبيقات الذكاء الاصطناعي في أنظمة الطاقة الكهربائية', alignment: 'center', color: '#334155', fontSize: 17, margin: [0, 0, 0, 7] },
          {
            columns: [
              { width: '*', text: '' },
              {
                width: 170,
                table: {
                  widths: ['*'],
                  body: [[{ text: `Score: ${stored.percent}%`, alignment: 'center', bold: true, fontSize: 18, color: '#15803d', fillColor: '#ecfdf5', margin: [4, 5, 4, 5] }]]
                },
                layout: { hLineColor: () => '#86efac', vLineColor: () => '#86efac' }
              },
              { width: 12, text: '' },
              {
                width: 170,
                table: {
                  widths: ['*'],
                  body: [[{ text: levelEn, alignment: 'center', bold: true, fontSize: 18, color: '#1d4ed8', fillColor: '#eff6ff', margin: [4, 5, 4, 5] }]]
                },
                layout: { hLineColor: () => '#93c5fd', vLineColor: () => '#93c5fd' }
              },
              { width: '*', text: '' }
            ],
            margin: [0, 3, 0, 4]
          },
          { text: `النتيجة: ${toArabicIndicDigits(stored.percent)}٪ — ${levelAr}`, alignment: 'center', bold: true, fontSize: 17, color: '#15803d', margin: [0, 0, 0, 5] },
          {
            columns: [
              {
                width: '*',
                stack: [
                  { text: `Completion Date: ${completedDate}`, alignment: 'center', color: '#475569', fontSize: 12 },
                  { text: 'Dr.-Ing. Aouss Gabash', alignment: 'center', bold: true, fontSize: 15, margin: [0, 8, 0, 0] },
                  { text: 'IEEE Senior Member', alignment: 'center', color: '#64748b', fontSize: 11 },
                  { text: 'Version 1.0', alignment: 'center', color: '#64748b', fontSize: 10, margin: [0, 3, 0, 0] }
                ]
              },
              {
                width: 95,
                stack: [
                  { qr: verificationUrl, fit: 64, alignment: 'center', foreground: '#0f172a' },
                  { text: 'Verify', alignment: 'center', fontSize: 9, color: '#475569', margin: [0, 2, 0, 0] }
                ]
              },
              {
                width: '*',
                stack: [
                  { text: 'Certificate ID', alignment: 'center', bold: true, color: '#075985', fontSize: 11 },
                  { text: certificateId, alignment: 'center', fontSize: 11, margin: [0, 2, 0, 4] },
                  { text: 'aoussgabash.com', alignment: 'center', color: '#475569', fontSize: 11 }
                ],
                margin: [0, 16, 0, 0]
              }
            ],
            columnGap: 12,
            margin: [35, 5, 35, 0]
          }
        ],
        metadata: {
          title: `Lecture ${lectureNumber} Certificate - ${studentName.trim()}`,
          author: 'Dr.-Ing. Aouss Gabash',
          subject: 'AI Applications in Electrical Power Systems',
          keywords: `certificate, lecture ${lectureNumber}, AI, electrical power systems`
        }
      };

      window.pdfMake.createPdf(docDefinition).download(`${safeName}_Lecture_${lectureNumber}_Certificate.pdf`);
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
