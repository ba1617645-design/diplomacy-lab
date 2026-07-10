import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAppState } from '../store/AppContext';
import { motion } from 'framer-motion';
import { GraduationCap, Home, User, BarChart3, Menu, X, UserPlus, Users, LogOut, Shield, Building2, Mail, LogIn } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Layout() {
  const { state, dispatch } = useAppState();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // حماية المسارات - منع الوصول المباشر للورشات بدون تسجيل
  const workshopPaths = ['/day1', '/day2', '/day3', '/day4', '/day5', '/profile'];
  const trainerPaths = ['/trainer', '/participants'];

  const dayKeyMap: Record<string, string> = { '/day1': 'day1', '/day2': 'day2', '/day3': 'day3', '/day4': 'day4', '/day5': 'day5' };

  useEffect(() => {
    const path = location.pathname;
    if (state.userRole === 'guest') {
      if (workshopPaths.includes(path)) {
        navigate('/register', { replace: true });
      }
    }
    if (state.userRole === 'participant') {
      // Only block if trainer explicitly locked the day
      const dayKey = dayKeyMap[path];
      if (dayKey && state.lockedDays[dayKey]) {
        navigate('/', { replace: true });
      }
    }
    if (state.userRole !== 'trainer' && trainerPaths.includes(path)) {
      if (state.userRole === 'guest') {
        navigate('/register', { replace: true });
      } else if (state.userRole === 'participant') {
        if (path === '/trainer' || path === '/participants') {
          navigate('/', { replace: true });
        }
      }
    }
  }, [location.pathname, state.userRole, state.lockedDays]);

  const [trainerLoginOpen, setTrainerLoginOpen] = useState(false);
  const [trainerPassword, setTrainerPassword] = useState('');

  const isActive = (path: string) => location.pathname === path;

  // الروابط حسب نوع المستخدم
  const getNavLinks = () => {
    if (state.userRole === 'trainer') {
      return [
        { path: '/', label: 'الرئيسية', icon: Home },
        { path: '/trainer', label: 'لوحة التحكم', icon: BarChart3 },
        { path: '/participants', label: 'المشاركون', icon: Users },
        { path: '/profile', label: 'ملفي الشخصي', icon: User },
      ];
    }
    if (state.userRole === 'participant') {
      return [
        { path: '/', label: 'الرئيسية', icon: Home },
        { path: '/profile', label: 'ملفي', icon: User },
      ];
    }
    // guest
    return [
      { path: '/', label: 'الرئيسية', icon: Home },
      { path: '/register', label: 'تسجيل جديد', icon: UserPlus },
      { path: '/login', label: 'تسجيل دخول', icon: LogIn },
    ];
  };

  const navLinks = getNavLinks();

  const handleTrainerLogin = () => {
    if (trainerPassword === 'admin@iisd') {
      dispatch({ type: 'LOGIN_TRAINER' });
      setTrainerLoginOpen(false);
      setTrainerPassword('');
      // Wait for React to process state update before navigating
      setTimeout(() => navigate('/trainer'), 100);
    } else {
      alert('❌ كلمة المرور غير صحيحة');
    }
  };

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50" dir="rtl">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-indigo-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 group-hover:shadow-indigo-300 transition-all">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Diplomacy Lab
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-0.5">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive(link.path)
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {/* دخول المدرب (لغير المسجلين) */}
              {state.userRole === 'guest' && (
                <button
                  onClick={() => setTrainerLoginOpen(true)}
                  className="px-3 py-2 rounded-lg text-xs font-medium text-amber-600 hover:bg-amber-50 transition-all flex items-center gap-1"
                >
                  <Shield className="w-3.5 h-3.5" />
                  دخول المدرب
                </button>
              )}

              {/* معلومات المدرب للمشاركين */}
              {state.userRole === 'participant' && (
                <div className="mr-3 px-3 py-1.5 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-full text-xs flex items-center gap-2">
                  <img
                    src={state.trainerInfo.photo}
                    alt="المدرب"
                    className="w-6 h-6 rounded-full object-cover border-2 border-indigo-200"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                  <span className="text-gray-700 font-medium">{state.trainerInfo.name}</span>
                  <span className="text-gray-400">|</span>
                  <span className="text-gray-500">{state.trainerInfo.organization}</span>
                </div>
              )}

              {/* معلومات المدرب للمدرب نفسه */}
              {state.userRole === 'trainer' && (
                <div className="mr-3 px-2 py-1 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-full text-xs flex items-center gap-2">
                  <img
                    src={state.trainerInfo.photo}
                    alt="المدرب"
                    className="w-7 h-7 rounded-full object-cover border-2 border-amber-300"
                  />
                  <div className="text-right">
                    <div className="font-bold text-amber-800">{state.trainerInfo.name}</div>
                    <div className="text-amber-600 text-[10px]">{state.trainerInfo.organization}</div>
                  </div>
                </div>
              )}


              {state.isLoggedIn && (
                <button onClick={handleLogout} className="mr-2 p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all" title="تسجيل خروج">
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-lg hover:bg-gray-100">
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {menuOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="md:hidden border-t border-gray-100 bg-white">
            <div className="px-4 py-3 space-y-1">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive(link.path) ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                  }`}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </Link>
              ))}

              {/* معلومات المدرب في الموبايل */}
              {state.userRole === 'participant' && (
                <div className="mt-3 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
                  <div className="text-xs text-gray-500 mb-1">المدرب المشرف</div>
                  <div className="flex items-center gap-2">
                    <img src={state.trainerInfo.photo} alt="المدرب" className="w-8 h-8 rounded-full object-cover border-2 border-indigo-200" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    <div>
                      <div className="text-sm font-bold text-gray-900">{state.trainerInfo.name}</div>
                      <div className="text-xs text-gray-500">{state.trainerInfo.organization}</div>
                    </div>
                  </div>
                </div>
              )}

              {state.userRole === 'trainer' && (
                <div className="mt-3 p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                  <div className="flex items-center gap-2">
                    <img src={state.trainerInfo.photo} alt="المدرب" className="w-10 h-10 rounded-full object-cover border-2 border-amber-300" />
                    <div>
                      <div className="text-sm font-bold text-amber-900">{state.trainerInfo.name}</div>
                      <div className="text-xs text-amber-700">{state.trainerInfo.organization}</div>
                    </div>
                  </div>
                </div>
              )}

              {state.isLoggedIn && (
                <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-50 w-full transition-all">
                  <LogOut className="w-4 h-4" /> تسجيل خروج
                </button>
              )}
            </div>
          </motion.div>
        )}
      </header>

      {/* Trainer Login Modal */}
      {trainerLoginOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setTrainerLoginOpen(false)}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">دخول المدرب</h2>
              <p className="text-sm text-gray-500 mt-1">الرجاء إدخال كلمة المرور الخاصة بالمدرب</p>
            </div>
            <input
              type="password"
              value={trainerPassword}
              onChange={(e) => setTrainerPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleTrainerLogin()}
              placeholder="كلمة مرور المدرب"
              className="w-full p-3 border-2 border-gray-200 rounded-xl text-sm text-center focus:border-amber-400 focus:outline-none focus:ring-4 focus:ring-amber-50 transition-all mb-4"
              autoFocus
            />
            <div className="flex gap-3">
              <button onClick={() => setTrainerLoginOpen(false)} className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition-all">
                إلغاء
              </button>
              <button onClick={handleTrainerLogin} className="flex-1 py-3 bg-gradient-to-l from-amber-600 to-orange-600 text-white rounded-xl font-bold hover:shadow-xl transition-all">
                دخول
              </button>
            </div>
            <p className="text-xs text-gray-400 text-center mt-4">* خاص بالمدرب فقط</p>
          </motion.div>
        </motion.div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-indigo-100 bg-white/50 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-gray-500 text-xs">
              <GraduationCap className="w-4 h-4 text-indigo-500" />
              <span>Diplomacy Lab © {new Date().getFullYear()} - {state.trainerInfo.organization}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Building2 className="w-3.5 h-3.5" />
              <span>{state.trainerInfo.organization}</span>
              <span className="mx-1">|</span>
              <Mail className="w-3.5 h-3.5" />
              <span>{state.trainerInfo.email}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
