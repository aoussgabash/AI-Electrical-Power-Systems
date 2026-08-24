import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const args = new Set(process.argv.slice(2));
const writeChanges = args.has('--write');
const checkOnly = args.has('--check');

if (writeChanges && checkOnly) {
  throw new Error('Use either --write or --check, not both.');
}

const lecturePattern = /^lecture\d{2}\.html$/i;
const labPattern = /^lab\d{2}\.html$/i;
const themeHref = 'course-theme.css?v=20260824-7';

const removeInlineStyles = (html) =>
  html.replace(/\s*<style\b[^>]*>[\s\S]*?<\/style>\s*/gi, '\n');

const removeLegacyFooter = (html) =>
  html.replace(/\s*<footer\b[^>]*>[\s\S]*?<\/footer>\s*/gi, '\n');

const ensureCourseTheme = (html) => {
  if (/href=["']course-theme\.css(?:\?[^"']*)?["']/i.test(html)) return html;

  const footerLink = /<link\s+rel=["']stylesheet["']\s+href=["']course-footer\.css(?:\?[^"']*)?["']\s*\/?>/i;
  if (footerLink.test(html)) {
    return html.replace(
      footerLink,
      `<link rel="stylesheet" href="${themeHref}">\n<link rel="stylesheet" href="course-footer.css">`
    );
  }

  if (!/<\/head>/i.test(html)) {
    throw new Error('Cannot insert course theme because </head> is missing.');
  }

  return html.replace(
    /<\/head>/i,
    `<link rel="stylesheet" href="${themeHref}">\n</head>`
  );
};

const normalizeSpacing = (html) => html
  .replace(/\n{4,}/g, '\n\n\n')
  .replace(/[ \t]+\n/g, '\n')
  .trimEnd()
  .concat('\n');

const cleanLecture = (html) => normalizeSpacing(
  ensureCourseTheme(removeLegacyFooter(removeInlineStyles(html)))
);

const cleanLab = (html) => normalizeSpacing(
  ensureCourseTheme(removeLegacyFooter(html))
);

const validate = (file, html) => {
  const errors = [];

  if (!/<html\b/i.test(html) || !/<\/html>/i.test(html)) errors.push('missing html boundary');
  if (!/<head\b/i.test(html) || !/<\/head>/i.test(html)) errors.push('missing head boundary');
  if (!/<body\b/i.test(html) || !/<\/body>/i.test(html)) errors.push('missing body boundary');
  if (!/href=["']course-theme\.css(?:\?[^"']*)?["']/i.test(html)) errors.push('missing course-theme.css');
  if (/<footer\b/i.test(html)) errors.push('legacy footer remains');
  if (lecturePattern.test(file) && /<style\b/i.test(html)) errors.push('inline style remains');

  return errors;
};

const entries = await readdir(root, { withFileTypes: true });
const files = entries
  .filter((entry) => entry.isFile() && (lecturePattern.test(entry.name) || labPattern.test(entry.name)))
  .map((entry) => entry.name)
  .sort();

let changed = 0;
let invalid = 0;

for (const file of files) {
  const filePath = path.join(root, file);
  const original = await readFile(filePath, 'utf8');
  const cleaned = lecturePattern.test(file) ? cleanLecture(original) : cleanLab(original);
  const errors = validate(file, cleaned);

  if (errors.length) {
    invalid += 1;
    console.error(`${file}: ${errors.join(', ')}`);
    continue;
  }

  if (cleaned === original) continue;
  changed += 1;

  if (writeChanges) {
    await writeFile(filePath, cleaned, 'utf8');
    console.log(`updated ${file}`);
  } else {
    console.log(`would update ${file}`);
  }
}

if (invalid) {
  console.error(`Validation failed for ${invalid} page(s).`);
  process.exitCode = 1;
} else if (checkOnly && changed) {
  console.error(`${changed} page(s) still require centralization.`);
  process.exitCode = 1;
} else {
  console.log(`${writeChanges ? 'Updated' : 'Would update'} ${changed} course page(s).`);
  if (!writeChanges && !checkOnly) console.log('Run again with --write to apply changes.');
}
