(() => {
  'use strict';

  const PASS_MARK = 80;

  function loadScript(src, check) {
    if (check()) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = resolve;
      script.onerror = () => reject(new Error(`Could not load ${src}`));
      document.head.appendChild(script);
    });
  }

  async function loadCertificateFont() {
    if (!('FontFace' in window)) return 'Arial';
    try {
      const font = new FontFace(
        'CertificateSans',
        'url(assets/fonts/DejaVuSans.ttf) format("truetype")'
      );
      await font.load();
      document.fonts.add(font);
      await document.fonts.ready;
      return 'CertificateSans';
    } catch (error) {
      console.warn('Local certificate font could not be loaded.', error);
      return 'Arial';
    }
  }

  function getLectureNumber() {
    return location.pathname.split('/').pop()?.match(/lecture(\d{2})\.html/i)?.[1] || '';
  }

  function getStoredResult(lectureNumber) {
    try {
      const raw = localStorage.getItem(`ai-power-systems:lecture${lectureNumber}`);
      return raw ? JSON.parse(raw) : null;
    } catch (_) {
      return null;
    }
  }

  function performanceLevel(percent) {
    if (percent >= 90) return ['Excellent', 'ممتاز'];
    if (percent >= 80) return ['Very Good', 'جيد جدًا'];
    if (percent >= 60) return ['Good', 'جيد'];
    return ['Needs Review', 'يحتاج إلى مراجعة'];
  }

  function makeCertificateId(studentName, lectureNumber, completedAt) {
    const source = `${studentName}|${lectureNumber}|${completedAt || ''}|${location.hostname}`;
    let hash = 2166136261;
    for (let index = 0; index < source.length; index += 1) {
      hash ^= source.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return `APS-${new Date().getFullYear()}-L${lectureNumber}-${(hash >>> 0).toString(36).toUpperCase()}`;
  }

  function containsArabic(text) {
    return /[\u0600-\u06FF]/.test(text);
  }

  function drawCenteredText(ctx, text, x, y, options = {}) {
    const {
      font = '32px Arial',
      color = '#0f172a',
      direction = 'ltr',
      align = 'center'
    } = options;
    ctx.save();
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.direction = direction;
    ctx.textAlign = align;
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x, y);
    ctx.restore();
  }

  function roundedRect(ctx, x, y, width, height, radius, fill, stroke) {
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, radius);
    if (fill) {
      ctx.fillStyle = fill;
      ctx.fill();
    }
    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }

  async function createCertificatePDF(button) {
    const lectureNumber = getLectureNumber();
    const stored = getStoredResult(lectureNumber);
    if (!stored || Number(stored.percent) < PASS_MARK) return;

    const studentName = prompt('Student name for the certificate | اسم الطالب في الشهادة');
    if (!studentName?.trim()) return;

    const originalText = button.textContent;
    button.disabled = true;
    button.textContent = '⏳ Creating PDF... | جارٍ إنشاء PDF...';

    try {
      await loadScript(
        'https://cdn.jsdelivr.net/npm/jspdf@2.5.2/dist/jspdf.umd.min.js',
        () => Boolean(window.jspdf?.jsPDF)
      );

      const fontFamily = await loadCertificateFont();
      const width = 1684;
      const height = 1190;
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas is not supported.');

      const completed = stored.completedAt ? new Date(stored.completedAt) : new Date();
      const completedDate = completed.toLocaleDateString('en-GB');
      const [levelEn, levelAr] = performanceLevel(Number(stored.percent));
      const certificateId = makeCertificateId(studentName.trim(), lectureNumber, stored.completedAt);
      const verificationUrl = `aoussgabash.com/?certificate=${certificateId}`;

      ctx.fillStyle = '#f8fbff';
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(45, 45, width - 90, height - 90);
      ctx.strokeStyle = '#075985';
      ctx.lineWidth = 10;
      ctx.strokeRect(45, 45, width - 90, height - 90);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.strokeRect(65, 65, width - 130, height - 130);

      drawCenteredText(ctx, 'AI POWER SYSTEMS', width / 2, 120, {
        font: `700 30px ${fontFamily}`,
        color: '#0284c7'
      });
      drawCenteredText(ctx, 'Certificate of Lecture Completion', width / 2, 190, {
        font: `700 58px ${fontFamily}`,
        color: '#075985'
      });
      drawCenteredText(ctx, 'شهادة إتمام المحاضرة', width / 2, 255, {
        font: `700 44px ${fontFamily}`,
        color: '#334155',
        direction: 'rtl'
      });
      drawCenteredText(ctx, 'This certifies that', width / 2, 320, {
        font: `28px ${fontFamily}`
      });

      const nameDirection = containsArabic(studentName) ? 'rtl' : 'ltr';
      drawCenteredText(ctx, studentName.trim(), width / 2, 395, {
        font: `700 55px ${fontFamily}`,
        color: '#111827',
        direction: nameDirection
      });
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(420, 438);
      ctx.lineTo(width - 420, 438);
      ctx.stroke();

      drawCenteredText(ctx, `has successfully completed Lecture ${lectureNumber}`, width / 2, 490, {
        font: `30px ${fontFamily}`
      });
      drawCenteredText(ctx, 'AI Applications in Electrical Power Systems', width / 2, 550, {
        font: `700 40px ${fontFamily}`
      });
      drawCenteredText(ctx, 'تطبيقات الذكاء الاصطناعي في أنظمة الطاقة الكهربائية', width / 2, 605, {
        font: `34px ${fontFamily}`,
        color: '#334155',
        direction: 'rtl'
      });

      roundedRect(ctx, 480, 665, 330, 85, 18, '#ecfdf5', '#86efac');
      roundedRect(ctx, 875, 665, 330, 85, 18, '#eff6ff', '#93c5fd');
      drawCenteredText(ctx, `Score: ${stored.percent}%`, 645, 708, {
        font: `700 34px ${fontFamily}`,
        color: '#15803d'
      });
      drawCenteredText(ctx, levelEn, 1040, 708, {
        font: `700 34px ${fontFamily}`,
        color: '#1d4ed8'
      });
      drawCenteredText(ctx, `النتيجة: ${stored.percent}٪ — ${levelAr}`, width / 2, 790, {
        font: `700 34px ${fontFamily}`,
        color: '#15803d',
        direction: 'rtl'
      });

      drawCenteredText(ctx, `Completion Date: ${completedDate}`, 430, 890, {
        font: `25px ${fontFamily}`,
        color: '#475569'
      });
      drawCenteredText(ctx, 'Dr.-Ing. Aouss Gabash', 430, 950, {
        font: `700 29px ${fontFamily}`
      });
      drawCenteredText(ctx, 'IEEE Senior Member', 430, 990, {
        font: `23px ${fontFamily}`,
        color: '#64748b'
      });

      drawCenteredText(ctx, 'Certificate ID', 1245, 885, {
        font: `700 24px ${fontFamily}`,
        color: '#075985'
      });
      drawCenteredText(ctx, certificateId, 1245, 930, {
        font: `22px ${fontFamily}`
      });
      drawCenteredText(ctx, verificationUrl, 1245, 975, {
        font: `20px ${fontFamily}`,
        color: '#475569'
      });
      drawCenteredText(ctx, 'Version 1.0', width / 2, 1080, {
        font: `20px ${fontFamily}`,
        color: '#64748b'
      });

      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 297, 210, undefined, 'FAST');
      pdf.setProperties({
        title: `Lecture ${lectureNumber} Certificate - ${studentName.trim()}`,
        author: 'Dr.-Ing. Aouss Gabash',
        subject: 'AI Applications in Electrical Power Systems'
      });

      const safeName = studentName.trim()
        .replace(/[^\p{L}\p{N}_-]+/gu, '_')
        .replace(/^_+|_+$/g, '') || 'Student';
      pdf.save(`${safeName}_Lecture_${lectureNumber}_Certificate.pdf`);
    } catch (error) {
      console.error(error);
      alert('The PDF could not be created. Please reload the page and try again. | تعذر إنشاء ملف PDF. أعد تحميل الصفحة ثم حاول مجددًا.');
    } finally {
      button.disabled = false;
      button.textContent = originalText;
    }
  }

  function installCanvasCertificateButton() {
    const oldButton = document.querySelector('[data-quiz-certificate]');
    if (!oldButton) return;

    const replacement = oldButton.cloneNode(true);
    replacement.textContent = '📄 Download PDF Certificate | تنزيل شهادة PDF';
    oldButton.replaceWith(replacement);
    replacement.addEventListener('click', () => createCertificatePDF(replacement));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', installCanvasCertificateButton, { once: true });
  } else {
    installCanvasCertificateButton();
  }
})();
