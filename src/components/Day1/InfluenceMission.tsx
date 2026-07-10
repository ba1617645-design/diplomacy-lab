import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../../store/AppContext';
import { generateInfluenceReport } from '../../utils/aiSimulator';
import { ArrowLeft, ArrowRight, Check, Sparkles, User, BarChart3, Brain } from 'lucide-react';

type Screen = 'welcome' | 'person' | 'cards' | 'map' | 'choice' | 'report';

const influenceCards = [
  { id: 'المعرفة', label: 'المعرفة', color: 'bg-blue-500', hoverColor: 'hover:bg-blue-600', icon: '📚' },
  { id: 'القيم', label: 'القيم', color: 'bg-green-500', hoverColor: 'hover:bg-green-600', icon: '💎' },
  { id: 'العلاقات', label: 'العلاقات', color: 'bg-yellow-500', hoverColor: 'hover:bg-yellow-600', icon: '🤝' },
  { id: 'المنصب', label: 'المنصب', color: 'bg-purple-500', hoverColor: 'hover:bg-purple-600', icon: '🏛️' },
  { id: 'السمعة', label: 'السمعة', color: 'bg-red-500', hoverColor: 'hover:bg-red-600', icon: '⭐' },
];

const developmentOptions = [
  { id: 'المعرفة', label: 'المعرفة', icon: '📚' },
  { id: 'العلاقات', label: 'العلاقات', icon: '🤝' },
  { id: 'السمعة', label: 'السمعة', icon: '⭐' },
  { id: 'القيادة', label: 'القيادة', icon: '👑' },
  { id: 'التواصل', label: 'التواصل', icon: '💬' },
];

