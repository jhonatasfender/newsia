import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

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

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return profile;
}

export async function requireAuthAPI(): Promise<{ profile: UserProfile; response?: NextResponse }> {
  const profile = await getCurrentUserProfile();
  
  if (!profile) {
    return {
      profile: null as unknown as UserProfile,
      response: NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    };
  }
  
  return { profile };
}

export async function requireAdminAPI(): Promise<{ profile: UserProfile; response?: NextResponse }> {
  const { profile, response } = await requireAuthAPI();
  
  if (response) return { profile, response };
  
  if (profile.role !== 'admin' && profile.role !== 'super_admin') {
    return {
      profile: null as unknown as UserProfile,
      response: NextResponse.json({ error: 'Acesso negado. Apenas administradores.' }, { status: 403 })
    };
  }
  
  return { profile };
}

export async function requireSuperAdminAPI(): Promise<{ profile: UserProfile; response?: NextResponse }> {
  const { profile, response } = await requireAuthAPI();
  
  if (response) return { profile, response };
  
  if (profile.role !== 'super_admin') {
    return {
      profile: null as unknown as UserProfile,
      response: NextResponse.json({ error: 'Acesso negado. Apenas super administradores.' }, { status: 403 })
    };
  }
  
  return { profile };
}
