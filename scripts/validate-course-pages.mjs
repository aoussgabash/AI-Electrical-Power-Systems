import fs from 'node:fs';

const errors = [];
const warnings = [];
const indexHtml = fs.readFileSync('index.html', 'utf8');

const stripTags = value => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
const matchText = (html, pattern) => {
  const match = html.match(pattern);
  return match ? stripTags(match[1]) : '';
};

const validatePage = (type, number) => {
  const num = String(number).padStart(2, '0');
  const file = `${type}${num}.html`;

  if (!fs.existsSync(file)) {
    errors.push(`${file}: file is missing.`);
    return;
  }

  const html = fs.readFileSync(file, 'utf8');
  const title = matchText(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
  const heading = matchText(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const numberClass = type === 'lecture' ? 'lecture-number' : 'lab-number';
  const numberText = matchText(
    html,
    new RegExp(`<[^>]+class=["'][^"']*${numberClass}[^"']*["'][^>]*>([\\s\\S]*?)<\\/[^>]+>`, 'i')
  );

  if (!title) errors.push(`${file}: missing document <title>.`);
  if (!heading) errors.push(`${file}: missing main <h1> heading.`);

  const expectedWord = type === 'lecture' ? 'Lecture' : 'Lab';
  if (title && !new RegExp(`${expectedWord}\\s*${number}`, 'i').test(title)) {
    warnings.push(`${file}: title does not clearly identify ${expectedWord} ${number}. Current title: “${title}”.`);
  }

  if (numberText && !new RegExp(`0?${number}(?:\\D|$)`).test(numberText)) {
    errors.push(`${file}: visible page number does not match filename. Found: “${numberText}”.`);
  }

  if (!html.includes('course-footer.js')) {
    errors.push(`${file}: central course-footer.js loader is missing.`);
  }

  const hrefPattern = new RegExp(`href=["']${file.replace('.', '\\.')}(?:[?#][^"']*)?["']`, 'i');
  if (!hrefPattern.test(indexHtml)) {
    errors.push(`index.html: missing link to ${file}.`);
  }

  return { file, title, heading };
};

const results = [];
for (const type of ['lecture', 'lab']) {
  for (let number = 1; number <= 20; number += 1) {
    const result = validatePage(type, number);
    if (result) results.push(result);
  }
}

const duplicateHeadingGroups = new Map();
for (const result of results) {
  const key = result.heading.toLowerCase();
  if (!key) continue;
  const group = duplicateHeadingGroups.get(key) || [];
  group.push(result.file);
  duplicateHeadingGroups.set(key, group);
}
for (const [heading, files] of duplicateHeadingGroups) {
  if (files.length > 1) warnings.push(`Repeated main heading “${heading}” in: ${files.join(', ')}.`);
}

console.log(`Validated ${results.length} course pages (20 lectures + 20 laboratories expected).`);
if (warnings.length) {
  console.log('\nWarnings:');
  warnings.forEach(item => console.log(`- ${item}`));
}
if (errors.length) {
  console.error('\nValidation errors:');
  errors.forEach(item => console.error(`- ${item}`));
  process.exit(1);
}

console.log('\nAll course files, numbering, central loaders, and homepage links passed validation.');
