'use client';

import { useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase/client';

export default function LogoutButton() {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);
      
      if (typeof window !== 'undefined') {
        localStorage.clear();
        sessionStorage.clear();
        
        document.cookie.split(";").forEach((c) => {
          const eqPos = c.indexOf("=");
          const name = eqPos > -1 ? c.substr(0, eqPos) : c;
          document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
        });
      }

      const supabase = supabaseBrowser();
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Erro ao fazer logout:', error);
      }

      await new Promise(resolve => setTimeout(resolve, 200));

      window.location.href = '/login';
      
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      window.location.href = '/login';
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleLogout}
      disabled={loading}
      className="h-9 px-3 rounded-md bg-white text-black text-sm font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? 'Saindo...' : 'Sair'}
    </button>
  );
}
