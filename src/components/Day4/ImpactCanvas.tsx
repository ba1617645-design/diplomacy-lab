import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../../store/AppContext';
import { generateImpactAnalysis } from '../../utils/aiSimulator';
import { ArrowRight, Sparkles, GripVertical, FileOutput, Globe, BarChart3, CheckCircle2, XCircle, ArrowLeft } from 'lucide-react';

type Phase = 'select' | 'canvas' | 'analysis' | 'theory';

interface CanvasItem {
  id: string;
  label: string;
  icon: string;
  field: keyof typeof emptyCanvas;
  placeholder: string;
}

const canvasItems: CanvasItem[] = [
  { id: 'problem', label: 'المشكلة', icon: '🎯', field: 'problem', placeholder: 'ما المشكلة التي تحاول حلها؟' },
  { id: 'target', label: 'الفئة المستهدفة', icon: '👥', field: 'targetGroup', placeholder: 'من هم المستفيدون؟' },
  { id: 'activities', label: 'الأنشطة', icon: '⚡', field: 'activities', placeholder: 'ما الأنشطة التي ستقوم بها؟' },
  { id: 'outputs', label: 'المخرجات', icon: '📦', field: 'outputs', placeholder: 'ما النتائج المباشرة؟' },
  { id: 'outcomes', label: 'النتائج', icon: '📈', field: 'outcomes', placeholder: 'ما التغييرات المتوقعة؟' },
  { id: 'impact', label: 'الأثر', icon: '🌍', field: 'impact', placeholder: 'ما الأثر طويل المدى؟' },
  { id: 'indicators', label: 'مؤشرات القياس', icon: '📊', field: 'indicators', placeholder: 'كيف تقيس النجاح؟' },
];

const emptyCanvas = {
  problem: '', targetGroup: '', activities: '', outputs: '', outcomes: '', impact: '', indicators: '',
};

const initiativeIdeas = [
  { title: 'التمكين الرقمي', desc: 'تمكين الشباب رقمياً بالمهارات التقنية', icon: '💻' },
  { title: 'قيادة الشباب', desc: 'برنامج تطوير القيادات الشابة', icon: '👑' },
  { title: 'العمل التطوعي', desc: 'منصة للعمل التطوعي المجتمعي', icon: '🤝' },
  { title: 'الاستدامة البيئية', desc: 'مبادرة للحفاظ على البيئة', icon: '🌱' },
  { title: 'الصحة النفسية', desc: 'دعم الصحة النفسية للشباب', icon: '🧠' },
  { title: 'ريادة الأعمال', desc: 'حاضنة أعمال للمشاريع الناشئة', icon: '🚀' },
];

