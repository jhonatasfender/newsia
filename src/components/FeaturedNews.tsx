"use client";

import { useState } from "react";
import FeaturedLead from "@/components/FeaturedLead";
import NewsCard from "@/components/NewsCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import type { NewsArticle } from "@/data/news.repository";

type Props = {
  initialArticles: NewsArticle[];
  totalCount: number;
};

export default function FeaturedNews({ initialArticles, totalCount }: Props) {
  const [articles, setArticles] = useState(initialArticles);
  const [isLoading, setIsLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);

  if (articles.length === 0) {
    return (
      <section
        id="ultimas"
        className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16 bg-white"
      >
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold">
            Últimas Notícias
          </h2>
          <p className="mt-2 text-black/70 text-sm">
            Acompanhe as principais tendências em IA
          </p>
        </div>
        <div className="mt-10 text-center">
          <p className="text-black/60">Nenhuma notícia publicada ainda.</p>
        </div>
      </section>
    );
  }

  const featuredArticle = articles[0];
  const otherArticles = showAll ? articles.slice(1) : articles.slice(1, 7);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatMeta = (article: typeof featuredArticle) => {
    const date = formatDate(article.published_at!);
    const minutes = article.minutes || 5;
    return `${date} • ${minutes} min`;
  };

  const loadAllArticles = async () => {
    if (isLoading || showAll) return;

    setIsLoading(true);

    try {
      const response = await fetch("/api/news/all");
      const allArticles = await response.json();

      if (allArticles.length > 0) {
        setArticles(allArticles);
        setShowAll(true);
      }
    } catch (error) {
      console.error("Erro ao carregar todas as notícias:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section
      id="ultimas"
      className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16 bg-white"
    >
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-extrabold">
          Últimas Notícias
        </h2>
        <p className="mt-2 text-black/70 text-sm">
          Acompanhe as principais tendências em IA
        </p>
      </div>

      <div className="mt-10 grid gap-8">
        <FeaturedLead
          image={
            featuredArticle.image_url ||
            "https://picsum.photos/seed/news-hero/1200/800"
          }
          category={featuredArticle.categories?.title || "Geral"}
          meta={formatMeta(featuredArticle)}
          title={featuredArticle.title}
          excerpt={featuredArticle.excerpt || ""}
          href={`/noticias/${featuredArticle.slug}`}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {otherArticles.map((article) => (
            <NewsCard
              key={article.id}
              category={article.categories?.title || "Geral"}
              categoryColor="bg-[color:var(--color-primary)]"
              title={article.title}
              excerpt={article.excerpt || ""}
              minutes={article.minutes || 5}
              date={formatDate(article.published_at!)}
              imageSrc={
                article.image_url ||
                "https://picsum.photos/seed/placeholder/800/450"
              }
              href={`/noticias/${article.slug}`}
            />
          ))}
        </div>

        {!showAll && totalCount > 7 && (
          <div className="flex justify-center pt-6">
            <button
              onClick={loadAllArticles}
              disabled={isLoading}
              className="inline-flex items-center gap-2 rounded-md bg-[color:var(--color-primary)] text-black font-semibold px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" />
                  Carregando...
                </>
              ) : (
                "Ver Todas as Notícias"
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