export default function InfluenceMission() {
  const navigate = useNavigate();
  const { state, dispatch } = useAppState();
  const [screen, setScreen] = useState<Screen>('welcome');
  const [person, setPerson] = useState('');
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [developmentChoice, setDevelopmentChoice] = useState('');
  const [_reportGenerated, setReportGenerated] = useState(false);

  const handleNext = () => {
    if (screen === 'welcome') setScreen('person');
    else if (screen === 'person' && person.trim()) setScreen('cards');
    else if (screen === 'cards' && selectedCards.length > 0) setScreen('map');
    else if (screen === 'map') setScreen('choice');
    else if (screen === 'choice' && developmentChoice) {
      // Generate AI report
      const report = generateInfluenceReport(person, selectedCards);
      dispatch({ type: 'UPDATE_PROFILE', payload: {
        influencePerson: person,
        influenceCards: selectedCards,
        topInfluenceSources: selectedCards.slice(0, 2),
        developmentChoice,
        aiReport: report,
        scores: { ...state.userProfile.scores, influence: 85 },
      }});
      setReportGenerated(true);
      setScreen('report');
    }
  };

  const handleComplete = () => {
    dispatch({ type: 'COMPLETE_MISSION', payload: 'day1' });
    dispatch({ type: 'ADD_XP', payload: 100 });
    navigate('/');
  };

  const toggleCard = (cardId: string) => {
    setSelectedCards(prev =>
      prev.includes(cardId) ? prev.filter(c => c !== cardId) : [...prev, cardId]
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-indigo-600">المهمة الأولى: اكتشف نفوذك المجتمعي</span>
          <span className="text-xs text-gray-500">
            {screen === 'welcome' ? '1/6' : screen === 'person' ? '2/6' : screen === 'cards' ? '3/6' : screen === 'map' ? '4/6' : screen === 'choice' ? '5/6' : '6/6'}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="h-2 rounded-full bg-gradient-to-l from-indigo-500 to-purple-500"
            initial={{ width: '0%' }}
            animate={{
              width: screen === 'welcome' ? '16%' : screen === 'person' ? '32%' : screen === 'cards' ? '48%' : screen === 'map' ? '64%' : screen === 'choice' ? '80%' : '100%',
            }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* Screen 1: Welcome */}
        {screen === 'welcome' && (
          <motion.div
            key="welcome"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: -20 }}
            className="text-center py-12"
          >
            <motion.div variants={itemVariants} className="text-6xl mb-6">🌍</motion.div>
            <motion.h1 variants={itemVariants} className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              مرحباً...
            </motion.h1>
            <motion.p variants={itemVariants} className="text-xl text-gray-600 mb-8 max-w-lg mx-auto leading-relaxed">
              خلال دقائق ستكتشف كيف يتشكل النفوذ المجتمعي الحقيقي
            </motion.p>
            <motion.div variants={itemVariants}>
              <button
                onClick={handleNext}
                className="px-10 py-4 bg-gradient-to-l from-indigo-600 to-purple-600 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all animate-pulse-glow"
              >
                ابدأ التجربة
              </button>
            </motion.div>
          </motion.div>
        )}

        {/* Screen 2: Person */}
        {screen === 'person' && (
          <motion.div
            key="person"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: -20 }}
            className="py-8"
          >
            <motion.h2 variants={itemVariants} className="text-2xl font-bold text-gray-900 mb-4">
              من هو الشخص الذي ترك أكبر أثر إيجابي في حياتك؟
            </motion.h2>
            <motion.p variants={itemVariants} className="text-gray-500 mb-6">
              فكر في شخص ألهمك أو غيّر نظرتك للحياة
            </motion.p>
            <motion.div variants={itemVariants}>
              <textarea
                value={person}
                onChange={(e) => setPerson(e.target.value)}
                placeholder="اكتب اسم الشخص وعلاقتك به..."
                className="w-full h-32 p-4 border-2 border-indigo-100 rounded-2xl text-lg focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-50 resize-none transition-all"
                dir="rtl"
              />
            </motion.div>
            <motion.div variants={itemVariants} className="mt-6 flex justify-between">
              <button onClick={() => setScreen('welcome')} className="px-6 py-3 text-gray-500 hover:text-gray-700 transition-colors flex items-center gap-2">
                <ArrowRight className="w-4 h-4" /> رجوع
              </button>
              <button
                onClick={handleNext}
                disabled={!person.trim()}
                className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                التالي <ArrowLeft className="w-4 h-4" />
              </button>
            </motion.div>
          </motion.div>
        )}

        {/* Screen 3: Cards */}
        {screen === 'cards' && (
          <motion.div
            key="cards"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: -20 }}
            className="py-8"
          >
            <motion.div variants={itemVariants} className="text-center mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-10 h-10 text-indigo-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{person}</h2>
              <p className="text-gray-500">اختر مصادر النفوذ التي اعتمد عليها هذا الشخص</p>
            </motion.div>
            <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {influenceCards.map(card => (
                <button
                  key={card.id}
                  onClick={() => toggleCard(card.id)}
                  className={`relative p-6 rounded-2xl border-2 transition-all text-center ${
                    selectedCards.includes(card.id)
                      ? `${card.color} border-white text-white shadow-xl scale-105`
                      : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  <div className="text-3xl mb-2">{card.icon}</div>
                  <div className="font-bold">{card.label}</div>
                  {selectedCards.includes(card.id) && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -left-2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow"
                    >
                      <Check className="w-4 h-4 text-green-500" />
                    </motion.div>
                  )}
                </button>
              ))}
            </motion.div>
            <motion.div variants={itemVariants} className="mt-6 flex justify-between">
              <button onClick={() => setScreen('person')} className="px-6 py-3 text-gray-500 hover:text-gray-700 flex items-center gap-2">
                <ArrowRight className="w-4 h-4" /> رجوع
              </button>
              <button
                onClick={handleNext}
                disabled={selectedCards.length === 0}
                className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                متابعة <ArrowLeft className="w-4 h-4" />
              </button>
            </motion.div>
          </motion.div>
        )}

        {/* Screen 4: Influence Map */}
        {screen === 'map' && (
          <motion.div
            key="map"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: -20 }}
            className="py-8"
          >
            <motion.h2 variants={itemVariants} className="text-2xl font-bold text-gray-900 text-center mb-8">
              🗺️ خريطة النفوذ
            </motion.h2>

            <motion.div variants={itemVariants} className="relative w-72 h-72 mx-auto mb-8">
              {/* Center circle */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-xl z-10">
                {person}
              </div>
              
              {/* Card positions around the circle */}
              {influenceCards.map((card, index) => {
                const angle = (index * 72 - 90) * (Math.PI / 180);
                const radius = 120;
                const x = Math.cos(angle) * radius + 144 - 56;
                const y = Math.sin(angle) * radius + 144 - 40;
                const isSelected = selectedCards.includes(card.id);
                
                return (
                  <motion.div
                    key={card.id}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.15 }}
                    className={`absolute w-28 h-20 rounded-xl flex items-center justify-center text-sm font-bold shadow-lg transition-all ${
                      isSelected
                        ? card.color + ' text-white scale-110 shadow-xl'
                        : 'bg-gray-100 text-gray-400 opacity-50'
                    }`}
                    style={{ left: x, top: y }}
                  >
                    <div className="text-center">
                      <div className="text-xl">{card.icon}</div>
                      <div>{card.label}</div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            <motion.div variants={itemVariants} className="bg-indigo-50 rounded-2xl p-6 text-center">
              <h3 className="font-bold text-gray-900 mb-3">أكثر مصدر نفوذ اعتمد عليه هذا الشخص هو</h3>
              <div className="flex justify-center gap-3 flex-wrap">
                {selectedCards.slice(0, 2).map(card => (
                  <span key={card} className="px-4 py-2 bg-white rounded-xl shadow-sm text-gray-800 font-medium flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" /> {card}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="mt-6 flex justify-between">
              <button onClick={() => setScreen('cards')} className="px-6 py-3 text-gray-500 hover:text-gray-700 flex items-center gap-2">
                <ArrowRight className="w-4 h-4" /> رجوع
              </button>
              <button onClick={handleNext} className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-all flex items-center gap-2">
                التالي <ArrowLeft className="w-4 h-4" />
              </button>
            </motion.div>
          </motion.div>
        )}

        {/* Screen 5: Development Choice */}
        {screen === 'choice' && (
          <motion.div
            key="choice"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: -20 }}
            className="py-8"
          >
            <motion.h2 variants={itemVariants} className="text-2xl font-bold text-gray-900 mb-4 text-center">
              لو أردت أن تصبح قائداً مؤثراً...
            </motion.h2>
            <motion.p variants={itemVariants} className="text-gray-500 mb-8 text-center">
              ما أول عنصر ستعمل على تطويره؟
            </motion.p>
            <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-lg mx-auto">
              {developmentOptions.map(option => (
                <button
                  key={option.id}
                  onClick={() => setDevelopmentChoice(option.id)}
                  className={`p-4 rounded-2xl border-2 transition-all text-center ${
                    developmentChoice === option.id
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-md'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{option.icon}</div>
                  <div className="font-bold text-sm">{option.label}</div>
                </button>
              ))}
            </motion.div>
            <motion.div variants={itemVariants} className="mt-6 flex justify-between">
              <button onClick={() => setScreen('map')} className="px-6 py-3 text-gray-500 hover:text-gray-700 flex items-center gap-2">
                <ArrowRight className="w-4 h-4" /> رجوع
              </button>
              <button
                onClick={handleNext}
                disabled={!developmentChoice}
                className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                احصل على تحليلك <Sparkles className="w-4 h-4" />
              </button>
            </motion.div>
          </motion.div>
        )}

        {/* Screen 6: AI Report */}
        {screen === 'report' && (
          <motion.div
            key="report"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: -20 }}
            className="py-8"
          >
            <motion.div variants={itemVariants} className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Brain className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">تحليلك الشخصي</h2>
              <p className="text-gray-500">تقرير مدعوم بالذكاء الاصطناعي</p>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-indigo-100 p-6 md:p-8 shadow-lg mb-6">
              <pre className="whitespace-pre-wrap text-gray-700 leading-relaxed font-sans text-sm md:text-base" dir="rtl">
                {state.userProfile.aiReport || 'جاري إنشاء التقرير...'}
              </pre>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-gradient-to-l from-indigo-50 to-purple-50 rounded-2xl p-6 mb-6">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-indigo-500" />
                ملخص النتائج
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">مستوى التحليل</span>
                    <span className="font-bold text-indigo-600">متقدم</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="h-2 rounded-full bg-indigo-500" style={{ width: '92%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">دقة التوصيات</span>
                    <span className="font-bold text-indigo-600">عالية</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="h-2 rounded-full bg-purple-500" style={{ width: '88%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">التطابق مع نمط القيادة</span>
                    <span className="font-bold text-indigo-600">ممتاز</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="h-2 rounded-full bg-amber-500" style={{ width: '95%' }} />
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex justify-between">
              <button
                onClick={() => navigate('/')}
                className="px-6 py-3 text-gray-500 hover:text-gray-700 flex items-center gap-2"
              >
                <ArrowRight className="w-4 h-4" /> العودة للرئيسية
              </button>
              <button
                onClick={handleComplete}
                className="px-8 py-3 bg-gradient-to-l from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-xl transition-all flex items-center gap-2"
              >
                أكملت المهمة! ✅ احصل على 100 XP
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
