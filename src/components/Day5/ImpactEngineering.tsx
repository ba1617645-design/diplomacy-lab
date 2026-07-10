import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../../store/AppContext';
import { Sparkles, Target, BarChart3, AlertTriangle, Zap, Brain, CheckCircle, ArrowRight as ArrowRightIcon } from 'lucide-react';

const challenges = [
  'ضعف مشاركة الشباب في الأنشطة المجتمعية',
  'انخفاض العمل التطوعي لدى فئة الشباب',
  'العزلة الاجتماعية لكبار السن',
  'ضعف الانتماء الوطني في الأوساط الشبابية',
  'انتشار الشائعات والمعلومات المضللة',
  'ضعف الوعي البيئي في المجتمع',
  'ضعف مشاركة المرأة في المبادرات التنموية',
  'قلة مشاركة ذوي الإعاقة في الأنشطة',
  'انخفاض المشاركة في المراكز الشبابية',
  'ضعف المهارات الرقمية لدى الفئات المهمشة',
];

const targetGroupOptions = [
  { id: 'شباب', label: 'شباب', icon: '🧑‍🤝‍🧑' },
  { id: 'أطفال', label: 'أطفال', icon: '👶' },
  { id: 'أسر', label: 'أسر', icon: '👨‍👩‍👧‍👦' },
  { id: 'كبار السن', label: 'كبار السن', icon: '👴' },
  { id: 'طلبة', label: 'طلبة', icon: '🎓' },
  { id: 'متطوعون', label: 'متطوعون', icon: '🤝' },
  { id: 'المجتمع المحلي', label: 'المجتمع المحلي', icon: '🏘️' },
];

const interventionOptions = [
  { id: 'حملة إعلامية', label: 'حملة إعلامية', icon: '📺' },
  { id: 'ورشة تدريبية', label: 'ورشة تدريبية', icon: '📚' },
  { id: 'مبادرة مجتمعية', label: 'مبادرة مجتمعية', icon: '🌍' },
  { id: 'منصة رقمية', label: 'منصة رقمية', icon: '💻' },
  { id: 'تحدي شبابي', label: 'تحدي شبابي', icon: '🏆' },
  { id: 'فعالية مجتمعية', label: 'فعالية مجتمعية', icon: '🎪' },
  { id: 'برنامج تطوعي', label: 'برنامج تطوعي', icon: '🤲' },
  { id: 'جلسات حوار', label: 'جلسات حوار', icon: '💬' },
  { id: 'شراكات', label: 'شراكات', icon: '🤝' },
  { id: 'مسابقات', label: 'مسابقات', icon: '🏅' },
  { id: 'تطبيق ذكي', label: 'تطبيق ذكي', icon: '📱' },
];

const partnerOptions = [
  { id: 'جهة حكومية', label: 'جهة حكومية', icon: '🏛️', strength: 'دعم رسمي', weakness: 'بيروقراطية' },
  { id: 'مدرسة', label: 'مدرسة', icon: '🏫', strength: 'وصول للطلاب', weakness: 'موارد محدودة' },
  { id: 'جامعة', label: 'جامعة', icon: '🎓', strength: 'خبرات بحثية', weakness: 'بطء في التنفيذ' },
  { id: 'مركز شباب', label: 'مركز شباب', icon: '🏟️', strength: 'قرب من الشباب', weakness: 'إمكانيات متواضعة' },
  { id: 'جمعية أهلية', label: 'جمعية أهلية', icon: '🤲', strength: 'خبرة مجتمعية', weakness: 'تمويل محدود' },
  { id: 'شركة خاصة', label: 'شركة خاصة', icon: '🏢', strength: 'تمويل وخبرات', weakness: 'مصالح تجارية' },
  { id: 'مؤثر إعلامي', label: 'مؤثر إعلامي', icon: '📱', strength: 'وصول واسع', weakness: 'احتمال الجدل' },
  { id: 'متطوعون', label: 'متطوعون', icon: '👥', strength: 'حماس وطاقة', weakness: 'قلة الخبرة' },
];

