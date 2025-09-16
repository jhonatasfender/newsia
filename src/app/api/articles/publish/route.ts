import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import { NewsRepository } from "@/data/news.repository";

export async function POST(request: Request) {
  const supabase = await supabaseServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const formData = await request.formData();
  const articleId = String(formData.get("article_id") || "");
  const action = String(formData.get("action") || "");

  if (!articleId.trim()) {
    return new Response("ID do artigo é obrigatório", { status: 400 });
  }

  if (!["publish", "unpublish"].includes(action)) {
    return new Response("Ação inválida", { status: 400 });
  }

  const newsRepo = new NewsRepository();
  let result;

  if (action === "publish") {
    result = await newsRepo.publishArticle(articleId);
  } else {
    result = await newsRepo.unpublishArticle(articleId);
  }

  if (!result.success) {
    return new Response(result.error || "Erro ao processar solicitação", {
      status: 500,
    });
  }

  redirect("/admin");
}
