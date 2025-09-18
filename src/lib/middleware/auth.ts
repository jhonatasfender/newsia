import { supabaseServer } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  role: 'user' | 'admin' | 'super_admin';
  created_at: string;
  updated_at: string;
}

export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('Erro ao buscar perfil do usuário:', error);
    return null;
  }

  return profile;
}

export async function requireAuth(): Promise<UserProfile> {
  const profile = await getCurrentUserProfile();
  
  if (!profile) {
    redirect('/login');
  }
  
  return profile;
}

export async function requireAdmin(): Promise<UserProfile> {
  const profile = await requireAuth();
  
  if (profile.role !== 'admin' && profile.role !== 'super_admin') {
    redirect('/');
  }
  
  return profile;
}

export async function requireSuperAdmin(): Promise<UserProfile> {
  const profile = await requireAuth();
  
  if (profile.role !== 'super_admin') {
    redirect('/');
  }
  
  return profile;
}

export async function isAdmin(): Promise<boolean> {
  const profile = await getCurrentUserProfile();
  return profile?.role === 'admin' || profile?.role === 'super_admin';
}

export async function isSuperAdmin(): Promise<boolean> {
  const profile = await getCurrentUserProfile();
  return profile?.role === 'super_admin';
}
