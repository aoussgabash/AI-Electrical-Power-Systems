(() => {
  'use strict';

  const archiveUrl = 'https://archive.org/details/@aouss_gabash';
  const startYear = 2026;
  const currentYear = new Date().getFullYear();
  const yearText = currentYear > startYear ? `${startYear}–${currentYear}` : `${startYear}`;
  const page = location.pathname.split('/').pop() || 'index.html';
  const match = page.match(/^(lecture|lab)(\d{2})\.html$/i);
  const isHomePage = page === '' || page.toLowerCase() === 'index.html';

  const exactFormulaMap = new Map([
    ['MDP = (S, A, P, R, γ)', String.raw`\mathrm{MDP}=(\mathcal{S},\mathcal{A},P,R,\gamma)`],
    ['P(sₜ₊₁ | s₀,a₀,...,sₜ,aₜ) = P(sₜ₊₁ | sₜ,aₜ)', String.raw`P(s_{t+1}\mid s_0,a_0,\ldots,s_t,a_t)=P(s_{t+1}\mid s_t,a_t)`],
    ['Gₜ = rₜ₊₁ + γrₜ₊₂ + γ²rₜ₊₃ + ...', String.raw`G_t=r_{t+1}+\gamma r_{t+2}+\gamma^2 r_{t+3}+\cdots`],
    ['Gₜ = Σₖ₌₀∞ γᵏ rₜ₊ₖ₊₁', String.raw`G_t=\sum_{k=0}^{\infty}\gamma^k r_{t+k+1}`],
    ['Vπ(s) = Eπ[Gₜ | sₜ=s]', String.raw`V^{\pi}(s)=\mathbb{E}_{\pi}\!\left[G_t\mid s_t=s\right]`],
    ['Qπ(s,a) = Eπ[Gₜ | sₜ=s, aₜ=a]', String.raw`Q^{\pi}(s,a)=\mathbb{E}_{\pi}\!\left[G_t\mid s_t=s,\ a_t=a\right]`],
    ['Q*(s,a) = E[r + γ maxₐ′ Q*(s′,a′)]', String.raw`Q^{*}(s,a)=\mathbb{E}\!\left[r+\gamma\max_{a'}Q^{*}(s',a')\right]`],
    ['Q(sₜ,aₜ) ← Q(sₜ,aₜ) + α[rₜ₊₁ + γ maxₐQ(sₜ₊₁,a) − Q(sₜ,aₜ)]', String.raw`Q(s_t,a_t)\leftarrow Q(s_t,a_t)+\alpha\!\left[r_{t+1}+\gamma\max_a Q(s_{t+1},a)-Q(s_t,a_t)\right]`],
    ['δₜ = rₜ₊₁ + γ maxₐQ(sₜ₊₁,a) − Q(sₜ,aₜ)', String.raw`\delta_t=r_{t+1}+\gamma\max_a Q(s_{t+1},a)-Q(s_t,a_t)`],
    ['With probability ε: choose a random action; otherwise: choose arg max Q(s,a)', String.raw`\begin{cases}\text{choose a random action},&\text{with probability }\varepsilon,\\[2pt]\displaystyle\arg\max_a Q(s,a),&\text{otherwise.}\end{cases}`],
    ['L(θ) = E[(r + γ maxₐ′Q(s′,a′;θ⁻) − Q(s,a;θ))²]', String.raw`L(\theta)=\mathbb{E}\!\left[\left(r+\gamma\max_{a'}Q(s',a';\theta^{-})-Q(s,a;\theta)\right)^2\right]`],
    ['∇θJ(θ) = E[∇θ log πθ(a|s) · A(s,a)]', String.raw`\nabla_{\theta}J(\theta)=\mathbb{E}\!\left[\nabla_{\theta}\log\pi_{\theta}(a\mid s)\cdot A(s,a)\right]`],
    ['SOCₜ₊₁ = SOCₜ + ηc Pc,t Δt/Emax − Pd,t Δt/(ηd Emax)', String.raw`\mathrm{SOC}_{t+1}=\mathrm{SOC}_t+\frac{\eta_c P_{c,t}\,\Delta t}{E_{\max}}-\frac{P_{d,t}\,\Delta t}{\eta_d E_{\max}}`],
    ['SOCmin ≤ SOCₜ ≤ SOCmax', String.raw`\mathrm{SOC}_{\min}\le \mathrm{SOC}_t\le \mathrm{SOC}_{\max}`],
    ['rₜ = −cₜPgrid,tΔt − λdeg|Pb,t| − λviol·Violationₜ', String.raw`r_t=-c_tP_{\mathrm{grid},t}\Delta t-\lambda_{\mathrm{deg}}\lvert P_{b,t}\rvert-\lambda_{\mathrm{viol}}\,\mathrm{Violation}_t`],
    ['x̂ₜ = Twin(zₜ, uₜ, topologyₜ, model parameters)', String.raw`\hat{x}_t=\operatorname{Twin}\!\left(z_t,u_t,\mathrm{topology}_t,\mathrm{model\ parameters}\right)`],
    ['z = h(x) + e', String.raw`z=h(x)+e`],
    ['u* = arg min_u J(x,u) subject to g(x,u)≤0 and h(x,u)=0', String.raw`u^{*}=\operatorname*{arg\,min}_{u}\ J(x,u)\quad\text{subject to}\quad g(x,u)\le 0,\ h(x,u)=0`],
    ['u_RL = πθ(s)', String.raw`u_{\mathrm{RL}}=\pi_{\theta}(s)`],
    ['u_safe = arg min_u ||u-u_AI||² subject to operational constraints', String.raw`u_{\mathrm{safe}}=\operatorname*{arg\,min}_{u}\ \lVert u-u_{\mathrm{AI}}\rVert^2\quad\text{subject to operational constraints}`],
    ['x_i(k+1)=Σ_j w_ij x_j(k)', String.raw`x_i(k+1)=\sum_j w_{ij}x_j(k)`],
    ['w_global = Σ_k (n_k/N) w_k', String.raw`w_{\mathrm{global}}=\sum_k\frac{n_k}{N}w_k`],
    ['J_total = J_data + λ_pf J_power-flow + λ_dyn J_dynamics + λ_limits J_limits', String.raw`J_{\mathrm{total}}=J_{\mathrm{data}}+\lambda_{\mathrm{pf}}J_{\mathrm{power\text{-}flow}}+\lambda_{\mathrm{dyn}}J_{\mathrm{dynamics}}+\lambda_{\mathrm{limits}}J_{\mathrm{limits}}`],
    ['Risk = E[Cost] + β·CVaR_α(Cost)', String.raw`\mathrm{Risk}=\mathbb{E}[\mathrm{Cost}]+\beta\,\mathrm{CVaR}_{\alpha}(\mathrm{Cost})`],
  ]);

  const subscriptChars = {
    '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4',
    '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9',
    '₊': '+', '₋': '-', '₌': '=', '₍': '(', '₎': ')',
    'ₐ': 'a', 'ₑ': 'e', 'ₕ': 'h', 'ᵢ': 'i', 'ⱼ': 'j', 'ₖ': 'k',
    'ₗ': 'l', 'ₘ': 'm', 'ₙ': 'n', 'ₒ': 'o', 'ₚ': 'p', 'ᵣ': 'r',
    'ₛ': 's', 'ₜ': 't', 'ᵤ': 'u', 'ᵥ': 'v', 'ₓ': 'x',
  };

  const superscriptChars = {
    '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4',
    '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9',
    '⁺': '+', '⁻': '-', '⁼': '=', '⁽': '(', '⁾': ')',
    'ᵃ': 'a', 'ᵇ': 'b', 'ᶜ': 'c', 'ᵈ': 'd', 'ᵉ': 'e', 'ᶠ': 'f',
    'ᵍ': 'g', 'ʰ': 'h', 'ⁱ': 'i', 'ʲ': 'j', 'ᵏ': 'k', 'ˡ': 'l',
    'ᵐ': 'm', 'ⁿ': 'n', 'ᵒ': 'o', 'ᵖ': 'p', 'ʳ': 'r', 'ˢ': 's',
    'ᵗ': 't', 'ᵘ': 'u', 'ᵛ': 'v', 'ʷ': 'w', 'ˣ': 'x', 'ʸ': 'y', 'ᶻ': 'z',
  };

  const mapUnicodeScripts = (value, map, marker) => {
    const chars = Object.keys(map).join('');
    if (!chars) return value;
    const regex = new RegExp(`[${chars}]+`, 'g');
    return value.replace(regex, (run) => `${marker}{${[...run].map((char) => map[char]).join('')}}`);
  };

  const formatArrowFlow = (value) => {
    const parts = value.split(/\s*→\s*/).map((part) => part.trim()).filter(Boolean);
    if (parts.length < 2) return null;
    return parts
      .map((part) => String.raw`\text{${part.replace(/([{}])/g, '\\$1')}}`)
      .join(String.raw`\;\longrightarrow\;`);
  };

  const genericFormulaToTex = (raw) => {
    const arrowFlow = raw.includes('→') && /[A-Za-z]{4,}/.test(raw) ? formatArrowFlow(raw) : null;
    if (arrowFlow) return arrowFlow;

    let value = raw
      .normalize('NFC')
      .replace(/x̂/g, String.raw`\hat{x}`)
      .replace(/ŷ/g, String.raw`\hat{y}`)
      .replace(/θ̂/g, String.raw`\hat{\theta}`);

    value = mapUnicodeScripts(value, subscriptChars, '_');
    value = mapUnicodeScripts(value, superscriptChars, '^');

    value = value
      .replace(/\.\.\./g, String.raw`\ldots`)
      .replace(/[Σ∑]/g, String.raw`\sum`)
      .replace(/∞/g, String.raw`\infty`)
      .replace(/∇/g, String.raw`\nabla `)
      .replace(/Δ/g, String.raw`\Delta `)
      .replace(/δ/g, String.raw`\delta `)
      .replace(/α/g, String.raw`\alpha `)
      .replace(/β/g, String.raw`\beta `)
      .replace(/γ/g, String.raw`\gamma `)
      .replace(/θ/g, String.raw`\theta `)
      .replace(/λ/g, String.raw`\lambda `)
      .replace(/η/g, String.raw`\eta `)
      .replace(/ε/g, String.raw`\varepsilon `)
      .replace(/π/g, String.raw`\pi `)
      .replace(/ρ/g, String.raw`\rho `)
      .replace(/σ/g, String.raw`\sigma `)
      .replace(/μ/g, String.raw`\mu `)
      .replace(/ω/g, String.raw`\omega `)
      .replace(/≤/g, String.raw`\le `)
      .replace(/≥/g, String.raw`\ge `)
      .replace(/≠/g, String.raw`\ne `)
      .replace(/≈/g, String.raw`\approx `)
      .replace(/←/g, String.raw`\leftarrow `)
      .replace(/→/g, String.raw`\rightarrow `)
      .replace(/[·⋅]/g, String.raw`\cdot `)
      .replace(/×/g, String.raw`\times `)
      .replace(/−/g, '-')
      .replace(/±/g, String.raw`\pm `)
      .replace(/√/g, String.raw`\sqrt `)
      .replace(/\|\|([^|]+)\|\|/g, String.raw`\lVert $1\rVert`)
      .replace(/\barg\s+min\b/gi, String.raw`\operatorname*{arg\,min}`)
      .replace(/\barg\s+max\b/gi, String.raw`\operatorname*{arg\,max}`)
      .replace(/\bmax\b/g, String.raw`\max`)
      .replace(/\bmin\b/g, String.raw`\min`)
      .replace(/\blog\b/g, String.raw`\log`)
      .replace(/\bexp\b/g, String.raw`\exp`)
      .replace(/\bsubject to\b/gi, String.raw`\quad\text{subject to}\quad`)
      .replace(/\band\b/gi, String.raw`\quad\text{and}\quad`)
      .replace(/\s+/g, ' ')
      .trim();

    return value;
  };

  const formulaToTex = (raw) => exactFormulaMap.get(raw.trim()) || genericFormulaToTex(raw.trim());

  const initMathRendering = () => {
    const formulas = [...document.querySelectorAll('.formula, .equation')]
      .filter((element) => !element.dataset.mathProcessed);

    if (!formulas.length) return;

    formulas.forEach((element) => {
      const original = element.textContent.trim();
      if (!original) return;
      element.dataset.mathOriginal = original;
      element.dataset.mathProcessed = 'pending';
      element.setAttribute('dir', 'ltr');
      element.setAttribute('role', 'math');
      element.setAttribute('aria-label', original);
      element.textContent = `\\[${formulaToTex(original)}\\]`;
    });

    window.MathJax = {
      tex: {
        inlineMath: [['\\(', '\\)']],
        displayMath: [['\\[', '\\]']],
        processEscapes: true,
      },
      chtml: {
        scale: 1.02,
      },
      options: {
        skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code'],
      },
      startup: {
        typeset: false,
      },
    };

    const mathJaxScript = document.createElement('script');
    mathJaxScript.src = 'https://cdn.jsdelivr.net/npm/mathjax@4/tex-chtml.js';
    mathJaxScript.defer = true;
    mathJaxScript.dataset.courseMathJax = 'true';

    mathJaxScript.addEventListener('load', () => {
      const ready = window.MathJax?.startup?.promise || Promise.resolve();
      ready
        .then(() => window.MathJax.typesetPromise(formulas))
        .then(() => {
          formulas.forEach((element) => {
            element.dataset.mathProcessed = 'true';
            element.classList.add('math-rendered');
          });
          document.documentElement.classList.add('mathjax-ready');
        })
        .catch(() => {
          formulas.forEach((element) => {
            element.textContent = element.dataset.mathOriginal || element.textContent;
            element.dataset.mathProcessed = 'failed';
          });
        });
    });

    mathJaxScript.addEventListener('error', () => {
      formulas.forEach((element) => {
        element.textContent = element.dataset.mathOriginal || element.textContent;
        element.dataset.mathProcessed = 'failed';
      });
    });

    document.head.appendChild(mathJaxScript);
  };

  let pageInfo = 'Version 1.0';
  if (match) {
    const type = match[1].toLowerCase();
    const number = match[2];
    pageInfo = type === 'lab'
      ? `MATLAB Lab ${number} • Lecture ${number} • Version 1.0`
      : `Lecture ${number} • MATLAB Lab ${number} • Version 1.0`;
  }

  if (isHomePage) {
    const navLinks = document.querySelector('.navlinks');
    if (navLinks && !navLinks.querySelector('[data-archive-link]')) {
      const navArchive = document.createElement('a');
      navArchive.href = '#digital-library';
      navArchive.dataset.archiveLink = 'true';
      navArchive.textContent = '📚 Digital Library';
      navLinks.appendChild(navArchive);
    }

    const heroButtons = document.querySelector('.hero .buttons');
    if (heroButtons && !heroButtons.querySelector('[data-archive-button]')) {
      const heroArchive = document.createElement('a');
      heroArchive.className = 'btn archive-button';
      heroArchive.href = '#digital-library';
      heroArchive.dataset.archiveButton = 'true';
      heroArchive.innerHTML = '📚 Digital Library & Archive';
      heroButtons.appendChild(heroArchive);
    }

    if (!document.getElementById('digital-library')) {
      const archiveSection = document.createElement('section');
      archiveSection.id = 'digital-library';
      archiveSection.className = 'digital-library-section';
      archiveSection.innerHTML = `
        <div class="section-title">
          <h2>Digital Library & Publications</h2>
          <div class="ar" lang="ar" dir="rtl">المكتبة الرقمية والمنشورات</div>
          <p>Open academic resources preserved and shared through Internet Archive.</p>
        </div>
        <div class="digital-library-card">
          <div class="digital-library-content">
            <span class="library-badge">📚 Open Academic Repository</span>
            <h3>Aouss Gabash Digital Library</h3>
            <p>
              Access books, lecture notes, research materials, archived publications,
              and educational resources related to artificial intelligence and electrical power systems.
            </p>
            <p class="library-ar" lang="ar" dir="rtl">
              الوصول إلى الكتب والملاحظات التعليمية والمواد البحثية والمنشورات المؤرشفة
              والمصادر العلمية المتعلقة بالذكاء الاصطناعي وأنظمة الطاقة الكهربائية.
            </p>
            <div class="library-resources" aria-label="Digital library resources">
              <span>📘 Books</span>
              <span>📄 Lecture Notes</span>
              <span>🧮 Engineering Resources</span>
              <span>🌐 Open Access</span>
            </div>
          </div>
          <div class="digital-library-action">
            <div class="library-symbol" aria-hidden="true">🏛️</div>
            <strong>Internet Archive Collection</strong>
            <span>External academic repository</span>
            <a href="${archiveUrl}" target="_blank" rel="noopener noreferrer">
              Open Digital Library ↗
            </a>
          </div>
        </div>`;

      const authorSection = document.getElementById('author');
      const container = document.querySelector('main > .container');
      if (authorSection && authorSection.parentNode) {
        authorSection.parentNode.insertBefore(archiveSection, authorSection);
      } else if (container) {
        container.appendChild(archiveSection);
      }
    }
  }

  const footer = document.createElement('footer');
  footer.className = 'site-footer course-footer';
  footer.innerHTML = `
    <div class="site-footer-inner">
      <div class="footer-title">AI Applications in Electrical Power Systems</div>
      <div class="footer-subtitle" lang="ar" dir="rtl">تطبيقات الذكاء الاصطناعي في أنظمة الطاقة الكهربائية</div>
      <div class="footer-links">
        <a href="index.html">Website</a>
        <a href="https://github.com/aoussgabash/AI-Electrical-Power-Systems" target="_blank" rel="noopener noreferrer">GitHub</a>
        <a href="${archiveUrl}" target="_blank" rel="noopener noreferrer">Internet Archive</a>
      </div>
      <div class="footer-info">${pageInfo}</div>
      <div class="footer-copy">© ${yearText} Aouss Gabash. All Rights Reserved.</div>
    </div>`;

  const existing = document.querySelector('footer');
  if (existing) existing.replaceWith(footer);
  else document.body.appendChild(footer);

  initMathRendering();
})();
