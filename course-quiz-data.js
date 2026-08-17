(() => {
  'use strict';

  const letters = ['a','b','c','d'];
  const Q = (en, ar, correctIndex, options, explanation) => ({
    en, ar,
    options: options.map((option, index) => [letters[index], option[0], option[1]]),
    correct: letters[correctIndex],
    explanation
  });

  const quizBank = {
    lecture01: { questions: [
      Q('Which statement best describes Artificial Intelligence?','أي عبارة تصف الذكاء الاصطناعي بصورة أفضل؟',1,[['Only numerical calculation','الحسابات العددية فقط'],['Systems performing tasks associated with human intelligence','أنظمة تنفذ مهام مرتبطة بالذكاء البشري'],['A type of generator','نوع من المولدات'],['A passive database','قاعدة بيانات سلبية']],'AI includes learning, reasoning, perception, and decision-making. | يشمل الذكاء الاصطناعي التعلم والاستدلال والإدراك واتخاذ القرار.'),
      Q('What is the correct relationship among AI, ML, and Deep Learning?','ما العلاقة الصحيحة بين AI وML والتعلم العميق؟',1,[['AI is a subset of Deep Learning','الذكاء الاصطناعي فرع من التعلم العميق'],['Deep Learning is within ML, and ML is within AI','التعلم العميق ضمن التعلم الآلي، والتعلم الآلي ضمن الذكاء الاصطناعي'],['They are unrelated','لا توجد علاقة بينها'],['They are identical','كلها متطابقة']],'Deep Learning is a specialized part of Machine Learning. | التعلم العميق جزء متخصص من التعلم الآلي.'),
      Q('Why is AI useful in power systems?','لماذا يفيد الذكاء الاصطناعي في أنظمة القدرة؟',1,[['Power systems never change','أنظمة القدرة لا تتغير'],['It handles complex, uncertain, data-rich problems','يعالج المسائل المعقدة وغير المؤكدة والغنية بالبيانات'],['It removes all measurements','يلغي جميع القياسات'],['It guarantees perfect predictions','يضمن تنبؤات مثالية']],'AI can complement physical models in nonlinear and uncertain problems. | يمكن للذكاء الاصطناعي أن يكمّل النماذج الفيزيائية في المسائل اللاخطية وغير المؤكدة.'),
      Q('Which is an intelligent agent?','أي مما يلي وكيل ذكي؟',0,[['A controller that senses and selects actions','متحكم يستشعر ويختار الأفعال'],['A disconnected wire','سلك غير موصول'],['A fixed label','تسمية ثابتة'],['A passive resistor','مقاومة سلبية']],'An agent perceives its environment and acts toward a goal. | يستشعر الوكيل بيئته ويتصرف لتحقيق هدف.'),
      Q('Which is a realistic AI application in power engineering?','أي تطبيق واقعي للذكاء الاصطناعي في هندسة القدرة؟',0,[['Load forecasting and fault detection','التنبؤ بالحمل وكشف الأعطال'],['Changing the speed of light','تغيير سرعة الضوء'],['Removing all losses by software','إلغاء جميع الفواقد برمجيًا'],['Operating without data','العمل دون بيانات']],'Forecasting and fault detection are established AI applications. | التنبؤ وكشف الأعطال من تطبيقات الذكاء الاصطناعي المعروفة.')
    ]},

    lecture02: { questions: [
      Q('What does an intelligent agent use to perceive its environment?','ماذا يستخدم الوكيل الذكي لإدراك بيئته؟',0,[['Sensors','الحساسات'],['Only actuators','المشغلات فقط'],['Transformers only','المحولات فقط'],['Static labels','التسميات الثابتة']],'Sensors provide observations from the environment. | توفر الحساسات ملاحظات عن البيئة.'),
      Q('In a search problem, what defines a goal state?','في مسألة البحث، ما الذي يحدد حالة الهدف؟',2,[['The first generated state','أول حالة مولدة'],['The most expensive state','الحالة الأعلى تكلفة'],['A state satisfying the goal test','حالة تحقق اختبار الهدف'],['Any repeated state','أي حالة مكررة']],'The goal test determines whether a state solves the problem. | يحدد اختبار الهدف ما إذا كانت الحالة تحل المسألة.'),
      Q('Which search uses an estimate of remaining cost?','أي خوارزمية بحث تستخدم تقديرًا للتكلفة المتبقية؟',1,[['Breadth-first search only','البحث بعرض الشجرة فقط'],['A* search','بحث A*'],['Random search','البحث العشوائي'],['Depth limit only','حد العمق فقط']],'A* combines path cost g(n) with heuristic h(n). | يجمع A* تكلفة المسار g(n) مع الدالة الإرشادية h(n).'),
      Q('An admissible heuristic must be:','يجب أن تكون الدالة الإرشادية المقبولة:',0,[['Never greater than the true remaining cost','لا تتجاوز التكلفة الحقيقية المتبقية'],['Always negative','سالبة دائمًا'],['Equal to zero only','تساوي صفرًا فقط'],['Randomly selected','مختارة عشوائيًا']],'Admissibility means the heuristic does not overestimate. | المقبولية تعني أن الدالة لا تبالغ في التقدير.'),
      Q('What may represent a state in battery scheduling?','ما الذي قد يمثل حالة في جدولة البطارية؟',3,[['Only the battery color','لون البطارية فقط'],['The webpage title','عنوان الصفحة'],['A fixed logo','شعار ثابت'],['SOC, time, load, and price','حالة الشحن والزمن والحمل والسعر']],'A useful state contains variables needed for decision-making. | تتضمن الحالة المفيدة المتغيرات اللازمة لاتخاذ القرار.')
    ]},

    lecture03: { questions: [
      Q('A fuzzy membership value normally lies in:','تقع قيمة الانتماء الضبابي عادة ضمن:',1,[['−1 to 1','من −1 إلى 1'],['0 to 1','من 0 إلى 1'],['0 to 1000','من 0 إلى 1000'],['Only 0 or 1','فقط 0 أو 1']],'Fuzzy membership expresses partial belonging between 0 and 1. | تعبّر درجة الانتماء عن انتماء جزئي بين 0 و1.'),
      Q('What is a fuzzy rule?','ما هي القاعدة الضبابية؟',0,[['An IF–THEN relation','علاقة إذا–فإن'],['A Fourier transform','تحويل فورييه'],['A random number','عدد عشوائي'],['A circuit breaker','قاطع كهربائي']],'Fuzzy systems encode expert knowledge using IF–THEN rules. | ترمز الأنظمة الضبابية خبرة المختص بقواعد إذا–فإن.'),
      Q('Defuzzification converts:','تحول إزالة الضبابية:',2,[['A crisp input into text','دخلاً محددًا إلى نص'],['AC into DC','التيار المتناوب إلى مستمر'],['A fuzzy output into a crisp value','خرجًا ضبابيًا إلى قيمة محددة'],['A graph into a matrix only','رسمًا إلى مصفوفة فقط']],'Defuzzification produces a usable numerical control output. | تنتج إزالة الضبابية خرج تحكم عدديًا قابلاً للاستخدام.'),
      Q('Which is a common membership-function shape?','أي شكل شائع لدالة الانتماء؟',1,[['Prime-number shape','شكل الأعداد الأولية'],['Triangular','مثلثي'],['Infinite discontinuity','انقطاع لا نهائي'],['No shape','دون شكل']],'Triangular and trapezoidal membership functions are common. | الدوال المثلثية وشبه المنحرفة شائعة.'),
      Q('Why is fuzzy control attractive?','لماذا يعد التحكم الضبابي جذابًا؟',3,[['It needs no variables','لا يحتاج متغيرات'],['It always proves global optimality','يثبت المثالية العالمية دائمًا'],['It removes physical limits','يلغي الحدود الفيزيائية'],['It handles linguistic expert knowledge and uncertainty','يعالج الخبرة اللغوية وعدم اليقين']],'Fuzzy control is useful when expert rules are available and exact models are difficult. | يفيد التحكم الضبابي عند توفر قواعد خبرة وصعوبة النموذج الدقيق.')
    ]},

    lecture04: { questions: [
      Q('Supervised learning requires:','يتطلب التعلم المراقب:',0,[['Labeled input-output examples','أمثلة دخل وخرج موسومة'],['No data','عدم وجود بيانات'],['Only unlabeled clusters','عناقيد غير موسومة فقط'],['A physical switch only','مفتاحًا فيزيائيًا فقط']],'Supervised models learn mappings from labeled examples. | تتعلم النماذج المراقبة العلاقة من أمثلة موسومة.'),
      Q('Which is a regression task?','أي مما يلي مسألة انحدار؟',2,[['Classifying a fault type','تصنيف نوع العطل'],['Detecting spam','كشف الرسائل المزعجة'],['Predicting tomorrow’s load in MW','التنبؤ بحمل الغد بالميغاواط'],['Choosing a label only','اختيار تسمية فقط']],'Regression predicts continuous numerical values. | يتنبأ الانحدار بقيم عددية مستمرة.'),
      Q('Why separate training and test data?','لماذا نفصل بيانات التدريب والاختبار؟',1,[['To increase file size','لزيادة حجم الملف'],['To evaluate generalization on unseen data','لتقييم التعميم على بيانات غير مرئية'],['To remove all errors','لإلغاء جميع الأخطاء'],['To avoid learning','لتجنب التعلم']],'A test set estimates performance on unseen examples. | تقدر مجموعة الاختبار الأداء على أمثلة لم يرها النموذج.'),
      Q('Overfitting means:','يعني فرط التوافق:',3,[['The model cannot run','النموذج لا يعمل'],['The data have no units','البيانات بلا وحدات'],['The model is always linear','النموذج خطي دائمًا'],['Excellent training fit but poor unseen-data performance','توافق ممتاز مع التدريب وأداء ضعيف على بيانات جديدة']],'Overfitting captures noise instead of general patterns. | يلتقط فرط التوافق الضجيج بدل الأنماط العامة.'),
      Q('Which metric is common for regression?','أي مقياس شائع للانحدار؟',0,[['RMSE','RMSE'],['Confusion matrix only','مصفوفة الالتباس فقط'],['Number of classes','عدد الأصناف'],['Voting count','عدد الأصوات']],'RMSE measures the magnitude of prediction errors. | يقيس RMSE مقدار أخطاء التنبؤ.')
    ]},

    lecture05: { questions: [
      Q('Unsupervised learning mainly uses:','يستخدم التعلم غير المراقب أساسًا:',1,[['Only labeled targets','الأهداف الموسومة فقط'],['Unlabeled data','بيانات غير موسومة'],['No observations','دون ملاحظات'],['Only control signals','إشارات التحكم فقط']],'Unsupervised learning discovers structure without target labels. | يكتشف التعلم غير المراقب البنية دون تسميات هدف.'),
      Q('What is the main aim of clustering?','ما الهدف الأساسي من التجميع؟',0,[['Group similar samples','تجميع العينات المتشابهة'],['Predict one exact voltage','التنبؤ بجهد واحد دقيق'],['Solve Kirchhoff equations directly','حل معادلات كيرشوف مباشرة'],['Encrypt data','تشفير البيانات']],'Clustering organizes samples according to similarity. | ينظم التجميع العينات وفق التشابه.'),
      Q('K-means requires the user to select:','يتطلب K-means من المستخدم تحديد:',2,[['The transformer ratio','نسبة المحول'],['The learning certificate','شهادة التعلم'],['The number of clusters K','عدد العناقيد K'],['The browser language','لغة المتصفح']],'K is a required hyperparameter in standard K-means. | يمثل K معاملًا فائقًا مطلوبًا في K-means.'),
      Q('PCA is mainly used for:','يستخدم PCA أساسًا من أجل:',3,[['Increasing labels','زيادة التسميات'],['Creating physical power','توليد قدرة فيزيائية'],['Replacing measurements with guesses','استبدال القياسات بالتخمين'],['Dimensionality reduction','تخفيض الأبعاد']],'PCA projects data onto directions of greatest variance. | يسقط PCA البيانات على اتجاهات أعلى تباين.'),
      Q('An anomaly is typically:','تكون القيمة الشاذة عادة:',1,[['A frequent normal pattern','نمطًا طبيعيًا متكررًا'],['A sample differing strongly from normal behavior','عينة تختلف كثيرًا عن السلوك الطبيعي'],['A required cluster center','مركز عنقود مطلوبًا'],['A fixed unit conversion','تحويل وحدات ثابتًا']],'Anomaly detection identifies unusual observations. | يحدد كشف الشذوذ الملاحظات غير المعتادة.')
    ]},

    lecture06: { questions: [
      Q('A neuron first computes a weighted sum and then applies:','تحسب العصبونة أولًا مجموعًا موزونًا ثم تطبق:',2,[['A circuit breaker','قاطعًا كهربائيًا'],['A database join','دمج قاعدة بيانات'],['An activation function','دالة تفعيل'],['A random label only','تسمية عشوائية فقط']],'The activation function introduces nonlinearity. | تضيف دالة التفعيل اللاخطية.'),
      Q('Backpropagation computes:','يحسب الانتشار العكسي:',0,[['Gradients of the loss with respect to parameters','تدرجات الخسارة بالنسبة للمعاملات'],['Only input voltages','جهود الدخل فقط'],['Cluster labels','تسميات العناقيد'],['Power-factor correction directly','تصحيح معامل القدرة مباشرة']],'Backpropagation applies the chain rule to obtain gradients. | يستخدم الانتشار العكسي قاعدة السلسلة لحساب التدرجات.'),
      Q('What does the learning rate control?','ماذا يتحكم معدل التعلم؟',1,[['Number of input variables','عدد متغيرات الدخل'],['Step size of parameter updates','حجم خطوة تحديث المعاملات'],['Number of power lines','عدد خطوط القدرة'],['Sampling unit','وحدة أخذ العينات']],'The learning rate determines how far parameters move per update. | يحدد معدل التعلم مقدار تغير المعاملات في كل تحديث.'),
      Q('Why use hidden layers?','لماذا نستخدم الطبقات المخفية؟',3,[['To remove all data','لحذف جميع البيانات'],['To make outputs constant','لجعل الخرج ثابتًا'],['To avoid any training','لتجنب التدريب'],['To learn nonlinear representations','لتعلم تمثيلات لاخطية']],'Hidden layers allow networks to model complex relationships. | تمكّن الطبقات المخفية الشبكة من نمذجة علاقات معقدة.'),
      Q('Which problem may indicate vanishing gradients?','أي مشكلة قد تشير إلى تلاشي التدرجات؟',0,[['Early layers learn very slowly','الطبقات الأولى تتعلم ببطء شديد'],['The dataset has labels','البيانات موسومة'],['The output has units','للخرج وحدات'],['The model uses a bias','النموذج يستخدم انحيازًا']],'Very small gradients hinder learning in early layers. | تعيق التدرجات الصغيرة جدًا تعلم الطبقات الأولى.')
    ]},

    lecture07: { questions: [
      Q('In a genetic algorithm, a chromosome represents:','في الخوارزمية الجينية يمثل الكروموسوم:',1,[['Only a random error','خطأً عشوائيًا فقط'],['A candidate solution','حلًا مرشحًا'],['A fixed theorem','مبرهنة ثابتة'],['A sensor failure','عطل حساس']],'Each chromosome encodes one candidate solution. | يرمز كل كروموسوم إلى حل مرشح.'),
      Q('The fitness function measures:','تقيس دالة الملاءمة:',0,[['Solution quality','جودة الحل'],['Cable temperature only','درجة حرارة الكبل فقط'],['Browser speed','سرعة المتصفح'],['Number of comments','عدد التعليقات']],'Fitness ranks candidate solutions according to the objective. | ترتب الملاءمة الحلول وفق الهدف.'),
      Q('Crossover is used to:','يستخدم العبور من أجل:',2,[['Delete all parents','حذف جميع الآباء'],['Set every gene to zero','تصفير جميع الجينات'],['Combine information from parents','دمج معلومات من الآباء'],['Calculate a Fourier series','حساب سلسلة فورييه']],'Crossover creates offspring by recombining parent genes. | ينتج العبور أفرادًا جديدة بدمج جينات الآباء.'),
      Q('Mutation primarily helps to:','تساعد الطفرة أساسًا على:',3,[['Guarantee one fixed answer','ضمان جواب ثابت'],['Remove diversity','إزالة التنوع'],['Stop after one generation','التوقف بعد جيل واحد'],['Maintain diversity and explore new regions','الحفاظ على التنوع واستكشاف مناطق جديدة']],'Mutation reduces premature convergence by introducing variation. | تقلل الطفرة التقارب المبكر بإضافة تنوع.'),
      Q('Which is a suitable GA application?','أي تطبيق مناسب للخوارزمية الجينية؟',1,[['Displaying a static title','عرض عنوان ثابت'],['Optimizing placement or scheduling','تحسين التوضع أو الجدولة'],['Measuring voltage without a sensor','قياس الجهد دون حساس'],['Changing physical constants','تغيير الثوابت الفيزيائية']],'GAs are useful for combinatorial and nonlinear optimization. | تفيد الخوارزميات الجينية في مسائل التحسين التوافقي واللاخطي.')
    ]},

    lecture08: { questions: [
      Q('Fairness in AI concerns:','تتعلق العدالة في الذكاء الاصطناعي بـ:',0,[['Avoiding unjustified discrimination','تجنب التمييز غير المبرر'],['Maximizing file size','تعظيم حجم الملف'],['Using only one sensor','استخدام حساس واحد فقط'],['Removing documentation','حذف التوثيق']],'Fairness seeks equitable treatment across relevant groups. | تسعى العدالة إلى معاملة منصفة للمجموعات المعنية.'),
      Q('Why is transparency important?','لماذا تعد الشفافية مهمة؟',2,[['It makes every model linear','تجعل كل نموذج خطيًا'],['It removes cybersecurity needs','تلغي الحاجة للأمن السيبراني'],['It supports understanding and accountability','تدعم الفهم والمساءلة'],['It guarantees zero error','تضمن انعدام الخطأ']],'Transparency helps stakeholders understand decisions and responsibilities. | تساعد الشفافية أصحاب المصلحة على فهم القرارات والمسؤوليات.'),
      Q('Data privacy requires:','تتطلب خصوصية البيانات:',1,[['Publishing all personal data','نشر جميع البيانات الشخصية'],['Protecting sensitive information and limiting use','حماية المعلومات الحساسة وتقييد استخدامها'],['Ignoring consent','تجاهل الموافقة'],['Removing encryption','إلغاء التشفير']],'Privacy controls collection, access, and use of sensitive data. | تضبط الخصوصية جمع البيانات الحساسة والوصول إليها واستخدامها.'),
      Q('Human oversight is especially important when:','تكون الرقابة البشرية مهمة خصوصًا عندما:',3,[['The page has a logo','تحتوي الصفحة شعارًا'],['The model predicts a harmless color','يتنبأ النموذج بلون غير مؤذٍ'],['The calculation is 1+1','الحساب هو 1+1'],['Decisions affect safety-critical operation','تؤثر القرارات في تشغيل حرج للسلامة']],'Safety-critical AI should support, not eliminate, responsible human control. | يجب أن يدعم الذكاء الاصطناعي الحرج للسلامة التحكم البشري المسؤول.'),
      Q('A responsible AI process includes:','تتضمن عملية الذكاء الاصطناعي المسؤول:',0,[['Risk assessment, monitoring, and documentation','تقييم المخاطر والمراقبة والتوثيق'],['Only model accuracy','دقة النموذج فقط'],['No testing','عدم الاختبار'],['No stakeholder input','عدم إشراك أصحاب المصلحة']],'Responsible AI considers the full lifecycle, not accuracy alone. | ينظر الذكاء الاصطناعي المسؤول إلى دورة الحياة كاملة لا إلى الدقة وحدها.')
    ]},

    lecture09: { questions: [
      Q('Why is an LSTM useful for load forecasting?','لماذا يفيد LSTM في التنبؤ بالحمل؟',1,[['It ignores time order','يتجاهل ترتيب الزمن'],['It models temporal dependencies','ينمذج الاعتماديات الزمنية'],['It only clusters data','يجمع البيانات فقط'],['It requires no training','لا يحتاج تدريبًا']],'LSTMs retain relevant information across time steps. | يحتفظ LSTM بالمعلومات المهمة عبر الخطوات الزمنية.'),
      Q('A CNN is especially effective at learning:','تكون CNN فعالة خصوصًا في تعلم:',2,[['Only exact equations','المعادلات الدقيقة فقط'],['Random labels','التسميات العشوائية'],['Local patterns through convolution','الأنماط المحلية عبر الالتفاف'],['No features','عدم وجود ميزات']],'Convolution detects local structures and shared patterns. | يكتشف الالتفاف البنى المحلية والأنماط المشتركة.'),
      Q('What is an epoch?','ما هو العصر التدريبي Epoch؟',0,[['One full pass through the training data','مرور كامل على بيانات التدريب'],['One input feature','ميزة دخل واحدة'],['One physical hour always','ساعة فيزيائية دائمًا'],['One cluster center','مركز عنقود واحد']],'An epoch is one complete traversal of the training set. | العصر هو مرور كامل على مجموعة التدريب.'),
      Q('Dropout is commonly used to:','يستخدم Dropout عادة من أجل:',3,[['Increase all weights','زيادة جميع الأوزان'],['Remove the target','حذف الهدف'],['Guarantee exact forecasts','ضمان تنبؤات دقيقة تمامًا'],['Reduce overfitting','تقليل فرط التوافق']],'Dropout regularizes the network by randomly disabling units during training. | ينظم Dropout الشبكة بتعطيل وحدات عشوائيًا أثناء التدريب.'),
      Q('For time-series validation, data should usually be split:','في التحقق من السلاسل الزمنية، تقسم البيانات عادة:',1,[['Randomly without regard to time','عشوائيًا دون اعتبار الزمن'],['Chronologically','زمنيًا'],['By color','حسب اللون'],['By filename length','حسب طول اسم الملف']],'Chronological splitting avoids leaking future information into training. | يمنع التقسيم الزمني تسرب معلومات المستقبل إلى التدريب.')
    ]},

    lecture10: { questions: [
      Q('The attention mechanism computes relevance between:','تحسب آلية الانتباه الصلة بين:',0,[['Queries and keys','الاستعلامات والمفاتيح'],['Only labels and filenames','التسميات وأسماء الملفات فقط'],['Transformers and circuit breakers','المحولات والقواطع'],['Clusters and voltmeters','العناقيد والفولتميترات']],'Attention compares queries with keys to weight values. | يقارن الانتباه الاستعلامات بالمفاتيح لوزن القيم.'),
      Q('What does self-attention allow each time step to do?','ماذا يتيح الانتباه الذاتي لكل خطوة زمنية؟',2,[['Ignore all other steps','تجاهل جميع الخطوات الأخرى'],['Use only the previous step','استخدام الخطوة السابقة فقط'],['Attend to other relevant positions','الانتباه إلى المواضع الأخرى ذات الصلة'],['Delete the input sequence','حذف سلسلة الدخل']],'Self-attention captures long-range dependencies directly. | يلتقط الانتباه الذاتي الاعتماديات بعيدة المدى مباشرة.'),
      Q('Why are positional encodings needed?','لماذا نحتاج الترميز الموضعي؟',1,[['To increase voltage','لزيادة الجهد'],['To represent sequence order','لتمثيل ترتيب السلسلة'],['To choose cluster count','لاختيار عدد العناقيد'],['To encrypt files','لتشفير الملفات']],'Attention alone has no built-in notion of order. | لا يمتلك الانتباه وحده مفهومًا داخليًا للترتيب.'),
      Q('Multi-head attention enables the model to:','يتيح الانتباه متعدد الرؤوس للنموذج:',3,[['Use no parameters','عدم استخدام معاملات'],['Process only one feature','معالجة ميزة واحدة فقط'],['Always output a constant','إخراج ثابت دائمًا'],['Learn different relationships in parallel','تعلم علاقات مختلفة بالتوازي']],'Different heads can focus on different temporal or feature relationships. | يمكن للرؤوس المختلفة التركيز على علاقات زمنية أو ميزات مختلفة.'),
      Q('A transformer advantage over a basic RNN is:','من مزايا Transformer على RNN الأساسي:',0,[['Greater parallelism during training','توازٍ أكبر أثناء التدريب'],['No need for data','عدم الحاجة للبيانات'],['Guaranteed zero error','ضمان خطأ صفري'],['No computation','عدم وجود حسابات']],'Transformers process sequence positions in parallel during training. | تعالج المحولات مواضع السلسلة بالتوازي أثناء التدريب.')
    ]},

    lecture11: { questions: [
      Q('In a power-system graph, buses are naturally represented as:','في بيان نظام القدرة، تمثل العقد الكهربائية طبيعيًا على أنها:',0,[['Nodes','عقد'],['Loss functions','دوال خسارة'],['Epochs','عصور تدريب'],['Passwords','كلمات مرور']],'Buses are nodes, while lines or transformers form edges. | تمثل العقد الكهربائية كعقد، والخطوط أو المحولات كحواف.'),
      Q('Message passing in a GNN means:','يعني تمرير الرسائل في GNN:',2,[['Sending emails','إرسال رسائل إلكترونية'],['Changing physical line length','تغيير طول الخط الفيزيائي'],['Aggregating information from neighboring nodes','تجميع معلومات العقد المجاورة'],['Deleting the graph','حذف البيان']],'GNN layers update node representations using neighbor information. | تحدث طبقات GNN تمثيلات العقد باستخدام معلومات الجيران.'),
      Q('Why are GNNs suitable for power systems?','لماذا تناسب GNN أنظمة القدرة؟',1,[['They ignore network structure','تتجاهل بنية الشبكة'],['They explicitly use topology','تستخدم طوبولوجيا الشبكة صراحة'],['They need no measurements','لا تحتاج قياسات'],['They only process images','تعالج الصور فقط']],'Power grids have an inherent graph structure. | تمتلك شبكات القدرة بنية بيانية طبيعية.'),
      Q('A graph-level task produces:','تنتج مهمة على مستوى البيان:',3,[['One value for each pixel','قيمة لكل بكسل'],['Only edge names','أسماء الحواف فقط'],['One password per node','كلمة مرور لكل عقدة'],['An output describing the whole graph','خرجًا يصف البيان كاملًا']],'Graph-level prediction summarizes the entire network. | يصف التنبؤ على مستوى البيان الشبكة كاملة.'),
      Q('Permutation invariance means aggregation should:','تعني عدم الحساسية للترتيب أن التجميع يجب أن:',0,[['Give the same result regardless of neighbor ordering','يعطي النتيجة نفسها مهما كان ترتيب الجيران'],['Depend on file order','يعتمد على ترتيب الملفات'],['Use only one neighbor','يستخدم جارًا واحدًا فقط'],['Reverse every edge','يعكس كل حافة']],'Neighbor ordering should not change the graph representation. | يجب ألا يغير ترتيب الجيران تمثيل البيان.')
    ]},

    lecture12: { questions: [
      Q('In reinforcement learning, the agent learns through:','في التعلم المعزز، يتعلم الوكيل من خلال:',1,[['Only labeled tables','جداول موسومة فقط'],['Interaction and rewards','التفاعل والمكافآت'],['No feedback','دون تغذية راجعة'],['Static clustering','تجميع ثابت']],'The agent improves its policy using reward feedback from interaction. | يحسن الوكيل سياسته باستخدام مكافآت التفاعل.'),
      Q('A policy maps:','تربط السياسة:',0,[['States to actions','الحالات بالأفعال'],['Files to colors','الملفات بالألوان'],['Voltages to passwords','الجهود بكلمات المرور'],['Clusters to labels only','العناقيد بالتسميات فقط']],'A policy specifies which action to take in a state. | تحدد السياسة الفعل الواجب اتخاذه في حالة معينة.'),
      Q('The discount factor controls:','يتحكم معامل الخصم في:',2,[['Number of sensors','عدد الحساسات'],['Battery voltage units','وحدات جهد البطارية'],['Importance of future rewards','أهمية المكافآت المستقبلية'],['Graph edge count','عدد حواف البيان']],'A larger discount factor gives more weight to future rewards. | يعطي معامل الخصم الأكبر وزنًا أعلى للمكافآت المستقبلية.'),
      Q('Exploration means:','يعني الاستكشاف:',3,[['Always choosing the current best action','اختيار أفضل فعل حالي دائمًا'],['Stopping training','إيقاف التدريب'],['Ignoring rewards','تجاهل المكافآت'],['Trying actions to gain information','تجربة أفعال لاكتساب معلومات']],'Exploration discovers potentially better actions. | يساعد الاستكشاف على اكتشاف أفعال أفضل محتملة.'),
      Q('A useful reward for battery scheduling may include:','قد تتضمن مكافأة مفيدة لجدولة البطارية:',0,[['Negative energy cost and constraint penalties','سالب تكلفة الطاقة وعقوبات القيود'],['Only battery color','لون البطارية فقط'],['Page loading speed','سرعة تحميل الصفحة'],['Random text length','طول نص عشوائي']],'The reward should represent cost, constraints, and operational objectives. | يجب أن تمثل المكافأة التكلفة والقيود والأهداف التشغيلية.')
    ]},

    lecture13: { questions: [
      Q('Explainable AI primarily aims to:','يهدف الذكاء الاصطناعي القابل للتفسير أساسًا إلى:',1,[['Hide model behavior','إخفاء سلوك النموذج'],['Make model decisions understandable','جعل قرارات النموذج قابلة للفهم'],['Increase file size','زيادة حجم الملف'],['Remove validation','إلغاء التحقق']],'XAI helps users understand why a model produced an output. | يساعد XAI المستخدمين على فهم سبب خرج النموذج.'),
      Q('SHAP values are based on ideas from:','تعتمد قيم SHAP على أفكار من:',2,[['Circuit theory only','نظرية الدارات فقط'],['Fourier optics','بصريات فورييه'],['Cooperative game theory','نظرية الألعاب التعاونية'],['Database indexing','فهرسة قواعد البيانات']],'SHAP attributes a prediction using Shapley values. | ينسب SHAP التنبؤ إلى الميزات باستخدام قيم شابلي.'),
      Q('A local explanation describes:','يصف التفسير المحلي:',0,[['One specific prediction','تنبؤًا محددًا واحدًا'],['Only the entire dataset average','متوسط البيانات كاملة فقط'],['A physical cable','كبلًا فيزيائيًا'],['A browser setting','إعداد متصفح']],'Local explanations focus on an individual decision. | تركز التفسيرات المحلية على قرار فردي.'),
      Q('Feature importance alone may be misleading because it may not show:','قد تكون أهمية الميزات مضللة لأنها قد لا تظهر:',3,[['The model name','اسم النموذج'],['The number of files','عدد الملفات'],['The webpage language','لغة الصفحة'],['Direction, interactions, or causality','الاتجاه أو التفاعلات أو السببية']],'Importance scores do not automatically imply causal effects. | لا تعني درجات الأهمية تأثيرًا سببيًا تلقائيًا.'),
      Q('Why is XAI valuable in power-system operation?','لماذا يفيد XAI في تشغيل أنظمة القدرة؟',1,[['It eliminates operators','يلغي المشغلين'],['It supports trust, diagnosis, and validation','يدعم الثقة والتشخيص والتحقق'],['It guarantees no faults','يضمن عدم وجود أعطال'],['It replaces all protection','يستبدل جميع الحمايات']],'Explanations help engineers assess whether predictions are technically plausible. | تساعد التفسيرات المهندسين على تقييم معقولية التنبؤات تقنيًا.')
    ]},

    lecture14: { questions: [
      Q('A large language model mainly predicts:','يتنبأ النموذج اللغوي الكبير أساسًا بـ:',0,[['The next token distribution','توزيع الرمز التالي'],['Physical line impedance directly','ممانعة الخط مباشرة'],['A cluster center only','مركز عنقود فقط'],['The speed of light','سرعة الضوء']],'LLMs are trained to model token sequences. | تدرب النماذج اللغوية على نمذجة تسلسل الرموز.'),
      Q('What is an embedding?','ما هو التضمين Embedding؟',2,[['A circuit breaker state','حالة قاطع'],['A printed certificate','شهادة مطبوعة'],['A numerical vector representing meaning or features','متجه عددي يمثل المعنى أو الميزات'],['A fixed voltage level','مستوى جهد ثابت']],'Embeddings map items into a continuous vector space. | تحول التضمينات العناصر إلى فضاء متجهي مستمر.'),
      Q('RAG combines generation with:','يجمع RAG التوليد مع:',1,[['Random mutation','طفرة عشوائية'],['Retrieval from an external knowledge source','استرجاع من مصدر معرفة خارجي'],['No context','عدم وجود سياق'],['Only image filtering','ترشيح الصور فقط']],'Retrieval-augmented generation grounds responses in retrieved documents. | يعزز RAG الإجابات بوثائق مسترجعة.'),
      Q('A hallucination is:','الهلوسة في النموذج هي:',3,[['A verified citation','مرجع موثوق'],['A physical fault','عطل فيزيائي'],['A successful optimization','تحسين ناجح'],['A plausible-sounding but unsupported statement','عبارة تبدو مقنعة لكنها غير مدعومة']],'LLMs may generate fluent text that is factually unsupported. | قد تولد النماذج نصًا سلسًا غير مدعوم بالحقائق.'),
      Q('A safe engineering assistant should:','يجب على المساعد الهندسي الآمن أن:',0,[['Show sources and communicate uncertainty','يعرض المصادر ويوضح عدم اليقين'],['Always claim certainty','يدعي اليقين دائمًا'],['Ignore technical standards','يتجاهل المعايير التقنية'],['Execute control actions without review','ينفذ إجراءات التحكم دون مراجعة']],'Grounding, citations, and human review reduce risk. | يقلل الاستناد إلى المصادر والمراجعة البشرية المخاطر.')
    ]},

    lecture15: { questions: [
      Q('A multi-agent system contains:','يحتوي النظام متعدد الوكلاء على:',1,[['One fixed resistor','مقاومة ثابتة واحدة'],['Multiple interacting autonomous agents','وكلاء مستقلين متعددين ومتفاعلين'],['Only one database row','صف قاعدة بيانات واحد'],['No communication','عدم وجود تواصل']],'Multiple agents coordinate or compete while pursuing objectives. | يتعاون أو يتنافس عدة وكلاء لتحقيق أهداف.'),
      Q('Consensus algorithms aim to:','تهدف خوارزميات الإجماع إلى:',0,[['Reach agreement among agents','الوصول إلى اتفاق بين الوكلاء'],['Increase voltage indefinitely','زيادة الجهد بلا حدود'],['Remove all communication','إلغاء جميع الاتصالات'],['Randomize every decision','عشوائية كل قرار']],'Consensus drives agent states or estimates toward agreement. | يدفع الإجماع حالات أو تقديرات الوكلاء نحو الاتفاق.'),
      Q('Distributed control is attractive because it can:','يعد التحكم الموزع جذابًا لأنه يمكن أن:',2,[['Require one perfect central computer only','يتطلب حاسوبًا مركزيًا مثاليًا فقط'],['Ignore local information','يتجاهل المعلومات المحلية'],['Improve scalability and resilience','يحسن قابلية التوسع والمرونة'],['Eliminate all delays','يلغي جميع التأخيرات']],'Distributed architectures reduce reliance on a single central point. | تقلل البنى الموزعة الاعتماد على نقطة مركزية واحدة.'),
      Q('A communication delay may cause:','قد يسبب تأخير الاتصال:',3,[['Instant perfect coordination','تنسيقًا مثاليًا فوريًا'],['No effect in any system','عدم أي تأثير'],['More labels','مزيدًا من التسميات'],['Outdated information and degraded coordination','معلومات قديمة وتدهور التنسيق']],'Delayed messages can impair distributed decisions. | قد تضعف الرسائل المتأخرة القرارات الموزعة.'),
      Q('In a smart grid, an agent could represent:','في الشبكة الذكية، يمكن أن يمثل الوكيل:',0,[['A battery, building, microgrid, or market participant','بطارية أو مبنى أو شبكة مصغرة أو مشاركًا في السوق'],['Only a webpage color','لون صفحة فقط'],['A punctuation mark','علامة ترقيم'],['A constant with no action','ثابتًا دون فعل']],'Grid assets and participants can be modeled as decision-making agents. | يمكن نمذجة أصول الشبكة ومشاركيها كوكلاء يتخذون قرارات.')
    ]},

    lecture16: { questions: [
      Q('A digital twin is best described as:','أفضل وصف للتوأم الرقمي هو:',1,[['A static picture only','صورة ثابتة فقط'],['A synchronized digital representation of a physical asset or system','تمثيل رقمي متزامن لأصل أو نظام فيزيائي'],['A second physical transformer','محول فيزيائي ثانٍ'],['An unrelated spreadsheet','جدول بيانات غير مرتبط']],'A digital twin evolves using data from its physical counterpart. | يتطور التوأم الرقمي باستخدام بيانات نظيره الفيزيائي.'),
      Q('Real-time synchronization requires:','يتطلب التزامن الآني:',0,[['Measurements and data exchange','قياسات وتبادل بيانات'],['No sensors','عدم وجود حساسات'],['Only historical textbooks','كتبًا تاريخية فقط'],['A constant output','خرجًا ثابتًا']],'Measurements update the digital model to reflect the physical state. | تحدث القياسات النموذج الرقمي ليعكس الحالة الفيزيائية.'),
      Q('Predictive maintenance uses a digital twin to:','تستخدم الصيانة التنبؤية التوأم الرقمي من أجل:',2,[['Change equipment color','تغيير لون المعدة'],['Remove all inspections','إلغاء كل الفحوص'],['Estimate degradation and anticipate failures','تقدير التدهور وتوقع الأعطال'],['Guarantee infinite lifetime','ضمان عمر لا نهائي']],'Twin data and models can forecast condition and remaining life. | يمكن لبيانات ونماذج التوأم توقع الحالة والعمر المتبقي.'),
      Q('Model calibration means:','تعني معايرة النموذج:',3,[['Deleting parameters','حذف المعاملات'],['Ignoring measurements','تجاهل القياسات'],['Using random units','استخدام وحدات عشوائية'],['Adjusting parameters to match observed behavior','ضبط المعاملات لتطابق السلوك المرصود']],'Calibration aligns the digital model with physical observations. | توائم المعايرة النموذج الرقمي مع الملاحظات الفيزيائية.'),
      Q('A key digital-twin challenge is:','أحد التحديات الأساسية للتوأم الرقمي هو:',1,[['Having too much certainty','وجود يقين مفرط'],['Data quality, model fidelity, and cybersecurity','جودة البيانات ودقة النموذج والأمن السيبراني'],['No need for computation','عدم الحاجة للحوسبة'],['No system changes','عدم تغير النظام']],'A trustworthy twin depends on accurate data, models, and secure connectivity. | يعتمد التوأم الموثوق على بيانات ونماذج دقيقة واتصال آمن.')
    ]},

    lecture17: { questions: [
      Q('Physics-informed learning adds to the loss function:','يضيف التعلم الموجه بالفيزياء إلى دالة الخسارة:',0,[['Physical-equation residuals or constraints','بواقي المعادلات الفيزيائية أو القيود'],['Only filenames','أسماء الملفات فقط'],['Random colors','ألوانًا عشوائية'],['No information','عدم وجود معلومات']],'Physical residuals encourage predictions that satisfy governing equations. | تشجع البواقي الفيزيائية التنبؤات على تحقيق المعادلات الحاكمة.'),
      Q('A PINN can use collocation points to:','يمكن لـ PINN استخدام نقاط المطابقة من أجل:',2,[['Print a certificate','طباعة شهادة'],['Choose a browser','اختيار متصفح'],['Evaluate differential-equation residuals','تقييم بواقي المعادلات التفاضلية'],['Create cluster labels','إنشاء تسميات عناقيد']],'Collocation points enforce physics throughout the domain. | تفرض نقاط المطابقة الفيزياء ضمن المجال.'),
      Q('Why combine data and physics?','لماذا ندمج البيانات والفيزياء؟',1,[['To remove all equations','لحذف جميع المعادلات'],['To improve data efficiency and physical consistency','لتحسين كفاءة البيانات والاتساق الفيزيائي'],['To guarantee global optimality','لضمان المثالية العالمية'],['To avoid validation','لتجنب التحقق']],'Physical knowledge can guide learning when data are limited. | يمكن للمعرفة الفيزيائية توجيه التعلم عندما تكون البيانات محدودة.'),
      Q('A boundary condition specifies:','يحدد الشرط الحدّي:',3,[['Only the model name','اسم النموذج فقط'],['The number of webpages','عدد صفحات الويب'],['A random output','خرجًا عشوائيًا'],['Behavior at the boundary of the domain','السلوك عند حدود المجال']],'Boundary and initial conditions are essential to define physical problems. | تعد الشروط الحدية والابتدائية أساسية لتعريف المسائل الفيزيائية.'),
      Q('A low physics residual alone does not necessarily guarantee:','لا يضمن انخفاض الباقي الفيزيائي وحده بالضرورة:',0,[['A unique, accurate solution everywhere','حلًا فريدًا ودقيقًا في كل مكان'],['That equations were used','أن المعادلات استخدمت'],['That gradients exist','وجود التدرجات'],['That inputs were provided','توفير المدخلات']],'Validation against data and physical benchmarks remains necessary. | يبقى التحقق بالبيانات والمراجع الفيزيائية ضروريًا.')
    ]},

    lecture18: { questions: [
      Q('Federated learning trains a model by:','يدرّب التعلم الاتحادي نموذجًا من خلال:',1,[['Moving all raw data to one public server','نقل كل البيانات الخام إلى خادم عام'],['Aggregating updates from distributed clients','تجميع تحديثات من عملاء موزعين'],['Using no local computation','عدم استخدام حوسبة محلية'],['Deleting client data','حذف بيانات العملاء']],'Clients train locally and share model updates rather than raw data. | يدرب العملاء محليًا ويشاركون تحديثات النموذج بدل البيانات الخام.'),
      Q('FedAvg performs:','تنفذ FedAvg:',0,[['Weighted averaging of client model updates','متوسطًا موزونًا لتحديثات نماذج العملاء'],['A Fourier transform','تحويل فورييه'],['Graph clustering only','تجميعًا بيانيًا فقط'],['No aggregation','عدم التجميع']],'Federated averaging combines local model parameters or updates. | يجمع المتوسط الاتحادي معاملات أو تحديثات النماذج المحلية.'),
      Q('Non-IID data means client datasets:','تعني البيانات غير المستقلة والمتطابقة أن بيانات العملاء:',2,[['Are exactly identical','متطابقة تمامًا'],['Contain no samples','لا تحتوي عينات'],['Have different statistical distributions','لها توزيعات إحصائية مختلفة'],['Use only one unit','تستخدم وحدة واحدة فقط']],'Different customers or regions often have heterogeneous data. | غالبًا ما يمتلك العملاء أو المناطق بيانات غير متجانسة.'),
      Q('Federated learning automatically guarantees perfect privacy.','يضمن التعلم الاتحادي خصوصية مثالية تلقائيًا.',1,[['True','صحيح'],['False','خطأ'],['Only for images','فقط للصور'],['Only with one client','فقط مع عميل واحد']],'Model updates may still leak information, so additional protections can be needed. | قد تسرب تحديثات النموذج معلومات، لذا قد تلزم وسائل حماية إضافية.'),
      Q('A major federated-learning challenge is:','أحد تحديات التعلم الاتحادي هو:',3,[['No communication at all','عدم وجود اتصال إطلاقًا'],['Identical hardware always','تطابق العتاد دائمًا'],['Unlimited bandwidth','عرض حزمة غير محدود'],['Communication cost and client heterogeneity','تكلفة الاتصال وعدم تجانس العملاء']],'Distributed clients differ in data, hardware, and availability. | يختلف العملاء الموزعون في البيانات والعتاد والتوفر.')
    ]},

    lecture19: { questions: [
      Q('An intrusion-detection system aims to:','يهدف نظام كشف التسلل إلى:',0,[['Identify malicious or abnormal activity','تحديد النشاط الخبيث أو غير الطبيعي'],['Increase line impedance','زيادة ممانعة الخط'],['Generate random passwords only','توليد كلمات مرور عشوائية فقط'],['Replace all protection relays','استبدال جميع مرحلات الحماية']],'Intrusion detection monitors data or traffic for suspicious behavior. | يراقب كشف التسلل البيانات أو الحركة لاكتشاف السلوك المشبوه.'),
      Q('A false positive occurs when:','تحدث الإيجابية الكاذبة عندما:',2,[['An attack is missed','يفوت النظام هجومًا'],['A real fault is repaired','يصلح عطل حقيقي'],['Normal behavior is incorrectly flagged as malicious','يصنف السلوك الطبيعي خطأ على أنه خبيث'],['A model is never used','لا يستخدم النموذج']],'False positives create unnecessary alarms. | تؤدي الإيجابيات الكاذبة إلى إنذارات غير ضرورية.'),
      Q('An adversarial example is:','المثال الخصومي هو:',1,[['A random training epoch','عصر تدريب عشوائي'],['A deliberately perturbed input designed to mislead a model','دخل معدل عمدًا لتضليل النموذج'],['A verified measurement','قياس موثوق'],['A physical grounding conductor','موصل تأريض فيزيائي']],'Small malicious perturbations can cause incorrect predictions. | قد تسبب تعديلات خبيثة صغيرة تنبؤات خاطئة.'),
      Q('Why is concept drift important in cybersecurity?','لماذا يعد انجراف المفهوم مهمًا في الأمن السيبراني؟',3,[['Threats never change','التهديدات لا تتغير'],['Models are always perfect','النماذج مثالية دائمًا'],['Only file names change','تتغير أسماء الملفات فقط'],['Normal and attack patterns evolve over time','تتطور الأنماط الطبيعية وأنماط الهجوم مع الزمن']],'Security models require monitoring and updating as behavior changes. | تحتاج نماذج الأمن للمراقبة والتحديث مع تغير السلوك.'),
      Q('Defense in depth means:','يعني الدفاع متعدد الطبقات:',0,[['Using multiple complementary security controls','استخدام ضوابط أمنية متعددة ومتكاملة'],['Relying on one model only','الاعتماد على نموذج واحد فقط'],['Disabling monitoring','تعطيل المراقبة'],['Publishing credentials','نشر بيانات الدخول']],'Layered controls reduce dependence on any single defense. | تقلل الضوابط متعددة الطبقات الاعتماد على دفاع واحد.')
    ]},

    lecture20: { questions: [
      Q('An autonomous power system must combine:','يجب أن يجمع نظام القدرة ذاتي التشغيل:',1,[['Only forecasting','التنبؤ فقط'],['Sensing, prediction, decision, and control','الاستشعار والتنبؤ واتخاذ القرار والتحكم'],['Only a static webpage','صفحة ثابتة فقط'],['No safety layer','دون طبقة سلامة']],'Autonomy requires a closed loop from perception to action. | يتطلب التشغيل الذاتي حلقة مغلقة من الإدراك إلى الفعل.'),
      Q('A safety supervisor should:','يجب أن يقوم مشرف السلامة بـ:',0,[['Block or modify unsafe AI actions','منع أو تعديل أفعال الذكاء الاصطناعي غير الآمنة'],['Always accept every action','قبول كل فعل دائمًا'],['Ignore constraints','تجاهل القيود'],['Remove operator visibility','إلغاء رؤية المشغل']],'A safety layer enforces operational limits before commands are applied. | تفرض طبقة السلامة الحدود التشغيلية قبل تطبيق الأوامر.'),
      Q('Resilience means the system can:','تعني المرونة أن النظام يستطيع:',2,[['Avoid all disturbances forever','تجنب كل الاضطرابات إلى الأبد'],['Operate without measurements','العمل دون قياسات'],['Maintain or recover critical functions after disturbances','الحفاظ على الوظائف الحرجة أو استعادتها بعد الاضطرابات'],['Guarantee no component failure','ضمان عدم تعطل أي مكون']],'Resilient systems withstand, adapt to, and recover from disruptions. | تتحمل الأنظمة المرنة الاضطرابات وتتكيّف معها وتتعافى منها.'),
      Q('Human-in-the-loop operation is valuable because:','يفيد وجود الإنسان ضمن الحلقة لأن:',3,[['Humans never make errors','البشر لا يخطئون'],['AI needs no validation','الذكاء الاصطناعي لا يحتاج تحققًا'],['It removes all automation','يلغي كل الأتمتة'],['Experts can supervise exceptional and high-risk situations','يمكن للخبراء الإشراف على الحالات الاستثنائية عالية المخاطر']],'Human oversight supports accountability and handling of novel situations. | تدعم الرقابة البشرية المساءلة والتعامل مع الحالات الجديدة.'),
      Q('Before deploying autonomous control, engineers should perform:','قبل نشر التحكم الذاتي، يجب على المهندسين إجراء:',1,[['Only visual design review','مراجعة التصميم البصري فقط'],['Simulation, validation, stress testing, and staged deployment','المحاكاة والتحقق واختبارات الإجهاد والنشر المرحلي'],['No testing','عدم الاختبار'],['Immediate full-scale activation','التفعيل الكامل الفوري']],'Staged validation reduces operational and safety risk. | يقلل التحقق المرحلي المخاطر التشغيلية ومخاطر السلامة.')
    ]}
  };

  Object.entries(quizBank).forEach(([key, quiz]) => {
    const number = key.replace('lecture', '');
    quiz.titleEn = `Interactive Quiz — Lecture ${number}`;
    quiz.titleAr = `اختبار تفاعلي — المحاضرة ${number}`;
  });

  function escapeHtml(value) {
    return String(value).replace(/[&<>"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[char]));
  }

  function renderQuiz(key) {
    const data = quizBank[key];
    if (!data || document.querySelector('[data-course-quiz]')) return;

    const section = document.createElement('section');
    section.className = 'course-quiz';
    section.id = 'quiz';
    section.dataset.courseQuiz = '';
    section.dataset.storageKey = `ai-power-systems:${key}`;

    const questionsHtml = data.questions.map((question, index) => {
      const name = `${key}-q${index + 1}`;
      const options = question.options.map(option => `
        <label class="quiz-option">
          <input type="radio" name="${name}" value="${escapeHtml(option[0])}">
          <span><strong>${escapeHtml(option[1])}</strong><br><span dir="rtl">${escapeHtml(option[2])}</span></span>
        </label>`).join('');

      return `
        <article class="quiz-question" data-correct="${escapeHtml(question.correct)}">
          <h3>${index + 1}. ${escapeHtml(question.en)}</h3>
          <p class="quiz-ar">${index + 1}. ${escapeHtml(question.ar)}</p>
          ${options}
          <div class="quiz-explanation">${escapeHtml(question.explanation)}</div>
        </article>`;
    }).join('');

    section.innerHTML = `
      <div class="course-quiz-header">
        <h2>🧠 ${escapeHtml(data.titleEn)}</h2>
        <p dir="rtl">${escapeHtml(data.titleAr)}</p>
      </div>
      ${questionsHtml}
      <div class="quiz-actions">
        <button type="button" class="quiz-btn" data-quiz-submit>Check Answers | تحقق من الإجابات</button>
        <button type="button" class="quiz-btn secondary" data-quiz-reset>Try Again | إعادة المحاولة</button>
      </div>
      <div class="quiz-result" data-quiz-result>
        <strong data-quiz-score></strong>
        <span data-quiz-message></span>
      </div>
      <div class="quiz-progress-note">Your result is stored only in this browser. | تُحفظ نتيجتك في هذا المتصفح فقط.</div>`;

    const nav = document.querySelector('.course-page-navigation');
    const footer = document.querySelector('footer');
    if (nav?.parentNode) nav.parentNode.insertBefore(section, nav);
    else if (footer?.parentNode) footer.parentNode.insertBefore(section, footer);
    else document.body.appendChild(section);
  }

  const pageKey = (location.pathname.split('/').pop() || '').replace(/\.html$/i, '').toLowerCase();
  if (quizBank[pageKey]) renderQuiz(pageKey);
})();
