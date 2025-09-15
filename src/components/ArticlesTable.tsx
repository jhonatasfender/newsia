import { NewsRepository } from "@/data/news.repository";
import ArticleActionButtons from "./ArticleActionButtons";

type Row = {
  id: string;
  slug: string;
  title: string;
  minutes: number | null;
  published_at: string | null;
};

import type { ReactElement } from "react";

export default async function ArticlesTable(): Promise<ReactElement> {
  const newsRepo = new NewsRepository();
  const articles = await newsRepo.getAllArticles();
  
  const rows: Row[] = articles.map(article => ({
    id: article.id,
    slug: article.slug,
    title: article.title,
    minutes: article.minutes,
    published_at: article.published_at
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
      <div className="overflow-x-auto border border-black/10 rounded-lg bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-black/5">
            <tr>
              <th className="text-left p-3">Título</th>
              <th className="text-left p-3 hidden sm:table-cell">Slug</th>
              <th className="text-left p-3 hidden md:table-cell">Status</th>
              <th className="text-left p-3 hidden md:table-cell">
                Publicado em
              </th>
              <th className="text-left p-3 hidden md:table-cell">Min</th>
              <th className="text-center p-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-black/10">
                <td className="p-3">{r.title}</td>
                <td className="p-3 hidden sm:table-cell text-black/70">
                  {r.slug}
                </td>
                <td className="p-3 hidden md:table-cell">
                  {r.published_at ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Publicado
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      Rascunho
                    </span>
                  )}
                </td>
                <td className="p-3 hidden md:table-cell text-black/70">
                  {r.published_at
                    ? new Date(r.published_at).toLocaleString("pt-BR")
                    : "—"}
                </td>
                <td className="p-3 hidden md:table-cell text-black/70">
                  {r.minutes ?? "—"}
                </td>
                <td className="p-3 text-center">
                  <ArticleActionButtons
                    articleId={r.id}
                    articleTitle={r.title}
                    isPublished={r.published_at !== null}
                  />
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td className="p-6 text-center text-black/60" colSpan={6}>
                  Nenhum artigo encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
