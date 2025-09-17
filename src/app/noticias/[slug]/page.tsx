import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { NewsRepository } from "@/data/news.repository";
import ShareButtons from "@/components/ShareButtons";
import RelatedNews from "@/components/RelatedNews";
import EditorJsRenderer from "@/components/EditorJsRenderer";

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const articles = await NewsRepository.getPublishedArticlesForSSG(50);

  return articles.map((article) => ({
    slug: encodeURIComponent(article.slug),
  }));
}

export default async function ArticlePage({ params }: Params) {
  const newsRepo = new NewsRepository();
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const article = await newsRepo.getBySlug(decodedSlug);

  if (!article) return notFound();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  let editorData = null;
  if (article.body) {
    try {
      if (
        typeof article.body === "string" &&
        article.body.trim().startsWith("{")
      ) {
        editorData = JSON.parse(article.body);
      } else {
        editorData = {
          blocks: [
            {
              type: "paragraph",
              data: {
                text: article.body,
              },
            },
          ],
        };
      }
    } catch (error) {
      console.error("Erro ao fazer parse do conteúdo:", error);
      editorData = {
        blocks: [
          {
            type: "paragraph",
            data: {
              text: article.body,
            },
          },
        ],
      };
    }
  }

  return (
    <>
      <article className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
        <div className="max-w-3xl w-full mx-auto">
          <nav aria-label="Breadcrumb" className="mb-4 text-sm text-black/60">
            <ol className="flex items-center gap-2 overflow-hidden">
              {article.categories ? (
                <>
                  <li className="min-w-0 max-w-[35%] truncate">
                    <Link
                      href={`/categoria/${article.categories.slug}`}
                      className="hover:text-[color:var(--color-primary)]"
                    >
                      {article.categories.title}
                    </Link>
                  </li>
                  <li>/</li>
                </>
              ) : null}
              <li
                className="min-w-0 max-w-[60%] truncate text-black/80"
                aria-current="page"
                title={article.title}
              >
                {article.title}
              </li>
            </ol>
          </nav>
          <header className="mb-6">
            <div className="flex items-center gap-3 text-xs mb-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded bg-[color:var(--color-primary)] text-white font-semibold uppercase tracking-wide">
                {article.categories?.title || "Geral"}
              </span>
              <span className="text-black/60">
                {formatDate(article.published_at!)}{" "}
                {article.minutes ? `• ${article.minutes} min` : ""}
              </span>
            </div>
            <h1 className="text-3xl font-extrabold leading-tight">
              {article.title}
            </h1>
            {article.excerpt && (
              <p className="mt-4 text-lg text-black/70 leading-relaxed">
                {article.excerpt}
              </p>
            )}
          </header>

          {article.image_url && (
            <figure className="mb-6">
              <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden border border-black/10">
                <Image
                  src={article.image_url}
                  alt={article.title}
                  fill
                  className="object-cover"
                />
              </div>
            </figure>
          )}

          {editorData ? (
            <EditorJsRenderer data={editorData} />
          ) : (
            <p className="text-gray-600">Conteúdo não disponível.</p>
          )}

          <div className="mt-10">
            <Link
              href="/"
              className="text-[color:var(--color-primary)] font-semibold"
            >
              Voltar para a Home
            </Link>
          </div>

          <ShareButtons
            title={article.title}
            url={`/noticias/${article.slug}`}
          />
        </div>
      </article>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12 lg:py-16">
        <RelatedNews articleId={article.id} categoryId={article.category_id} />
      </section>
    </>
  );
}
