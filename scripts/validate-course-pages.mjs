import fs from 'node:fs';

const errors = [];
const warnings = [];
const indexHtml = fs.readFileSync('index.html', 'utf8');

const stripTags = value => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
const normalize = value => stripTags(value).toLowerCase().replace(/&amp;/g, 'and').replace(/[^a-z0-9]+/g, ' ').replace(/\b(the|for|and|in|of|to|with|based|applications?)\b/g, ' ').replace(/\s+/g, ' ').trim();
const matchText = (html, pattern) => html.match(pattern) ? stripTags(html.match(pattern)[1]) : '';

const extractCatalog = variableName => {
  const pattern = new RegExp(`const\\s+${variableName}\\s*=\\s*(\\[[\\s\\S]*?\\]);(?:\\s*const\\s+|\\s*function\\s+)`, 'm');
  const fallback = new RegExp(`const\\s+${variableName}\\s*=\\s*(\\[[\\s\\S]*?\\]);`, 'm');
  const match = indexHtml.match(pattern) || indexHtml.match(fallback);
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

const catalogs = { lecture: extractCatalog('lectures'), lab: extractCatalog('labs') };
const dynamicCardBuilderPresent = /href=\\?`\$\{type\}\$\{num\}\.html/.test(indexHtml) || /href="\$\{type\}\$\{num\}\.html"/.test(indexHtml);

const relatedEnough = (catalogTitle, pageHeading) => {
  const a = normalize(catalogTitle);
  const b = normalize(pageHeading);
  if (!a || !b) return false;
  if (a === b || a.includes(b) || b.includes(a)) return true;
  const wordsA = new Set(a.split(' ').filter(word => word.length > 2));
  const wordsB = new Set(b.split(' ').filter(word => word.length > 2));
  const common = [...wordsA].filter(word => wordsB.has(word)).length;
  return Math.min(wordsA.size, wordsB.size) > 0 && common / Math.min(wordsA.size, wordsB.size) >= 0.65;
};

const results = [];
for (const type of ['lecture', 'lab']) {
  if (catalogs[type].length !== 20) errors.push(`index.html: ${type} catalog contains ${catalogs[type].length} entries instead of 20.`);

  for (let number = 1; number <= 20; number += 1) {
    const num = String(number).padStart(2, '0');
    const file = `${type}${num}.html`;
    if (!fs.existsSync(file)) {
      errors.push(`${file}: file is missing.`);
      continue;
    }

    const html = fs.readFileSync(file, 'utf8');
    const title = matchText(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
    const heading = matchText(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i);
    const arabicHeading = matchText(html, /<[^>]+class=["'][^"']*hero-ar[^"']*["'][^>]*>([\s\S]*?)<\/[^>]+>/i);
    const numberClass = type === 'lecture' ? 'lecture-number' : 'lab-number';
    const numberText = matchText(html, new RegExp(`<[^>]+class=["'][^"']*${numberClass}[^"']*["'][^>]*>([\\s\\S]*?)<\\/[^>]+>`, 'i'));

    if (!title) errors.push(`${file}: missing document <title>.`);
    if (!heading) errors.push(`${file}: missing main <h1> heading.`);
    if (!arabicHeading) warnings.push(`${file}: missing Arabic hero title.`);
    if (numberText && !new RegExp(`0?${number}(?:\\D|$)`).test(numberText)) errors.push(`${file}: visible page number does not match filename. Found: “${numberText}”.`);
    if (!html.includes('course-footer.js')) errors.push(`${file}: central course-footer.js loader is missing.`);

    if (!dynamicCardBuilderPresent) {
      const hrefPattern = new RegExp(`href=["']${file.replace('.', '\\.')}(?:[?#][^"']*)?["']`, 'i');
      if (!hrefPattern.test(indexHtml)) errors.push(`index.html: missing link to ${file}.`);
    }

    const catalogEntry = catalogs[type][number - 1];
    if (!catalogEntry) {
      errors.push(`index.html: missing ${type} catalog entry ${number}.`);
    } else if (!relatedEnough(catalogEntry[0] || '', heading)) {
      warnings.push(`${file}: homepage title “${catalogEntry[0]}” does not match page heading “${heading}”. Scientific review required.`);
    }

    const sectionCount = (html.match(/<section\b/gi) || []).length;
    if (sectionCount < 3) warnings.push(`${file}: only ${sectionCount} content sections found.`);
    if (!/references?|المراجع/i.test(html)) warnings.push(`${file}: no visible references section detected.`);
    results.push({ file, heading });
  }
}

const duplicateHeadings = new Map();
for (const result of results) {
  const key = normalize(result.heading);
  const files = duplicateHeadings.get(key) || [];
  files.push(result.file);
  duplicateHeadings.set(key, files);
}
for (const [heading, files] of duplicateHeadings) if (heading && files.length > 1) warnings.push(`Repeated heading “${heading}” in: ${files.join(', ')}.`);

console.log(`Validated ${results.filter(x => x.file.startsWith('lecture')).length} lectures and ${results.filter(x => x.file.startsWith('lab')).length} laboratories.`);
if (warnings.length) {
  console.log('\nReview findings (non-blocking):');
  warnings.forEach(item => console.log(`- ${item}`));
}
if (errors.length) {
  console.error('\nStructural validation errors:');
  errors.forEach(item => console.error(`- ${item}`));
  process.exit(1);
}
console.log('\nStructural validation passed. Catalog/content mismatches remain visible as review findings until corrected page by page.');
