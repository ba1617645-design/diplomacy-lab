/**
 * محاكاة تحليل الذكاء الاصطناعي
 * في الإصدار الحقيقي، سيتم استبدال هذا بـ API فعلي
 */

export function generateInfluenceReport(person: string, cards: string[]): string {
  const cardMap: Record<string, string> = {
    'المعرفة': 'المعرفة والتعلم المستمر',
    'القيم': 'القيم والمبادئ الراسخة',
    'العلاقات': 'بناء العلاقات وشبكات التواصل',
    'المنصب': 'السلطة الرسمية والمنصب',
    'السمعة': 'السمعة والمصداقية',
  };

  const selected = cards.map(c => cardMap[c] || c);
  const hasKnowledge = cards.includes('المعرفة');
  const hasValues = cards.includes('القيم');
  const hasRelations = cards.includes('العلاقات');
  const hasPosition = cards.includes('المنصب');
  const hasReputation = cards.includes('السمعة');

  let development = '';
  let style = '';

  if (hasValues && hasKnowledge) {
    style = 'قيادة تحويلية (Transformational Leadership)';
  } else if (hasRelations && hasReputation) {
    style = 'قيادة شبكية (Network Leadership)';
  } else if (hasPosition) {
    style = 'قيادة هيكلية (Structural Leadership)';
  } else {
    style = 'قيادة متوازنة (Balanced Leadership)';
  }

  if (cards.length <= 2) {
    development = 'نوصي بتوسيع مصادر نفوذك. القائد المؤثر لا يعتمد على مصدر واحد بل يبني مزيجاً متكاملاً من المعرفة والعلاقات والقيم.';
  } else if (cards.length === 3) {
    development = 'لديك قاعدة جيدة من مصادر النفوذ. يمكنك تعزيز تأثيرك بالتركيز على بناء السمعة وتوسيع شبكة علاقاتك.';
  } else {
    development = 'تمتلك مجموعة متنوعة من مصادر النفوذ. التحدي الآن هو كيفية توظيفها بشكل استراتيجي في مواقف مختلفة.';
  }

  if (!hasReputation) {
    development += '\n• بناء السمعة: العمل على تعزيز مصداقيتك من خلال الاتساق بين القول والفعل.';
  }
  if (!hasRelations) {
    development += '\n• توسيع الشبكات: بناء علاقات استراتيجية مع مختلف أصحاب المصلحة.';
  }
  if (hasPosition && !hasValues) {
    development += '\n• تعزيز القيم: لا تعتمد فقط على المنصب، بل ابنِ نفوذك على أسس قيمية راسخة.';
  }

  return `تحليلك الشخصي

نمط قيادتك: ${style}

نقاط القوة:
${strengthBuilder(selected)}

مجالات التطوير:
${development}

مستخلص التحليل:
تأثرت بشخصية ${person} التي اعتمدت على ${selected.join(' و ')}. 
هذا الاختيار يكشف عن قيمك القيادية العميقة وكيف ترى النفوذ الحقيقي.
أنت تميل إلى ${hasValues ? 'المبادئ والقيم' : 'النتائج العملية'} كمصدر أساسي للتأثير.
نوصي بالاستمرار في تطوير ذاتك والاطلاع على نماذج قيادية متنوعة لتعزيز فهمك للنفوذ المجتمعي.`;
}

function strengthBuilder(selected: string[]): string {
  if (selected.length === 0) return '• لم يتم تحديد مصادر نفوذ محددة';
  return selected.map((s, i) => `• ${s} - أنت تدرك أهمية ${s} في بناء النفوذ والتأثير المجتمعي${i === 0 ? ' (المصدر الأهم بالنسبة لك)' : ''}`).join('\n');
}

