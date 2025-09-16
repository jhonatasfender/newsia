import { NextResponse } from "next/server";
import { NewsRepository } from "@/data/news.repository";

export async function GET() {
  try {
    const newsRepo = new NewsRepository();
    const allArticles = await newsRepo.listPublished(100);

    return NextResponse.json(allArticles);
  } catch (error) {
    console.error("Erro ao carregar todas as notícias:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
