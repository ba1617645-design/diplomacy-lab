import { useNavigate } from 'react-router-dom';
import { useAppState } from '../store/AppContext';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Search, BookOpen, Handshake, Target, 
  Shield, Star, Zap, Trophy, Users, BarChart3, Sparkles,
  Zap as ZapIcon, UserPlus
} from 'lucide-react';

const missions = [
  {
    day: 'اليوم الأول',
    title: 'اكتشف نفوذك المجتمعي',
    desc: 'رحلة تفاعلية لاكتشاف مصادر نفوذك وتأثيرك في المجتمع',
    icon: Search, path: '/day1',
    color: 'from-violet-500 to-purple-600', shadow: 'shadow-violet-200', emoji: '🔍',
  },
  {
    day: 'اليوم الثاني',
    title: 'ورشة صناعة السرد',
    desc: 'صمم سردك القصصي المؤثر باستخدام الذكاء الاصطناعي',
    icon: BookOpen, path: '/day2',
    color: 'from-emerald-500 to-teal-600', shadow: 'shadow-emerald-200', emoji: '📖',
  },
  {
    day: 'اليوم الثالث',
    title: 'محاكاة التفاوض',
    desc: 'تفاوض مع 6 فرق في بيئة محاكاة بمؤقت زمني و3 محاولات إعادة',
    icon: Handshake, path: '/day3',
    color: 'from-amber-500 to-orange-600', shadow: 'shadow-amber-200', emoji: '🤝',
  },
  {
    day: 'اليوم الرابع',
    title: 'من النشاط إلى الأثر',
    desc: 'حوّل مبادرتك إلى نظرية تغيير متكاملة',
    icon: Target, path: '/day4',
    color: 'from-rose-500 to-pink-600', shadow: 'shadow-rose-200', emoji: '🎯',
  },
  {
    day: 'اليوم الخامس',
    title: 'هندسة التأثير',
    desc: 'صمم تدخلاً مجتمعياً بأعلى أثر وأقل تكلفة مع أحداث مفاجئة',
    icon: ZapIcon, path: '/day5',
    color: 'from-cyan-500 to-blue-600', shadow: 'shadow-cyan-200', emoji: '⚡',
  },
];

const badges = [
  { name: 'مستكشف النفوذ', icon: '🔍', desc: 'أكمل مهمة اليوم الأول' },
  { name: 'صانع السرد', icon: '📖', desc: 'أكمل مهمة اليوم الثاني' },
  { name: 'مفاوض محترف', icon: '🤝', desc: 'أكمل مهمة اليوم الثالث' },
  { name: 'مهندس الأثر', icon: '🏗️', desc: 'أكمل مهمة اليوم الرابع' },
  { name: 'مهندس التأثير', icon: '⚡', desc: 'أكمل مهمة اليوم الخامس' },
  { name: 'قائد متكامل', icon: '👑', desc: 'أكمل جميع المهمات' },
];

