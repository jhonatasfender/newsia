import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { newsCards, featuredLead } from "@/data/news";
import ShareButtons from "@/components/ShareButtons";
import RelatedNews from "@/components/RelatedNews";

type Params = { params: { slug: string } };

type Article = {
  category: string;
  title: string;
  image: string;
  excerpt: string;
  date: string; // deterministic SSR
  minutes?: number;
  href?: string;
};

export function generateStaticParams() {
  const hrefs = [
    featuredLead.href ?? "",
    ...newsCards.map((n) => n.href ?? ""),
  ].filter((v) => typeof v === "string" && v.length > 0) as string[];

  const slugs = hrefs
    .map((h) => h.replace(/^\/?noticias\//, ""))
    .map((s) => s.replace(/\/$/, ""))
    .filter((s) => s.length > 0);

  return slugs.map((slug) => ({ slug }));
}

export default function ArticlePage({ params }: Params) {
  const all: Article[] = [
    { ...featuredLead, href: featuredLead.href ?? "", date: featuredLead.date ?? "" },
    ...newsCards.map((n) => ({ ...n, date: n.date })),
  ];
  const article = all.find((a) => (a.href ?? "").endsWith(params.slug));
  if (!article) return notFound();

  return (
    <>
    <article className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      <div className="max-w-3xl w-full mx-auto">
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-black/60">
        <ol className="flex items-center gap-2">
          <li>
            <Link href="/" className="hover:text-[color:var(--color-primary)]">Home</Link>
          </li>
          <li>/</li>
          <li>
            <Link href="/" className="hover:text-[color:var(--color-primary)]">{article.category}</Link>
          </li>
          <li>/</li>
          <li className="text-black/80" aria-current="page">{article.title}</li>
        </ol>
      </nav>
      <header className="mb-6">
        <div className="flex items-center gap-3 text-xs mb-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded bg-[color:var(--color-primary)] text-white font-semibold uppercase tracking-wide">{article.category}</span>
          <span className="text-black/60">{article.date} {article.minutes ? `• ${article.minutes} min` : ""}</span>
        </div>
        <h1 className="text-3xl font-extrabold leading-tight">
          {article.title}
        </h1>
      </header>

      <figure className="mb-6">
        <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden border border-black/10">
          <Image src={article.image} alt="" fill className="object-cover" />
        </div>
        <figcaption className="mt-2 text-xs text-black/60">OpenAI implementa seus próprios sistemas de IA para automatizar operações internas</figcaption>
      </figure>

      <div className="prose prose-neutral prose-lg max-w-none">
        <p>
          {article.excerpt}
        </p>
        <p>
          Este é um conteúdo estático de exemplo. Na integração com o Supabase/MDX,
          renderizaremos o corpo completo aqui.
        </p>
      </div>

      <div className="mt-10">
        <Link href="/" className="text-[color:var(--color-primary)] font-semibold">
          ← Voltar para a Home
        </Link>
      </div>

      <ShareButtons title={article.title} url={article.href} />
      </div>
    </article>

    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12 lg:py-16">
      <RelatedNews currentHref={article.href ?? ""} />
    </section>
    </>
  );
}


