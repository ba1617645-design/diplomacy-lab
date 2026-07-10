import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../../store/AppContext';
import { generateNegotiationScores, generateAIBotResponse } from '../../utils/aiSimulator';
import { Send, MessageSquare, Users, Target, DollarSign, AlertTriangle, BarChart3, Sparkles, RotateCcw, Timer, XCircle } from 'lucide-react';

type Phase = 'intro' | 'brief' | 'chat' | 'results';

export default function NegotiationSimulation() {
  const navigate = useNavigate();
  const { state, dispatch } = useAppState();
  const [phase, setPhase] = useState<Phase>('intro');
  const [chatInput, setChatInput] = useState('');
  const [botTimeout, setBotTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [showScores, setShowScores] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const playerTeam = state.negotiation?.teams?.[0] || { name: 'وزارة الشباب', isPlayer: true, interests: '', budget: '', redLines: '' };

  // Timer effect
  useEffect(() => {
    if (phase !== 'chat' || state.negotiation.finished) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          dispatch({ type: 'SET_NEGOTIATION_TIMER', payload: 0 });
          return 0;
        }
        const newTime = prev - 1;
        dispatch({ type: 'SET_NEGOTIATION_TIMER', payload: newTime });
        return newTime;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [phase, state.negotiation.finished, dispatch]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.negotiation.messages]);

  // Auto-finish when timer hits 0
  useEffect(() => {
    if (timeLeft === 0 && phase === 'chat' && !state.negotiation.finished) {
      finishNegotiation();
    }
  }, [timeLeft]);

  const startNegotiation = () => {
    dispatch({ type: 'START_NEGOTIATION' });
    setPhase('brief');
  };

  const goToChat = () => {
    setPhase('chat');
    dispatch({
      type: 'ADD_NEGOTIATION_MESSAGE',
      payload: { from: 'النظام', text: `🎯 مرحباً بكم في محاكاة التفاوض!\n\nالهدف: بناء تحالف لتنظيم مؤتمر دولي للشباب.\n⏱ المدة المتبقية: 5 دقائق\n🔄 لديك 3 محاولات إعادة تفاوض.\n\nابدأ المفاوضات!`, timestamp: Date.now() },
    });
  };

  const sendMessage = () => {
    if (!chatInput.trim() || state.negotiation.finished) return;

    dispatch({
      type: 'ADD_NEGOTIATION_MESSAGE',
      payload: { from: 'أنت (وزارة الشباب)', text: chatInput, timestamp: Date.now() },
    });
    setChatInput('');

    if (botTimeout) clearTimeout(botTimeout);
    const timeout = setTimeout(() => {
      const otherTeams = (state.negotiation.teams || []).filter((t: any) => !t.isPlayer);
      const targetTeam = selectedTeam ? otherTeams.find((t: any) => t.name === selectedTeam) : otherTeams[Math.floor(Math.random() * otherTeams.length)];
      const team = targetTeam || otherTeams[Math.floor(Math.random() * otherTeams.length)];
      const response = generateAIBotResponse(team.name, chatInput);

      dispatch({
        type: 'ADD_NEGOTIATION_MESSAGE',
        payload: { from: team.name, text: response, timestamp: Date.now() },
      });
    }, 1200);
    setBotTimeout(timeout);
  };

  const useRetry = () => {
    if (state.negotiation.retriesLeft <= 0) return;
    dispatch({ type: 'USE_RETRY' });
    setTimeLeft(300);
  };

  const finishNegotiation = () => {
    if (botTimeout) clearTimeout(botTimeout);
    const scores = generateNegotiationScores();
    dispatch({ type: 'FINISH_NEGOTIATION', payload: scores });
    dispatch({
      type: 'UPDATE_PROFILE',
      payload: {
        negotiationScore: scores,
        scores: { ...state.userProfile.scores, negotiation: Math.round((scores.negotiation + scores.alliance + scores.communication + scores.time) / 4) },
      },
    });
    setPhase('results');
    setTimeout(() => setShowScores(true), 500);
  };

  const handleComplete = () => {
    dispatch({ type: 'COMPLETE_MISSION', payload: 'day3' });
    dispatch({ type: 'ADD_XP', payload: 100 });
    navigate('/');
  };

  const formatTime = (ts: number) => new Date(ts).toLocaleTimeString('ar-SA', { hour: '2-digit' as any, minute: '2-digit' as any });
  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const timerPercent = (timeLeft / 300) * 100;
  const timerColor = timeLeft > 180 ? 'bg-green-500' : timeLeft > 60 ? 'bg-amber-500' : 'bg-red-500';

  const otherTeams = (state.negotiation.teams || []).filter((t: any) => !t.isPlayer);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-amber-600">اليوم الثالث: محاكاة التفاوض - 6 فرق</span>
          <span className="text-xs text-gray-500">{phase === 'intro' ? '1/4' : phase === 'brief' ? '2/4' : phase === 'chat' ? '3/4' : '4/4'}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div className="h-2 rounded-full bg-gradient-to-l from-amber-500 to-orange-500" initial={{ width: '0%' }} animate={{ width: phase === 'intro' ? '25%' : phase === 'brief' ? '50%' : phase === 'chat' ? '75%' : '100%' }} transition={{ duration: 0.5 }} />
        </div>
      </div>

      {/* Timer Bar - Always visible during chat */}
      {phase === 'chat' && !state.negotiation.finished && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Timer className={`w-5 h-5 ${timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-amber-500'}`} />
              <span className={`font-bold ${timeLeft < 60 ? 'text-red-500' : 'text-gray-900'}`}>{formatTimer(timeLeft)}</span>
              <span className="text-xs text-gray-400">متبقي</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <RotateCcw className="w-3 h-3" />
                <span>إعادة التفاوض: {state.negotiation.retriesLeft}/{state.negotiation.totalRetries}</span>
              </div>
              <button onClick={useRetry} disabled={state.negotiation.retriesLeft <= 0} className="px-3 py-1.5 bg-amber-100 text-amber-700 rounded-lg text-xs font-bold hover:bg-amber-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1">
                <RotateCcw className="w-3 h-3" /> إعادة تفاوض
              </button>
              <button onClick={finishNegotiation} className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-xs font-bold hover:bg-red-200 transition-all flex items-center gap-1">
                <XCircle className="w-3 h-3" /> إنهاء
              </button>
            </div>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5">
            <motion.div animate={{ width: `${timerPercent}%` }} transition={{ duration: 0.5 }} className={`h-2.5 rounded-full ${timerColor} shadow-sm`} />
          </div>
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {/* Intro */}
        {phase === 'intro' && (
          <motion.div key="intro" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-center py-12">
            <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Users className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">محاكاة التفاوض</h2>
            <p className="text-gray-600 mb-6 max-w-xl mx-auto">
              محاكاة تفاعلية بـ <strong>6 فرق</strong>، كل فريق يمثل جهة مختلفة.<br />
              ⏱ المدة: <strong>5 دقائق</strong> | 🔄 <strong>3 محاولات</strong> إعادة تفاوض
            </p>
            <p className="text-lg text-gray-500 mb-4">أنت الآن تمثل</p>
            <div className="inline-block px-8 py-4 bg-gradient-to-l from-amber-500 to-orange-500 rounded-2xl text-white text-2xl font-bold shadow-xl mb-8">
              {playerTeam.name}
            </div>
            <div className="flex justify-center gap-3 flex-wrap mb-8">
              {otherTeams.map((t: any) => (
                <span key={t.name} className="px-3 py-1.5 bg-gray-100 rounded-xl text-xs text-gray-600 font-medium">{t.name}</span>
              ))}
            </div>
            <button onClick={startNegotiation} className="px-10 py-4 bg-gradient-to-l from-amber-600 to-orange-600 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all">
              ابدأ المحاكاة
            </button>
          </motion.div>
        )}

        {/* Brief */}
        {phase === 'brief' && (
          <motion.div key="brief" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="py-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">🎯 الفرق المشاركة (6 فرق)</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {(state.negotiation.teams || []).map((team: any, i: number) => (
                <motion.div key={team.name} initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className={`bg-white rounded-2xl border-2 p-4 shadow-sm ${team.isPlayer ? 'border-amber-400 bg-amber-50 ring-2 ring-amber-200' : 'border-gray-100'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2 text-sm">
                      <Users className={`w-4 h-4 ${team.isPlayer ? 'text-amber-500' : 'text-gray-400'}`} />
                      {team.name}
                    </h3>
                    {team.isPlayer && <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-lg text-xs font-bold">أنت</span>}
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-1.5 text-gray-600"><Target className="w-3 h-3 text-indigo-400 flex-shrink-0" /> {team.interests}</div>
                    <div className="flex items-center gap-1.5 text-gray-600"><DollarSign className="w-3 h-3 text-green-400 flex-shrink-0" /> {team.budget}</div>
                    <div className="flex items-center gap-1.5 text-gray-600"><AlertTriangle className="w-3 h-3 text-red-400 flex-shrink-0" /> {team.redLines}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="bg-gradient-to-l from-indigo-50 to-purple-50 rounded-2xl p-5 mb-6 border border-indigo-100">
              <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2 text-sm"><Target className="w-4 h-4 text-indigo-500" /> المهمة</h3>
              <p className="text-gray-700 text-sm">بناء تحالف لتنظيم مؤتمر دولي للشباب. تفاوض مع 5 فرق أخرى، لكل منها مصالحه وخطوطه الحمراء.</p>
              <div className="flex gap-4 mt-3 text-xs text-gray-500">
                <span className="flex items-center gap-1">⏱ المدة: 5 دقائق</span>
                <span className="flex items-center gap-1">🔄 3 محاولات إعادة تفاوض</span>
              </div>
            </div>

            <div className="flex justify-between">
              <button onClick={() => setPhase('intro')} className="px-6 py-3 text-gray-500 hover:text-gray-700 flex items-center gap-2"><span>→</span> رجوع</button>
              <button onClick={goToChat} className="px-8 py-3 bg-amber-600 text-white rounded-xl font-medium hover:bg-amber-700 flex items-center gap-2">
                ابدأ التفاوض <MessageSquare className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Chat */}
        {phase === 'chat' && (
          <motion.div key="chat" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="py-2">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-amber-500" /> غرفة التفاوض
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">الرد على:</span>
                <select value={selectedTeam} onChange={(e) => setSelectedTeam(e.target.value)} className="text-xs border border-gray-200 rounded-lg p-1.5 bg-white">
                  <option value="">الكل (عشوائي)</option>
                  {otherTeams.map((t: any) => <option key={t.name} value={t.name}>{t.name}</option>)}
                </select>
              </div>
            </div>

            {/* Chat messages */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm h-[350px] overflow-y-auto mb-3 p-4">
              <div className="space-y-3">
                {(state.negotiation.messages || []).map((msg: any, i: number) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex ${msg.from === 'أنت (وزارة الشباب)' ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-[85%] rounded-2xl p-3 ${msg.from === 'أنت (وزارة الشباب)' ? 'bg-indigo-500 text-white rounded-br-md' : msg.from === 'النظام' ? 'bg-gray-100 text-gray-600 text-xs text-center w-full' : 'bg-amber-50 text-gray-800 border border-amber-100 rounded-bl-md'}`}>
                      {msg.from !== 'النظام' && <div className={`text-xs font-bold mb-1 ${msg.from === 'أنت (وزارة الشباب)' ? 'text-indigo-200' : 'text-amber-600'}`}>{msg.from}</div>}
                      <div className="text-sm whitespace-pre-wrap">{msg.text}</div>
                      <div className={`text-xs mt-1 ${msg.from === 'أنت (وزارة الشباب)' ? 'text-indigo-300' : 'text-gray-400'}`}>{formatTime(msg.timestamp)}</div>
                    </div>
                  </motion.div>
                ))}
                <div ref={chatEndRef} />
              </div>
            </div>

            {/* Chat input */}
            <div className="flex gap-2">
              <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMessage()} placeholder="اكتب رسالتك التفاوضية..." className="flex-1 p-3.5 border-2 border-gray-200 rounded-2xl text-sm focus:border-amber-400 focus:outline-none focus:ring-4 focus:ring-amber-50 transition-all" disabled={timeLeft === 0 || state.negotiation.finished} />
              <button onClick={sendMessage} disabled={!chatInput.trim() || timeLeft === 0 || state.negotiation.finished} className="px-5 py-3.5 bg-amber-600 text-white rounded-2xl hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                <Send className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Results */}
        {phase === 'results' && (
          <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <BarChart3 className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">نتائج التفاوض</h2>
              <p className="text-gray-500">تقرير أدائك في محاكاة التفاوض مع 6 فرق</p>
            </div>

            <AnimatePresence>
              {showScores && (
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: 'التفاوض', value: state.negotiation.scores.negotiation, color: 'bg-indigo-500', icon: '🤝' },
                      { label: 'بناء التحالف', value: state.negotiation.scores.alliance, color: 'bg-emerald-500', icon: '🏗️' },
                      { label: 'التواصل', value: state.negotiation.scores.communication, color: 'bg-blue-500', icon: '💬' },
                      { label: 'إدارة الوقت', value: state.negotiation.scores.time, color: 'bg-amber-500', icon: '⏰' },
                    ].map(score => (
                      <div key={score.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-center">
                        <div className="text-3xl mb-2">{score.icon}</div>
                        <div className="text-3xl font-bold text-gray-900 mb-1">{score.value}%</div>
                        <div className="text-sm text-gray-500">{score.label}</div>
                        <div className="w-full bg-gray-100 rounded-full h-2 mt-2">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${score.value}%` }} transition={{ duration: 1, delay: 0.3 }} className={`h-2 rounded-full ${score.color}`} />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-gradient-to-l from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Sparkles className="w-5 h-5 text-indigo-500" /> تقرير الذكاء الاصطناعي</h3>
                    <div className="space-y-3 text-sm text-gray-700">
                      <p>• <strong>المشاركون:</strong> 6 فرق (حكومة، دولي، قطاع خاص، إعلام، متطوعون، أكاديميا)</p>
                      <p>• مستوى التفاوض: <strong>{state.negotiation.scores.negotiation >= 85 ? 'متقدم جداً' : state.negotiation.scores.negotiation >= 70 ? 'جيد' : 'قيد التطوير'}</strong></p>
                      <p>• استخدام إعادة التفاوض: <strong>{state.negotiation.totalRetries - state.negotiation.retriesLeft} من {state.negotiation.totalRetries}</strong></p>
                      <p>• إدارة الوقت: <strong>{state.negotiation.scores.time >= 80 ? 'ممتازة' : 'بحاجة للتحسين'}</strong></p>
                      <p className="text-xs text-gray-400 mt-4">* التحليل مبني على أدائك في المحاكاة.</p>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <button onClick={() => navigate('/')} className="px-6 py-3 text-gray-500 hover:text-gray-700 flex items-center gap-2"><span>→</span> العودة للرئيسية</button>
                    <button onClick={handleComplete} className="px-8 py-3 bg-gradient-to-l from-amber-600 to-orange-600 text-white rounded-xl font-bold hover:shadow-xl flex items-center gap-2">
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
