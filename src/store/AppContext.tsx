import { createContext, useContext, useReducer, ReactNode, Dispatch, useRef, useEffect } from 'react';
import { supabase, isSupabaseReady } from '../utils/supabase';

// ====== Types ======
export interface RegisteredUser {
  id: string; name: string; email: string; phone: string; password: string;
  role: string; country: string; profession: string; registeredAt: number;
  xp: number; level: number; completedMissions: string[];
  scores: any; badges: any[];
}
export interface UserProfile {
  name: string; xp: number; level: number; completedMissions: string[];
  scores: any; badges: any[]; email: string;
  aiReport?: string; negotiationScore?: any; influencePerson?: string;
  influenceCards?: string[]; topInfluenceSources?: string[]; developmentChoice?: string;
}
export interface AppState {
  isLoggedIn: boolean; userRole: 'guest' | 'participant' | 'trainer';
  registeredUsers: RegisteredUser[];
  userProfile: UserProfile;
  trainerInfo: { name: string; title: string; organization: string; photo: string; email: string; };
  lockedDays: Record<string, boolean>;
  // Workshop state (local only)
  story: any; impactCanvas: any; negotiation: any; impactEngineering: any;
  _supabaseUserId?: string;
}

const STORAGE_KEY = 'dl_state';

function freshState(): AppState {
  return {
    isLoggedIn: false, userRole: 'guest', registeredUsers: [],
    lockedDays: { day1: false, day2: false, day3: false, day4: false, day5: false },
    trainerInfo: { name: 'د. عبدالله القحطاني', title: 'مدرب معتمد', organization: 'المعهد الدولي للتنمية المستدامة', photo: '/images/trainer.jpg', email: 'a.alqahtani@iisd.org' },
    userProfile: { name: '', xp: 0, level: 1, completedMissions: [], scores: { influence: 0, storytelling: 0, negotiation: 0, impact: 0, impactEngineering: 0 }, badges: [], email: '' },
    story: {}, impactCanvas: {}, negotiation: {}, impactEngineering: {},
  };
}

function loadLocal() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch { return {}; }
}
function saveLocal(data: any) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {} 
}

type Action =
  | { type: 'SET_STATE'; payload: any }
  | { type: 'LOGIN'; payload: { profile: any; role: string } }
  | { type: 'LOGIN_TRAINER' }
  | { type: 'LOGOUT' }
  | { type: 'REGISTER_USER'; payload: RegisteredUser }
  | { type: 'UPDATE_PROFILE'; payload: any }
  | { type: 'TOGGLE_DAY_LOCK'; payload: string }
  | { type: 'UPDATE_TRAINER'; payload: any }
  | { type: 'COMPLETE_MISSION'; payload: string }
  | { type: 'ADD_XP'; payload: number }
  | { type: 'SET_STORY'; payload: any }
  | { type: 'SET_IMPACT_CANVAS'; payload: any }
  | { type: 'ADD_NEGOTIATION_MESSAGE'; payload: any }
  | { type: 'START_NEGOTIATION' }
  | { type: 'SET_NEGOTIATION_TIMER'; payload: number }
  | { type: 'USE_RETRY' }
  | { type: 'RESET_NEGOTIATION' }
  | { type: 'FINISH_NEGOTIATION'; payload: any }
  | { type: 'SET_IMPACT_ENGINEERING'; payload: any }
  | { type: 'RESET_IMPACT_ENGINEERING' };

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_STATE': return { ...state, ...action.payload };
    case 'LOGIN': return { ...state, isLoggedIn: true, userRole: action.payload.role as any, userProfile: { ...state.userProfile, ...action.payload.profile }, _supabaseUserId: action.payload.profile?.id || state._supabaseUserId };
    case 'LOGIN_TRAINER': return { ...state, isLoggedIn: true, userRole: 'trainer' };
    case 'LOGOUT': return { ...state, isLoggedIn: false, userRole: 'guest' };
    case 'REGISTER_USER': return { ...state, registeredUsers: [...state.registeredUsers, action.payload] };
    case 'UPDATE_PROFILE': return { ...state, userProfile: { ...state.userProfile, ...action.payload } };
    case 'TOGGLE_DAY_LOCK': return { ...state, lockedDays: { ...state.lockedDays, [action.payload]: !state.lockedDays[action.payload] } };
    case 'UPDATE_TRAINER': return { ...state, trainerInfo: { ...state.trainerInfo, ...action.payload } };
    case 'COMPLETE_MISSION': {
      const missions = [...state.userProfile.completedMissions, action.payload];
      const xp = state.userProfile.xp + 100;
      const lvl = Math.floor(xp / 300) + 1;
      return { ...state, userProfile: { ...state.userProfile, completedMissions: missions, xp, level: lvl } };
    }
    case 'ADD_XP': return { ...state, userProfile: { ...state.userProfile, xp: state.userProfile.xp + action.payload } };
    case 'SET_STORY': return { ...state, story: { ...state.story, ...action.payload } };
    case 'SET_IMPACT_CANVAS': return { ...state, impactCanvas: { ...state.impactCanvas, ...action.payload } };
    case 'ADD_NEGOTIATION_MESSAGE': return { ...state, negotiation: { ...(state.negotiation || {}), messages: [...((state.negotiation as any)?.messages || []), action.payload] } };
    case 'START_NEGOTIATION': return { ...state, negotiation: { started: true, timerSeconds: 300, retriesLeft: 3, totalRetries: 3, messages: [], scores: { negotiation: 0, alliance: 0, communication: 0, time: 0 }, teams: [] } };
    case 'SET_NEGOTIATION_TIMER': return { ...state, negotiation: { ...state.negotiation, timerSeconds: action.payload } };
    case 'USE_RETRY': return { ...state, negotiation: { ...state.negotiation, retriesLeft: (state.negotiation as any)?.retriesLeft - 1 || 2, messages: [...((state.negotiation as any)?.messages || []), { from: 'النظام', text: '🔄 تم إعادة التفاوض', timestamp: Date.now() }], timerSeconds: 300 } };
    case 'RESET_NEGOTIATION': return { ...state, negotiation: {} };
    case 'FINISH_NEGOTIATION': return { ...state, negotiation: { ...state.negotiation, finished: true, scores: action.payload } };
    case 'SET_IMPACT_ENGINEERING': return { ...state, impactEngineering: { ...state.impactEngineering, ...action.payload } };
    case 'RESET_IMPACT_ENGINEERING': return { ...state, impactEngineering: {} };
    default: return state;
  }
}

