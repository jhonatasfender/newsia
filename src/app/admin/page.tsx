import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import ArticlesTable from "@/components/ArticlesTable";

export default async function AdminHome() {
  const supabase = supabaseServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold">Admin • Notícias</h1>
        <p className="text-sm text-black/70">Listagem de matérias cadastradas</p>
      </div>
      <ArticlesTable />
    </main>
  );
}


