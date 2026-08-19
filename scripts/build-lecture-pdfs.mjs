import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const outputDir = path.resolve('build/pdf-html');
fs.rmSync(outputDir, { recursive: true, force: true });
fs.mkdirSync(outputDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  locale: 'en-US'
});
const page = await context.newPage();

const printCss = `
@font-face {
  font-family: "Course Arabic PDF";
  src: url("http://127.0.0.1:8000/assets/fonts/NotoNaskhArabic-Regular.ttf") format("truetype");
  font-weight: 400;
  font-style: normal;
}

@page {
  size: A4;
  margin: 14mm 14mm 18mm;
  @bottom-left {
    content: "Dr.-Ing. Aouss Gabash";
    font-family: Arial, sans-serif;
    font-size: 8px;
    color: #666;
  }
  @bottom-center {
    content: "AI Applications in Electrical Power Systems";
    font-family: Arial, sans-serif;
    font-size: 8px;
    color: #666;
  }
  @bottom-right {
    content: counter(page) "/" counter(pages);
    font-family: Arial, sans-serif;
    font-size: 8px;
    color: #666;
  }
}

html, body {
  background: #fff !important;
  color: #111827 !important;
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}

header, nav, .mobile-menu-toggle, .navlinks, .back-to-top,
.course-footer, .site-footer, .course-actions, .quiz,
button, [data-progress-reset], [data-learning-dashboard] {
  display: none !important;
}

.ar, .hero-ar, [lang="ar"], [dir="rtl"] {
  font-family: "Course Arabic PDF", "Noto Naskh Arabic", Tahoma, Arial, sans-serif !important;
  direction: rtl !important;
  text-align: right !important;
  unicode-bidi: isolate !important;
  white-space: normal !important;
  letter-spacing: normal !important;
  word-spacing: normal !important;
  word-break: normal !important;
  overflow-wrap: break-word !important;
  line-height: 1.85 !important;
  font-kerning: normal !important;
  font-variant-ligatures: common-ligatures contextual !important;
}

.ar p, .ar li, .ar h1, .ar h2, .ar h3, .ar h4,
.ar td, .ar th, .ar blockquote,
[lang="ar"] p, [lang="ar"] li, [lang="ar"] h1,
[lang="ar"] h2, [lang="ar"] h3, [lang="ar"] h4,
[lang="ar"] td, [lang="ar"] th, [lang="ar"] blockquote {
  direction: rtl !important;
  text-align: right !important;
  unicode-bidi: plaintext !important;
}

.en, [lang="en"], [dir="ltr"] {
  direction: ltr !important;
  text-align: left !important;
  unicode-bidi: isolate !important;
}

pre, code, .formula, mjx-container {
  direction: ltr !important;
  unicode-bidi: isolate !important;
  text-align: left !important;
}

section {
  background: #fff !important;
  border: 1px solid #cbd5e1 !important;
  color: #111827 !important;
  break-inside: auto !important;
}

h1, h2, h3, h4, strong, b { color: #111827 !important; }
p, li, td, th, span, div { color: #1f2937 !important; }

.mini-card, .flow-box, .highlight, .note, .good, .warning,
.research, .task, .svg-wrap, .svg-box, .toc a, .course-meta-item {
  background: #f8fafc !important;
  color: #111827 !important;
  border: 1px solid #94a3b8 !important;
  box-shadow: none !important;
}

.highlight, .note { border-left: 4px solid #0284c7 !important; }
.ar .highlight, .ar .note {
  border-left: 1px solid #94a3b8 !important;
  border-right: 4px solid #0284c7 !important;
}
.good { background: #f0fdf4 !important; border-color: #86efac !important; }
.warning { background: #fff1f2 !important; border-color: #fda4af !important; }
.research { background: #faf5ff !important; border-color: #d8b4fe !important; }
.task { background: #fffbeb !important; border-color: #fcd34d !important; }
.flow-box { background: #e0f2fe !important; border-color: #38bdf8 !important; }

th { background: #e2e8f0 !important; color: #111827 !important; }
td { background: #fff !important; color: #1f2937 !important; }
pre, code, .formula {
  background: #f8fafc !important;
  color: #111827 !important;
  border-color: #94a3b8 !important;
}

svg { background: #fff !important; color: #111827 !important; }
svg text, svg tspan { fill: #111827 !important; color: #111827 !important; }
svg line, svg polyline, svg path { stroke: #475569 !important; }

a { color: #0f4c81 !important; text-decoration: none !important; }
`;

for (const type of ['lecture', 'lab']) {
  for (let number = 1; number <= 20; number += 1) {
    const num = String(number).padStart(2, '0');
    const source = `${type}${num}.html`;
    if (!fs.existsSync(source)) continue;

    const url = `http://127.0.0.1:8000/${source}`;
    await page.goto(url, { waitUntil: 'networkidle', timeout: 120000 });

    await page.evaluate(async () => {
      if (window.MathJax?.startup?.promise) {
        await window.MathJax.startup.promise;
      }
      await document.fonts?.ready;
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    });

    await page.evaluate(({ css }) => {
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
      style.textContent = css;
      document.head.appendChild(style);

      document.documentElement.setAttribute('lang', 'en');

      document.querySelectorAll('.ar, .hero-ar, [dir="rtl"]').forEach(element => {
        element.setAttribute('lang', 'ar');
        element.setAttribute('dir', 'rtl');
      });

      const arabic = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/g;
      document.querySelectorAll('p, li, h1, h2, h3, h4, td, th, blockquote, figcaption').forEach(element => {
        if (element.closest('pre, code, .formula, mjx-container')) return;
        const text = (element.textContent || '').trim();
        if (!text) return;
        const arabicCount = (text.match(arabic) || []).length;
        const letters = (text.match(/[A-Za-z\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/g) || []).length;
        if (letters > 0 && arabicCount / letters >= 0.55) {
          element.setAttribute('lang', 'ar');
          element.setAttribute('dir', 'rtl');
        }
      });
    }, { css: printCss });

    const html = '<!doctype html>\n' + await page.content();
    const output = path.join(outputDir, `${type}${num}.html`);
    fs.writeFileSync(output, html, 'utf8');
    console.log(`Prepared ${output}`);
  }
}

await browser.close();
