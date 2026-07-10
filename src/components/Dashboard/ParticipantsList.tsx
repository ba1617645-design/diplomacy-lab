import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppState, RegisteredUser } from '../../store/AppContext';
import { Users, Mail, Phone, Briefcase, Clock, Search, Key, Eye, EyeOff, Shield, Globe, BadgeCheck } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getAllProfiles, isSupabaseReady } from '../../utils/supabase';

export default function ParticipantsList() {
  const navigate = useNavigate();
  const { state, dispatch } = useAppState();
  const [search, setSearch] = useState('');
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});

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

  const registeredUsers: RegisteredUser[] = state.registeredUsers.length > 0 
    ? state.registeredUsers 
    : (() => { try { return JSON.parse(localStorage.getItem('dl_users') || '[]'); } catch { return []; } })();

  const filteredUsers = registeredUsers.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.country?.toLowerCase().includes(search.toLowerCase()) ||
    u.profession?.toLowerCase().includes(search.toLowerCase())
  );

  const togglePassword = (id: string) => {
    setShowPasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-7 h-7 text-indigo-500" />
            المشاركون المسجلون
          </h1>
          <p className="text-gray-500 text-sm">إدارة ومتابعة المشاركين - جميع البيانات متاحة للمدرب</p>
        </div>
        <div className="text-sm text-gray-500">
          الإجمالي: <strong className="text-indigo-600">{registeredUsers.length}</strong>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="relative">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="ابحث بالاسم أو البريد أو الدولة أو الصفة المهنية..." className="w-full pr-12 p-4 border-2 border-gray-200 rounded-2xl text-sm focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-50 transition-all" />
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
        <Shield className="w-5 h-5 text-amber-600 flex-shrink-0" />
        <div className="text-sm text-amber-800">
          <strong>خاص بالمدرب:</strong> يمكنك الاطلاع على كلمات المرور لمساعدة المشاركين في حالة نسيانها.
        </div>
      </motion.div>

      {registeredUsers.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16 bg-white rounded-3xl border border-gray-100">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-10 h-10 text-indigo-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">لا يوجد مشاركون مسجلون بعد</h3>
          <button onClick={() => navigate('/register')} className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-all">تسجيل مشارك جديد</button>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {filteredUsers.map((user, i) => (
            <motion.div key={user.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-5">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{user.name}</h3>
                    <div className="flex items-center gap-3 text-sm text-gray-500 mt-1 flex-wrap">
                      <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {user.email}</span>
                      <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {user.phone}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-500 mt-1 flex-wrap">
                      <span className="flex items-center gap-1"><Globe className="w-3.5 h-3.5 text-emerald-500" /> {user.country || 'غير محدد'}</span>
                      <span className="flex items-center gap-1"><BadgeCheck className="w-3.5 h-3.5 text-amber-500" /> {user.profession || 'غير محدد'}</span>
                      <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5 text-indigo-400" /> {user.role}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Key className="w-3.5 h-3.5 text-amber-500" />
                      <span className="text-xs text-gray-400">كلمة المرور:</span>
                      <span className="text-xs font-mono bg-gray-50 px-2 py-0.5 rounded border border-gray-200 text-gray-700">
                        {showPasswords[user.id] ? user.password : '••••••••'}
                      </span>
                      <button onClick={() => togglePassword(user.id)} className="text-amber-500 hover:text-amber-700 transition-colors" title={showPasswords[user.id] ? 'إخفاء' : 'إظهار'}>
                        {showPasswords[user.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-amber-500">{user.xp} XP</div>
                    <div className="text-xs text-gray-400">المستوى {user.level}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-indigo-500">{user.completedMissions.length}/5</div>
                    <div className="text-xs text-gray-400">مهام</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-5 gap-2 mt-4 pt-4 border-t border-gray-50">
                {[
                  { label: 'النفوذ', value: user.scores.influence, color: 'bg-violet-500' },
                  { label: 'السرد', value: user.scores.storytelling, color: 'bg-emerald-500' },
                  { label: 'التفاوض', value: user.scores.negotiation, color: 'bg-amber-500' },
                  { label: 'الأثر', value: user.scores.impact, color: 'bg-rose-500' },
                  { label: 'الهندسة', value: user.scores.impactEngineering, color: 'bg-cyan-500' },
                ].map(score => (
                  <div key={score.label} className="text-center">
                    <div className="text-xs text-gray-500 mb-1">{score.label}</div>
                    <div className="text-sm font-bold text-gray-900">{score.value}%</div>
                    <div className="w-full bg-gray-100 rounded-full h-1 mt-1"><div className={`h-1 rounded-full ${score.color}`} style={{ width: `${score.value}%` }} /></div>
                  </div>
                ))}
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(user.registeredAt).toLocaleDateString('ar-SA')}</span>
                <div className="flex gap-1">
                  {['b1', 'b2', 'b3', 'b4', 'b5'].map((bid, idx) => {
                    const earned = user.badges?.find((b: any) => b.id === bid)?.earned;
                    return (
                      <span key={bid} className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${earned ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-300'}`}>
                        {['🔍', '📖', '🤝', '🏗️', '⚡'][idx]}
                      </span>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <div className="flex justify-center pt-4">
        <button onClick={() => navigate('/trainer')} className="px-6 py-3 text-gray-500 hover:text-gray-700 flex items-center gap-2 transition-all">
          <span>→</span> العودة للوحة المدرب
        </button>
      </div>
    </div>
  );
}
