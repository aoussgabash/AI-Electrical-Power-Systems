(() => {
  'use strict';

  const page = location.pathname.split('/').pop()?.toLowerCase() || '';
  const match = page.match(/^lecture(\d{2})\.html$/);
  if (!match) return;

  const number = Number(match[1]);
  if (number < 1 || number > 20) return;

  const hero = document.querySelector('main .hero');
  if (!hero) return;

  document.querySelectorAll('.lecture-cover').forEach(cover => cover.remove());
  document.getElementById('shared-lecture-cover-style')?.remove();

  const style = document.createElement('style');
  style.id = 'shared-lecture-cover-style';
  style.textContent = `
    .lecture-cover{
      width:min(100%,1100px);
      margin:22px auto 34px;
      overflow:hidden;
      border:1px solid rgba(56,189,248,.35);
      border-radius:22px;
      background:#071a2b;
      box-shadow:0 18px 44px rgba(0,0,0,.28);
      box-sizing:border-box;
    }
    .course-two-page .lecture-cover{
      border-color:rgba(251,191,36,.42);
      box-shadow:0 18px 46px rgba(245,158,11,.14);
    }
    .lecture-cover img{
      display:block;
      width:100%;
      height:auto;
      aspect-ratio:16/9;
      object-fit:cover;
      object-position:center;
    }
    @media(max-width:700px){
      .lecture-cover{
        margin:16px auto 26px;
        border-radius:16px;
      }
    }
  `;
  document.head.appendChild(style);

  const figure = document.createElement('figure');
  figure.className = 'lecture-cover';
  figure.setAttribute('aria-label', `Lecture ${match[1]} cover image`);

  const image = document.createElement('img');
  image.src = `assets/images/lecture${match[1]}-ai-power.png`;
  image.alt = document.querySelector('main .hero h1')?.textContent?.trim() || `Lecture ${match[1]}`;
  image.width = 1536;
  image.height = 1024;
  image.loading = number === 1 ? 'eager' : 'lazy';
  image.decoding = 'async';
  image.addEventListener('error', () => figure.remove(), { once: true });

  figure.appendChild(image);
  hero.insertAdjacentElement('afterend', figure);
})();
