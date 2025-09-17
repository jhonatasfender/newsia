import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import ArticlesTable from "@/components/ArticlesTable";
import AdminClient from "@/components/AdminClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin - Impacto IA",
  description: "Painel administrativo do Impacto IA",
};

export default async function AdminHome() {
  const supabase = await supabaseServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold">
              Admin • Notícias
            </h1>
            <p className="text-sm text-black/70">
              Listagem de matérias cadastradas
            </p>
          </div>
          <div className="flex gap-3">
            <AdminClient />
            <a
              href="/admin/noticias/criar"
              className="h-10 px-4 rounded-md bg-black text-white inline-flex items-center"
            >
              Criar Notícia
            </a>
          </div>
        </div>
      </div>
      <ArticlesTable />
    </main>
  );
}
