import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await supabaseServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  
  if (!session) {
    redirect("/login");
  }

  const formData = await request.formData();
  const title = String(formData.get("title") || "");
  const slug = String(formData.get("slug") || "");
  const excerpt = String(formData.get("excerpt") || "");
  const minutes = formData.get("minutes")
    ? Number(formData.get("minutes"))
    : null;
  const body = String(formData.get("body") || "");
  const imageUrl = String(formData.get("image_url") || "");
  const categoryId = String(formData.get("category_id") || "");
  const publishNow = formData.get("publish_now") === "on";

  if (!title.trim()) {
    return new Response("Título é obrigatório", { status: 400 });
  }
  if (!slug.trim()) {
    return new Response("Slug é obrigatório", { status: 400 });
  }

  const { data: existingArticle } = await supabase
    .from("articles")
    .select("id")
    .eq("slug", slug)
    .single();

  if (existingArticle) {
    return new Response("Slug já existe. Escolha outro slug.", { status: 400 });
  }

  const articleData = {
    title: title.trim(),
    slug: slug.trim(),
    excerpt: excerpt.trim() || null,
    minutes,
    body: body || null,
    image_url: imageUrl.trim() || null,
    category_id: categoryId || null,
    published_at: publishNow ? new Date().toISOString() : null,
  };

  const { error } = await supabase
    .from("articles")
    .insert(articleData);

  if (error) {
    console.error("Erro ao criar artigo:", error);
    return new Response(`Erro: ${error.message}`, { status: 500 });
  }

  redirect("/admin");
}