export function generateStoryNarrative(issue: string, audience: string, message: string, feeling: string): string {
  const feelingDesc: Record<string, string> = {
    'إلهام': 'ملهمة تلامس القلوب',
    'تعاطف': 'تنبض بالتعاطف والإنسانية',
    'حماس': 'مفعمة بالحماس والطاقة',
    'ثقة': 'تبني الثقة وتزرع الأمل',
    'خوف': 'تسليط الضوء على المخاطر',
    'أمل': 'تبعث الأمل والتفاؤل',
  };

  const feelingWord = feelingDesc[feeling] || 'مؤثرة';

  return `# قصة: ${issue}

## لجمهور: ${audience}

**${feelingWord}**، ${message}

---

### المقدمة

في عالمنا المعاصر، تبرز قضية **${issue}** كواحدة من أهم التحديات والفرص التي تواجه مجتمعاتنا. كل يوم، نرى آثار هذه القضية تتجلى في حياة الناس، مما يجعل من الضروري التحدث عنها بكل وضوح وشجاعة.

### الرسالة الأساسية

${message}

### رحلة التأثير

عندما نتحدث إلى ${audience === 'الشباب' ? 'الشباب' : audience === 'الحكومة' ? 'صانعي القرار' : audience === 'الإعلام' ? 'الإعلاميين' : audience === 'المؤسسات' ? 'المؤسسات والمنظمات' : 'المجتمع'}، يجب أن نبدأ بفهم همومهم وتطلعاتهم. ${issue} ليست مجرد قضية، بل هي فرصة لبناء مستقبل أفضل.

### الدعوة للعمل

الآن هو الوقت المناسب للتحرك. معاً، يمكننا إحداث فرق حقيقي في **${issue}**. انضم إلينا في هذه الرحلة، وكن جزءاً من الحل.

### الخاتمة

${feeling === 'إلهام' ? 'تذكر أن التغيير يبدأ بفكرة، والإرادة تصنع المستحيل.' : feeling === 'تعاطف' ? 'لأننا جميعاً في نفس المركب، فلنمد أيدينا بالخير والعطاء.' : feeling === 'حماس' ? 'الطريق طويل ولكننا معاً، والعمل الجاد يقودنا إلى القمة.' : feeling === 'ثقة' ? 'نحن على يقين بأن المستقبل يحمل لنا الخير، بجهودنا المشتركة.' : feeling === 'أمل' ? 'الأمل يشرق كل صباح، وغداً سيكون أجمل بإذن الله.' : 'التغيير يبدأ من هنا، من كل واحد منا.'}

---

*هذه القصة تم إنشاؤها بواسطة Diplomacy Lab AI`;
}

export function generateStoryQualityScores(issue: string, message: string): { persuasion: number; emotion: number; clarity: number; impact: number } {
  const baseScore = (input: string): number => {
    const length = input.length;
    if (length > 100) return 85 + Math.floor(Math.random() * 10);
    if (length > 50) return 75 + Math.floor(Math.random() * 15);
    if (length > 20) return 65 + Math.floor(Math.random() * 15);
    return 50 + Math.floor(Math.random() * 20);
  };

  return {
    persuasion: Math.min(98, baseScore(message) + 5),
    emotion: Math.min(98, baseScore(issue) + Math.floor(Math.random() * 10)),
    clarity: Math.min(98, baseScore(message) + Math.floor(Math.random() * 8)),
    impact: Math.min(98, (baseScore(issue) + baseScore(message)) / 2 + 5),
  };
}

export function generateImpactAnalysis(canvas: {
  problem: string;
  targetGroup: string;
  activities: string;
  outputs: string;
  outcomes: string;
  impact: string;
  indicators: string;
}): { feedback: string; theoryOfChange: string } {
  const issues: string[] = [];
  const suggestions: string[] = [];

  if (!canvas.problem || canvas.problem.length < 10) {
    issues.push('❌ المشكلة غير محددة بوضوح. يجب تحديد المشكلة بدقة لبناء نظرية تغيير فعالة.');
    suggestions.push('• حدد المشكلة الأساسية التي تحاول حلها مع ذكر الأدلة والإحصائيات.');
  } else {
    issues.push('✅ المشكلة محددة بوضوح.');
  }

  if (!canvas.targetGroup || canvas.targetGroup.length < 5) {
    issues.push('❌ الفئة المستهدفة غير محددة. من هم المستفيدون المباشرون من مبادرتك؟');
    suggestions.push('• حدد الفئة المستهدفة بدقة (العمر، الموقع، الاحتياجات).');
  } else {
    issues.push('✅ الفئة المستهدفة محددة.');
  }

  if (!canvas.activities || canvas.activities.length < 10) {
    issues.push('❌ الأنشطة غير محددة. ما هي الأنشطة التي ستقوم بها لتحقيق المخرجات؟');
    suggestions.push('• اذكر الأنشطة الرئيسية بشكل محدد وقابل للتنفيذ.');
  } else {
    issues.push('✅ الأنشطة محددة وقابلة للتنفيذ.');
  }

  if (!canvas.indicators || canvas.indicators.length < 5) {
    issues.push('❌ لا توجد مؤشرات قياس كافية. كيف ستقيس النجاح؟');
    suggestions.push('• أضف مؤشرات كمية ونوعية لقياس التقدم.');
  } else {
    issues.push('✅ توجد مؤشرات قياس.');
  }

  // Check alignment
  if (canvas.activities && canvas.outcomes) {
    if (canvas.activities.length < canvas.outcomes.length * 0.5) {
      issues.push('⚠️ الأنشطة لا تقود بشكل مباشر إلى النتائج المتوقعة.');
      suggestions.push('• تأكد من أن كل نشاط يساهم بشكل مباشر في تحقيق مخرجات محددة.');
    }
  }

  if (canvas.problem && canvas.impact) {
    if (canvas.problem.length > 0 && canvas.impact.length > 0) {
      // Simple check for alignment
      const problemWords = canvas.problem.split(' ').slice(0, 5);
      const impactWords = canvas.impact.split(' ');
      const hasOverlap = problemWords.some(w => impactWords.includes(w));
      if (!hasOverlap && canvas.problem.length > 10 && canvas.impact.length > 10) {
        issues.push('⚠️ الأثر بعيد عن المشكلة الأساسية.');
        suggestions.push('• اربط الأثر النهائي بالمشكلة التي حددتها في البداية.');
      }
    }
  }

  const feedback = `## تحليل المبادرة

${issues.map(i => `* ${i}`).join('\n')}

### الاقتراحات

${suggestions.length > 0 ? suggestions.map(s => `* ${s}`).join('\n') : '* مبادرتك تبدو متكاملة! يمكنك الانتقال إلى مرحلة التنفيذ.'}

### التقييم العام
${issues.filter(i => i.includes('❌')).length > 0 ? 'المبادرة بحاجة إلى تحسين. ركز على سد الثغرات المحددة أعلاه.' :
  issues.filter(i => i.includes('⚠️')).length > 0 ? 'المبادرة جيدة ولكنها تحتاج بعض التحسينات الطفيفة.' :
  'مبادرة ممتازة! لقد قمت بتغطية جميع العناصر الأساسية.'}
`;

  const theoryOfChange = `# نظرية التغيير

## المشكلة
${canvas.problem || 'المشكلة الأساسية التي نعمل على حلها'}

## الفئة المستهدفة
${canvas.targetGroup || 'المستفيدون من المبادرة'}

## الأنشطة
${canvas.activities || 'الأنشطة المخطط تنفيذها'}

## المخرجات
${canvas.outputs || 'النتائج المباشرة للأنشطة'}

## النتائج
${canvas.outcomes || 'التغييرات قصيرة ومتوسطة المدى'}

## الأثر
${canvas.impact || 'التغيير طويل المدى المنشود'}

## مؤشرات القياس
${canvas.indicators || 'كيف نقيس النجاح'}

---

### المنطق الأساسي

إذا قمنا بـ **${canvas.activities?.split(' ').slice(0, 5).join(' ') || 'الأنشطة المخطط لها'}**،
فسنحصل على **${canvas.outputs?.split(' ').slice(0, 5).join(' ') || 'مخرجات ملموسة'}**،
مما يؤدي إلى **${canvas.outcomes?.split(' ').slice(0, 5).join(' ') || 'نتائج إيجابية'}**،
وتحقيق **${canvas.impact?.split(' ').slice(0, 5).join(' ') || 'أثر دائم'}** في المجتمع.

### الافتراضات
- توفر الموارد اللازمة للتنفيذ
- دعم أصحاب المصلحة الرئيسيين
- استعداد الفئة المستهدفة للمشاركة
- استقرار البيئة التنفيذية

*تم إنشاء نظرية التغيير بواسطة Diplomacy Lab AI*
`;

  return { feedback, theoryOfChange };
}

