import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import { normalizeSlug } from "@/lib/utils";
import { requireAdminAPI } from "@/lib/middleware/api-auth";

export async function POST(request: Request) {
  const { response } = await requireAdminAPI();
  
  if (response) {
    return response;
  }

  const supabase = await supabaseServer();

  const formData = await request.formData();
  const title = String(formData.get("title") || "");
  const rawSlug = String(formData.get("slug") || "");
  const excerpt = String(formData.get("excerpt") || "");
  const author = String(formData.get("author") || "");
  const minutes = formData.get("minutes")
    ? Number(formData.get("minutes"))
    : null;
  
  const rawBody = formData.get("body");
  let body = null;
  
  if (rawBody) {
    try {
      const bodyString = String(rawBody);
      const parsedBody = JSON.parse(bodyString);
      body = parsedBody;
    } catch (error) {
      console.error("Error parsing body JSON:", error);
      body = String(rawBody);
    }
  }
  const imageUrl = String(formData.get("image_url") || "");
  const categoryId = String(formData.get("category_id") || "");
  const publishNow = formData.get("publish_now") === "on";

  if (!title.trim()) {
    return new Response("Título é obrigatório", { status: 400 });
  }
  if (!rawSlug.trim()) {
    return new Response("Slug é obrigatório", { status: 400 });
  }
  if (!author.trim()) {
    return new Response("Autor é obrigatório", { status: 400 });
  }
  if (!categoryId.trim()) {
    return new Response("Categoria é obrigatória", { status: 400 });
  }

  const slug = normalizeSlug(rawSlug);

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
    category_id: categoryId.trim(),
    author: author.trim(),
    published_at: publishNow ? new Date().toISOString() : null,
  };

  const { error } = await supabase.from("articles").insert(articleData);

  if (error) {
    console.error("Erro ao criar artigo:", error);
    return new Response(`Erro: ${error.message}`, { status: 500 });
  }

  redirect("/admin");
}
