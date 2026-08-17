import fs from 'node:fs';

const path = 'course-navigation.js';
let text = fs.readFileSync(path, 'utf8');

const oldBlock = `    const downloadButton = card({
      tag: 'button',
      className: 'course-action-download',
      icon: '📥',
      title: 'Download Lecture PDF',
      subtitle: 'تحميل المحاضرة بصيغة PDF',
      meta: 'Print / Save as PDF | طباعة / حفظ PDF'
    });
    downloadButton.addEventListener('click', () => {
      const originalTitle = document.title;
      document.title = \`Lecture_\${num}_AI_Power_Systems_Version_1.0\`;
      window.addEventListener('afterprint', () => { document.title = originalTitle; }, { once: true });
      window.print();
    });
    actions.appendChild(downloadButton);
`;

const newBlock = `    const downloadButton = card({
      className: 'course-action-download',
      href: \`pdf/lecture\${num}.pdf\`,
      icon: '📥',
      title: 'Download Lecture PDF',
      subtitle: 'تحميل المحاضرة بصيغة PDF',
      meta: 'Ready PDF | ملف PDF جاهز'
    });
    downloadButton.setAttribute('download', \`Lecture_\${num}_AI_Power_Systems_Version_1.0.pdf\`);
    actions.appendChild(downloadButton);
`;

if (text.includes(oldBlock)) {
  text = text.replace(oldBlock, newBlock);
  fs.writeFileSync(path, text, 'utf8');
  console.log('Updated course-navigation.js with direct PDF links.');
} else if (text.includes('href: `pdf/lecture${num}.pdf`')) {
  console.log('Direct PDF links are already configured.');
} else {
  throw new Error('Expected lecture PDF button block was not found.');
}