export function generateNegotiationScores(): { negotiation: number; alliance: number; communication: number; time: number } {
  return {
    negotiation: 75 + Math.floor(Math.random() * 20),
    alliance: 70 + Math.floor(Math.random() * 25),
    communication: 80 + Math.floor(Math.random() * 18),
    time: 65 + Math.floor(Math.random() * 30),
  };
}

export function generateAIBotResponse(teamName: string, _context: string): string {
  const responses: Record<string, string[]> = {
    'منظمة دولية': [
      'نحن نقدر التعاون ولكن يجب أن نلتزم بالمعايير الدولية.',
      'يمكننا تقديم الدعم الفني والخبرات الدولية.',
      'الشفافية شرط أساسي لمشاركتنا في هذا التحالف.',
      'نحتاج إلى ضمانات بأن المؤتمر سيلتزم بالقوانين الدولية.',
    ],
    'شركة راعية': [
      'نحن مستعدون للاستثمار ولكن نريد عائداً واضحاً على الاستثمار.',
      'العلامة التجارية مهمة لنا. نريد ظهوراً بارزاً في المؤتمر.',
      'ميزانيتنا متاحة ولكن تحت إشراف فريق التسويق لدينا.',
      'نقترح شراكة استراتيجية طويلة المدى.',
    ],
    'الإعلام': [
      'نحتاج إلى قصة صحفية مثيرة للاهتمام.',
      'التغطية الإعلامية ممكنة إذا كان هناك محتوى حصري.',
      'نريد مقابلات حصرية مع المنظمين والمتحدثين.',
      'يمكننا توفير تغطية مباشرة للفعاليات.',
    ],
    'متطوعون': [
      'نحن متحمسون للمشاركة ولكن نريد تطوير مهاراتنا.',
      'نحتاج إلى تدريب مناسب قبل المؤتمر.',
      'التقدير المعنوي مهم لنا كمتطوعين.',
      'نستطيع المساعدة في التنظيم والتنسيق الميداني.',
    ],
  };

  const teamResponses = responses[teamName];
  if (teamResponses) {
    return teamResponses[Math.floor(Math.random() * teamResponses.length)];
  }
  return 'نحن منفتحون للحوار والتعاون من أجل نجاح هذا التحالف.';
}
