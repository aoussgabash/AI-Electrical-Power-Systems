import { chromium } from 'playwright';
import fs from 'node:fs';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });

for (let number = 1; number <= 20; number += 1) {
  const num = String(number).padStart(2, '0');
  const html = `lecture${num}.html`;
  if (!fs.existsSync(html)) continue;

  await page.goto(`http://127.0.0.1:8000/${html}`, {
    waitUntil: 'networkidle',
    timeout: 120000
  });

  await page.emulateMedia({ media: 'print' });
  await page.evaluate(() => document.fonts?.ready);
  await page.pdf({
    path: `pdf/lecture${num}.pdf`,
    format: 'A4',
    printBackground: true,
    preferCSSPageSize: true,
    displayHeaderFooter: false
  });

  const size = fs.statSync(`pdf/lecture${num}.pdf`).size;
  if (size < 10000) {
    throw new Error(`Generated PDF for ${html} is unexpectedly small.`);
  }
  console.log(`Generated pdf/lecture${num}.pdf (${size} bytes)`);
}

await browser.close();
