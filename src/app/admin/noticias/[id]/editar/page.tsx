import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import type { OutputData } from "@editorjs/editorjs";
import EditArticleForm from "@/components/EditArticleForm";
import type { Metadata } from "next";
import { normalizeSlug } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Editar Notícia - Impacto IA",
  description: "Editar notícia no painel administrativo",
};

type Params = { params: Promise<{ id: string }> };

async function updateArticle(formData: FormData) {
  "use server";
  const supabase = await supabaseServer();
  const id = String(formData.get("id") || "");
  const title = String(formData.get("title") || "");
  const rawSlug = String(formData.get("slug") || "");
  const excerpt = String(formData.get("excerpt") || "");
  const author = String(formData.get("author") || "");
  const minutes = formData.get("minutes")
    ? Number(formData.get("minutes"))
    : null;
  const body = String(formData.get("body") || "");
  const imageUrl = String(formData.get("image_url") || "");
  const categoryId = String(formData.get("category_id") || "");

  if (!categoryId.trim()) {
    throw new Error("Categoria é obrigatória");
  }

  const slug = normalizeSlug(rawSlug);

  await supabase
    .from("articles")
    .update({
      title,
      slug,
      excerpt: excerpt.trim() || null,
      author: author.trim(),
      minutes,
      body,
      image_url: imageUrl.trim() || null,
      category_id: categoryId.trim(),
    })
    .eq("id", id);
  redirect("/admin");
}

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
