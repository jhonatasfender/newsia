import NewsCard from "./NewsCard";
import { NewsRepository } from "@/data/news.repository";

type RelatedNewsProps = {
  articleId: string;
  categoryId: string | null;
};

export default async function RelatedNews({ articleId, categoryId }: RelatedNewsProps) {
  const newsRepo = new NewsRepository();
  const relatedArticles = await newsRepo.getRelatedNews(articleId, categoryId, 3);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (relatedArticles.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="related-heading" className="mt-12">
      <h2 id="related-heading" className="text-lg font-semibold mb-4">
        Notícias Relacionadas
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedArticles.map((article) => (
          <NewsCard
            key={article.id}
            category={article.categories?.title || "Geral"}
            categoryColor="bg-[color:var(--color-primary)]"
            title={article.title}
            excerpt={article.excerpt || ""}
            minutes={article.minutes || 5}
            date={formatDate(article.published_at!)}
            imageSrc={article.image_url || "https://picsum.photos/seed/placeholder/800/450"}
            href={`/noticias/${article.slug}`}
          />
        ))}
      </div>
    </section>
  );
}
