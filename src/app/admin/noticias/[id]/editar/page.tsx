import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import type { OutputData } from "@editorjs/editorjs";
import EditArticleForm from "@/components/EditArticleForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Editar Notícia - Impacto IA",
  description: "Editar notícia no painel administrativo",
};

type Params = { params: Promise<{ id: string }> };


export default async function EditArticlePage({ params }: Params) {
  const supabase = await supabaseServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) redirect("/login");

  const { id } = await params;

  const { data } = await supabase
    .from("articles")
    .select(
      `
      id, title, slug, excerpt, minutes, body, image_url, category_id, author,
      categories (
        id,
        title,
        slug
      )
    `,
    )
    .eq("id", id)
    .single();

  const { data: categories } = await supabase
    .from("categories")
    .select("id, title, slug")
    .order("title");

  if (!data) redirect("/admin");

  let initialBlocks: OutputData | undefined = undefined;
  try {
    initialBlocks = data.body
      ? (JSON.parse(data.body) as OutputData)
      : undefined;
  } catch {}

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
        <h1 className="text-2xl font-extrabold mb-4">Editar Notícia</h1>
        <EditArticleForm 
          article={data} 
          categories={categories || []} 
          initialBlocks={initialBlocks} 
        />
      </div>
    </main>
  );
}
