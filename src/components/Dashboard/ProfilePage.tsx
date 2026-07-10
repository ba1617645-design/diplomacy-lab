import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../../store/AppContext';
import { User, Award, BarChart3, Shield, Zap, Target, Handshake, Sparkles, ArrowRight, Star, Trophy, BadgeCheck } from 'lucide-react';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { state } = useAppState();
  const { userProfile } = state;

  const missionIcons: Record<string, string> = {
    day1: '🔍',
    day2: '📖',
    day3: '🤝',
    day4: '🎯',
  };
  const missionNames: Record<string, string> = {
    day1: 'اكتشف نفوذك المجتمعي',
    day2: 'ورشة صناعة السرد',
    day3: 'محاكاة التفاوض',
    day4: 'من النشاط إلى الأثر',
  };

  const scores = [
    { label: 'النفوذ', value: userProfile.scores.influence, icon: '🔍', color: 'from-violet-500 to-purple-600' },
    { label: 'السرد', value: userProfile.scores.storytelling, icon: '📖', color: 'from-emerald-500 to-teal-600' },
    { label: 'التفاوض', value: userProfile.scores.negotiation, icon: '🤝', color: 'from-amber-500 to-orange-600' },
    { label: 'الأثر', value: userProfile.scores.impact, icon: '🎯', color: 'from-rose-500 to-pink-600' },
  ];

  const levelProgress = (userProfile.xp % 300) / 300 * 100;
  const nextLevelXp = (Math.floor(userProfile.xp / 300) + 1) * 300;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Profile Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
                <User className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">ملفي الشخصي</h1>
                <div className="flex items-center gap-2 text-indigo-200 text-sm">
                  <Trophy className="w-4 h-4" />
                  المستوى {userProfile.level}
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{userProfile.xp}</div>
              <div className="text-xs text-indigo-200">XP</div>
            </div>
          </div>

          {/* XP Bar */}
          <div className="bg-white/20 rounded-full h-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${levelProgress}%` }}
              transition={{ duration: 1 }}
              className="h-3 rounded-full bg-gradient-to-l from-amber-400 to-yellow-300"
            />
          </div>
          <div className="flex justify-between text-xs text-indigo-200 mt-1">
            <span>{userProfile.xp} XP</span>
            <span>{nextLevelXp} XP للمستوى التالي</span>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: Star, label: 'الشارات', value: `${userProfile.badges.filter(b => b.earned).length}/${userProfile.badges.length}`, color: 'text-amber-500 bg-amber-50' },
          { icon: Zap, label: 'المهام', value: `${userProfile.completedMissions.length}/4`, color: 'text-indigo-500 bg-indigo-50' },
          { icon: Award, label: 'المستوى', value: `${userProfile.level}`, color: 'text-purple-500 bg-purple-50' },
          { icon: BadgeCheck, label: 'المعدل', value: `${Math.round((userProfile.scores.influence + userProfile.scores.storytelling + userProfile.scores.negotiation + userProfile.scores.impact) / 4)}%`, color: 'text-emerald-500 bg-emerald-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
            <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mx-auto mb-2`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div className="text-xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-xs text-gray-500">{stat.label}</div>
          </div>
        ))}
      </motion.div>

      {/* Score Cards */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-indigo-500" />
          درجات المهارات
        </h2>
        <div className="grid md:grid-cols-2 gap-3">
          {scores.map((score) => (
            <div key={score.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{score.icon}</span>
                  <span className="font-bold text-gray-700">{score.label}</span>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-l bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(to left, ${score.color.replace('from-', '').split(' ')[0]}, ${score.color.replace('to-', '').split(' ')[0]})` }}>
                  {score.value}%
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${score.value}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className={`h-3 rounded-full bg-gradient-to-l ${score.color} shadow-sm`}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Completed Missions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-rose-500" />
          المهام المنجزة
        </h2>
        <div className="grid md:grid-cols-2 gap-3">
          {['day1', 'day2', 'day3', 'day4'].map((day) => {
            const done = userProfile.completedMissions.includes(day);
            return (
              <div key={day} className={`bg-white rounded-2xl p-4 border-2 shadow-sm ${done ? 'border-emerald-200 bg-emerald-50' : 'border-gray-100'}`}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{missionIcons[day]}</span>
                  <div className="flex-1">
                    <div className="font-bold text-sm text-gray-900">{missionNames[day]}</div>
                    <div className={`text-xs ${done ? 'text-emerald-600' : 'text-gray-400'}`}>
                      {done ? '✓ مكتمل' : 'لم يبدأ بعد'}
                    </div>
                  </div>
                  {done && <Shield className="w-5 h-5 text-emerald-500" />}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Badges */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-500" />
          الشارات
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {userProfile.badges.map((badge) => (
            <div key={badge.id} className={`text-center p-4 rounded-2xl border-2 transition-all ${badge.earned ? 'border-amber-200 bg-amber-50 shadow-sm' : 'border-gray-100 opacity-40'}`}>
              <div className="text-3xl mb-1">{badge.icon}</div>
              <div className="text-xs font-bold text-gray-700">{badge.name}</div>
              {badge.earned && <div className="text-xs text-amber-600 font-medium">✓ مكتسبة</div>}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Negotiation Score (if available) */}
      {userProfile.negotiationScore && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Handshake className="w-5 h-5 text-amber-500" />
            نتائج التفاوض
          </h2>
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: 'التفاوض', value: userProfile.negotiationScore.negotiation, color: 'bg-indigo-500' },
                { label: 'بناء التحالف', value: userProfile.negotiationScore.alliance, color: 'bg-emerald-500' },
                { label: 'التواصل', value: userProfile.negotiationScore.communication, color: 'bg-blue-500' },
                { label: 'إدارة الوقت', value: userProfile.negotiationScore.time, color: 'bg-amber-500' },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <div className="text-lg font-bold text-gray-900">{s.value}%</div>
                  <div className="text-xs text-gray-500">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* AI Report Section */}
      {userProfile.aiReport && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            تقرير الذكاء الاصطناعي
          </h2>
          <div className="bg-gradient-to-l from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
            <pre className="whitespace-pre-wrap text-gray-700 leading-relaxed font-sans text-sm" dir="rtl">
              {userProfile.aiReport}
            </pre>
          </div>
        </motion.div>
      )}

      {/* Back */}
      <div className="flex justify-center pt-4">
        <button onClick={() => navigate('/')} className="px-6 py-3 text-gray-500 hover:text-gray-700 flex items-center gap-2 transition-all">
          <ArrowRight className="w-4 h-4" /> العودة للرئيسية
        </button>
      </div>
    </div>
  );
}
