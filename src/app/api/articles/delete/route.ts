import { redirect } from "next/navigation";
import { NewsRepository } from "@/data/news.repository";
import { requireAdminAPI } from "@/lib/middleware/api-auth";

export async function POST(request: Request) {
  const { response } = await requireAdminAPI();
  
  if (response) {
    return response;
  }

  const formData = await request.formData();
  const articleId = String(formData.get("article_id") || "");

  if (!articleId.trim()) {
    return new Response("ID do artigo é obrigatório", { status: 400 });
  }

  const newsRepo = new NewsRepository();
  const result = await newsRepo.deleteArticle(articleId);

  if (!result.success) {
    return new Response(result.error || "Erro ao processar solicitação", {
      status: 500,
    });
  }

  redirect("/admin");
}
