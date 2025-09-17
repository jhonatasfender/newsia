import { notFound } from "next/navigation";
import { NewsRepository } from "@/data/news.repository";
import NewsCard from "@/components/NewsCard";

type Params = { params: { slug: string } };

export async function generateStaticParams() {
  const categories = await NewsRepository.getCategoriesForSSG();

  return categories.map((category) => ({
    slug: category.slug,
  }));
}


export default async function CategoryPage({ params }: Params) {
  const category = await NewsRepository.getCategoryBySlugForSSG(params.slug);

  if (!category) {
    return notFound();
  }

  const articles = await NewsRepository.getNewsByCategoryForSSG(category.id, 50);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16 bg-white">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-4">
            {category.title}
          </h1>
          <p className="text-lg text-black/70">
            Todas as notícias sobre {category.title.toLowerCase()}
          </p>
        </div>

        {articles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-black/60 text-lg">
              Nenhuma notícia encontrada nesta categoria.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <NewsCard
                key={article.id}
                category={category.title}
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
        )}
      </section>
    </main>
  );
}
