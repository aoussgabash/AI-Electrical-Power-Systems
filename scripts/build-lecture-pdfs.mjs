import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const outputDir = path.resolve('build/pdf-html');
const currentYear = new Date().getFullYear();
const version = '1.0';
const website = 'https://aoussgabash.com';
const publishingCss = fs
  .readFileSync(path.resolve('scripts/pdf-publishing.css'), 'utf8')
  .replaceAll('2026', String(currentYear));

fs.rmSync(outputDir, { recursive: true, force: true });
fs.mkdirSync(outputDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, locale: 'en-US' });
const page = await context.newPage();

const printCss = `
@font-face {
  font-family:"Course Arabic PDF";
  src:url("http://127.0.0.1:8000/assets/fonts/NotoNaskhArabic-Regular.ttf") format("truetype");
  font-weight:400;
  font-style:normal;
}

html,body{background:#fff!important;color:#111827!important;-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}
header,nav,.mobile-menu-toggle,.navlinks,.back-to-top,.course-footer,.site-footer,.course-actions,.quiz,button,[data-progress-reset],[data-learning-dashboard]{display:none!important}

.ar,[lang="ar"],[dir="rtl"]{
  font-family:"Course Arabic PDF","Noto Naskh Arabic",Tahoma,Arial,sans-serif!important;
  direction:rtl!important;text-align:right!important;unicode-bidi:isolate!important;
  white-space:normal!important;letter-spacing:normal!important;word-spacing:normal!important;
  word-break:normal!important;overflow-wrap:break-word!important;line-height:1.85!important;
  font-kerning:normal!important;font-variant-ligatures:common-ligatures contextual!important;
}
.ar p,.ar li,.ar h1,.ar h2,.ar h3,.ar h4,.ar td,.ar th,.ar blockquote,
[lang="ar"] p,[lang="ar"] li,[lang="ar"] h1,[lang="ar"] h2,[lang="ar"] h3,[lang="ar"] h4,[lang="ar"] td,[lang="ar"] th,[lang="ar"] blockquote{
  direction:rtl!important;text-align:right!important;unicode-bidi:plaintext!important;
}

.hero-ar,.subtitle-ar{
  display:block!important;width:100%!important;max-width:100%!important;box-sizing:border-box!important;
  margin-left:auto!important;margin-right:auto!important;padding:0!important;
  direction:ltr!important;unicode-bidi:isolate!important;text-align:left!important;
}

.pdf-ar-table{
  display:table!important;width:auto!important;max-width:100%!important;
  margin-left:auto!important;margin-right:auto!important;padding:0!important;
  direction:rtl!important;unicode-bidi:isolate!important;text-align:right!important;
  font-family:"Course Arabic PDF","Noto Naskh Arabic",Tahoma,Arial,sans-serif!important;
  white-space:normal!important;line-height:1.85!important;
}

.subtitle-en{
  display:block!important;width:100%!important;max-width:100%!important;box-sizing:border-box!important;
  margin:0 auto 12px!important;padding:0!important;direction:ltr!important;
  unicode-bidi:isolate!important;text-align:center!important;
}
.hero .subtitle{
  display:block!important;width:100%!important;max-width:100%!important;margin:0 auto!important;padding:0!important;
  direction:ltr!important;unicode-bidi:isolate!important;text-align:center!important;
}
.en,[lang="en"],[dir="ltr"]{direction:ltr!important;text-align:left!important;unicode-bidi:isolate!important}
pre,code,.formula,mjx-container{direction:ltr!important;unicode-bidi:isolate!important;text-align:left!important}

section{background:#fff!important;border:1px solid #cbd5e1!important;color:#111827!important;break-inside:auto!important}
h1,h2,h3,h4,strong,b{color:#111827!important}
p,li,td,th,span,div{color:#1f2937!important}
.mini-card,.flow-box,.highlight,.note,.good,.warning,.research,.task,.svg-wrap,.svg-box,.toc a,.course-meta-item{
  background:#f8fafc!important;color:#111827!important;border:1px solid #94a3b8!important;box-shadow:none!important;
}
.highlight,.note{border-left:4px solid #0284c7!important}
.ar .highlight,.ar .note{border-left:1px solid #94a3b8!important;border-right:4px solid #0284c7!important}
.good{background:#f0fdf4!important;border-color:#86efac!important}
.warning{background:#fff1f2!important;border-color:#fda4af!important}
.research{background:#faf5ff!important;border-color:#d8b4fe!important}
.task{background:#fffbeb!important;border-color:#fcd34d!important}
.flow-box{background:#e0f2fe!important;border-color:#38bdf8!important}
th{background:#e2e8f0!important;color:#111827!important}
td{background:#fff!important;color:#1f2937!important}
pre,code,.formula{background:#f8fafc!important;color:#111827!important;border-color:#94a3b8!important}
svg{background:#fff!important;color:#111827!important}
svg text,svg tspan{fill:#111827!important;color:#111827!important}
svg line,svg polyline,svg path{stroke:#475569!important}
a{color:#0f4c81!important;text-decoration:none!important}
`;

