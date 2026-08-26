(() => {
  'use strict';

  const params = new URLSearchParams(location.search);
  if (params.get('type') !== 'lecture' || String(params.get('number') || '').padStart(2,'0') !== '01') return;

  const root = document.getElementById('summary-root');
  if (!root) return;

  const arrowPattern = /\s*(?:→|←)\s*/;

  function convertArrowCallouts() {
    root.querySelectorAll('.callout').forEach(callout => {
      if (callout.dataset.flowEnhanced === 'true') return;
      const raw = (callout.textContent || '').trim();
      if (!raw.includes('→') && !raw.includes('←')) return;

      const isReverse = raw.includes('←') && !raw.includes('→');
      const parts = raw.split(arrowPattern).map(part => part.trim()).filter(Boolean);
      if (parts.length < 2) return;

      callout.dataset.flowEnhanced = 'true';
      callout.classList.add('flow');
      callout.setAttribute('aria-label', raw);
      callout.innerHTML = '';

      parts.forEach((part, index) => {
        const step = document.createElement('span');
        step.textContent = part;
        callout.appendChild(step);
        if (index < parts.length - 1) {
          const arrow = document.createElement('b');
          arrow.setAttribute('aria-hidden', 'true');
          arrow.textContent = isReverse ? '←' : '→';
          callout.appendChild(arrow);
        }
      });
    });
  }

  function labelSourceSections() {
    root.querySelectorAll('.panel,.example,.takeaway').forEach(block => {
      if (block.dataset.sourceLabelled === 'true') return;
      block.dataset.sourceLabelled = 'true';
      block.setAttribute('data-summary-source', 'lecture01.html');
    });
  }

  function enhance() {
    convertArrowCallouts();
    labelSourceSections();
  }

  const observer = new MutationObserver(() => enhance());
  observer.observe(root, {childList:true, subtree:true});
  enhance();
})();
