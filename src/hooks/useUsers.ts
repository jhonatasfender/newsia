import { useState, useEffect } from 'react';
import { supabaseBrowser } from '@/lib/supabase/client';
import { UserProfile } from '@/lib/middleware/auth';

export interface UserWithProfile extends UserProfile {
  last_sign_in_at: string | null;
  created_at: string;
}

export function useUsers() {
  const [users, setUsers] = useState<UserWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const supabase = supabaseBrowser();
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const usersWithAuth = data?.map((user: UserProfile) => ({
        ...user,
        last_sign_in_at: null,
        created_at: user.created_at,
      })) || [];

      setUsers(usersWithAuth);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: 'user' | 'admin' | 'super_admin') => {
    try {
      const supabase = supabaseBrowser();
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole } as never)
        .eq('id', userId);

      if (error) throw error;

      setUsers(prev => 
        prev.map(user => 
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar usuário');
    }
  };


  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    error,
    fetchUsers,
    updateUserRole,
  };
}