const randomEvents = [
  { id: '1', text: 'تم تخفيض الميزانية بنسبة 40%', type: 'negative' as const },
  { id: '2', text: 'انسحب الشريك الرئيسي من المشروع', type: 'negative' as const },
  { id: '3', text: 'انتشر خبر سلبي عن المبادرة', type: 'negative' as const },
  { id: '4', text: 'ظهر ممول جديد لدعم المشروع', type: 'positive' as const },
  { id: '5', text: 'ارتفع عدد المتطوعين بشكل مفاجئ', type: 'positive' as const },
  { id: '6', text: 'تغيرت الأولويات الحكومية بعيداً عن المشروع', type: 'negative' as const },
  { id: '7', text: 'هطلت أمطار غزيرة وألغيت الفعالية', type: 'negative' as const },
  { id: '8', text: 'انتشر فيديو إيجابي عن المبادرة وحقق انتشاراً', type: 'positive' as const },
  { id: '9', text: 'تم طلب تنفيذ المشروع خلال أسبوع واحد فقط', type: 'negative' as const },
  { id: '10', text: 'حصل الفريق على دعم من شخصية مؤثرة', type: 'positive' as const },
];

const defenseQuestions = [
  'لماذا اخترتم هذا التدخل بالذات؟',
  'لماذا اخترتم هذه الفئة المستهدفة؟',
  'كيف سيحقق المشروع أثراً مستداماً؟',
  'ماذا لو انخفضت الميزانية بنسبة 50%؟',
  'كيف ستقيسون النجاح؟',
  'ما المخاطر المتوقعة وكيف ستتعاملون معها؟',
  'لماذا اخترتم هذا الشريك بالتحديد؟',
  'كيف تضمنون استمرارية المشروع بعد انتهاء التمويل؟',
];

