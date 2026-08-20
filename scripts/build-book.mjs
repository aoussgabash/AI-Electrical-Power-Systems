import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const OUTPUT_DIR = path.resolve('build/book');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'AI-Power-Systems-Book.html');
const BOOK_CSS = fs.readFileSync(path.resolve('scripts/book-publishing.css'), 'utf8');

const chapters = [
  { file: 'lecture01.html', number: 1 },
  { file: 'lecture02.html', number: 2 },
];

fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  locale: 'en-US',
});
const page = await context.newPage();

const chapterData = [];

for (const chapter of chapters) {
  await page.goto(`http://127.0.0.1:8000/${chapter.file}`, {
    waitUntil: 'networkidle',
    timeout: 120000,
  });

  await page.evaluate(async () => {
    if (window.MathJax?.startup?.promise) await window.MathJax.startup.promise;
    await document.fonts?.ready;
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  });

  const data = await page.evaluate(({ number }) => {
    document.querySelectorAll('script').forEach(node => node.remove());

    // Preserve SVG appearance before extracting chapter HTML.
    document.querySelectorAll('svg').forEach(svg => {
      svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      svg.querySelectorAll('*').forEach(element => {
        const computed = getComputedStyle(element);
        [
          'fill', 'fill-opacity', 'fill-rule',
          'stroke', 'stroke-width', 'stroke-opacity',
          'stroke-linecap', 'stroke-linejoin', 'stroke-dasharray',
          'opacity', 'color',
          'font-family', 'font-size', 'font-style', 'font-weight',
          'text-anchor', 'dominant-baseline',
        ].forEach(property => {
          const value = computed.getPropertyValue(property);
          if (value && value !== 'normal') {
            element.style.setProperty(property, value, 'important');
          }
        });
      });
    });

    const main = document.querySelector('main');
    if (!main) throw new Error('Missing <main> element.');

    const englishTitle = main.querySelector('.hero h1')?.textContent?.trim() || `Chapter ${number}`;
    const arabicTitle = main.querySelector('.hero-ar')?.textContent?.trim() || '';

    main.querySelectorAll(
      'header, nav, .course-footer, .site-footer, .course-actions, .quiz, button, .back-to-top, .mobile-menu-toggle'
    ).forEach(node => node.remove());

    const hero = main.querySelector('.hero');
    if (hero) hero.remove();

    return {
      englishTitle,
      arabicTitle,
      html: main.innerHTML,
    };
  }, { number: chapter.number });

  chapterData.push({ ...chapter, ...data });
  console.log(`Prepared chapter ${chapter.number}: ${data.englishTitle}`);
}

await browser.close();

const tocItems = chapterData.map(chapter => `
  <li>
    <a href="#chapter-${chapter.number}">Chapter ${chapter.number}: ${escapeHtml(chapter.englishTitle)}</a>
    <span class="toc-ar" lang="ar" dir="rtl">الفصل ${chapter.number}: ${escapeHtml(chapter.arabicTitle)}</span>
  </li>`).join('\n');

const chapterHtml = chapterData.map(chapter => `
<section class="book-chapter" id="chapter-${chapter.number}">
  <div class="chapter-heading">
    <h1>Chapter ${chapter.number}: ${escapeHtml(chapter.englishTitle)}</h1>
    <div class="chapter-ar" lang="ar" dir="rtl">الفصل ${chapter.number}: ${escapeHtml(chapter.arabicTitle)}</div>
  </div>
  ${chapter.html}
</section>`).join('\n');

const bookHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>AI Applications in Electrical Power Systems</title>
  <base href="file://${ROOT.replaceAll('\\', '/')}/">
  <style>${BOOK_CSS}</style>
</head>
<body>
  <div class="book-title-string">AI Applications in Electrical Power Systems</div>

  <section class="book-cover">
    <h1>AI Applications in Electrical Power Systems</h1>
    <div class="title-ar" lang="ar" dir="rtl">تطبيقات الذكاء الاصطناعي في أنظمة الطاقة الكهربائية</div>
    <div class="author">Dr.-Ing. Aouss Gabash</div>
    <div class="edition">Bilingual Academic Edition · English followed by Arabic · 2026</div>
  </section>

  <section class="front-matter">
    <h1>Preface | المقدمة</h1>
    <p>
      This bilingual academic book presents the foundations and applications of artificial intelligence
      in electrical power systems. English content is followed directly by its Arabic counterpart to
      support both technical accuracy and accessible learning.
    </p>
    <div class="ar" lang="ar" dir="rtl">
      يقدم هذا الكتاب الأكاديمي ثنائي اللغة الأسس والتطبيقات المتعلقة بالذكاء الاصطناعي في أنظمة
      الطاقة الكهربائية. ويأتي المحتوى العربي مباشرة بعد المحتوى الإنجليزي لدعم الدقة العلمية وسهولة التعلم.
    </div>
    <div class="prototype-note">
      Prototype edition containing Chapters 1–2. After layout approval, the remaining lectures and laboratories will be added automatically.
    </div>
  </section>

  <nav class="toc">
    <h1>Contents | المحتويات</h1>
    <ol>${tocItems}</ol>
  </nav>

  ${chapterHtml}
</body>
</html>`;

fs.writeFileSync(OUTPUT_FILE, bookHtml, 'utf8');
console.log(`Generated ${path.relative(ROOT, OUTPUT_FILE)}`);

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
