import Image from "next/image";
import Link from "next/link";
import { supabaseServer } from "@/lib/supabase/server";

type Article = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  image_url: string | null;
  minutes: number | null;
  published_at: string | null;
};

export default async function NewsList(): Promise<JSX.Element> {
  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from("articles")
    .select("id, slug, title, excerpt, image_url, minutes, published_at")
    .order("published_at", { ascending: false, nullsFirst: false });

  const articles: Article[] = data ?? [];

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      <h1 className="text-2xl sm:text-3xl font-extrabold">Últimas Notícias</h1>

      {error && (
        <p className="mt-4 text-sm text-red-600">Erro ao carregar notícias.</p>
      )}

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((a) => (
          <article key={a.id} className="rounded-lg border border-black/10 overflow-hidden bg-white">
            <Link href={`/noticias/${a.slug}`}>
              <div className="relative aspect-[16/9] w-full">
                {a.image_url ? (
                  <Image src={a.image_url} alt="" fill className="object-cover" />
                ) : (
                  <div className="absolute inset-0 bg-gray-100" />
                )}
              </div>
            </Link>
            <div className="p-4">
              <h2 className="font-semibold text-lg">
                <Link href={`/noticias/${a.slug}`}>{a.title}</Link>
              </h2>
              {a.excerpt && (
                <p className="mt-1 text-sm text-black/70 line-clamp-3">{a.excerpt}</p>
              )}
              <div className="mt-3 text-xs text-black/60">
                {a.published_at ? new Date(a.published_at).toLocaleDateString("pt-BR") : ""}
                {a.minutes ? ` • ${a.minutes} min` : ""}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}


