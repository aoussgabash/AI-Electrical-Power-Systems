(() => {
  'use strict';

  const PASS_MARK = 80;

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

  function createPrintableCertificate(button) {
    const lectureNumber = getLectureNumber();
    const stored = getStoredResult(lectureNumber);
    if (!stored || Number(stored.percent) < PASS_MARK) return;

    const studentName = prompt('Student name for the certificate | اسم الطالب في الشهادة');
    if (!studentName?.trim()) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow pop-ups for this site, then try again. | يرجى السماح بالنوافذ المنبثقة لهذا الموقع ثم المحاولة مجددًا.');
      return;
    }

    const completed = stored.completedAt ? new Date(stored.completedAt) : new Date();
    const completedDate = completed.toLocaleDateString('en-GB');
    const [levelEn, levelAr] = performanceLevel(Number(stored.percent));
    const certificateId = makeCertificateId(studentName.trim(), lectureNumber, stored.completedAt);
    const safeName = escapeHtml(studentName.trim());

    const originalText = button.textContent;
    button.disabled = true;
    button.textContent = '🖨 Opening certificate... | جارٍ فتح الشهادة...';

    printWindow.document.open();
    printWindow.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Lecture ${lectureNumber} Certificate - ${safeName}</title>
<style>
@font-face{font-family:CertificateSans;src:url('assets/fonts/DejaVuSans.ttf') format('truetype');font-weight:400;font-style:normal}
@font-face{font-family:CertificateSans;src:url('assets/fonts/DejaVuSans-Bold.ttf') format('truetype');font-weight:700;font-style:normal}
@page{size:A4 landscape;margin:0}
*{box-sizing:border-box}
html,body{margin:0;background:#eef3f8;font-family:CertificateSans,Arial,Tahoma,sans-serif;color:#0f172a}
body{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:18px}
.certificate{width:297mm;height:210mm;background:#fff;border:5px double #0b4f91;box-shadow:inset 0 0 0 2px #60a5fa;padding:15mm 18mm 12mm;display:flex;flex-direction:column;align-items:center;text-align:center;overflow:hidden}
.brand{font-size:14pt;font-weight:700;letter-spacing:4px;color:#075985}
.title{font-size:31pt;font-weight:700;color:#083f77;line-height:1.1;margin-top:5mm}
.title-ar{font-size:24pt;font-weight:700;color:#0b4f91;line-height:1.35;margin-top:3mm;direction:rtl;unicode-bidi:isolate}
.rule{width:95mm;height:1px;background:#3978bf;margin:3mm 0 4mm}
.certifies{font-size:14pt;line-height:1.35}
.certifies-ar{font-size:15pt;line-height:1.5;direction:rtl;unicode-bidi:isolate}
.student{font-size:30pt;font-weight:700;color:#111827;line-height:1.25;margin:3mm 0 1mm;direction:auto;unicode-bidi:plaintext;border-bottom:1px solid #93b9df;padding:0 12mm 1mm}
.completed{font-size:14pt;margin-top:3mm}
.completed-ar{font-size:15pt;direction:rtl;unicode-bidi:isolate;margin-top:1mm}
.course{font-size:21pt;font-weight:700;color:#0b3f79;margin-top:3mm}
.course-ar{font-size:16pt;font-weight:700;color:#0b4f91;direction:rtl;unicode-bidi:isolate;margin-top:1mm}
.score-row{display:flex;gap:8mm;justify-content:center;margin-top:5mm}
.score-box{min-width:62mm;padding:3mm 5mm;border-radius:3mm;font-size:18pt;font-weight:700}
.score{border:1px solid #34a853;background:#effcf3;color:#148436}
.level{border:1px solid #6ea8f7;background:#f3f7ff;color:#2458b8}
.result-ar{font-size:16pt;font-weight:700;color:#148436;direction:rtl;unicode-bidi:isolate;margin-top:3mm}
.footer-grid{width:100%;display:grid;grid-template-columns:1fr 1fr 1fr;gap:8mm;align-items:end;margin-top:auto;padding-top:5mm}
.footer-block{font-size:10.5pt;line-height:1.45}
.footer-block.left{text-align:left}.footer-block.center{text-align:center}.footer-block.right{text-align:right}
.signature{font-size:15pt;font-weight:700;font-style:italic;color:#111827;margin-top:2mm}
.meta-title{font-weight:700;color:#075985}
.version{font-size:9.5pt;color:#64748b;margin-top:1mm}
.print-actions{position:fixed;right:16px;bottom:16px;display:flex;gap:10px;z-index:5}
.print-actions button{border:0;border-radius:12px;padding:12px 16px;font:700 15px Arial,sans-serif;cursor:pointer}
.print-btn{background:#075985;color:#fff}.close-btn{background:#e2e8f0;color:#0f172a}
@media print{body{padding:0;background:#fff}.certificate{box-shadow:none}.print-actions{display:none!important}}
@media screen and (max-width:900px){body{align-items:flex-start;overflow:auto}.certificate{transform-origin:top center;transform:scale(.72);margin-bottom:-55mm}.print-actions{left:12px;right:12px;justify-content:center}}
</style>
</head>
<body>
<main class="certificate">
  <div class="brand">AI POWER SYSTEMS</div>
  <div class="title">Certificate of Lecture Completion</div>
  <div class="title-ar" lang="ar" dir="rtl">شهادة إتمام المحاضرة</div>
  <div class="rule"></div>
  <div class="certifies">This certifies that</div>
  <div class="certifies-ar" lang="ar" dir="rtl">تشهد هذه الشهادة بأن</div>
  <div class="student" dir="auto">${safeName}</div>
  <div class="completed">has successfully completed Lecture ${lectureNumber}</div>
  <div class="completed-ar" lang="ar" dir="rtl">قد أتم بنجاح المحاضرة رقم <bdi dir="ltr">${lectureNumber}</bdi></div>
  <div class="course">AI Applications in Electrical Power Systems</div>
  <div class="course-ar" lang="ar" dir="rtl">تطبيقات الذكاء الاصطناعي في أنظمة الطاقة الكهربائية</div>
  <div class="score-row">
    <div class="score-box score">Score: ${stored.percent}%</div>
    <div class="score-box level">${levelEn}</div>
  </div>
  <div class="result-ar" lang="ar" dir="rtl">النتيجة: <bdi dir="ltr">${stored.percent}%</bdi> — ${levelAr}</div>
  <div class="footer-grid">
    <div class="footer-block left">
      <div class="meta-title">Completion Date</div>
      <div>${completedDate}</div>
      <div class="signature">Dr.-Ing. Aouss Gabash</div>
      <div>IEEE Senior Member</div>
      <div class="version">Version 1.0</div>
    </div>
    <div class="footer-block center">
      <div class="meta-title">Verification</div>
      <div>aoussgabash.com</div>
    </div>
    <div class="footer-block right">
      <div class="meta-title">Certificate ID</div>
      <div>${certificateId}</div>
      <div>aoussgabash.com</div>
    </div>
  </div>
</main>
<div class="print-actions">
  <button class="print-btn" onclick="window.print()">Print / Save PDF | طباعة / حفظ PDF</button>
  <button class="close-btn" onclick="window.close()">Close | إغلاق</button>
</div>
<script>
window.addEventListener('load',()=>{
  document.fonts?.ready?.then(()=>setTimeout(()=>window.print(),500));
});
<\/script>
</body>
</html>`);
    printWindow.document.close();

    setTimeout(() => {
      button.disabled = false;
      button.textContent = originalText;
    }, 1200);
  }

  function installCertificateButton() {
    const oldButton = document.querySelector('[data-quiz-certificate]');
    if (!oldButton) return;
    const replacement = oldButton.cloneNode(true);
    replacement.textContent = '📄 Open Certificate | فتح الشهادة';
    oldButton.replaceWith(replacement);
    replacement.addEventListener('click', () => createPrintableCertificate(replacement));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', installCertificateButton, { once: true });
  } else {
    installCertificateButton();
  }
})();
