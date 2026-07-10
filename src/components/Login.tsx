import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../store/AppContext';
import { Mail, Lock, Eye, EyeOff, LogIn, ArrowRight, AlertCircle } from 'lucide-react';
import { signIn, isSupabaseReady, getProfile } from '../utils/supabase';

export default function Login() {
  const navigate = useNavigate();
  const { state, dispatch } = useAppState();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('الرجاء إدخال البريد الإلكتروني وكلمة المرور');
      return;
    }

    if (isSupabaseReady()) {
      setLoading(true);
      try {
        const data = await signIn(email, password);
        let profile = await getProfile(data.user.id);
        if (!profile) profile = { id: data.user.id, email, full_name: email.split('@')[0], role: 'participant' };
        dispatch({ type: 'LOGIN', payload: { profile, role: profile.role || 'participant' } });
        navigate('/');
      } catch (err: any) {
        setError(err.message || 'فشل تسجيل الدخول');
      } finally {
        setLoading(false);
      }
    } else {
      // Search in registeredUsers
      const user = state.registeredUsers.find((u: any) => u.email === email && u.password === password);
      if (!user) {
        setError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
        return;
      }
      dispatch({ type: 'LOGIN', payload: { profile: user, role: user.role || 'participant' } });
      navigate('/');
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">تسجيل الدخول</h1>
          <p className="text-gray-500 text-sm mt-1">أدخل بريدك الإلكتروني وكلمة المرور</p>
        </div>

        <div className="space-y-4">
          {state.registeredUsers.length === 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-xs text-amber-800">
              لا توجد حسابات مسجلة بعد. قم بإنشاء حساب جديد أولاً.
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
            <div className="relative">
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="أدخل بريدك الإلكتروني" className="w-full pr-12 p-3 border-2 border-gray-200 rounded-xl focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-50 transition-all" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور</label>
            <div className="relative">
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="أدخل كلمة المرور" className="w-full pr-12 pl-10 p-3 border-2 border-gray-200 rounded-xl focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-50 transition-all" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
              <AlertCircle className="w-4 h-4 inline ml-1" />{error}
            </motion.div>
          )}

          <button onClick={handleLogin} disabled={loading} className="w-full py-3 bg-gradient-to-l from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-xl transition-all disabled:opacity-60">
            {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
          </button>

          <div className="text-center pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-500 mb-2">ليس لديك حساب؟</p>
            <button onClick={() => navigate('/register')} className="text-indigo-600 font-medium hover:text-indigo-700 transition-colors text-sm">إنشاء حساب جديد</button>
          </div>

          <button onClick={() => navigate('/')} className="w-full py-2 text-gray-400 hover:text-gray-600 transition-colors text-sm flex items-center justify-center gap-1">
            <ArrowRight className="w-3 h-3" /> العودة للرئيسية
          </button>
        </div>
      </motion.div>
    </div>
  );
}
