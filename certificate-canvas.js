(() => {
  'use strict';

  const PASS_MARK = 80;

  function loadScript(src, check) {
    if (check()) return Promise.resolve();
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
      script.onerror = () => reject(new Error(`Could not load ${src}`));
      document.head.appendChild(script);
    });
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

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, char => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[char]));
  }

  function containsArabic(value) {
    return /[\u0600-\u06FF]/.test(String(value));
  }

  // html2canvas on some Android/Samsung browsers reverses Arabic word order.
  // We prepare the visual sequence in advance and render it as a fixed LTR row.
  function visualArabic(value) {
    return String(value).trim().split(/\s+/).reverse().join(' ');
  }

  async function ensureCertificateFonts() {
    if (!('FontFace' in window)) return;
    const fonts = [
      new FontFace('CertificateSans', 'url(assets/fonts/DejaVuSans.ttf) format("truetype")', { weight: '400' }),
      new FontFace('CertificateSans', 'url(assets/fonts/DejaVuSans-Bold.ttf) format("truetype")', { weight: '700' })
    ];
    for (const font of fonts) {
      try {
        const loaded = await font.load();
        document.fonts.add(loaded);
      } catch (error) {
        console.warn('Certificate font could not be loaded.', error);
      }
    }
    await document.fonts?.ready;
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

    let certificate;
    try {
      await Promise.all([
        loadScript('https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js', () => typeof window.html2canvas === 'function'),
        loadScript('https://cdn.jsdelivr.net/npm/jspdf@2.5.2/dist/jspdf.umd.min.js', () => Boolean(window.jspdf?.jsPDF)),
        loadScript('https://cdn.jsdelivr.net/npm/qrcode@1.5.4/build/qrcode.min.js', () => Boolean(window.QRCode))
      ]);
      await ensureCertificateFonts();

      const completed = stored.completedAt ? new Date(stored.completedAt) : new Date();
      const completedDate = completed.toLocaleDateString('en-GB');
      const [levelEn, levelAr] = performanceLevel(Number(stored.percent));
      const certificateId = makeCertificateId(studentName.trim(), lectureNumber, stored.completedAt);
      const verificationUrl = `https://aoussgabash.com/?certificate=${encodeURIComponent(certificateId)}`;
      const visualStudentName = containsArabic(studentName)
        ? visualArabic(studentName.trim())
        : studentName.trim();
      const safeStudentName = escapeHtml(visualStudentName);
      const fixedArabic = value => escapeHtml(visualArabic(value));

      certificate = document.createElement('div');
      certificate.setAttribute('aria-hidden', 'true');
      certificate.style.cssText = [
        'position:fixed', 'left:-10000px', 'top:0', 'width:1400px', 'height:990px',
        'padding:28px', 'background:#f8fbff', 'font-family:CertificateSans,Arial,Tahoma,sans-serif',
        'color:#0f172a', 'z-index:-9999', 'box-sizing:border-box'
      ].join(';');

      certificate.innerHTML = `
        <main style="height:100%;background:#fff;border:8px double #0b4f91;box-shadow:inset 0 0 0 3px #60a5fa;padding:42px 68px;box-sizing:border-box;text-align:center;display:flex;flex-direction:column;align-items:center;">
          <div style="font-size:20px;font-weight:700;letter-spacing:7px;color:#075985;margin-top:2px;">AI POWER SYSTEMS</div>
          <div style="font-size:50px;font-weight:700;color:#083f77;line-height:1.15;margin-top:12px;">Certificate of Lecture Completion</div>
          <div lang="ar" dir="ltr" style="font-size:40px;font-weight:700;color:#0b4f91;line-height:1.35;margin-top:14px;white-space:nowrap;">${fixedArabic('شهادة إتمام المحاضرة')}</div>
          <div style="width:520px;height:2px;background:#3978bf;margin:13px 0 18px;"></div>

          <div style="font-size:26px;line-height:1.3;">This certifies that</div>
          <div lang="ar" dir="ltr" style="font-size:27px;line-height:1.4;white-space:nowrap;">${fixedArabic('تشهد هذه الشهادة بأن')}</div>
          <div dir="ltr" style="font-size:52px;font-weight:700;color:#111827;line-height:1.25;margin:10px 0 4px;white-space:nowrap;">${safeStudentName}</div>
          <div style="width:430px;height:2px;background:#93b9df;margin:2px 0 14px;"></div>

          <div style="font-size:25px;line-height:1.3;">has successfully completed Lecture ${lectureNumber}</div>
          <div lang="ar" dir="ltr" style="font-size:27px;line-height:1.45;margin-top:4px;white-space:nowrap;">${fixedArabic(`قد أتم بنجاح المحاضرة رقم ${lectureNumber}`)}</div>

          <div style="font-size:36px;font-weight:700;color:#0b3f79;line-height:1.25;margin-top:13px;">AI Applications in Electrical Power Systems</div>
          <div lang="ar" dir="ltr" style="font-size:28px;font-weight:700;color:#0b4f91;line-height:1.45;margin-top:4px;white-space:nowrap;">${fixedArabic('تطبيقات الذكاء الاصطناعي في أنظمة الطاقة الكهربائية')}</div>

          <div style="display:flex;justify-content:center;gap:32px;margin-top:22px;">
            <div style="width:300px;padding:14px 18px;border:2px solid #34a853;border-radius:12px;background:#effcf3;color:#148436;font-size:32px;font-weight:700;box-sizing:border-box;">Score: ${stored.percent}%</div>
            <div style="width:300px;padding:14px 18px;border:2px solid #6ea8f7;border-radius:12px;background:#f3f7ff;color:#2458b8;font-size:32px;font-weight:700;box-sizing:border-box;">${levelEn}</div>
          </div>

          <div lang="ar" dir="ltr" style="font-size:28px;font-weight:700;color:#148436;line-height:1.5;margin-top:12px;white-space:nowrap;">${fixedArabic(`${levelAr} — النتيجة: ${stored.percent}%`)}</div>

          <div style="width:100%;display:grid;grid-template-columns:1fr 150px 1fr;align-items:end;gap:30px;margin-top:auto;padding:0 10px 10px;box-sizing:border-box;">
            <div style="text-align:left;line-height:1.45;">
              <div style="font-size:20px;color:#0b4f91;">Completion Date:</div>
              <div style="font-size:22px;margin-bottom:13px;">${completedDate}</div>
              <div style="font-size:27px;font-weight:700;font-style:italic;">Dr.-Ing. Aouss Gabash</div>
              <div style="font-size:19px;color:#42648a;">IEEE Senior Member</div>
              <div style="font-size:18px;color:#42648a;">Version 1.0</div>
            </div>

            <div style="text-align:center;">
              <canvas data-certificate-qr width="112" height="112" style="display:block;margin:auto;"></canvas>
              <div style="font-size:18px;color:#334155;margin-top:4px;">Verify</div>
            </div>

            <div style="text-align:right;line-height:1.5;">
              <div style="font-size:21px;font-weight:700;color:#0b4f91;">Certificate ID</div>
              <div style="font-size:19px;">${certificateId}</div>
              <div style="font-size:20px;color:#0b4f91;margin-top:4px;">aoussgabash.com</div>
            </div>
          </div>
        </main>`;

      document.body.appendChild(certificate);
      const qrCanvas = certificate.querySelector('[data-certificate-qr]');
      await window.QRCode.toCanvas(qrCanvas, verificationUrl, {
        width: 112,
        margin: 1,
        color: { dark: '#0f172a', light: '#ffffff' }
      });

      await document.fonts?.ready;
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));

      const canvas = await window.html2canvas(certificate, {
        scale: 2,
        backgroundColor: '#f8fbff',
        useCORS: true,
        logging: false,
        letterRendering: true
      });

      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
      pdf.addImage(canvas.toDataURL('image/jpeg', 0.97), 'JPEG', 0, 0, 297, 210, undefined, 'FAST');
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
      certificate?.remove();
      button.disabled = false;
      button.textContent = originalText;
    }
  }

  function installCertificateButton() {
    const oldButton = document.querySelector('[data-quiz-certificate]');
    if (!oldButton) return;
    const replacement = oldButton.cloneNode(true);
    replacement.textContent = '📄 Download PDF Certificate | تنزيل شهادة PDF';
    oldButton.replaceWith(replacement);
    replacement.addEventListener('click', () => createCertificatePDF(replacement));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', installCertificateButton, { once: true });
  } else {
    installCertificateButton();
  }
})();
