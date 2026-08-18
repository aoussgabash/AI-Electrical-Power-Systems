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
      await document.fonts?.ready;
      if (window.MathJax?.startup?.promise) {
        await window.MathJax.startup.promise;
      }
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
          <span style="display:flex;align-items:center;gap:6px;">
            <span>Dr.-Ing. Aouss Gabash</span>
            <span style="color:#999;">|</span>
            <span dir="rtl" style="font-family:Tahoma,Arial,sans-serif;">د. م. أوس غباش</span>
          </span>
          <span>AI Applications in Electrical Power Systems</span>
          <span><span class="pageNumber"></span>/<span class="totalPages"></span></span>
        </div>`,
      margin: {
        top: '14mm',
        right: '14mm',
        bottom: '18mm',
        left: '14mm'
      }
    });

    const size = fs.statSync(pdf).size;
    if (size < 10000) {
      throw new Error(`Generated PDF for ${html} is unexpectedly small.`);
    }

    console.log(`Generated ${pdf} (${size} bytes)`);
  }
}

await browser.close();
