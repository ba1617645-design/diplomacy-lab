import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppState, RegisteredUser } from '../../store/AppContext';
import { BarChart3, Users, Award, TrendingUp, Download, FileText, MessageSquare, Send, ArrowRight, Sparkles, Star, Shield, Zap, Target, CheckCircle, UserPlus, Mail, Key, Pencil, X, Lock as LockIcon, Database, Upload } from 'lucide-react';
import { getAllProfiles, isSupabaseReady } from '../../utils/supabase';

export default function TrainerDashboard() {
  const navigate = useNavigate();
  const { state, dispatch } = useAppState();
  const [feedbackText, setFeedbackText] = useState('');

  useEffect(() => {
    if (isSupabaseReady()) {
      getAllProfiles().then(profiles => {
        if (profiles && profiles.length > 0) {
          dispatch({ type: 'SET_STATE', payload: { registeredUsers: profiles.map((p: any) => ({
            id: p.id, name: p.full_name || p.email, email: p.email, phone: p.phone || '',
            password: '000000', role: p.role || 'participant', country: p.country || '',
            profession: p.profession || '', registeredAt: Date.now(), xp: p.xp || 0, level: p.level || 1,
            completedMissions: p.completed_missions || [], scores: p.scores || {},
            badges: p.badges || [],
          })) } });
        }
      }).catch(() => {});
    }
  }, []);

  // قراءة المستخدمين من التخزين المنفصل كاحتياط
  const allUsers: RegisteredUser[] = state.registeredUsers.length > 0 
    ? state.registeredUsers 
    : (() => { try { return JSON.parse(localStorage.getItem('dl_users') || '[]'); } catch { return []; } })();
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string>('all');
  const [showPasswords, setShowPasswords] = useState(false);
  const [showEditTrainer, setShowEditTrainer] = useState(false);
  const [editForm, setEditForm] = useState({ name: state.trainerInfo.name, title: state.trainerInfo.title, org: state.trainerInfo.organization, email: state.trainerInfo.email, photo: state.trainerInfo.photo });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { userProfile } = state;
  const registeredUsers = allUsers;

  // Calculate aggregated stats
  const totalUsers = registeredUsers.length;
  const avgInfluence = totalUsers > 0 ? Math.round(registeredUsers.reduce((a, u) => a + u.scores.influence, 0) / totalUsers) : 0;
  const avgStorytelling = totalUsers > 0 ? Math.round(registeredUsers.reduce((a, u) => a + u.scores.storytelling, 0) / totalUsers) : 0;
  const avgNegotiation = totalUsers > 0 ? Math.round(registeredUsers.reduce((a, u) => a + u.scores.negotiation, 0) / totalUsers) : 0;
  const avgImpact = totalUsers > 0 ? Math.round(registeredUsers.reduce((a, u) => a + u.scores.impact, 0) / totalUsers) : 0;
  const avgImpactEng = totalUsers > 0 ? Math.round(registeredUsers.reduce((a, u) => a + u.scores.impactEngineering, 0) / totalUsers) : 0;
  const totalAvg = Math.round((avgInfluence + avgStorytelling + avgNegotiation + avgImpact + avgImpactEng) / 5);

  const totalMissions = registeredUsers.reduce((a, u) => a + u.completedMissions.length, 0);
  const maxPossibleMissions = totalUsers * 5;
  const completionRate = maxPossibleMissions > 0 ? Math.round((totalMissions / maxPossibleMissions) * 100) : 0;

  const missionProgress = [
    { name: 'اكتشف نفوذك', key: 'day1', icon: '🔍', color: 'bg-violet-500', done: userProfile.completedMissions.includes('day1') },
    { name: 'صناعة السرد', key: 'day2', icon: '📖', color: 'bg-emerald-500', done: userProfile.completedMissions.includes('day2') },
    { name: 'محاكاة التفاوض', key: 'day3', icon: '🤝', color: 'bg-amber-500', done: userProfile.completedMissions.includes('day3') },
    { name: 'من النشاط إلى الأثر', key: 'day4', icon: '🎯', color: 'bg-rose-500', done: userProfile.completedMissions.includes('day4') },
    { name: 'هندسة التأثير', key: 'day5', icon: '⚡', color: 'bg-cyan-500', done: userProfile.completedMissions.includes('day5') },
  ];

  const scores = [
    { label: 'النفوذ', value: avgInfluence, color: 'bg-violet-500' },
    { label: 'السرد', value: avgStorytelling, color: 'bg-emerald-500' },
    { label: 'التفاوض', value: avgNegotiation, color: 'bg-amber-500' },
    { label: 'الأثر', value: avgImpact, color: 'bg-rose-500' },
    { label: 'هندسة التأثير', value: avgImpactEng, color: 'bg-cyan-500' },
  ];

  const generateAIAnalysis = () => {
    const parts = [];
    if (avgInfluence > 70) parts.push('✅ مستوى متقدم في تحليل النفوذ المجتمعي');
    else parts.push('⚠️ تحليل النفوذ يحتاج تطوير - ركز على فهم مصادر التأثير');
    if (avgStorytelling > 70) parts.push('✅ مهارات سردية قوية لدى المجموعة');
    else parts.push('⚠️ بناء السرد بحاجة لتحسين - أضف المزيد من التمارين');
    if (avgNegotiation > 70) parts.push('✅ أداء ممتاز في التفاوض وبناء التحالفات');
    else parts.push('⚠️ مهارات التفاوض تحتاج تدريب إضافي');
    if (avgImpact > 70) parts.push('✅ فهم متكامل لتصميم الأثر ونظرية التغيير');
    else parts.push('⚠️ تصميم الأثر يحتاج تحسين');
    if (avgImpactEng > 70) parts.push('✅ إبداع في هندسة التأثير وإدارة الموارد');
    else parts.push('⚠️ مهارات التخطيط الاستراتيجي بحاجة للتطوير');
    return parts;
  };

  const handleSendFeedback = () => {
    if (feedbackText.trim()) {
      setFeedbackSent(true);
      setTimeout(() => setFeedbackSent(false), 3000);
      setFeedbackText('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Trainer Profile Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-l from-amber-50 via-orange-50 to-amber-50 rounded-3xl border border-amber-200 p-6 shadow-sm">
        <div className="flex items-center gap-5">
          <div className="relative group">
            <img
              src={state.trainerInfo.photo}
              alt={state.trainerInfo.name}
              className="w-20 h-20 md:w-24 md:h-24 rounded-2xl object-cover border-4 border-amber-300 shadow-lg"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">{state.trainerInfo.name}</h2>
              <button onClick={() => { setEditForm({ name: state.trainerInfo.name, title: state.trainerInfo.title, org: state.trainerInfo.organization, email: state.trainerInfo.email, photo: state.trainerInfo.photo }); setShowEditTrainer(true); }} className="p-1.5 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-all" title="تعديل الملف الشخصي">
                <Pencil className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-amber-700 text-sm font-medium">{state.trainerInfo.title}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold">{state.trainerInfo.organization}</span>
              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold">مشرف البرنامج</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 text-xs text-gray-400">
            <Mail className="w-3.5 h-3.5" />
            {state.trainerInfo.email}
          </div>
        </div>
      </motion.div>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-indigo-500" />
            لوحة التحكم
          </h1>
          <p className="text-gray-500 text-sm">إحصائيات شاملة وتحليلات ذكاء اصطناعي للمتدربين</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => navigate('/participants')} className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-sm font-medium hover:bg-indigo-100 transition-all flex items-center gap-2">
            <Users className="w-4 h-4" /> إدارة المشاركين ({totalUsers})
          </button>
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-all flex items-center gap-2">
            <Download className="w-4 h-4" /> PDF
          </button>
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-all flex items-center gap-2">
            <FileText className="w-4 h-4" /> Excel
          </button>
        </div>
      </motion.div>

      {/* Day Lock Management */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <LockIcon className="w-5 h-5 text-amber-500" />
            إدارة المهام التدريبية
          </h2>
          <p className="text-xs text-gray-400">المهام متاحة للمشاركين تلقائياً. استخدم زر القفل لحجب مهمة.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { key: 'day1', label: 'اكتشف نفوذك', icon: '🔍', color: 'from-violet-500 to-purple-600' },
            { key: 'day2', label: 'صناعة السرد', icon: '📖', color: 'from-emerald-500 to-teal-600' },
            { key: 'day3', label: 'محاكاة التفاوض', icon: '🤝', color: 'from-amber-500 to-orange-600' },
            { key: 'day4', label: 'من النشاط إلى الأثر', icon: '🎯', color: 'from-rose-500 to-pink-600' },
            { key: 'day5', label: 'هندسة التأثير', icon: '⚡', color: 'from-cyan-500 to-blue-600' },
          ].map(day => {
            const isLocked = state.lockedDays[day.key];
            return (
              <div key={day.key} className={`rounded-2xl p-4 border-2 text-center transition-all ${isLocked ? 'border-gray-200 bg-gray-50' : 'border-green-200 bg-green-50'}`}>
                <div className="text-2xl mb-2">{day.icon}</div>
                <div className="text-xs font-bold text-gray-900 mb-1">{day.label}</div>
                <div className={`text-xs font-bold mb-2 ${isLocked ? 'text-red-500' : 'text-green-600'}`}>
                  {isLocked ? '🔒 غير متاحة (مقفلة)' : '✅ متاحة للمشاركين'}
                </div>
                <button
                  onClick={() => dispatch({ type: 'TOGGLE_DAY_LOCK', payload: day.key })}
                  className={`w-full py-1.5 rounded-lg text-xs font-bold transition-all ${
                    isLocked
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-amber-500 text-white hover:bg-amber-600'
                  }`}
                >
                  {isLocked ? '🔓 فتح المهمة ونشرها' : '🔒 حجب المهمة عن المشاركين'}
                </button>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { icon: Users, label: 'المشاركون', value: `${totalUsers}`, sub: 'مسجل في المنصة', color: 'text-blue-600 bg-blue-50' },
          { icon: Star, label: 'المعدل العام', value: `${totalAvg}%`, sub: 'عبر 5 مهام', color: 'text-amber-600 bg-amber-50' },
          { icon: Shield, label: 'إنجاز المهام', value: `${completionRate}%`, sub: `${totalMissions}/${maxPossibleMissions}`, color: 'text-emerald-600 bg-emerald-50' },
          { icon: Zap, label: 'إجمالي XP', value: `${registeredUsers.reduce((a, u) => a + u.xp, 0)}`, sub: `لكل المشاركين`, color: 'text-purple-600 bg-purple-50' },
          { icon: Target, label: 'المستوى المتوسط', value: totalUsers > 0 ? String(Math.round(registeredUsers.reduce((a, u) => a + u.level, 0) / totalUsers)) : '1', sub: 'مستوى للمشارك', color: 'text-cyan-600 bg-cyan-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-2`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-sm text-gray-500">{stat.label}</div>
            <div className="text-xs text-gray-400 mt-0.5">{stat.sub}</div>
          </div>
        ))}
      </motion.div>

      {/* Main Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Progress per mission */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-500" />
            نسبة إنجاز المهام (5 أيام)
          </h2>
          <div className="space-y-4">
            {missionProgress.map((mission) => (
              <div key={mission.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <span>{mission.icon}</span> {mission.name}
                  </span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${mission.done ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                    {mission.done ? '✓ مكتمل' : 'لم يبدأ'}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <motion.div initial={{ width: 0 }} animate={{ width: mission.done ? '100%' : '0%' }} transition={{ duration: 1, delay: 0.3 }} className={`h-2 rounded-full ${mission.color}`} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <h3 className="text-sm font-bold text-gray-700 mb-2">إنجاز المشاركين لكل مهمة</h3>
            <div className="grid grid-cols-5 gap-2">
              {['day1','day2','day3','day4','day5'].map((day, i) => {
                const count = registeredUsers.filter(u => u.completedMissions.includes(day)).length;
                const pct = totalUsers > 0 ? Math.round((count / totalUsers) * 100) : 0;
                return (
                  <div key={day} className="text-center p-2 bg-gray-50 rounded-xl">
                    <div className="text-lg">{['🔍','📖','🤝','🎯','⚡'][i]}</div>
                    <div className="text-sm font-bold text-gray-900">{count}/{totalUsers}</div>
                    <div className="text-xs text-gray-400">{pct}%</div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Scores */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            متوسط درجات المهارات (5 مهام)
          </h2>
          <div className="space-y-4">
            {scores.map((score) => (
              <div key={score.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{score.label}</span>
                  <span className="text-sm font-bold" style={{ color: score.color.replace('bg-', '#') }}>{score.value}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${score.value}%` }} transition={{ duration: 1, delay: 0.3 }} className={`h-3 rounded-full ${score.color} shadow-sm`} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">المعدل العام للمجموعة</span>
              <span className="text-xl font-bold text-indigo-600">{totalAvg}%</span>
            </div>
          </div>
        </motion.div>

        {/* AI Analysis */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            تحليل الذكاء الاصطناعي للمجموعة
          </h2>
          <div className="space-y-3">
            {generateAIAnalysis().map((item, i) => (
              <div key={i} className="p-3 rounded-xl bg-gray-50 border border-gray-100 text-sm text-gray-700">
                {item}
              </div>
            ))}
          </div>
          {totalUsers === 0 && (
            <div className="text-center py-6 text-gray-400">
              <Users className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p className="text-sm">لا يوجد مشاركون مسجلون بعد</p>
              <button onClick={() => navigate('/register')} className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-all inline-flex items-center gap-2">
                <UserPlus className="w-4 h-4" /> تسجيل مشارك
              </button>
            </div>
          )}
        </motion.div>

        {/* Feedback */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-500" />
            إرسال تغذية راجعة
          </h2>
          <div className="mb-3">
            <label className="text-xs text-gray-500 mb-1 block">إلى</label>
            <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)} className="w-full p-2.5 border border-gray-200 rounded-xl text-sm focus:border-indigo-400 focus:outline-none">
              <option value="all">جميع المشاركين ({totalUsers})</option>
              {registeredUsers.map(u => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
          </div>
          <textarea value={feedbackText} onChange={(e) => setFeedbackText(e.target.value)} placeholder={selectedUser === 'all' ? 'اكتب تغذية راجعة عامة للمجموعة...' : 'اكتب تغذية راجعة للمشارك...'} className="w-full h-28 p-4 border-2 border-gray-200 rounded-2xl text-sm focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-50 resize-none transition-all mb-3" />
          <div className="flex gap-2">
            <button onClick={handleSendFeedback} disabled={!feedbackText.trim()} className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2">
              <Send className="w-4 h-4" /> إرسال
            </button>
          </div>
          {feedbackSent && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mt-3 p-3 bg-green-50 text-green-700 rounded-xl text-sm text-center flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4" /> تم إرسال التغذية الراجعة بنجاح
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Participant Leaderboard */}
      {totalUsers > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            ترتيب المشاركين
            <button onClick={() => setShowPasswords(!showPasswords)} className="mr-auto px-3 py-1.5 bg-amber-50 text-amber-700 rounded-xl text-xs font-medium hover:bg-amber-100 transition-all flex items-center gap-1">
              <Key className="w-3 h-3" />
              {showPasswords ? 'إخفاء كلمات المرور' : 'عرض كلمات المرور'}
            </button>
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-right p-3 text-gray-500 font-medium">#</th>
                  <th className="text-right p-3 text-gray-500 font-medium">الاسم</th>
                  <th className="text-center p-3 text-gray-500 font-medium">XP</th>
                  <th className="text-center p-3 text-gray-500 font-medium">المستوى</th>
                  <th className="text-center p-3 text-gray-500 font-medium">المهام</th>
                  <th className="text-center p-3 text-gray-500 font-medium">المعدل</th>
                  <th className="text-center p-3 text-gray-500 font-medium">الشارات</th>
                  {showPasswords && <th className="text-center p-3 text-gray-500 font-medium">كلمة المرور</th>}
                </tr>
              </thead>
              <tbody>
                {[...registeredUsers].sort((a, b) => b.xp - a.xp).map((user, i) => {
                  const userAvg = Math.round((user.scores.influence + user.scores.storytelling + user.scores.negotiation + user.scores.impact + user.scores.impactEngineering) / 5);
                  const badgeCount = user.badges?.filter((b: any) => b.earned).length || 0;
                  return (
                    <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50 transition-all">
                      <td className="p-3">
                        <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-amber-100 text-amber-700' : i === 1 ? 'bg-gray-100 text-gray-600' : i === 2 ? 'bg-orange-100 text-orange-700' : 'bg-gray-50 text-gray-400'}`}>
                          {i + 1}
                        </span>
                      </td>
                      <td className="p-3 font-medium text-gray-900">{user.name}</td>
                      <td className="p-3 text-center font-bold text-amber-600">{user.xp}</td>
                      <td className="p-3 text-center">{user.level}</td>
                      <td className="p-3 text-center">{user.completedMissions.length}/5</td>
                      <td className="p-3 text-center">
                        <span className={`font-bold ${userAvg >= 70 ? 'text-emerald-600' : userAvg >= 50 ? 'text-amber-600' : 'text-red-600'}`}>{userAvg}%</span>
                      </td>
                      <td className="p-3 text-center">{badgeCount}/6</td>
                      {showPasswords && (
                        <td className="p-3 text-center font-mono text-xs text-amber-700 bg-amber-50/50">
                          <span className="px-2 py-0.5 bg-amber-100 rounded border border-amber-200">{user.password}</span>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Badges Overview */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-500" />
          نظرة عامة على الشارات
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          {[
            { name: 'مستكشف النفوذ', icon: '🔍', id: 'b1' },
            { name: 'صانع السرد', icon: '📖', id: 'b2' },
            { name: 'مفاوض محترف', icon: '🤝', id: 'b3' },
            { name: 'مهندس الأثر', icon: '🏗️', id: 'b4' },
            { name: 'مهندس التأثير', icon: '⚡', id: 'b5' },
            { name: 'قائد متكامل', icon: '👑', id: 'b6' },
          ].map(badge => {
            const earnedCount = registeredUsers.filter(u => u.badges?.find((b: any) => b.id === badge.id)?.earned).length;
            return (
              <div key={badge.id} className="text-center p-4 rounded-2xl border border-gray-100 bg-gray-50">
                <div className="text-3xl mb-1">{badge.icon}</div>
                <div className="text-xs font-bold text-gray-700">{badge.name}</div>
                <div className="text-sm font-bold text-indigo-600 mt-1">{earnedCount}/{totalUsers}</div>
                <div className="text-xs text-gray-400">حصلوا عليها</div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Export / Import Database */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Database className="w-5 h-5 text-indigo-500" />
          قاعدة البيانات - تصدير / استيراد
        </h2>
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-4 text-sm text-amber-800">
          <strong>⚠️ مهم جداً:</strong> البيانات مخزنة في المتصفح الحالي فقط. إذا فتحت المنصة من متصفح آخر، لن تجد الحسابات.
          <br />
          استخدم خاصية <strong>التصدير</strong> لحفظ نسخة احتياطية، و<strong>الاستيراد</strong> لنقل البيانات إلى متصفح آخر.
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <button
            onClick={() => {
              const data = {
                registeredUsers: state.registeredUsers,
                trainerInfo: state.trainerInfo,
                lockedDays: state.lockedDays,
              };
              const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `diplomacy_lab_backup_${new Date().toISOString().split('T')[0]}.json`;
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="p-4 bg-gradient-to-l from-indigo-500 to-purple-600 text-white rounded-2xl font-bold hover:shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            📥 تصدير قاعدة البيانات
          </button>
          <label className="p-4 bg-gradient-to-l from-emerald-500 to-teal-600 text-white rounded-2xl font-bold hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer">
            <Upload className="w-5 h-5" />
            📤 استيراد قاعدة البيانات
            <input
              type="file"
              accept=".json"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (ev) => {
                  try {
                    const data = JSON.parse(ev.target?.result as string);
                    if (data.registeredUsers) {
                      // استيراد البيانات إلى localStorage مباشرة
                      const currentState = JSON.parse(localStorage.getItem('diplomacy_lab_state') || '{}');
                      currentState.registeredUsers = data.registeredUsers;
                      if (data.trainerInfo) currentState.trainerInfo = { ...currentState.trainerInfo, ...data.trainerInfo };
                      if (data.lockedDays) currentState.lockedDays = { ...currentState.lockedDays, ...data.lockedDays };
                      localStorage.setItem('diplomacy_lab_state', JSON.stringify(currentState));
                      alert(`✅ تم استيراد ${data.registeredUsers.length} مشارك بنجاح!\nالرجاء إعادة تحميل الصفحة لرؤية التغييرات.`);
                      window.location.reload();
                    } else {
                      alert('❌ ملف غير صالح. يجب أن يحتوي على registeredUsers.');
                    }
                  } catch (err) {
                    alert('❌ فشل في قراءة الملف. تأكد من أنه ملف JSON صحيح.');
                  }
                };
                reader.readAsText(file);
              }}
            />
          </label>
        </div>
      </motion.div>

      {/* Back */}
      <div className="flex justify-center">
        <button onClick={() => navigate('/')} className="px-6 py-3 text-gray-500 hover:text-gray-700 flex items-center gap-2 transition-all">
          <ArrowRight className="w-4 h-4" /> العودة للرئيسية
        </button>
      </div>

      {/* Edit Trainer Modal */}
      {showEditTrainer && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowEditTrainer(false)}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">تعديل الملف الشخصي للمدرب</h2>
              <button onClick={() => setShowEditTrainer(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-all"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <img
                    src={editForm.photo || state.trainerInfo.photo}
                    alt="صورة المدرب"
                    className="w-24 h-24 rounded-2xl object-cover border-4 border-amber-300 shadow-lg"
                    onError={(e) => { (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM5Y2EzYWYiIHN0cm9rZS13aWR0aD0iMiI+PHBhdGggZD0iTTIwIDIxdi0yYTQgNCAwIDAgMC00LTRINEE0IDQgMCAwIDAgMCAxOXYyIi8+PGNpcmNsZSBjeD0iMTIiIGN5PSI3IiByPSI0Ii8+PC9zdmc+'; }}
                  />
                  <button onClick={() => fileInputRef.current?.click()} className="absolute -bottom-1 -left-1 w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-amber-600 transition-all text-sm">
                    ✏️
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (ev) => setEditForm({ ...editForm, photo: ev.target?.result as string });
                      reader.readAsDataURL(file);
                    }
                  }} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الاسم</label>
                <input type="text" value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})} className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-amber-400 focus:outline-none focus:ring-4 focus:ring-amber-50 transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">المسمى الوظيفي</label>
                <input type="text" value={editForm.title} onChange={(e) => setEditForm({...editForm, title: e.target.value})} className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-amber-400 focus:outline-none focus:ring-4 focus:ring-amber-50 transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الجهة / المؤسسة</label>
                <input type="text" value={editForm.org} onChange={(e) => setEditForm({...editForm, org: e.target.value})} className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-amber-400 focus:outline-none focus:ring-4 focus:ring-amber-50 transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
                <input type="email" value={editForm.email} onChange={(e) => setEditForm({...editForm, email: e.target.value})} className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-amber-400 focus:outline-none focus:ring-4 focus:ring-amber-50 transition-all" />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowEditTrainer(false)} className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition-all">إلغاء</button>
                <button onClick={() => {
                  dispatch({ type: 'UPDATE_TRAINER', payload: { name: editForm.name, title: editForm.title, organization: editForm.org, email: editForm.email, photo: editForm.photo } });
                  setShowEditTrainer(false);
                }} className="flex-1 py-3 bg-gradient-to-l from-amber-600 to-orange-600 text-white rounded-xl font-bold hover:shadow-xl transition-all">حفظ التغييرات</button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

function Trophy(props: { className?: string }) {
  return (
    <svg className={props.className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
}
