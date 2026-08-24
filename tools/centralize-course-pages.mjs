import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const args = new Set(process.argv.slice(2));
const writeChanges = args.has('--write');

const lecturePattern = /^lecture\d{2}\.html$/i;
const labPattern = /^lab\d{2}\.html$/i;

const removeInlineStyles = (html) => html.replace(/\s*<style>[\s\S]*?<\/style>\s*/i, '\n');
const removeLegacyFooter = (html) => html.replace(/\s*<footer\b[^>]*>[\s\S]*?<\/footer>\s*/i, '\n');

const ensureCourseTheme = (html) => {
  if (/href=["']course-theme\.css(?:\?[^"']*)?["']/i.test(html)) return html;

  const compatibilityLink = /<link\s+rel=["']stylesheet["']\s+href=["']course-footer\.css(?:\?[^"']*)?["']\s*\/?>/i;
  if (compatibilityLink.test(html)) {
    return html.replace(
      compatibilityLink,
      '<link rel="stylesheet" href="course-theme.css?v=20260824-7">\n<link rel="stylesheet" href="course-footer.css">'
    );
  }

  return html.replace(
    /<\/head>/i,
    '<link rel="stylesheet" href="course-theme.css?v=20260824-7">\n</head>'
  );
};

const normalizeSpacing = (html) => html
  .replace(/\n{4,}/g, '\n\n\n')
  .replace(/[ \t]+\n/g, '\n');

const cleanLecture = (html) => normalizeSpacing(
  ensureCourseTheme(removeLegacyFooter(removeInlineStyles(html)))
);

const cleanLab = (html) => normalizeSpacing(removeLegacyFooter(html));

const entries = await readdir(root, { withFileTypes: true });
const files = entries
  .filter((entry) => entry.isFile() && (lecturePattern.test(entry.name) || labPattern.test(entry.name)))
  .map((entry) => entry.name)
  .sort();

let changed = 0;

for (const file of files) {
  const filePath = path.join(root, file);
  const original = await readFile(filePath, 'utf8');
  const cleaned = lecturePattern.test(file) ? cleanLecture(original) : cleanLab(original);

  if (cleaned === original) continue;
  changed += 1;

  if (writeChanges) {
    await writeFile(filePath, cleaned, 'utf8');
    console.log(`updated ${file}`);
  } else {
    console.log(`would update ${file}`);
  }
}

console.log(`${writeChanges ? 'Updated' : 'Would update'} ${changed} course page(s).`);
console.log(writeChanges ? 'Review the diff before committing.' : 'Run again with --write to apply changes.');
