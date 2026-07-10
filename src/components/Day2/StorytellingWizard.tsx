import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../../store/AppContext';
import { generateStoryNarrative, generateStoryQualityScores } from '../../utils/aiSimulator';
import { ArrowLeft, ArrowRight, Sparkles, BookOpen, BarChart3, ThumbsUp, Star, MessageSquare, Send } from 'lucide-react';

type Step = 'issue' | 'audience' | 'message' | 'feeling' | 'narrative' | 'quality' | 'published';

const audienceOptions = [
  { id: 'الشباب', label: 'الشباب', icon: '🧑‍🎤' },
  { id: 'الحكومة', label: 'الحكومة', icon: '🏛️' },
  { id: 'الإعلام', label: 'الإعلام', icon: '📺' },
  { id: 'المجتمع', label: 'المجتمع', icon: '👥' },
  { id: 'المؤسسات', label: 'المؤسسات', icon: '🏢' },
];

const feelingOptions = [
  { id: 'إلهام', label: 'إلهام', icon: '✨', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  { id: 'تعاطف', label: 'تعاطف', icon: '💗', color: 'bg-pink-100 text-pink-700 border-pink-200' },
  { id: 'حماس', label: 'حماس', icon: '🔥', color: 'bg-orange-100 text-orange-700 border-orange-200' },
  { id: 'ثقة', label: 'ثقة', icon: '💪', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { id: 'خوف', label: 'خوف', icon: '😨', color: 'bg-gray-100 text-gray-700 border-gray-200' },
  { id: 'أمل', label: 'أمل', icon: '🌟', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
];

const issueSuggestions = ['التطوع', 'الشباب', 'المناخ', 'الأسرة', 'التعليم', 'الصحة', 'التكنولوجيا', 'المياه', 'الطاقة', 'العدالة'];

export default function StorytellingWizard() {
  const navigate = useNavigate();
  const { state, dispatch } = useAppState();
  const [step, setStep] = useState<Step>('issue');
  const [issue, setIssue] = useState('');
  const [audience, setAudience] = useState('');
  const [message, setMessage] = useState('');
  const [feeling, setFeeling] = useState('');
  const [narrative, setNarrative] = useState('');
  const [scores, setScores] = useState({ persuasion: 0, emotion: 0, clarity: 0, impact: 0 });
  const [comment, setComment] = useState('');

  const generateNarrative = () => {
    const fullNarrative = generateStoryNarrative(issue, audience, message, feeling);
    const qualityScores = generateStoryQualityScores(issue, message);
    setNarrative(fullNarrative);
    setScores(qualityScores);
    dispatch({ type: 'SET_STORY', payload: { issue, audience, message, feeling, fullNarrative, qualityScores } });
    setStep('narrative');
  };

  const handlePublish = () => {
    dispatch({ type: 'COMPLETE_MISSION', payload: 'day2' });
    dispatch({ type: 'ADD_XP', payload: 100 });
    dispatch({ type: 'UPDATE_PROFILE', payload: { scores: { ...state.userProfile.scores, storytelling: Math.round((scores.persuasion + scores.emotion + scores.clarity + scores.impact) / 4) } } });
    setStep('published');
  };

  const handleVote = (type: 'like' | 'star') => {
    const currentStory = state.story;
    const currentVotes = currentStory?.votes || { like: 0, star: 0, comments: [] };
    dispatch({ type: 'SET_STORY', payload: {
      votes: {
        like: type === 'like' ? currentVotes.like + 1 : currentVotes.like,
        star: type === 'star' ? currentVotes.star + 1 : currentVotes.star,
        comments: currentVotes.comments,
      }
    }});
  };

  const handleComment = () => {
    if (comment.trim()) {
      const currentStory = state.story;
      const currentVotes = currentStory?.votes || { like: 0, star: 0, comments: [] };
      dispatch({ type: 'SET_STORY', payload: {
        votes: { ...currentVotes, comments: [...currentVotes.comments, comment] }
      }});
      setComment('');
    }
  };

  const progress = step === 'issue' ? '14%' : step === 'audience' ? '28%' : step === 'message' ? '42%' : step === 'feeling' ? '56%' : step === 'narrative' ? '70%' : step === 'quality' ? '85%' : '100%';

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-emerald-600">اليوم الثاني: ورشة صناعة السرد</span>
          <span className="text-xs text-gray-500">{step}/7</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div className="h-2 rounded-full bg-gradient-to-l from-emerald-500 to-teal-500" initial={{ width: '0%' }} animate={{ width: progress }} transition={{ duration: 0.5 }} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: Issue */}
        {step === 'issue' && (
          <motion.div key="issue" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="py-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">اختر قضية تريد الدفاع عنها</h2>
            <p className="text-gray-500 mb-6">اختر من القائمة أو اكتب موضوعك الخاص</p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
              {issueSuggestions.map(s => (
                <button key={s} onClick={() => setIssue(s)} className={`p-4 rounded-2xl border-2 transition-all text-center ${issue === s ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                  <div className="text-2xl mb-1">
                    {s === 'التطوع' ? '🤝' : s === 'الشباب' ? '🧑‍🤝‍🧑' : s === 'المناخ' ? '🌍' : s === 'الأسرة' ? '👨‍👩‍👧‍👦' : s === 'التعليم' ? '📚' : s === 'الصحة' ? '🏥' : s === 'التكنولوجيا' ? '💻' : s === 'المياه' ? '💧' : s === 'الطاقة' ? '⚡' : '⚖️'}
                  </div>
                  <div className="font-bold text-sm">{s}</div>
                </button>
              ))}
            </div>
            <div className="relative">
              <input type="text" value={issue} onChange={(e) => setIssue(e.target.value)} placeholder="أو اكتب موضوعاً..." className="w-full p-4 border-2 border-gray-200 rounded-2xl text-lg focus:border-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-50 transition-all" />
            </div>
            <div className="mt-6 flex justify-between">
              <button onClick={() => navigate('/')} className="px-6 py-3 text-gray-500 hover:text-gray-700 flex items-center gap-2"><ArrowRight className="w-4 h-4" /> رجوع</button>
              <button onClick={() => setStep('audience')} disabled={!issue.trim()} className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">التالي <ArrowLeft className="w-4 h-4" /></button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Audience */}
        {step === 'audience' && (
          <motion.div key="audience" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="py-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">من هو جمهورك؟</h2>
            <p className="text-gray-500 mb-6">اختر الفئة التي تريد التأثير فيها</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-lg mx-auto">
              {audienceOptions.map(a => (
                <button key={a.id} onClick={() => setAudience(a.id)} className={`p-6 rounded-2xl border-2 transition-all text-center ${audience === a.id ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-md' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                  <div className="text-3xl mb-2">{a.icon}</div>
                  <div className="font-bold">{a.label}</div>
                </button>
              ))}
            </div>
            <div className="mt-6 flex justify-between">
              <button onClick={() => setStep('issue')} className="px-6 py-3 text-gray-500 hover:text-gray-700 flex items-center gap-2"><ArrowRight className="w-4 h-4" /> رجوع</button>
              <button onClick={() => setStep('message')} disabled={!audience} className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">التالي <ArrowLeft className="w-4 h-4" /></button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Message */}
        {step === 'message' && (
          <motion.div key="message" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="py-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">ما الرسالة الأساسية؟</h2>
            <p className="text-gray-500 mb-6">اكتب الرسالة التي تريد أن يوصلها سردك</p>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="اكتب رسالتك الأساسية هنا..." className="w-full h-40 p-4 border-2 border-emerald-100 rounded-2xl text-lg focus:border-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-50 resize-none transition-all" />
            <div className="mt-2 text-sm text-gray-400 text-left">{message.length} حرف</div>
            <div className="mt-6 flex justify-between">
              <button onClick={() => setStep('audience')} className="px-6 py-3 text-gray-500 hover:text-gray-700 flex items-center gap-2"><ArrowRight className="w-4 h-4" /> رجوع</button>
              <button onClick={() => setStep('feeling')} disabled={!message.trim()} className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">التالي <ArrowLeft className="w-4 h-4" /></button>
            </div>
          </motion.div>
        )}

        {/* Step 4: Feeling */}
        {step === 'feeling' && (
          <motion.div key="feeling" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="py-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">كيف تريد أن يشعر جمهورك؟</h2>
            <p className="text-gray-500 mb-6">اختر المشاعر التي تريد إثارتها</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {feelingOptions.map(f => (
                <button key={f.id} onClick={() => setFeeling(f.id)} className={`p-6 rounded-2xl border-2 transition-all text-center ${feeling === f.id ? f.color + ' shadow-md scale-105' : 'bg-white border-gray-200 hover:border-gray-300'}`}>
                  <div className="text-4xl mb-2">{f.icon}</div>
                  <div className="font-bold">{f.label}</div>
                </button>
              ))}
            </div>
            <div className="mt-6 flex justify-between">
              <button onClick={() => setStep('message')} className="px-6 py-3 text-gray-500 hover:text-gray-700 flex items-center gap-2"><ArrowRight className="w-4 h-4" /> رجوع</button>
              <button onClick={generateNarrative} disabled={!feeling} className="px-8 py-3 bg-gradient-to-l from-emerald-600 to-teal-600 text-white rounded-xl font-bold hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                أنشئ السرد بالذكاء الاصطناعي <Sparkles className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 5: Narrative */}
        {step === 'narrative' && (
          <motion.div key="narrative" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="py-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">السرد القصصي</h2>
                <p className="text-sm text-gray-500">تم إنشاؤه بواسطة الذكاء الاصطناعي</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-emerald-100 p-6 md:p-8 shadow-lg mb-6 whitespace-pre-wrap text-gray-700 leading-relaxed text-sm md:text-base" dir="rtl">
              {narrative}
            </div>
            <div className="flex justify-between">
              <button onClick={() => setStep('feeling')} className="px-6 py-3 text-gray-500 hover:text-gray-700 flex items-center gap-2"><ArrowRight className="w-4 h-4" /> رجوع</button>
              <button onClick={() => setStep('quality')} className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 flex items-center gap-2">قياس الجودة <BarChart3 className="w-4 h-4" /></button>
            </div>
          </motion.div>
        )}

        {/* Step 6: Quality */}
        {step === 'quality' && (
          <motion.div key="quality" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="py-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">📊 مقياس جودة السرد</h2>
            <p className="text-gray-500 text-center mb-8">تحليل دقيق لسردك القصصي</p>

            <div className="space-y-6 mb-8">
              {[
                { label: 'الإقناع', value: scores.persuasion, color: 'bg-emerald-500' },
                { label: 'العاطفة', value: scores.emotion, color: 'bg-rose-500' },
                { label: 'الوضوح', value: scores.clarity, color: 'bg-blue-500' },
                { label: 'التأثير', value: scores.impact, color: 'bg-amber-500' },
              ].map(metric => (
                <div key={metric.label} className="bg-white rounded-2xl p-4 border border-gray-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-gray-700">{metric.label}</span>
                    <span className={`text-lg font-bold ${metric.color.replace('bg-', 'text-')}`}>{metric.value}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${metric.value}%` }} transition={{ duration: 1, delay: 0.2 }} className={`h-3 rounded-full ${metric.color} shadow-sm`} />
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-l from-amber-50 to-orange-50 rounded-2xl p-6 mb-6 border border-amber-100">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><Sparkles className="w-5 h-5 text-amber-500" /> اقتراحات للتحسين</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                {scores.persuasion < 85 && <li>• أضف المزيد من الحقائق والإحصائيات لتعزيز الإقناع</li>}
                {scores.emotion < 85 && <li>• استخدم قصصاً شخصية ومشاعر حقيقية لزيادة البعد العاطفي</li>}
                {scores.clarity < 85 && <li>• بسّط الجمل واستخدم لغة أكثر وضوحاً</li>}
                {scores.impact < 85 && <li>• أضف دعوة قوية للعمل في نهاية السرد</li>}
                {(scores.persuasion >= 85 && scores.emotion >= 85 && scores.clarity >= 85 && scores.impact >= 85) && <li>• سردك ممتاز! يمكنك الآن نشره</li>}
              </ul>
            </div>

            <div className="flex justify-between">
              <button onClick={() => setStep('narrative')} className="px-6 py-3 text-gray-500 hover:text-gray-700 flex items-center gap-2"><ArrowRight className="w-4 h-4" /> رجوع</button>
              <button onClick={handlePublish} className="px-8 py-3 bg-gradient-to-l from-emerald-600 to-teal-600 text-white rounded-xl font-bold hover:shadow-xl flex items-center gap-2">
                انشر السرد في المنصة <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 7: Published */}
        {step === 'published' && (
          <motion.div key="published" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="py-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Send className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">تم النشر بنجاح! 🎉</h2>
              <p className="text-gray-500">سردك متاح الآن للمشاركة والتصويت</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><BookOpen className="w-5 h-5 text-emerald-500" /> {issue}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{narrative.slice(0, 200)}...</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button onClick={() => handleVote('like')} className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 text-sm hover:bg-blue-100 transition-all">
                    <ThumbsUp className="w-4 h-4" /> {state.story?.votes?.like ?? 0}
                  </button>
                  <button onClick={() => handleVote('star')} className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-50 text-amber-600 text-sm hover:bg-amber-100 transition-all">
                    <Star className="w-4 h-4" /> {state.story?.votes?.star ?? 0}
                  </button>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span>الجمهور: {audience}</span>
                  <span>•</span>
                  <span>{feeling}</span>
                </div>
              </div>
            </div>

            {/* Comments */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><MessageSquare className="w-5 h-5 text-indigo-500" /> التعليقات ({state.story?.votes?.comments?.length ?? 0})</h3>
              <div className="space-y-3 mb-4">
                {(state.story?.votes?.comments ?? []).map((c: any, i: number) => (
                  <div key={i} className="bg-gray-50 rounded-xl p-3 text-sm text-gray-700">💬 {c}</div>
                ))}
                {(state.story?.votes?.comments?.length ?? 0) === 0 && <p className="text-gray-400 text-sm text-center">لا توجد تعليقات بعد</p>}
              </div>
              <div className="flex gap-2">
                <input type="text" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="اكتب تعليقاً..." className="flex-1 p-3 border border-gray-200 rounded-xl focus:border-indigo-400 focus:outline-none text-sm" />
                <button onClick={handleComment} disabled={!comment.trim()} className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm hover:bg-indigo-700 disabled:opacity-50 transition-all">إرسال</button>
              </div>
            </div>

            <div className="flex justify-between">
              <button onClick={() => navigate('/')} className="px-6 py-3 text-gray-500 hover:text-gray-700 flex items-center gap-2"><ArrowRight className="w-4 h-4" /> العودة للرئيسية</button>
              <button onClick={() => { dispatch({ type: 'ADD_XP', payload: 50 }); navigate('/'); }} className="px-8 py-3 bg-gradient-to-l from-emerald-600 to-teal-600 text-white rounded-xl font-bold hover:shadow-xl flex items-center gap-2">
                أكملت المهمة! +100 XP ✨
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
