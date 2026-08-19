import { chromium } from 'playwright';
import fs from 'node:fs';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });

for (const type of ['lecture', 'lab']) {
  for (let number = 1; number <= 20; number += 1) {
    const num = String(number).padStart(2, '0');
    const html = `${type}${num}.html`;
    const pdf = `pdf/${type}${num}.pdf`;

    if (!fs.existsSync(html)) continue;

    await page.goto(`http://127.0.0.1:8000/${html}`, {
      waitUntil: 'networkidle',
      timeout: 120000
    });

    await page.emulateMedia({ media: 'print' });
    await page.evaluate(async () => {
      const style = document.createElement('style');
      style.id = 'pdf-print-fix';
      style.textContent = `
        @font-face {
          font-family: 'Course Arabic PDF';
          src: url('/assets/fonts/NotoNaskhArabic-Regular.ttf') format('truetype');
          font-weight: 400;
          font-style: normal;
          font-display: block;
        }

        .ar, .hero-ar, [lang='ar'], [dir='rtl'] {
          font-family: 'Course Arabic PDF', 'Noto Naskh Arabic', Tahoma, Arial, sans-serif !important;
          direction: rtl !important;
          text-align: right !important;
          unicode-bidi: isolate !important;
          white-space: normal !important;
          letter-spacing: 0 !important;
          word-spacing: .08em !important;
          word-break: normal !important;
          overflow-wrap: normal !important;
          font-kerning: normal !important;
          font-variant-ligatures: contextual common-ligatures !important;
          text-rendering: optimizeLegibility !important;
        }

        .ar p, .ar li, .ar h1, .ar h2, .ar h3, .ar h4,
        .ar td, .ar th, .ar blockquote,
        [lang='ar'] p, [lang='ar'] li, [lang='ar'] h1,
        [lang='ar'] h2, [lang='ar'] h3, [lang='ar'] h4,
        [lang='ar'] td, [lang='ar'] th, [lang='ar'] blockquote {
          direction: rtl !important;
          unicode-bidi: plaintext !important;
          text-align: right !important;
          white-space: normal !important;
          letter-spacing: 0 !important;
          word-spacing: .08em !important;
        }

        .ar pre, .ar code, .ar .formula,
        [lang='ar'] pre, [lang='ar'] code, [lang='ar'] .formula {
          direction: ltr !important;
          unicode-bidi: isolate !important;
          text-align: left !important;
          word-spacing: normal !important;
          font-family: Consolas, 'Courier New', monospace !important;
        }

        @media print {
          html, body {
            background: #ffffff !important;
            color: #111827 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .en { direction: ltr !important; unicode-bidi: isolate !important; text-align: left !important; }
          .ar { direction: rtl !important; unicode-bidi: isolate !important; text-align: right !important; }

          section {
            break-inside: auto !important;
            background: #ffffff !important;
            border: 1px solid #cbd5e1 !important;
            color: #111827 !important;
          }
          section > .en, section > .ar { break-inside: auto !important; }

          h1, h2, h3, h4, strong, b,
          section h1, section h2, section h3,
          .mini-card strong, .flow-box strong { color: #111827 !important; }

          p, li, td, th, span, div,
          .en p, .en li, .ar p, .ar li { color: #1f2937 !important; }

          .mini-card, .flow-box, .highlight, .note, .good, .warning,
          .research, .task, .svg-wrap, .toc a, .course-meta-item {
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
          .arrow { color: #0369a1 !important; }

          table { background: #ffffff !important; }
          th { background: #e2e8f0 !important; color: #111827 !important; border-color: #94a3b8 !important; }
          td { background: #ffffff !important; color: #1f2937 !important; border-color: #cbd5e1 !important; }

          pre, code { background: #f8fafc !important; color: #111827 !important; border-color: #94a3b8 !important; }
          .formula { background: #f1f5f9 !important; color: #111827 !important; border: 1px solid #94a3b8 !important; }
          .formula *, pre *, code * { color: #111827 !important; }

          .svg-wrap, .svg-box { background: #ffffff !important; border-color: #94a3b8 !important; }
          svg { background: #ffffff !important; color: #111827 !important; }
          svg text, svg tspan, svg .svgtext, svg .label {
            fill: #111827 !important;
            color: #111827 !important;
            font-weight: 600 !important;
          }
          svg line, svg polyline, svg path, svg .edge, svg .axis { stroke: #475569 !important; }
          svg marker path { fill: #475569 !important; stroke: #475569 !important; }
          svg rect:not([data-pdf-background]), svg circle, svg ellipse, svg polygon,
          svg .node, svg .inputnode, svg .outputnode {
            stroke: #475569 !important;
            stroke-width: 1.5 !important;
          }
          svg .node, svg circle.node, svg rect.node, svg .inputnode, svg .outputnode { fill: #dbeafe !important; }
          svg .goal, svg .good, svg .success { fill: #dcfce7 !important; stroke: #16a34a !important; }
          svg .warning, svg .danger, svg .bad { fill: #ffe4e6 !important; stroke: #e11d48 !important; }

          a { color: #0f4c81 !important; text-decoration: none !important; }
        }
      `;
      document.head.appendChild(style);

      document.querySelectorAll('.ar, .hero-ar, [dir="rtl"]').forEach((element) => {
        element.setAttribute('lang', 'ar');
        element.setAttribute('dir', 'rtl');
      });

      const arabicPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/g;
      const textBlocks = document.querySelectorAll('p, li, h1, h2, h3, h4, td, th, blockquote, figcaption');
      textBlocks.forEach((element) => {
        if (element.closest('pre, code, .formula, .MathJax, mjx-container')) return;
        const text = (element.textContent || '').trim();
        if (!text) return;
        const arabicCount = (text.match(arabicPattern) || []).length;
        const letterCount = (text.match(/[A-Za-z\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/g) || []).length;
        if (letterCount > 0 && arabicCount / letterCount >= 0.55) {
          element.setAttribute('lang', 'ar');
          element.setAttribute('dir', 'rtl');
          element.style.whiteSpace = 'normal';
          element.style.letterSpacing = '0';
          element.style.wordSpacing = '.08em';
        }
      });

      document.querySelectorAll('svg').forEach((svg) => {
        svg.style.background = '#ffffff';
        svg.style.color = '#111827';

        let viewWidth = 0;
        let viewHeight = 0;
        const viewBox = svg.viewBox?.baseVal;
        if (viewBox) {
          viewWidth = viewBox.width;
          viewHeight = viewBox.height;
        }

        svg.querySelectorAll('rect').forEach((shape) => {
          const width = Number(shape.getAttribute('width')) || 0;
          const height = Number(shape.getAttribute('height')) || 0;
          const isBackground = viewWidth > 0 && viewHeight > 0 && width >= viewWidth * 0.75 && height >= viewHeight * 0.75;
          if (isBackground) {
            shape.setAttribute('data-pdf-background', 'true');
            shape.setAttribute('fill', '#ffffff');
            shape.setAttribute('stroke', '#cbd5e1');
          } else if (!shape.closest('defs')) {
            shape.setAttribute('fill', '#e0f2fe');
            shape.setAttribute('stroke', '#475569');
          }
        });

        svg.querySelectorAll('circle, ellipse, polygon').forEach((shape) => {
          if (shape.closest('defs')) return;
          const classes = (shape.getAttribute('class') || '').toLowerCase();
          const isGoal = /goal|success|good/.test(classes);
          shape.setAttribute('fill', isGoal ? '#dcfce7' : '#dbeafe');
          shape.setAttribute('stroke', isGoal ? '#16a34a' : '#475569');
        });

        svg.querySelectorAll('line, polyline, path').forEach((shape) => {
          if (shape.closest('defs')) return;
          shape.setAttribute('stroke', '#475569');
          const fill = (shape.getAttribute('fill') || '').toLowerCase();
          if (fill && fill !== 'none' && fill !== 'transparent') shape.setAttribute('fill', '#e0f2fe');
        });

        svg.querySelectorAll('text, tspan').forEach((text) => {
          text.setAttribute('fill', '#111827');
          text.style.fontWeight = '600';
        });
      });

      await document.fonts?.ready;
      if (window.MathJax?.startup?.promise) await window.MathJax.startup.promise;
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    });

    await page.pdf({
      path: pdf,
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      displayHeaderFooter: true,
      headerTemplate: '<div></div>',
      footerTemplate: `
        <div style="width:100%;font-size:8px;color:#666;padding:0 12mm;display:flex;justify-content:space-between;align-items:center;font-family:Arial,Tahoma,sans-serif;">
          <span>Dr.-Ing. Aouss Gabash</span>
          <span>AI Applications in Electrical Power Systems</span>
          <span><span class="pageNumber"></span>/<span class="totalPages"></span></span>
        </div>`,
      margin: { top: '14mm', right: '14mm', bottom: '18mm', left: '14mm' }
    });

    const size = fs.statSync(pdf).size;
    if (size < 10000) throw new Error(`Generated PDF for ${html} is unexpectedly small.`);
    console.log(`Generated ${pdf} (${size} bytes)`);
  }
}

await browser.close();
