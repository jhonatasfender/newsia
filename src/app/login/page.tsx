"use server";

import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";

async function login(formData: FormData) {
  "use server";
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");

  const supabase = supabaseServer();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    redirect("/login?error=1");
  }

  redirect("/admin");
}

export default async function LoginPage({ searchParams }: { searchParams?: Record<string, string | string[] | undefined> }) {
  const showError = Boolean(searchParams?.error);
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white border border-black/10 rounded-lg p-6 shadow-sm">
        <h1 className="text-xl font-bold mb-1">Entrar</h1>
        <p className="text-sm text-black/70 mb-6">Use o email e senha fixos para desenvolvimento.</p>
        {showError && (
          <p className="mb-4 text-sm text-red-600">Credenciais inválidas. Tente novamente.</p>
        )}

        <form action={login} className="grid gap-3">
          <div className="grid gap-1">
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              defaultValue="jhonatas.fender@gmail.com"
              className="h-10 px-3 rounded-md border border-black/15 outline-none focus:border-[color:var(--color-primary)]"
              required
            />
          </div>
          <div className="grid gap-1">
            <label htmlFor="password" className="text-sm font-medium">Senha</label>
            <input
              id="password"
              name="password"
              type="password"
              defaultValue="123456"
              className="h-10 px-3 rounded-md border border-black/15 outline-none focus:border-[color:var(--color-primary)]"
              required
            />
          </div>
          <button
            type="submit"
            className="mt-2 h-10 rounded-md bg-[color:var(--color-primary)] text-black font-semibold"
          >
            Entrar
          </button>
        </form>
      </div>
    </main>
  );
}