export default function ImpactCanvas() {
  const navigate = useNavigate();
  const { state, dispatch } = useAppState();
  const [phase, setPhase] = useState<Phase>('select');
  const [initiative, setInitiative] = useState('');
  const [canvas, setCanvas] = useState(emptyCanvas);
  const [activeField, setActiveField] = useState<keyof typeof emptyCanvas | null>(null);
  const [feedback, setFeedback] = useState('');
  const [theory, setTheory] = useState('');

  const handleSelectInitiative = (title: string) => {
    setInitiative(title);
    setPhase('canvas');
  };

  const handleFieldChange = (field: keyof typeof emptyCanvas, value: string) => {
    setCanvas(prev => ({ ...prev, [field]: value }));
  };

  const handleAnalyze = () => {
    const result = generateImpactAnalysis(canvas);
    setFeedback(result.feedback);
    setTheory(result.theoryOfChange);
    dispatch({ type: 'SET_IMPACT_CANVAS', payload: { ...canvas, aiFeedback: result.feedback, theoryOfChange: result.theoryOfChange } });
    setPhase('analysis');
  };

  const handleShowTheory = () => {
    setPhase('theory');
  };

  const handleComplete = () => {
    const filledCount = Object.values(canvas).filter(v => v.trim().length > 0).length;
    const score = Math.round((filledCount / 7) * 100);
    dispatch({ type: 'COMPLETE_MISSION', payload: 'day4' });
    dispatch({ type: 'ADD_XP', payload: 100 });
    dispatch({ type: 'UPDATE_PROFILE', payload: { scores: { ...state.userProfile.scores, impact: score } } });
    navigate('/');
  };

  const fieldIcons: Record<string, string> = {
    problem: '🎯', targetGroup: '👥', activities: '⚡', outputs: '📦', outcomes: '📈', impact: '🌍', indicators: '📊',
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-rose-600">اليوم الرابع: من النشاط إلى الأثر</span>
          <span className="text-xs text-gray-500">{phase === 'select' ? '1/4' : phase === 'canvas' ? '2/4' : phase === 'analysis' ? '3/4' : '4/4'}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div className="h-2 rounded-full bg-gradient-to-l from-rose-500 to-pink-500" initial={{ width: '0%' }} animate={{ width: phase === 'select' ? '25%' : phase === 'canvas' ? '50%' : phase === 'analysis' ? '75%' : '100%' }} transition={{ duration: 0.5 }} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* Select Initiative */}
        {phase === 'select' && (
          <motion.div key="select" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="py-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">اختر مبادرة</h2>
            <p className="text-gray-500 text-center mb-8">اختر مبادرة لتحليلها وتصميم نظرية التغيير الخاصة بها</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {initiativeIdeas.map(idea => (
                <button key={idea.title} onClick={() => handleSelectInitiative(idea.title)} className="bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-rose-300 hover:shadow-lg transition-all text-right group">
                  <div className="text-4xl mb-3">{idea.icon}</div>
                  <h3 className="font-bold text-gray-900 mb-1 group-hover:text-rose-600 transition-colors">{idea.title}</h3>
                  <p className="text-sm text-gray-500">{idea.desc}</p>
                </button>
              ))}
            </div>
            <div className="mt-6">
              <button onClick={() => navigate('/')} className="px-6 py-3 text-gray-500 hover:text-gray-700 flex items-center gap-2"><ArrowRight className="w-4 h-4" /> رجوع</button>
            </div>
          </motion.div>
        )}

        {/* Canvas */}
        {phase === 'canvas' && (
          <motion.div key="canvas" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="py-4">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{initiative}</h2>
                <p className="text-gray-500 text-sm">قم بتعبئة بطاقات Canvas أدناه</p>
              </div>
              <button onClick={handleAnalyze} disabled={Object.values(canvas).filter(v => v.trim()).length < 3} className="px-6 py-3 bg-gradient-to-l from-rose-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                تحليل المبادرة <Sparkles className="w-4 h-4" />
              </button>
            </div>

            {/* Flow arrows */}
            <div className="flex items-center justify-center gap-1 mb-6 text-gray-300 text-sm">
              <span className="text-xs">المشكلة</span>
              <ArrowLeft className="w-3 h-3" />
              <span className="text-xs">الفئة</span>
              <ArrowLeft className="w-3 h-3" />
              <span className="text-xs">الأنشطة</span>
              <ArrowLeft className="w-3 h-3" />
              <span className="text-xs">المخرجات</span>
              <ArrowLeft className="w-3 h-3" />
              <span className="text-xs">النتائج</span>
              <ArrowLeft className="w-3 h-3" />
              <span className="text-xs">الأثر</span>
              <ArrowLeft className="w-3 h-3" />
              <span className="text-xs">المؤشرات</span>
            </div>

            <div className="space-y-3">
              {canvasItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`bg-white rounded-2xl border-2 transition-all ${
                    activeField === item.field
                      ? 'border-rose-400 shadow-lg shadow-rose-100'
                      : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3 p-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-rose-100 to-pink-100 rounded-xl flex items-center justify-center text-lg">
                      {fieldIcons[item.field] || '📝'}
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-bold text-gray-500 mb-1">{item.label}</div>
                      <textarea
                        value={canvas[item.field] || ''}
                        onChange={(e) => handleFieldChange(item.field, e.target.value)}
                        onFocus={() => setActiveField(item.field)}
                        onBlur={() => setActiveField(null)}
                        placeholder={item.placeholder}
                        className="w-full bg-transparent text-gray-900 font-medium resize-none focus:outline-none text-sm"
                        rows={2}
                      />
                    </div>
                    <GripVertical className="w-5 h-5 text-gray-300 flex-shrink-0" />
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 flex justify-between">
              <button onClick={() => setPhase('select')} className="px-6 py-3 text-gray-500 hover:text-gray-700 flex items-center gap-2"><ArrowRight className="w-4 h-4" /> رجوع</button>
            </div>
          </motion.div>
        )}

        {/* Analysis */}
        {phase === 'analysis' && (
          <motion.div key="analysis" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="py-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <BarChart3 className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">تحليل المبادرة</h2>
              <p className="text-gray-500">مراجعة مدعومة بالذكاء الاصطناعي</p>
            </div>

            <div className="bg-white rounded-2xl border border-rose-100 p-6 md:p-8 shadow-lg mb-6">
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed text-sm md:text-base" dir="rtl">
                {feedback}
              </div>
            </div>

            {/* Canvas Summary */}
            <div className="grid md:grid-cols-2 gap-3 mb-6">
              {canvasItems.map(item => (
                <div key={item.id} className={`bg-white rounded-xl p-4 border text-sm ${canvas[item.field]?.trim() ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    {canvas[item.field]?.trim() ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-red-400" />}
                    <span className="font-bold text-xs text-gray-600">{item.label}</span>
                  </div>
                  <p className="text-gray-800 text-xs line-clamp-2">{canvas[item.field] || '(غير محدد)'}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-between">
              <button onClick={() => setPhase('canvas')} className="px-6 py-3 text-gray-500 hover:text-gray-700 flex items-center gap-2"><ArrowRight className="w-4 h-4" /> رجوع</button>
              <div className="flex gap-3">
                <button onClick={handleShowTheory} className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 flex items-center gap-2">
                  عرض نظرية التغيير <FileOutput className="w-4 h-4" />
                </button>
                <button onClick={handleComplete} className="px-8 py-3 bg-gradient-to-l from-rose-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-xl flex items-center gap-2">
                  أكملت المهمة! +100 XP ✨
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Theory of Change */}
        {phase === 'theory' && (
          <motion.div key="theory" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="py-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Globe className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">نظرية التغيير</h2>
              <p className="text-gray-500">خارطة الأثر لمبادرتك</p>
            </div>

            {/* Visual Flow */}
            <div className="grid grid-cols-7 gap-1 mb-8">
              {canvasItems.slice(0, 7).map((item, i) => (
                <div key={item.id} className={`text-center p-2 rounded-xl text-xs font-bold ${canvas[item.field]?.trim() ? 'bg-gradient-to-b from-rose-100 to-pink-50 text-rose-800' : 'bg-gray-100 text-gray-400'}`}>
                  <div className="text-lg mb-1">{fieldIcons[item.field] || '📝'}</div>
                  <div className="truncate">{item.label}</div>
                  {i < 6 && <div className="text-gray-300 mt-1">↓</div>}
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl border border-indigo-100 p-6 md:p-8 shadow-lg mb-6">
              <pre className="whitespace-pre-wrap text-gray-700 leading-relaxed font-sans text-sm md:text-base" dir="rtl">
                {theory}
              </pre>
            </div>

            <div className="flex justify-between">
              <button onClick={() => setPhase('analysis')} className="px-6 py-3 text-gray-500 hover:text-gray-700 flex items-center gap-2"><ArrowRight className="w-4 h-4" /> رجوع</button>
              <button onClick={handleComplete} className="px-8 py-3 bg-gradient-to-l from-rose-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-xl flex items-center gap-2">
                أكملت المهمة! +100 XP ✨
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
