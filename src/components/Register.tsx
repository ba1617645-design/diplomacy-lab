import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../store/AppContext';
import { User, Mail, Phone, Briefcase, CheckCircle, GraduationCap, Sparkles, Lock, Eye, EyeOff, Globe, BadgeCheck } from 'lucide-react';
import { signUp, isSupabaseReady, getProfile } from '../utils/supabase';

const countries = [
  'السعودية', 'الإمارات', 'قطر', 'الكويت', 'عمان', 'البحرين',
  'مصر', 'الأردن', 'لبنان', 'فلسطين', 'العراق', 'سوريا',
  'تونس', 'الجزائر', 'المغرب', 'ليبيا', 'السودان', 'اليمن',
  'تركيا', 'أخرى',
];

export default function Register() {
  const navigate = useNavigate();
  const { state, dispatch } = useAppState();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', role: '', country: '', profession: '',
    password: '', confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'الاسم مطلوب';
    if (!form.email.trim() || !form.email.includes('@')) errs.email = 'بريد إلكتروني صحيح مطلوب';
    if (!form.phone.trim()) errs.phone = 'رقم الهاتف مطلوب';
    if (!form.country.trim()) errs.country = 'الدولة مطلوبة';
    if (!form.profession.trim()) errs.profession = 'الصفة المهنية مطلوبة';
    if (!form.password.trim() || form.password.length < 6) errs.password = '6 أحرف على الأقل';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'غير متطابقتين';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setSubmitting(true);

    if (isSupabaseReady()) {
      try {
        const data = await signUp(form.email, form.password, {
          full_name: form.name,
          phone: form.phone,
          country: form.country,
          profession: form.profession,
          role: 'participant',
        });
        if (data.user) {
          let profile = await getProfile(data.user.id);
          if (!profile) profile = { id: data.user.id, email: form.email, full_name: form.name, phone: form.phone, country: form.country, profession: form.profession, role: 'participant', xp: 0, level: 1, completed_missions: [], scores: {}, badges: [] };
          const registeredUser = { id: data.user.id, name: form.name, email: form.email, phone: form.phone, password: form.password, role: 'participant', country: form.country, profession: form.profession, registeredAt: Date.now(), xp: 0, level: 1, completedMissions: [], scores: { influence: 0, storytelling: 0, negotiation: 0, impact: 0, impactEngineering: 0 }, badges: [] };
          dispatch({ type: 'REGISTER_USER', payload: registeredUser });
          dispatch({ type: 'LOGIN', payload: { profile, role: 'participant' } });
          setRegistered(true);
        }
      } catch (err: any) {
        setErrors({ form: err.message || 'فشل التسجيل' });
      }
    } else {
      // Offline mode
      const newUser = { id: `user_${Date.now()}`, name: form.name, email: form.email, phone: form.phone, password: form.password, role: 'participant', country: form.country, profession: form.profession, registeredAt: Date.now(), xp: 0, level: 1, completedMissions: [], scores: { influence: 0, storytelling: 0, negotiation: 0, impact: 0, impactEngineering: 0 }, badges: [] };
      dispatch({ type: 'SET_STATE', payload: { registeredUsers: [...(state.registeredUsers || []), newUser] as any[] } });
      dispatch({ type: 'LOGIN', payload: { profile: newUser, role: 'participant' } });
      setRegistered(true);
    }
    setSubmitting(false);
  };

  if (registered) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <CheckCircle className="w-12 h-12 text-white" />
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold text-gray-900 mb-4">تم التسجيل بنجاح! 🎉</motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-gray-500 mb-8">مرحباً {form.name}، أنت الآن جاهز لبدء البرنامج التدريبي</motion.p>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex flex-col gap-3">
          <button onClick={() => navigate('/day1')} className="px-8 py-4 bg-gradient-to-l from-indigo-600 to-purple-600 text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all">ابدأ رحلتك التدريبية 🚀</button>
          <button onClick={() => navigate('/')} className="px-8 py-3 text-gray-500 hover:text-gray-700 transition-all">العودة للرئيسية</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">تسجيل المشاركين</h1>
          <p className="text-gray-500 text-sm mt-1">سجل بياناتك لبدء البرنامج التدريبي</p>
        </div>

        <div className="flex items-center justify-center gap-2 mb-6">
          {[1, 2, 3].map(s => (
            <div key={s} className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step >= s ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-400'}`}>{s}</div>
          ))}
        </div>

        {errors.form && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{errors.form}</div>
        )}

        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الاسم الكامل *</label>
              <div className="relative">
                <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="text" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} placeholder="الاسم كما تريد ظهوره" className={`w-full pr-12 p-3 border-2 rounded-xl focus:outline-none transition-all ${errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50'}`} />
              </div>
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني *</label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} placeholder="example@email.com" className={`w-full pr-12 p-3 border-2 rounded-xl focus:outline-none transition-all ${errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50'}`} />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف *</label>
              <div className="relative">
                <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="tel" value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} placeholder="05xxxxxxxx" className={`w-full pr-12 p-3 border-2 rounded-xl focus:outline-none transition-all ${errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50'}`} />
              </div>
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>
            <button onClick={() => setStep(2)} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-all">التالي</button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الدولة *</label>
              <div className="relative">
                <Globe className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select value={form.country} onChange={(e) => setForm({...form, country: e.target.value})} className={`w-full pr-12 p-3 border-2 rounded-xl focus:outline-none appearance-none bg-white ${errors.country ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50'}`}>
                  <option value="">اختر الدولة</option>
                  {countries.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الصفة المهنية *</label>
              <div className="relative">
                <BadgeCheck className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="text" value={form.profession} onChange={(e) => setForm({...form, profession: e.target.value})} placeholder="مثال: مهندس، طالب، باحث" className={`w-full pr-12 p-3 border-2 rounded-xl focus:outline-none transition-all ${errors.profession ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50'}`} />
              </div>
              {errors.profession && <p className="text-red-500 text-xs mt-1">{errors.profession}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الجهة / المؤسسة</label>
              <div className="relative">
                <Briefcase className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="text" value={form.role} onChange={(e) => setForm({...form, role: e.target.value})} placeholder="اسم الجهة" className="w-full pr-12 p-3 border-2 border-gray-200 rounded-xl focus:border-indigo-400 focus:outline-none transition-all" />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition-all">رجوع</button>
              <button onClick={() => setStep(3)} className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-all">التالي</button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور *</label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} placeholder="6 أحرف على الأقل" className={`w-full pr-12 pl-10 p-3 border-2 rounded-xl focus:outline-none transition-all ${errors.password ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50'}`} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">تأكيد كلمة المرور *</label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type={showConfirm ? 'text' : 'password'} value={form.confirmPassword} onChange={(e) => setForm({...form, confirmPassword: e.target.value})} placeholder="أعد إدخال كلمة المرور" className={`w-full pr-12 pl-10 p-3 border-2 rounded-xl focus:outline-none transition-all ${errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50'}`} />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition-all">رجوع</button>
              <button onClick={handleRegister} disabled={submitting} className="flex-1 py-3 bg-gradient-to-l from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-xl transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                {submitting ? 'جاري التسجيل...' : <><Sparkles className="w-4 h-4" /> تسجيل وبدء الرحلة</>}
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
