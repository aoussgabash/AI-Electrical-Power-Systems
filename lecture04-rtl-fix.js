(() => {
  'use strict';

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

  const replacements = new Map([
    ['x = [درجة الحرارة، الساعة، نوع اليوم، الحمل السابق]', {
      symbol: 'x =',
      text: '[درجة الحرارة، الساعة، نوع اليوم، الحمل السابق]'
    }],
    ['y = الحمل في الساعة القادمة', {
      symbol: 'y =',
      text: 'الحمل في الساعة القادمة'
    }]
  ]);

  document.querySelectorAll('.ar .formula').forEach(formula => {
    const normalized = formula.textContent.replace(/\s+/g, ' ').trim();
    const replacement = replacements.get(normalized);
    if (!replacement) return;

    formula.classList.add('ag-mixed-formula');
    formula.setAttribute('dir', 'ltr');
    formula.innerHTML = '';

    const symbol = document.createElement('span');
    symbol.className = 'ag-math-symbol';
    symbol.dir = 'ltr';
    symbol.textContent = replacement.symbol;

    const arabic = document.createElement('span');
    arabic.className = 'ag-arabic-formula-text';
    arabic.dir = 'rtl';
    arabic.lang = 'ar';
    arabic.textContent = replacement.text;

    formula.append(symbol, arabic);
  });
})();
