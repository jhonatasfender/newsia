import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import CreateArticleForm from "@/components/CreateArticleForm";

export default async function CreateArticlePage() {
  const supabase = await supabaseServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) redirect("/login");

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
