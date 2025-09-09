import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import AuthClient from "@/components/AuthClient";

export default async function LoginPage() {
  const supabase = await supabaseServer();
  const { data } = await supabase.auth.getSession();
  if (data.session) redirect("/admin");
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white border border-black/10 rounded-lg p-6 shadow-sm">
        <h1 className="text-xl font-bold mb-4">Entrar</h1>
        <AuthClient />
      </div>
    </main>
  );
}
