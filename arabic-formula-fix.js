(() => {
  'use strict';

  const ARABIC_RE = /[\u0600-\u06FF]/;
  const PREFIX_RE = /^\s*([A-Za-zÀ-ž\u0370-\u03FF\u1D400-\u1D7FFŷηΣ√]+(?:\s*\([^)]*\))?\s*=)\s*(.+)$/u;

  const style = document.createElement('style');
  style.textContent = `
    .formula.ag-mixed-formula {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      gap: .55rem;
      direction: ltr;
      text-align: center;
      white-space: normal;
      overflow-wrap: anywhere;
    }

    .formula.ag-mixed-formula .ag-math-symbol {
      direction: ltr;
      unicode-bidi: isolate;
      flex: 0 0 auto;
    }

    .formula.ag-mixed-formula .ag-arabic-formula-text {
      direction: rtl;
      unicode-bidi: isolate;
      font-family: "Noto Naskh Arabic", "Tahoma", "Arial", sans-serif;
      font-style: normal;
      line-height: 1.7;
      text-align: right;
    }

    @media (max-width: 600px) {
      .formula.ag-mixed-formula {
        font-size: clamp(1rem, 4vw, 1.2rem);
        padding-inline: .75rem;
      }
    }
  `;
  document.head.appendChild(style);

  const fixFormula = formula => {
    if (formula.dataset.agArabicFormulaFixed === 'true') return;

    const text = formula.textContent.replace(/\s+/g, ' ').trim();
    if (!ARABIC_RE.test(text)) return;

    const match = text.match(PREFIX_RE);
    if (!match) {
      formula.dir = 'rtl';
      formula.style.unicodeBidi = 'plaintext';
      formula.style.fontStyle = 'normal';
      formula.dataset.agArabicFormulaFixed = 'true';
      return;
    }

    formula.classList.add('ag-mixed-formula');
    formula.dir = 'ltr';
    formula.innerHTML = '';

    const symbol = document.createElement('span');
    symbol.className = 'ag-math-symbol';
    symbol.dir = 'ltr';
    symbol.textContent = match[1];

    const arabic = document.createElement('span');
    arabic.className = 'ag-arabic-formula-text';
    arabic.dir = 'rtl';
    arabic.lang = 'ar';
    arabic.textContent = match[2];

    formula.append(symbol, arabic);
    formula.dataset.agArabicFormulaFixed = 'true';
  };

  const scan = root => {
    if (root.matches?.('.formula')) fixFormula(root);
    root.querySelectorAll?.('.formula').forEach(fixFormula);
  };

  scan(document);

  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) scan(node);
      });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();