export default function Home() {
  const navigate = useNavigate();
  const { state } = useAppState();
  const { userProfile, isLoggedIn, userRole, registeredUsers, trainerInfo, lockedDays } = state;

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 p-8 md:p-12">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span className="text-amber-300 text-sm font-medium">منصة تعلم تفاعلية</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Diplomacy Lab</h1>
          <p className="text-xl text-indigo-200 max-w-2xl mb-8">
            برنامج تأهيل في مجال الدبلوماسية المجتمعية
            <br className="hidden md:block" />
            من خلال 5 مهام وتحديات مدعومة بالذكاء الاصطناعي
          </p>
          <div className="flex flex-wrap gap-4">
            {!isLoggedIn ? (
              <button onClick={() => navigate('/register')} className="px-8 py-3 bg-white text-indigo-900 rounded-xl font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-2">
                <UserPlus className="w-5 h-5" />
                سجل الآن وابدأ الرحلة
              </button>
            ) : (
              <button onClick={() => navigate('/day1')} className="px-8 py-3 bg-white text-indigo-900 rounded-xl font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-2">
                <ArrowLeft className="w-5 h-5" />
                ابدأ رحلتك التدريبية
              </button>
            )}
            <button onClick={() => navigate('/trainer')} className="px-8 py-3 bg-white/10 text-white border border-white/20 rounded-xl font-medium hover:bg-white/20 transition-all flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              لوحة المدرب
            </button>
          </div>
          {isLoggedIn && userProfile?.name && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-sm text-white">
              <Users className="w-4 h-4" />
              مرحباً {userProfile.name} 👋
            </div>
          )}
        </div>
      </motion.div>

      {/* Stats Bar */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { icon: Star, label: 'نقاط الخبرة', value: `${userProfile.xp} XP`, color: 'text-amber-500' },
          { icon: Trophy, label: 'المستوى', value: `${userProfile.level}`, color: 'text-indigo-500' },
          { icon: Shield, label: 'الشارات', value: `${userProfile.badges.filter(b => b.earned).length}/${userProfile.badges.length}`, color: 'text-emerald-500' },
          { icon: Zap, label: 'المهام المنجزة', value: `${userProfile.completedMissions.length}/5`, color: 'text-rose-500' },
          { icon: Users, label: 'المشاركون', value: `${registeredUsers.length}`, color: 'text-cyan-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-3">
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
              <div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-xs text-gray-500">{stat.label}</div>
              </div>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Missions Grid */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Target className="w-6 h-6 text-indigo-500" />
          المهمات التدريبية (5 أيام)
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {missions.map((mission, i) => (
            <motion.button
              key={mission.day}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              onClick={() => {
                if (userRole === 'guest') {
                  navigate('/register');
                } else {
                  const dayKey = `day${i + 1}`;
                  if (lockedDays[dayKey]) {
                    alert('🔒 هذه المهمة محجوبة حالياً من قبل المدرب. انتظر حتى يتم فتحها.');
                    return;
                  }
                  navigate(mission.path);
                }
              }}
              className="group relative overflow-hidden bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 text-right"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${mission.color} flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform`}>
                    {mission.emoji}
                  </div>
                  {userProfile.completedMissions.includes(`day${i + 1}`) && (
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold">✓ مكتمل</span>
                  )}
                  {userRole === 'participant' && lockedDays[`day${i + 1}`] && (
                    <span className="px-2 py-1 bg-red-50 text-red-600 rounded-lg text-xs font-bold flex items-center gap-1">🔒 محجوبة من المدرب</span>
                  )}
                  {userRole === 'participant' && !lockedDays[`day${i + 1}`] && !userProfile.completedMissions.includes(`day${i + 1}`) && (
                    <span className="px-2 py-1 bg-green-50 text-green-600 rounded-lg text-xs font-bold flex items-center gap-1">✅ متاحة</span>
                  )}
                </div>
                <div className="text-xs text-indigo-500 font-medium mb-1">{mission.day}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                  {mission.title}
                </h3>
                <p className="text-sm text-gray-500">{mission.desc}</p>
              </div>
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${mission.color} scale-x-0 group-hover:scale-x-100 transition-transform origin-right`} />
            </motion.button>
          ))}
        </div>
      </div>

      {/* Badges Display */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Trophy className="w-6 h-6 text-amber-500" />
          الشارات والإنجازات (6 شارات)
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          {badges.map((badge) => {
            const earned = userProfile.badges.find(b => b.name === badge.name)?.earned;
            return (
              <div key={badge.name} className={`bg-white rounded-2xl p-4 border text-center transition-all ${earned ? 'border-amber-200 shadow-md shadow-amber-100' : 'border-gray-100 opacity-50 grayscale'}`}>
                <div className="text-4xl mb-2">{badge.icon}</div>
                <div className="text-sm font-bold text-gray-900">{badge.name}</div>
                <div className="text-xs text-gray-500 mt-1">{badge.desc}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Trainer Info for Participants */}
      {userRole === 'participant' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-gradient-to-l from-amber-50 via-orange-50 to-amber-50 rounded-3xl border border-amber-200 p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <img src={trainerInfo.photo} alt={trainerInfo.name} className="w-16 h-16 md:w-20 md:h-20 rounded-2xl object-cover border-4 border-amber-300 shadow-md" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            <div className="flex-1">
              <div className="text-xs text-amber-600 font-medium mb-1">المشرف على البرنامج</div>
              <h3 className="text-lg font-bold text-gray-900">{trainerInfo.name}</h3>
              <p className="text-sm text-gray-600">{trainerInfo.title}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 rounded-full text-xs font-bold">{trainerInfo.organization}</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Quick Register CTA */}
      {userRole === 'guest' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-gradient-to-l from-indigo-500 to-purple-600 rounded-3xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-2">🚀 ابدأ رحلتك الآن</h2>
          <p className="text-indigo-200 mb-6">سجل كparticipant وابدأ رحلة التغيير</p>
          <button onClick={() => navigate('/register')} className="px-8 py-3 bg-white text-indigo-700 rounded-xl font-bold hover:shadow-xl transition-all">
            تسجيل المشاركين
          </button>
        </motion.div>
      )}

      {/* Features Grid */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">ماذا تقدم المنصة؟</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Sparkles, title: 'ذكاء اصطناعي', desc: 'تحليل فوري وتقارير شخصية وتوصيات مخصصة' },
            { icon: Users, title: 'محاكاة تفاعلية', desc: 'تفاوض مع 6 فرق في بيئة واقعية بمؤقت زمني' },
            { icon: BarChart3, title: 'تحليل متقدم', desc: 'مقاييس دقيقة للأداء ولوحات متابعة شاملة للمدرب' },
          ].map((feat, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-indigo-100 shadow-sm hover:shadow-md transition-all">
              <feat.icon className="w-10 h-10 text-indigo-500 mb-3" />
              <h3 className="font-bold text-gray-900 mb-2">{feat.title}</h3>
              <p className="text-sm text-gray-500">{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
