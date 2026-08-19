import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const pages = [];
for (const type of ['lecture', 'lab']) {
  for (let i = 1; i <= 20; i++) pages.push(`${type}${String(i).padStart(2, '0')}.html`);
}

const errors = [];
const warnings = [];
const rows = [];
const exists = (p) => fs.existsSync(path.join(root, p));
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const count = (text, re) => (text.match(re) || []).length;

function issue(level, file, message) {
  (level === 'error' ? errors : warnings).push({ file, message });
}

for (const file of pages) {
  if (!exists(file)) {
    issue('error', file, 'Missing page');
    continue;
  }

  const html = read(file);
  const type = file.startsWith('lecture') ? 'lecture' : 'lab';
  const num = file.match(/\d+/)?.[0] || '';
  const sections = count(html, /<section\b/gi);
  const enBlocks = count(html, /class=["'][^"']*\ben\b/gi);
  const arBlocks = count(html, /class=["'][^"']*\bar\b/gi);
  const formulas = count(html, /class=["'][^"']*\bformula\b/gi);
  const codeBlocks = count(html, /<pre\b/gi);
  const bytes = Buffer.byteLength(html);

  const required = [
    ['UTF-8 charset', /<meta[^>]+charset=["']?UTF-8/i],
    ['viewport', /<meta[^>]+name=["']viewport["']/i],
    ['title', /<title>[^<]+<\/title>/i],
    ['course-common.css', /course-common\.css/i],
    ['course-footer.css', /course-footer\.css/i],
    ['course-navigation.js', /course-navigation\.js/i],
    ['course-footer.js', /course-footer\.js/i],
    ['standard header logo', /AI<\/span>\s*Power Systems/i],
    ['home link', /href=["']index\.html["']/i],
    ['English block', /class=["'][^"']*\ben\b/i],
    ['Arabic block', /class=["'][^"']*\bar\b/i],
    ['Arabic direction', /dir=["']rtl["']|class=["'][^"']*\bar\b/i],
  ];

  for (const [label, re] of required) if (!re.test(html)) issue('error', file, `Missing ${label}`);

  if (type === 'lecture') {
    for (const [label, re] of [
      ['quiz stylesheet', /course-quiz\.css/i],
      ['quiz data', /course-quiz-data\.js/i],
      ['quiz script', /course-quiz\.js/i],
      ['certificate generator', /certificate-canvas\.js/i],
    ]) if (!re.test(html)) issue('warning', file, `Missing ${label}`);
  }

  if (sections < 4) issue('warning', file, `Only ${sections} sections`);
  if (bytes < (type === 'lecture' ? 9000 : 7000)) issue('warning', file, `Small page (${bytes} bytes)`);
  if (type === 'lab' && codeBlocks === 0) issue('warning', file, 'No code block found');
  if (formulas === 0) issue('warning', file, 'No formula block found');
  if (enBlocks !== arBlocks) issue('warning', file, `English/Arabic block mismatch (${enBlocks}/${arBlocks})`);

  const ids = [...html.matchAll(/\bid=["']([^"']+)["']/gi)].map((m) => m[1]);
  const duplicateIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
  if (duplicateIds.length) issue('error', file, `Duplicate IDs: ${duplicateIds.join(', ')}`);

  const refs = [...html.matchAll(/(?:href|src)=["']([^"']+)["']/gi)].map((m) => m[1]);
  for (const ref of refs) {
    if (/^(?:https?:|mailto:|tel:|data:|javascript:|#)/i.test(ref)) continue;
    const clean = ref.split(/[?#]/)[0];
    if (!clean) continue;
    if (!exists(clean)) issue('error', file, `Broken local reference: ${ref}`);
  }

  const pdf = `pdf/${type}${num}.pdf`;
  if (!exists(pdf)) issue('error', file, `Missing ${pdf}`);
  else if (fs.statSync(path.join(root, pdf)).size < 10000) issue('error', pdf, 'PDF unexpectedly small');

  rows.push({ file, bytes, sections, enBlocks, arBlocks, formulas, codeBlocks, pdf: exists(pdf) ? 'yes' : 'no' });
}

if (exists('index.html')) {
  const index = read('index.html');
  for (const file of pages) if (!index.includes(file)) issue('warning', 'index.html', `No link to ${file}`);
} else issue('error', 'index.html', 'Missing homepage');

if (exists('course-quiz-data.js')) {
  const quiz = read('course-quiz-data.js');
  for (let i = 1; i <= 20; i++) {
    const n = String(i).padStart(2, '0');
    if (!new RegExp(`lecture0?${i}\\b|lecture${n}\\b|['\"]${i}['\"]`, 'i').test(quiz)) {
      issue('warning', 'course-quiz-data.js', `Could not confirm quiz data for lecture ${n}`);
    }
  }
} else issue('error', 'course-quiz-data.js', 'Missing quiz data file');

const now = new Date().toISOString();
let md = `# Comprehensive Course Audit\n\nGenerated: **${now}**\n\n`;
md += `## Summary\n\n- Expected pages: **40**\n- Audited pages: **${rows.length}**\n- Errors: **${errors.length}**\n- Warnings: **${warnings.length}**\n- Overall result: **${errors.length ? 'FAIL' : 'PASS'}**\n\n`;
md += `## Page Matrix\n\n| Page | Bytes | Sections | EN | AR | Formulas | Code blocks | PDF |\n|---|---:|---:|---:|---:|---:|---:|:---:|\n`;
for (const r of rows) md += `| \`${r.file}\` | ${r.bytes} | ${r.sections} | ${r.enBlocks} | ${r.arBlocks} | ${r.formulas} | ${r.codeBlocks} | ${r.pdf} |\n`;

md += `\n## Errors\n\n`;
md += errors.length ? errors.map((x) => `- **${x.file}:** ${x.message}`).join('\n') : '- None';
md += `\n\n## Warnings\n\n`;
md += warnings.length ? warnings.map((x) => `- **${x.file}:** ${x.message}`).join('\n') : '- None';
md += `\n\n## Checks Performed\n\n- Presence of all 20 lectures and 20 labs\n- Shared CSS, navigation, footer, header, metadata, and bilingual structure\n- Lecture quiz and certificate integrations\n- Section count, formulas, and laboratory code blocks\n- Duplicate HTML IDs\n- Broken local href/src references\n- Presence and minimum size of all generated PDFs\n- Homepage links and quiz-data coverage\n`;

fs.writeFileSync(path.join(root, 'COURSE-AUDIT.md'), md);
console.log(md);
if (errors.length) process.exitCode = 1;