for (const type of ['lecture', 'lab']) {
  for (let number = 1; number <= 20; number += 1) {
    const num = String(number).padStart(2, '0');
    const source = `${type}${num}.html`;
    if (!fs.existsSync(source)) continue;

    await page.goto(`http://127.0.0.1:8000/${source}`, { waitUntil: 'networkidle', timeout: 120000 });
    await page.evaluate(async () => {
      if (window.MathJax?.startup?.promise) await window.MathJax.startup.promise;
      await document.fonts?.ready;
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    });

    await page.evaluate(({ css, publishingCss, version, currentYear, website, type, num }) => {
      document.querySelectorAll('script').forEach(node => node.remove());

      let base = document.head.querySelector('base[data-pdf-base]');
      if (!base) {
        base = document.createElement('base');
        base.dataset.pdfBase = 'true';
        base.href = 'http://127.0.0.1:8000/';
        document.head.prepend(base);
      }

      const style = document.createElement('style');
      style.id = 'weasyprint-course-pdf';
      style.textContent = `${css}\n${publishingCss}`;
      document.head.appendChild(style);
      document.documentElement.setAttribute('lang', 'en');

      const arabicPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
      const centerArabic = (container, text) => {
        container.replaceChildren();
        container.setAttribute('lang', 'en');
        container.setAttribute('dir', 'ltr');
        const block = document.createElement('div');
        block.className = 'pdf-ar-table';
        block.setAttribute('lang', 'ar');
        block.setAttribute('dir', 'rtl');
        block.textContent = text.trim();
        container.appendChild(block);
      };

      document.querySelectorAll('.hero-ar').forEach(element => centerArabic(element, element.textContent || ''));

      document.querySelectorAll('.hero .subtitle').forEach(subtitle => {
        const parts = [];
        let current = '';
        subtitle.childNodes.forEach(node => {
          if (node.nodeName === 'BR') {
            if (current.trim()) parts.push(current.trim());
            current = '';
          } else current += node.textContent || '';
        });
        if (current.trim()) parts.push(current.trim());
        if (parts.length < 2) return;

        subtitle.replaceChildren();
        subtitle.setAttribute('lang', 'en');
        subtitle.setAttribute('dir', 'ltr');
        parts.forEach(text => {
          const line = document.createElement('div');
          const isArabic = arabicPattern.test(text);
          line.className = isArabic ? 'subtitle-ar' : 'subtitle-en';
          if (isArabic) centerArabic(line, text);
          else {
            line.setAttribute('lang', 'en');
            line.setAttribute('dir', 'ltr');
            line.textContent = text;
          }
          subtitle.appendChild(line);
        });
      });

      document.querySelectorAll('.ar, [dir="rtl"]').forEach(element => {
        if (element.classList.contains('hero-ar') || element.classList.contains('subtitle-ar')) return;
        element.setAttribute('lang', 'ar');
        element.setAttribute('dir', 'rtl');
      });

      const arabic = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/g;
      document.querySelectorAll('p,li,h1,h2,h3,h4,td,th,blockquote,figcaption').forEach(element => {
        if (element.closest('pre,code,.formula,mjx-container')) return;
        const text = (element.textContent || '').trim();
        if (!text) return;
        const arabicCount = (text.match(arabic) || []).length;
        const letters = (text.match(/[A-Za-z\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/g) || []).length;
        if (letters && arabicCount / letters >= 0.55) {
          element.setAttribute('lang', 'ar');
          element.setAttribute('dir', 'rtl');
        }
      });

      document.querySelectorAll('p, div, span').forEach(element => {
        if (!element.children.length && !element.textContent.trim()) element.remove();
      });

      const title = document.querySelector('.hero h1, main h1, h1')?.textContent?.trim() || `${type} ${num}`;
      const kind = type === 'lecture' ? 'Lecture' : 'Laboratory';
      const kindAr = type === 'lecture' ? 'محاضرة' : 'مخبر';
      const citation = `Gabash, A. (${currentYear}). ${title}. AI Applications in Electrical Power Systems, ${kind} ${num}, Version ${version}. ${website}`;

      const endMatter = document.createElement('section');
      endMatter.className = 'publication-endmatter';
      endMatter.innerHTML = `
        <h2>Publication Information</h2>
        <div class="publication-ar-title" lang="ar" dir="rtl">معلومات النشر والمرجع</div>
        <table class="publication-table">
          <tbody>
            <tr><th>Document</th><td>${kind} ${num} · ${title}</td></tr>
            <tr><th>Course</th><td>AI Applications in Electrical Power Systems</td></tr>
            <tr><th>Author</th><td>Dr.-Ing. Aouss Gabash</td></tr>
            <tr><th>Version</th><td>${version}</td></tr>
            <tr><th>Publication year</th><td>${currentYear}</td></tr>
            <tr><th>Official website</th><td>${website}</td></tr>
          </tbody>
        </table>
        <p class="publication-reference"><strong>Recommended citation:</strong><br>${citation}</p>
        <p class="publication-reference publication-reference-ar" lang="ar" dir="rtl"><strong>المرجع المقترح:</strong><br>أوس غباش، ${currentYear}، ${kindAr} ${num}، تطبيقات الذكاء الاصطناعي في أنظمة الطاقة الكهربائية، الإصدار ${version}، ${website}</p>
        <p class="publication-reference">© ${currentYear} Dr.-Ing. Aouss Gabash. Educational use with attribution to the author and official website.</p>`;

      const main = document.querySelector('main') || document.body;
      main.appendChild(endMatter);
    }, { css: printCss, publishingCss, version, currentYear, website, type, num });

    fs.writeFileSync(path.join(outputDir, `${type}${num}.html`), '<!doctype html>\n' + await page.content(), 'utf8');
    console.log(`Prepared publication HTML: ${type}${num}`);
  }
}

await browser.close();
