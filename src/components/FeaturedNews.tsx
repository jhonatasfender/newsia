import FeaturedLead from "@/components/FeaturedLead";
import NewsCard from "@/components/NewsCard";
import { featuredLead, newsCards } from "@/data/news";
import type { ReactElement } from "react";

export default function FeaturedNews(): ReactElement {
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
          image={featuredLead.image}
          category={featuredLead.category}
          meta={featuredLead.meta}
          title={featuredLead.title}
          excerpt={featuredLead.excerpt}
          href={featuredLead.href}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsCards.map((card) => (
            <NewsCard
              key={card.title}
              category={card.category}
              categoryColor={card.color}
              title={card.title}
              excerpt={card.excerpt}
              minutes={card.minutes}
              date={card.date}
              imageSrc={card.image}
              href={card.href ?? "#"}
            />
          ))}
        </div>
        <div className="flex justify-center pt-2">
          <a
            href="#"
            className="inline-flex items-center rounded-md bg-[color:var(--color-primary)] text-black font-semibold px-4 py-2"
          >
            Ver Todas as Notícias
          </a>
        </div>
      </div>
    </section>
  );
}
