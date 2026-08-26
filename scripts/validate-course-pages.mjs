import fs from 'node:fs';

const errors = [];
const warnings = [];
const indexHtml = fs.readFileSync('index.html', 'utf8');

const stripTags = value => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
const normalize = value => stripTags(value)
  .toLowerCase()
  .replace(/&amp;/g, 'and')
  .replace(/[^a-z0-9]+/g, ' ')
  .replace(/\b(the|for|and|in|of|to|with|based|applications?)\b/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const matchText = (html, pattern) => {
  const match = html.match(pattern);
  return match ? stripTags(match[1]) : '';
};

const extractCatalog = (variableName) => {
  const pattern = new RegExp(`const\\s+${variableName}\\s*=\\s*(\\[[\\s\\S]*?\\]);\\s*const\\s+`, 'm');
  let match = indexHtml.match(pattern);

  if (!match) {
    const fallback = new RegExp(`const\\s+${variableName}\\s*=\\s*(\\[[\\s\\S]*?\\]);`, 'm');
    match = indexHtml.match(fallback);
  }

  if (!match) {
    errors.push(`index.html: could not extract ${variableName} catalog.`);
    return [];
  }

  try {
    return Function(`"use strict"; return (${match[1]});`)();
  } catch (error) {
    errors.push(`index.html: invalid ${variableName} catalog: ${error.message}`);
    return [];
  }
};

const catalogs = {
  lecture: extractCatalog('lectures'),
  lab: extractCatalog('labs')
};

const relatedEnough = (catalogTitle, pageHeading) => {
  const a = normalize(catalogTitle);
  const b = normalize(pageHeading);
  if (!a || !b) return false;
  if (a === b || a.includes(b) || b.includes(a)) return true;

  const wordsA = new Set(a.split(' ').filter(word => word.length > 2));
  const wordsB = new Set(b.split(' ').filter(word => word.length > 2));
  const common = [...wordsA].filter(word => wordsB.has(word)).length;
  const minimum = Math.min(wordsA.size, wordsB.size);
  return minimum > 0 && common / minimum >= 0.65;
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
  const arabicHeading = matchText(html, /<[^>]+class=["'][^"']*hero-ar[^"']*["'][^>]*>([\s\S]*?)<\/[^>]+>/i);
  const numberClass = type === 'lecture' ? 'lecture-number' : 'lab-number';
  const numberText = matchText(
    html,
    new RegExp(`<[^>]+class=["'][^"']*${numberClass}[^"']*["'][^>]*>([\\s\\S]*?)<\\/[^>]+>`, 'i')
  );

  if (!title) errors.push(`${file}: missing document <title>.`);
  if (!heading) errors.push(`${file}: missing main <h1> heading.`);
  if (!arabicHeading) warnings.push(`${file}: missing Arabic hero title.`);

  const expectedWord = type === 'lecture' ? 'Lecture' : 'Lab';
  if (title && !new RegExp(`${expectedWord}\\s*0?${number}`, 'i').test(title)) {
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

  const catalog = catalogs[type];
  const catalogEntry = catalog[number - 1];
  if (!catalogEntry) {
    errors.push(`index.html: missing ${type} catalog entry ${number}.`);
  } else {
    const catalogTitle = catalogEntry[0] || '';
    const catalogArabic = catalogEntry[1] || '';

    if (!relatedEnough(catalogTitle, heading)) {
      errors.push(`${file}: homepage title “${catalogTitle}” does not match page heading “${heading}”.`);
    }

    if (catalogArabic && arabicHeading && normalize(catalogArabic) !== normalize(arabicHeading)) {
      warnings.push(`${file}: Arabic homepage title may differ from page Arabic heading.`);
    }
  }

  const sectionCount = (html.match(/<section\b/gi) || []).length;
  if (sectionCount < 3) warnings.push(`${file}: only ${sectionCount} content sections found; scientific coverage may be too short.`);

  const hasReferences = /references?|المراجع/i.test(html);
  if (!hasReferences) warnings.push(`${file}: no visible references section detected.`);

  return { file, title, heading, sectionCount };
};

const results = [];
for (const type of ['lecture', 'lab']) {
  if (catalogs[type].length !== 20) {
    errors.push(`index.html: ${type} catalog contains ${catalogs[type].length} entries instead of 20.`);
  }

  for (let number = 1; number <= 20; number += 1) {
    const result = validatePage(type, number);
    if (result) results.push(result);
  }
}

const duplicateHeadingGroups = new Map();
for (const result of results) {
  const key = normalize(result.heading);
  if (!key) continue;
  const group = duplicateHeadingGroups.get(key) || [];
  group.push(result.file);
  duplicateHeadingGroups.set(key, group);
}
for (const [heading, files] of duplicateHeadingGroups) {
  if (files.length > 1) warnings.push(`Repeated main heading “${heading}” in: ${files.join(', ')}.`);
}

const lectureResults = results.filter(item => item.file.startsWith('lecture'));
const labResults = results.filter(item => item.file.startsWith('lab'));
console.log(`Validated ${lectureResults.length} lectures and ${labResults.length} laboratories.`);
console.log(`Checked filenames, visible numbering, page titles, homepage catalog titles, Arabic headings, central loaders, content depth, links, and references.`);

if (warnings.length) {
  console.log('\nWarnings:');
  warnings.forEach(item => console.log(`- ${item}`));
}
if (errors.length) {
  console.error('\nValidation errors:');
  errors.forEach(item => console.error(`- ${item}`));
  process.exit(1);
}

console.log('\nAll 20 lectures and 20 laboratories passed structural and catalog-title validation.');
