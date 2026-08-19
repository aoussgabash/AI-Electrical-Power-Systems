import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const outputDir = path.resolve('build/pdf-html');
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

@page {
  size:A4;
  margin:14mm 14mm 18mm;
  @bottom-left { content:"Dr.-Ing. Aouss Gabash"; font:8px Arial,sans-serif; color:#666; }
  @bottom-center { content:"AI Applications in Electrical Power Systems"; font:8px Arial,sans-serif; color:#666; }
  @bottom-right { content:counter(page) "/" counter(pages); font:8px Arial,sans-serif; color:#666; }
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

/* The wrapper owns page positioning; the table owns Arabic direction and shrink-to-fit width. */
.hero-ar,.subtitle-ar{
  display:block!important;width:100%!important;max-width:100%!important;box-sizing:border-box!important;
  margin-left:auto!important;margin-right:auto!important;padding:0!important;
  direction:ltr!important;unicode-bidi:isolate!important;text-align:left!important;
}
.hero-ar{margin-top:14px!important;margin-bottom:18px!important}
.subtitle-ar{margin-top:8px!important;margin-bottom:18px!important;font-size:1.08em!important;line-height:1.9!important}

.pdf-ar-table{
  display:table!important;
  width:auto!important;
  max-width:100%!important;
  margin-left:auto!important;
  margin-right:auto!important;
  padding:0!important;
  direction:rtl!important;
  unicode-bidi:isolate!important;
  text-align:right!important;
  font-family:"Course Arabic PDF","Noto Naskh Arabic",Tahoma,Arial,sans-serif!important;
  white-space:normal!important;
  line-height:1.85!important;
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

    await page.evaluate(({ css }) => {
      document.querySelectorAll('script').forEach(node => node.remove());

      const base = document.createElement('base');
      base.dataset.pdfBase = 'true';
      base.href = 'http://127.0.0.1:8000/';
      document.head.prepend(base);

      const style = document.createElement('style');
      style.id = 'weasyprint-course-pdf';
      style.textContent = css;
      document.head.appendChild(style);
      document.documentElement.setAttribute('lang', 'en');

      const arabicPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;

      const centerArabic = (container, text) => {
        container.replaceChildren();
        container.setAttribute('lang', 'en');
        container.setAttribute('dir', 'ltr');
        container.style.setProperty('display', 'block', 'important');
        container.style.setProperty('width', '100%', 'important');
        container.style.setProperty('direction', 'ltr', 'important');
        container.style.setProperty('text-align', 'left', 'important');

        const block = document.createElement('div');
        block.className = 'pdf-ar-table';
        block.setAttribute('lang', 'ar');
        block.setAttribute('dir', 'rtl');
        block.textContent = text.trim();
        block.style.setProperty('display', 'table', 'important');
        block.style.setProperty('width', 'auto', 'important');
        block.style.setProperty('margin-left', 'auto', 'important');
        block.style.setProperty('margin-right', 'auto', 'important');
        block.style.setProperty('direction', 'rtl', 'important');
        block.style.setProperty('text-align', 'right', 'important');
        container.appendChild(block);
      };

      document.querySelectorAll('.hero-ar').forEach(element => {
        centerArabic(element, element.textContent || '');
        element.style.setProperty('margin', '14px auto 18px', 'important');
      });

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
          if (isArabic) {
            centerArabic(line, text);
            line.style.setProperty('margin', '8px auto 18px', 'important');
          } else {
            line.setAttribute('lang', 'en');
            line.setAttribute('dir', 'ltr');
            line.textContent = text;
            line.style.setProperty('display', 'block', 'important');
            line.style.setProperty('width', '100%', 'important');
            line.style.setProperty('text-align', 'center', 'important');
            line.style.setProperty('margin', '0 auto 12px', 'important');
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
    }, { css: printCss });

    fs.writeFileSync(path.join(outputDir, `${type}${num}.html`), '<!doctype html>\n' + await page.content(), 'utf8');
    console.log(`Prepared build/pdf-html/${type}${num}.html`);
  }
}

await browser.close();