const AppContext = createContext<{ state: AppState; dispatch: Dispatch<Action> } | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, rawDispatch] = useReducer(appReducer, undefined, () => {
    // Load from localStorage + merge with fresh state
    const cached = loadLocal();
    const fresh = freshState();
    if (!cached || Object.keys(cached).length === 0) return fresh;
    return {
      ...fresh,
      ...cached,
      registeredUsers: cached.registeredUsers || [],
      trainerInfo: { ...fresh.trainerInfo, ...(cached.trainerInfo || {}) },
      userProfile: { ...fresh.userProfile, ...(cached.userProfile || {}) },
      lockedDays: { ...fresh.lockedDays, ...(cached.lockedDays || {}) },
    };
  });

  // Stable dispatch that also saves to localStorage
  const stateRef = useRef(state);
  stateRef.current = state;
  
  const dispatch = useRef((action: any) => {
    rawDispatch(action);
    setTimeout(() => {
      const current = stateRef.current;
      saveLocal({
        registeredUsers: current.registeredUsers,
        trainerInfo: current.trainerInfo,
        lockedDays: current.lockedDays,
        userProfile: current.userProfile,
        isLoggedIn: current.isLoggedIn,
        userRole: current.userRole,
      });
    }, 0);
  }).current;

  // Sync user profile to Supabase when it changes
  useEffect(() => {
    if (!isSupabaseReady() || !state.isLoggedIn || state.userRole === 'trainer' || !state.userProfile.email) return;
    const userId = (state as any)._supabaseUserId;
    if (!userId) return;
    const timer = setTimeout(async () => {
      try {
        await supabase!.from('profiles').update({
          full_name: state.userProfile.name,
          xp: state.userProfile.xp,
          level: state.userProfile.level,
          completed_missions: state.userProfile.completedMissions,
          scores: state.userProfile.scores,
          badges: state.userProfile.badges,
        }).eq('id', userId);
      } catch {}
    }, 2000);
    return () => clearTimeout(timer);
  }, [state.isLoggedIn, state.userRole, state.userProfile.name, state.userProfile.xp, state.userProfile.level, state.userProfile.completedMissions, state.userProfile.scores, state.userProfile.badges, state.userProfile.email]);

  // Sync registeredUsers from Supabase on mount
  useEffect(() => {
    if (!isSupabaseReady()) return;
    (async () => {
      try {
        const { data: profiles } = await supabase!.from('profiles').select('*').order('created_at', { ascending: false });
        if (profiles && profiles.length > 0) {
          rawDispatch({ type: 'SET_STATE', payload: { registeredUsers: profiles.map((p: any) => ({
            id: p.id, name: p.full_name || p.email, email: p.email, phone: p.phone || '',
            password: '000000', role: p.role || 'participant', country: p.country || '',
            profession: p.profession || '', registeredAt: Date.now(), xp: p.xp || 0, level: p.level || 1,
            completedMissions: p.completed_missions || [], scores: p.scores || {},
            badges: p.badges || [],
          })) } });
        }
      } catch {}
    })();
  }, []);

  if (!state) return null;

  return <AppContext.Provider value={{ state, dispatch } as any}>{children}</AppContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppState must be used within AppProvider');
  return ctx;
}