export default function ImpactEngineering() {
  const navigate = useNavigate();
  const { state, dispatch } = useAppState();
  const [phase, setPhase] = useState('start');
  const [challenge, setChallenge] = useState('');
  const [teamName, setTeamName] = useState('');
  const [targetGroup, setTargetGroup] = useState('');
  const [interventionType, setInterventionType] = useState<string[]>([]);
  const [selectedPartner, setSelectedPartner] = useState('');
  const [budgetRemaining, setBudgetRemaining] = useState(10000);
  const [budgetAlloc, setBudgetAlloc] = useState({ marketing: 0, training: 0, operations: 0, tech: 0, incentives: 0, followup: 0, evaluation: 0 });
  const [indicators, setIndicators] = useState<string[]>([]);
  const [events, setEvents] = useState<{ text: string; type: 'positive' | 'negative' }[]>([]);
  const [defenseIdx, setDefenseIdx] = useState(0);
  const [defenseAnswers, setDefenseAnswers] = useState<{ question: string; answer: string }[]>([]);
  const [defenseInput, setDefenseInput] = useState('');
  const [evaluation, setEvaluation] = useState<any>(null);
  const [showResults, setShowResults] = useState(false);

  const handleStart = () => {
    const randChallenge = challenges[Math.floor(Math.random() * challenges.length)];
    setChallenge(randChallenge);
    dispatch({ type: 'SET_IMPACT_ENGINEERING', payload: { challenge: randChallenge, phase: 'plan' } });
    setPhase('plan');
  };

  const toggleIntervention = (id: string) => {
    setInterventionType(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const updateBudget = (key: keyof typeof budgetAlloc, value: number) => {
    const newAlloc = { ...budgetAlloc, [key]: value };
    const total = Object.values(newAlloc).reduce((a, b) => a + b, 0);
    if (total <= 10000) {
      setBudgetAlloc(newAlloc);
      setBudgetRemaining(10000 - total);
    }
  };

  const toggleIndicator = (indicator: string) => {
    setIndicators(prev => prev.includes(indicator) ? prev.filter(i => i !== indicator) : [...prev, indicator]);
  };

  const submitPlan = () => {
    // Trigger random events
    const numEvents = 2 + Math.floor(Math.random() * 2);
    const selectedEvents: typeof events = [];
    const shuffled = [...randomEvents].sort(() => Math.random() - 0.5);
    for (let i = 0; i < Math.min(numEvents, shuffled.length); i++) {
      selectedEvents.push({ text: shuffled[i].text, type: shuffled[i].type });
    }
    setEvents(selectedEvents);
    dispatch({ type: 'SET_IMPACT_ENGINEERING', payload: { events: selectedEvents, phase: 'events' } });
    setPhase('events');
  };

  const handleEventResponse = () => {
    // Move to defense phase
    setPhase('defense');
    dispatch({ type: 'SET_IMPACT_ENGINEERING', payload: { phase: 'defense' } });
  };

  const submitDefenseAnswer = () => {
    if (!defenseInput.trim()) return;
    setDefenseAnswers(prev => [...prev, { question: defenseQuestions[defenseIdx], answer: defenseInput }]);
    setDefenseInput('');
    if (defenseIdx < defenseQuestions.length - 1) {
      setDefenseIdx(prev => prev + 1);
    } else {
      // Generate evaluation
      const evalResult = generateEvaluation(challenge, interventionType, budgetAlloc, indicators, events, defenseAnswers);
      setEvaluation(evalResult);
      dispatch({ type: 'SET_IMPACT_ENGINEERING', payload: { defenseAnswers: [...defenseAnswers, { question: defenseQuestions[defenseIdx], answer: defenseInput }], evaluation: evalResult, phase: 'results' } });
      setPhase('results');
      setTimeout(() => setShowResults(true), 500);
    }
  };

  const handleComplete = () => {
    dispatch({ type: 'COMPLETE_MISSION', payload: 'day5' });
    dispatch({ type: 'ADD_XP', payload: 100 });
    dispatch({ type: 'UPDATE_PROFILE', payload: { scores: { ...state.userProfile.scores, impactEngineering: evaluation?.overall || 0 } } });
    navigate('/');
  };

  const indicatorOptions = [
    'عدد المستفيدين', 'نسبة المشاركة', 'عدد المتطوعين',
    'نسبة رضا المشاركين', 'عدد الشراكات', 'نسبة استدامة المشروع',
    'نسبة التغيير السلوكي', 'عدد المبادرات المنبثقة', 'التغطية الإعلامية',
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-cyan-600">اليوم الخامس: هندسة التأثير (Impact Engineering)</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div className="h-2 rounded-full bg-gradient-to-l from-cyan-500 to-blue-500" initial={{ width: '0%' }} animate={{ width: phase === 'start' ? '10%' : phase === 'plan' ? '35%' : phase === 'events' ? '55%' : phase === 'defense' ? '75%' : '100%' }} transition={{ duration: 0.5 }} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* Start */}
        {phase === 'start' && (
          <motion.div key="start" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Zap className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">⚡ هندسة التأثير</h2>
            <p className="text-xl text-gray-600 mb-4 max-w-2xl mx-auto">صمم تدخلاً مجتمعياً يحقق <strong>أكبر أثر بأقل تكلفة وأقصر وقت</strong></p>
            <div className="bg-gradient-to-l from-cyan-50 to-blue-50 rounded-2xl p-6 border border-cyan-100 max-w-lg mx-auto mb-8">
              <h3 className="font-bold text-gray-900 mb-3">📋 الموارد المتاحة</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-white rounded-xl p-3 text-center"><span className="text-xl font-bold text-cyan-600">$10,000</span><br /><span className="text-gray-500">الميزانية</span></div>
                <div className="bg-white rounded-xl p-3 text-center"><span className="text-xl font-bold text-cyan-600">30</span><br /><span className="text-gray-500">يوم للتنفيذ</span></div>
                <div className="bg-white rounded-xl p-3 text-center"><span className="text-xl font-bold text-cyan-600">5</span><br /><span className="text-gray-500">أعضاء الفريق</span></div>
                <div className="bg-white rounded-xl p-3 text-center"><span className="text-xl font-bold text-cyan-600">20</span><br /><span className="text-gray-500">متطوع</span></div>
              </div>
            </div>
            <button onClick={handleStart} className="px-10 py-4 bg-gradient-to-l from-cyan-600 to-blue-600 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all">
              ابدأ التحدي
            </button>
          </motion.div>
        )}

        {/* Planning Phase */}
        {phase === 'plan' && (
          <motion.div key="plan" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="py-6 space-y-6">
            {/* Challenge */}
            <div className="bg-gradient-to-l from-cyan-50 to-blue-50 rounded-2xl p-5 border border-cyan-100">
              <h3 className="font-bold text-gray-900 mb-1 flex items-center gap-2"><Target className="w-5 h-5 text-cyan-500" /> التحدي</h3>
              <p className="text-lg text-gray-800">{challenge}</p>
            </div>

            {/* Team Name */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">اسم الفريق</label>
              <input type="text" value={teamName} onChange={(e) => setTeamName(e.target.value)} placeholder="أدخل اسم فريقك..." className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-50" />
            </div>

            {/* Target Group */}
            <div>
              <h3 className="text-sm font-bold text-gray-700 mb-3">اختر الفئة المستهدفة</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {targetGroupOptions.map(t => (
                  <button key={t.id} onClick={() => setTargetGroup(t.id)} className={`p-3 rounded-xl border-2 text-center transition-all ${targetGroup === t.id ? 'border-cyan-500 bg-cyan-50 text-cyan-700' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                    <div className="text-xl">{t.icon}</div>
                    <div className="text-xs font-bold">{t.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Intervention Type */}
            <div>
              <h3 className="text-sm font-bold text-gray-700 mb-3">اختر نوع التدخل (يمكن اختيار أكثر من واحد)</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {interventionOptions.map(item => (
                  <button key={item.id} onClick={() => toggleIntervention(item.id)} className={`p-3 rounded-xl border-2 text-center transition-all ${interventionType.includes(item.id) ? 'border-cyan-500 bg-cyan-50 text-cyan-700' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                    <div className="text-xl">{item.icon}</div>
                    <div className="text-xs font-bold">{item.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Partner */}
            <div>
              <h3 className="text-sm font-bold text-gray-700 mb-3">اختر شريكاً واحداً</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {partnerOptions.map(p => (
                  <button key={p.id} onClick={() => setSelectedPartner(p.id)} className={`p-3 rounded-xl border-2 text-center transition-all ${selectedPartner === p.id ? 'border-cyan-500 bg-cyan-50 text-cyan-700' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                    <div className="text-xl">{p.icon}</div>
                    <div className="text-xs font-bold">{p.label}</div>
                    <div className="text-xs text-gray-400 mt-1">قوة: {p.strength}</div>
                    <div className="text-xs text-gray-400">ضعف: {p.weakness}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Budget Allocation */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-gray-700">توزيع الميزانية</h3>
                <span className="text-lg font-bold text-cyan-600">${budgetRemaining.toLocaleString()}</span>
              </div>
              <div className="space-y-3">
                {[
                  { key: 'marketing' as const, label: 'التسويق', emoji: '📢' },
                  { key: 'training' as const, label: 'التدريب', emoji: '📚' },
                  { key: 'operations' as const, label: 'التشغيل', emoji: '⚙️' },
                  { key: 'tech' as const, label: 'التقنية', emoji: '💻' },
                  { key: 'incentives' as const, label: 'الحوافز', emoji: '🎁' },
                  { key: 'followup' as const, label: 'المتابعة', emoji: '📋' },
                  { key: 'evaluation' as const, label: 'التقييم', emoji: '📊' },
                ].map(item => (
                  <div key={item.key} className="flex items-center gap-3 bg-white rounded-xl p-3 border border-gray-100">
                    <span className="text-lg">{item.emoji}</span>
                    <span className="text-sm text-gray-700 w-16">{item.label}</span>
                    <input type="range" min={0} max={5000} step={100} value={budgetAlloc[item.key]} onChange={(e) => updateBudget(item.key, parseInt(e.target.value))} className="flex-1 accent-cyan-500" />
                    <span className="text-sm font-bold text-gray-900 w-16 text-left">${budgetAlloc[item.key]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Indicators */}
            <div>
              <h3 className="text-sm font-bold text-gray-700 mb-3">مؤشرات النجاح (اختر 3 على الأقل)</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {indicatorOptions.map(ind => (
                  <button key={ind} onClick={() => toggleIndicator(ind)} className={`p-3 rounded-xl border-2 text-center transition-all ${indicators.includes(ind) ? 'border-cyan-500 bg-cyan-50 text-cyan-700' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                    <div className="text-xs font-bold">{ind}</div>
                  </button>
                ))}
              </div>
            </div>

            <button onClick={submitPlan} disabled={!teamName || !targetGroup || interventionType.length === 0 || !selectedPartner || indicators.length < 3} className="w-full py-4 bg-gradient-to-l from-cyan-600 to-blue-600 text-white rounded-2xl font-bold text-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all">
              قدم الخطة وانتظر الأحداث المفاجئة ⚡
            </button>
          </motion.div>
        )}

        {/* Events Phase */}
        {phase === 'events' && (
          <motion.div key="events" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="py-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-red-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-pulse">
                <AlertTriangle className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">⚠️ أحداث مفاجئة!</h2>
              <p className="text-gray-500">تغيرات غير متوقعة تؤثر على خطتك</p>
            </div>

            <div className="space-y-4 max-w-lg mx-auto mb-8">
              {events.map((evt, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.3 }} className={`p-5 rounded-2xl border-2 ${evt.type === 'positive' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{evt.type === 'positive' ? '✅' : '⚠️'}</span>
                    <div>
                      <div className="text-sm font-bold text-gray-900">{evt.type === 'positive' ? 'حدث إيجابي' : 'تحدي مفاجئ'}</div>
                      <p className="text-sm text-gray-700 mt-1">{evt.text}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="text-center">
              <button onClick={handleEventResponse} className="px-10 py-4 bg-gradient-to-l from-cyan-600 to-blue-600 text-white rounded-2xl font-bold text-lg hover:shadow-xl transition-all">
                تكيف مع المتغيرات وانتقل للدفاع عن مشروعك 🛡️
              </button>
            </div>
          </motion.div>
        )}

        {/* Defense Phase */}
        {phase === 'defense' && (
          <motion.div key="defense" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="py-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Brain className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">🛡️ الدفاع عن المشروع</h2>
              <p className="text-gray-500">لجنة التقييم الافتراضية تطرح أسئلتها</p>
              <div className="mt-2 text-sm text-gray-400">السؤال {defenseIdx + 1} من {defenseQuestions.length}</div>
            </div>

            <div className="max-w-2xl mx-auto">
              <div className="bg-gradient-to-l from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100 mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">AI</div>
                  <span className="text-sm font-bold text-indigo-700">لجنة التقييم</span>
                </div>
                <p className="text-lg text-gray-800">{defenseQuestions[defenseIdx]}</p>
              </div>

              <textarea value={defenseInput} onChange={(e) => setDefenseInput(e.target.value)} placeholder="اكتب إجابتك هنا..." className="w-full h-32 p-4 border-2 border-gray-200 rounded-2xl text-sm focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-50 resize-none transition-all mb-4" />

              <div className="flex justify-between">
                <span className="text-sm text-gray-400">تمت الإجابة على {defenseAnswers.length} أسئلة</span>
                <button onClick={submitDefenseAnswer} disabled={!defenseInput.trim()} className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                  {defenseIdx < defenseQuestions.length - 1 ? <>التالي <ArrowRightIcon className="w-4 h-4" /></> : 'عرض التقييم النهائي 📊'}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Results */}
        {phase === 'results' && evaluation && (
          <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <BarChart3 className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">📊 تقييم المشروع</h2>
              <p className="text-gray-500">تحليل الذكاء الاصطناعي لمشروعك</p>
            </div>

            <AnimatePresence>
              {showResults && (
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6 max-w-3xl mx-auto">
                  {/* Score Overview */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {evaluation.scores.map((s: any, i: number) => (
                      <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
                        <div className="text-2xl mb-1">{s.icon}</div>
                        <div className="text-2xl font-bold text-gray-900">{s.value}%</div>
                        <div className="text-xs text-gray-500">{s.label}</div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${s.value}%` }} transition={{ duration: 1, delay: i * 0.1 }} className={`h-1.5 rounded-full ${s.color}`} />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="text-center mb-4">
                    <div className="inline-block px-6 py-3 bg-gradient-to-l from-cyan-500 to-blue-500 rounded-2xl text-white text-2xl font-bold shadow-lg">
                      الدرجة النهائية: {evaluation.overall}%
                    </div>
                  </div>

                  {/* Evaluation Details */}
                  <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                    <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><Sparkles className="w-5 h-5 text-cyan-500" /> تحليل المشروع</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> <strong>نقاط القوة:</strong> {evaluation.strengths}</div>
                      <div className="flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-500" /> <strong>فرص التحسين:</strong> {evaluation.weaknesses}</div>
                      <div className="flex items-center gap-2"><Target className="w-4 h-4 text-indigo-500" /> <strong>التوصيات:</strong> {evaluation.recommendations}</div>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="bg-gradient-to-l from-cyan-50 to-blue-50 rounded-2xl p-6 border border-cyan-100">
                    <h3 className="font-bold text-gray-900 mb-2">📋 ملخص المشروع</h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div><span className="text-gray-500">التحدي:</span> <span className="font-medium">{challenge}</span></div>
                      <div><span className="text-gray-500">الفئة المستهدفة:</span> <span className="font-medium">{targetGroup}</span></div>
                      <div><span className="text-gray-500">الشريك:</span> <span className="font-medium">{selectedPartner}</span></div>
                      <div><span className="text-gray-500">التدخلات:</span> <span className="font-medium">{interventionType.join(', ')}</span></div>
                      <div><span className="text-gray-500">الميزانية المستخدمة:</span> <span className="font-medium">${10000 - budgetRemaining}</span></div>
                      <div><span className="text-gray-500">مؤشرات القياس:</span> <span className="font-medium">{indicators.length}</span></div>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <button onClick={() => navigate('/')} className="px-6 py-3 text-gray-500 hover:text-gray-700 flex items-center gap-2"><span>→</span> العودة للرئيسية</button>
                    <button onClick={handleComplete} className="px-8 py-3 bg-gradient-to-l from-cyan-600 to-blue-600 text-white rounded-xl font-bold hover:shadow-xl flex items-center gap-2">
                      أكملت المهمة! +100 XP ✨
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function generateEvaluation(_challenge: string, interventions: string[], budget: any, indicators: string[], events: any[], answers: any[]) {
  const baseScore = 65 + Math.floor(Math.random() * 15);
  const interventionScore = Math.min(98, baseScore + interventions.length * 3);
  const budgetScore = Math.min(98, baseScore + (Object.values(budget).filter((v: any) => v > 0).length * 2));
  const indicatorScore = Math.min(98, baseScore + indicators.length * 3);
  const defenseScore = Math.min(98, baseScore + answers.length * 2);
  const innovationScore = Math.min(98, baseScore + Math.floor(Math.random() * 10));
  const sustainabilityScore = Math.min(98, baseScore + Math.floor(Math.random() * 8));

  const negativeEvents = events.filter((e: any) => e.type === 'negative').length;
  const positiveEvents = events.filter((e: any) => e.type === 'positive').length;
  const adaptabilityScore = Math.min(98, baseScore + positiveEvents * 5 - negativeEvents * 3);

  const scores = [
    { label: 'تحليل المشكلة', value: baseScore, icon: '🎯', color: 'bg-indigo-500' },
    { label: 'التدخل', value: interventionScore, icon: '⚡', color: 'bg-cyan-500' },
    { label: 'الميزانية', value: budgetScore, icon: '💰', color: 'bg-green-500' },
    { label: 'المؤشرات', value: indicatorScore, icon: '📊', color: 'bg-blue-500' },
    { label: 'الابتكار', value: innovationScore, icon: '💡', color: 'bg-purple-500' },
    { label: 'الاستدامة', value: sustainabilityScore, icon: '♻️', color: 'bg-emerald-500' },
    { label: 'التكيف', value: adaptabilityScore, icon: '🦎', color: 'bg-amber-500' },
    { label: 'الدفاع', value: defenseScore, icon: '🛡️', color: 'bg-rose-500' },
  ];

  const overall = Math.round(scores.reduce((a, s) => a + s.value, 0) / scores.length);

  const strengths = [];
  if (interventionScore > 75) strengths.push('اختيار ممتاز للتدخلات المناسبة');
  if (budgetScore > 75) strengths.push('توزيع فعال للميزانية');
  if (indicatorScore > 75) strengths.push('مؤشرات قياس شاملة ومتنوعة');
  if (defenseScore > 75) strengths.push('قدرة عالية على الدفاع عن المشروع');
  if (adaptabilityScore > 75) strengths.push('مرونة عالية في التكيف مع المتغيرات');

  const weaknesses = [];
  if (interventionScore < 70) weaknesses.push('يمكن تحسين اختيار التدخلات');
  if (budgetScore < 70) weaknesses.push('إعادة توزيع الميزانية بشكل أكثر فعالية');
  if (indicatorScore < 70) weaknesses.push('إضافة المزيد من مؤشرات القياس');
  if (adaptabilityScore < 70) weaknesses.push('تطوير خطة لإدارة المخاطر');

  return {
    scores,
    overall,
    strengths: strengths.length > 0 ? strengths.join('، ') : 'أداء جيد في جميع المجالات',
    weaknesses: weaknesses.length > 0 ? weaknesses.join('، ') : 'لا توجد نقاط ضعف كبيرة',
    recommendations: `التركيز على ${interventionScore < 75 ? 'تحسين التدخلات' : 'تعزيز مؤشرات القياس'} و${budgetScore < 75 ? 'ترشيد الميزانية' : 'تطوير خطة الاستدامة'}.`,
  };
}
