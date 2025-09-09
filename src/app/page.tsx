import Hero from "@/components/Hero";
import FeaturedNews from "@/components/FeaturedNews";
import Newsletter from "@/components/Newsletter";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <FeaturedNews />
      <Newsletter />
    </main>
  );
}
