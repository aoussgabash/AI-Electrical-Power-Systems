(() => {
  'use strict';

  const COURSE_THEME_VERSION = '20260826-10';
  const COURSE_NAV_VERSION = '20260826-10';
  const page = location.pathname.split('/').pop()?.toLowerCase() || 'index.html';
  const isLecturePage = /^lecture\d{2}\.html$/.test(page);
  const isLabPage = /^lab\d{2}\.html$/.test(page);
  const isCourseContentPage = isLecturePage || isLabPage;

  const synchronizeHomepageCatalog = () => {
    if (page !== 'index.html' && page !== '') return;

    const actualLectures = {
      5:['Artificial Neural Networks','الشبكات العصبية الاصطناعية','Neurons, multilayer networks, forward propagation, backpropagation, and training.'],
      6:['Genetic Algorithms','الخوارزميات الجينية','Population-based evolutionary optimization for electrical-engineering problems.'],
      7:['Deep Learning','التعلم العميق','Deep neural architectures, feature learning, CNNs, RNNs, and engineering applications.'],
      11:['Graph Neural Networks for Power Systems','الشبكات العصبية البيانية في أنظمة القدرة الكهربائية','Topology-aware learning for state estimation, fault detection, stability, and smart grids.'],
      12:['Reinforcement Learning in Energy Management','التعلم المعزز في إدارة الطاقة','Sequential decision-making for batteries, microgrids, demand response, and grid control.'],
      13:['Explainable Artificial Intelligence','الذكاء الاصطناعي القابل للتفسير','SHAP, LIME, feature importance, and trustworthy engineering decisions.'],
      14:['Generative AI and Large Language Models','الذكاء الاصطناعي التوليدي والنماذج اللغوية الكبيرة','LLMs, embeddings, prompting, retrieval-augmented generation, and engineering assistants.'],
      15:['Multi-Agent AI for Smart Grids','الذكاء الاصطناعي متعدد الوكلاء للشبكات الذكية','Distributed coordination, consensus, negotiation, and cooperative grid control.'],
      16:['Digital Twins for Power Systems','التوأم الرقمي لأنظمة القدرة','Real-time synchronization, simulation, monitoring, and predictive maintenance.'],
      17:['Physics-Informed Artificial Intelligence','الذكاء الاصطناعي الموجّه بالفيزياء','Physics-informed neural networks, constraints, and dynamic-system learning.'],
      18:['Federated Learning for Smart Grids','التعلم الاتحادي للشبكات الذكية','Privacy-aware distributed learning across grid participants.'],
      19:['AI Cybersecurity for Power Systems','الأمن السيبراني المدعوم بالذكاء الاصطناعي لأنظمة القدرة','Attack detection, resilient AI, and cyber-physical security.'],
      20:['Autonomous AI Power Systems','أنظمة القدرة ذاتية التشغيل بالذكاء الاصطناعي','Integrated sensing, prediction, decision, safety, and autonomous control.']
    };

    const actualLabs = {
      2:['Fuzzy Logic Voltage Control','التحكم بالجهد باستخدام المنطق الضبابي'],
      3:['Machine Learning Load Forecasting','التنبؤ بالأحمال باستخدام تعلم الآلة'],
      4:['AI-Based PV Power Forecasting','التنبؤ بقدرة الأنظمة الكهروضوئية باستخدام الذكاء الاصطناعي'],
      5:['Genetic Algorithm for Economic Dispatch','الخوارزمية الجينية للتوزيع الاقتصادي'],
      6:['AI-Based Optimal Power Flow','تدفق القدرة الأمثل باستخدام الذكاء الاصطناعي'],
      7:['Battery Energy Storage Optimization','تحسين تشغيل أنظمة تخزين طاقة البطاريات'],
      8:['Integrated PV-Battery Smart Energy Management','الإدارة الذكية المتكاملة للطاقة الشمسية والبطاريات'],
      11:['Graph Neural Network for State Estimation','الشبكة العصبية البيانية لتقدير الحالة'],
      12:['Battery Scheduling with Deep Q-Learning','جدولة البطارية باستخدام التعلم العميق المعزز DQN'],
      13:['Explaining a Load-Forecasting Model','تفسير نموذج التنبؤ بالأحمال'],
      14:['Building a Power Engineering RAG Assistant','بناء مساعد هندسي معزز بالاسترجاع'],
      15:['Multi-Agent Energy Management','إدارة الطاقة متعددة الوكلاء'],
      16:['Building a Simple Digital Twin','بناء توأم رقمي مبسط'],
      17:['PINN Solution of the Swing Equation','حل معادلة التأرجح باستخدام PINN'],
      18:['Federated Learning Simulation','محاكاة التعلم الاتحادي'],
      19:['AI-Based Intrusion Detection','كشف التسلل باستخدام الذكاء الاصطناعي'],
      20:['Autonomous Microgrid Supervisor','مشرف ذاتي التشغيل لشبكة مصغرة']
    };

    document.querySelectorAll('.course-card').forEach(card => {
      const href = card.getAttribute('href') || '';
      const match = href.match(/^(lecture|lab)(\d{2})\.html$/i);
      if (!match) return;
      const type = match[1].toLowerCase();
      const number = Number(match[2]);
      const data = type === 'lecture' ? actualLectures[number] : actualLabs[number];
      if (!data) return;

      const title = card.querySelector('h3');
      const arabic = card.querySelector('.arabic');
      const description = card.querySelector('p');
      if (title) title.textContent = data[0];
      if (arabic) arabic.textContent = data[1];
      if (description) description.textContent = type === 'lecture'
        ? data[2]
        : 'Hands-on MATLAB laboratory with code, analysis, experiments, and student tasks.';

      card.dataset.search = `${data[0]} ${data[1]} ${type === 'lecture' ? data[2] : 'MATLAB laboratory code analysis experiments'}`.toLowerCase();
    });
  };

  const removeLegacyMarkup = () => {
    if (!isCourseContentPage) return;
    document.querySelectorAll('footer').forEach((footer) => footer.remove());
    document.documentElement.dataset.courseFooterCentralized = 'true';
  };

  const loadCourseTheme = () => {
    document.querySelectorAll('link[href^="course-theme.css"]').forEach(link => {
      link.href = `course-theme.css?v=${COURSE_THEME_VERSION}`;
      link.dataset.courseTheme = 'true';
    });

    if (!document.querySelector('link[data-course-theme]')) {
      const theme = document.createElement('link');
      theme.rel = 'stylesheet';
      theme.href = `course-theme.css?v=${COURSE_THEME_VERSION}`;
      theme.dataset.courseTheme = 'true';
      document.head.appendChild(theme);
    }

    removeLegacyMarkup();
  };

  const loadCentralComponents = () => {
    if (document.querySelector('script[data-ag-loader]')) return;
    const loader = document.createElement('script');
    loader.src = 'https://aoussgabash.com/assets/shared/ag-loader.js?v=20260824-3';
    loader.defer = true;
    loader.dataset.agLoader = 'true';
    document.body.appendChild(loader);
  };

  const reloadCourseNavigation = () => {
    if (!isCourseContentPage) return;

    document.querySelectorAll('.academic-course-banner,.course-action-panel,.course-metadata-bar,.academic-overview').forEach(panel => panel.remove());
    delete document.documentElement.dataset.courseNavigationReady;
    document.querySelectorAll('script[data-course-navigation-fresh],script[data-academic-overview]').forEach(script => script.remove());

    const navigation = document.createElement('script');
    navigation.src = `course-navigation.js?v=${COURSE_NAV_VERSION}`;
    navigation.defer = true;
    navigation.dataset.courseNavigationFresh = 'true';
    navigation.addEventListener('load', () => {
      const overview = document.createElement('script');
      overview.src = `academic-overview.js?v=${COURSE_NAV_VERSION}`;
      overview.defer = true;
      overview.dataset.academicOverview = 'true';
      document.body.appendChild(overview);
    }, {once:true});
    document.body.appendChild(navigation);
  };

  const startCourseFeatures = () => {
    synchronizeHomepageCatalog();
    if (!isCourseContentPage) return;

    loadCourseTheme();
    const finish = () => {
      loadCentralComponents();
      reloadCourseNavigation();
    };

    const existingLegacy = document.querySelector('script[data-course-legacy]');
    if (existingLegacy) {
      if (existingLegacy.dataset.loaded === 'true') finish();
      else {
        existingLegacy.addEventListener('load', finish, { once: true });
        existingLegacy.addEventListener('error', finish, { once: true });
      }
      return;
    }

    const courseFeatures = document.createElement('script');
    courseFeatures.src = 'course-footer-legacy.js?v=20260826-10';
    courseFeatures.defer = true;
    courseFeatures.dataset.courseLegacy = 'true';
    courseFeatures.addEventListener('load', () => {
      courseFeatures.dataset.loaded = 'true';
      finish();
    }, { once: true });
    courseFeatures.addEventListener('error', finish, { once: true });
    document.head.appendChild(courseFeatures);
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', startCourseFeatures, { once: true });
  else startCourseFeatures();
})();
