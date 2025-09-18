import { requireAdmin } from "@/lib/middleware/auth";
import { supabaseServer } from "@/lib/supabase/server";
import CreateArticleForm from "@/components/CreateArticleForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Criar Notícia - Impacto IA",
  description: "Criar nova notícia no painel administrativo",
};

export default async function CreateArticlePage() {
  await requireAdmin();
  const supabase = await supabaseServer();

  const { data: categories } = await supabase
    .from("categories")
    .select("id, title, slug")
    .order("title");

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
        <h1 className="text-2xl font-extrabold mb-4">Criar Notícia</h1>
        <CreateArticleForm categories={categories || []} />
      </div>
    </main>
  );
}
