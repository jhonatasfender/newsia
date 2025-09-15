import Hero from "@/components/Hero";
import FeaturedNews from "@/components/FeaturedNews";
import Newsletter from "@/components/Newsletter";
import { NewsRepository } from "@/data/news.repository";

export default async function Home() {
  const newsRepo = new NewsRepository();
  const initialArticles = await newsRepo.listPublished(7);
  const totalCount = await newsRepo.getTotalPublishedCount();

  return (
    <main className="min-h-screen">
      <Hero />
      <FeaturedNews 
        initialArticles={initialArticles} 
        totalCount={totalCount} 
      />
      <Newsletter />
    </main>
  );
}
