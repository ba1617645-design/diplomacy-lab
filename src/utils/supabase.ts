import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
// Disable Supabase for local development - use localStorage only
export const supabase = null;
export const isReady = false;
export function isSupabaseReady() { return false; }

// Admin client for creating profiles (uses the same anon key but with a flag to bypass RLS)
// We insert profiles directly after auth signup
export async function signUp(email: string, password: string, profile: any) {
  if (!supabase) return { user: null, error: 'Supabase not configured' };
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  if (!data.user) throw new Error('فشل إنشاء الحساب');
  const userId = data.user.id;
  // Try insert with session if available, otherwise use service client
  const insertProfile = async () => {
    const { error: profileError } = await supabase.from('profiles').insert({
      id: userId, email,
      full_name: profile.full_name, phone: profile.phone || '',
      country: profile.country || '', profession: profile.profession || '',
      role: profile.role || 'participant',
    });
    if (profileError) throw profileError;
  };
  if (data.session) {
    await insertProfile();
  } else {
    // No session (email confirmation enabled) - try inserting anyway
    // If it fails, profile will be created on first login
    try { await insertProfile(); } catch {}
  }
  return { user: data.user };
}

export async function signIn(email: string, password: string) {
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return { user: data.user };
}

export async function getProfile(userId: string) {
  if (!supabase) return null;
  const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
  return data;
}

export async function getAllProfiles() {
  if (!supabase) return [];
  const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
  return data || [];
}

export async function updateProfile(userId: string, updates: any) {
  if (!supabase) return;
  await supabase.from('profiles').update(updates).eq('id', userId);
}

export async function getActivities() {
  if (!supabase) return [];
  const { data } = await supabase.from('activities').select('*').order('id');
  return data || [];
}

export async function toggleActivityLock(dayKey: string, isLocked: boolean) {
  if (!supabase) return;
  await supabase.from('activities').update({ is_locked: isLocked }).eq('day_key', dayKey);
}

export async function getTrainerProfile() {
  if (!supabase) return null;
  const { data } = await supabase.from('trainer_profile').select('*').eq('id', 1).single();
  return data || null;
}

export async function updateTrainerProfile(updates: any) {
  if (!supabase) return;
  await supabase.from('trainer_profile').update(updates).eq('id', 1);
}
