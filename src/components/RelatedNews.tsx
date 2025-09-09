import NewsCard from "./NewsCard";
import { featuredLead, newsCards, type NewsItem } from "@/data/news";

type RelatedNewsProps = {
  currentHref: string;
};

export default function RelatedNews({ currentHref }: RelatedNewsProps) {
  const lead: NewsItem = {
    category: featuredLead.category,
    color: "bg-[color:var(--color-primary)]",
    title: featuredLead.title,
    excerpt: featuredLead.excerpt,
    minutes: featuredLead.minutes ?? 5,
    date: featuredLead.date ?? "",
    image: featuredLead.image,
    href: featuredLead.href,
  };

  const all: NewsItem[] = [lead, ...newsCards];

  const items = all.filter((n) => (n.href ?? "") !== currentHref).slice(0, 3);

  return (
    <section aria-labelledby="related-heading" className="mt-12">
      <h2 id="related-heading" className="text-lg font-semibold mb-4">
        Notícias Relacionadas
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((n) => (
          <NewsCard
            key={n.href}
            category={n.category}
            categoryColor={n.color}
            title={n.title}
            excerpt={n.excerpt}
            minutes={n.minutes}
            date={n.date}
            imageSrc={n.image}
            href={n.href ?? "#"}
          />
        ))}
      </div>
    </section>
  );
}
