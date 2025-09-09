import Link from "next/link";

export default function Hero(): JSX.Element {
  return (
    <section className="relative w-full overflow-hidden text-white">
      {/* Background image with dark overlay */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/network-bg/1600/800')] bg-center bg-cover" />
        <div className="absolute inset-0 bg-black/60" />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24">
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
          Inteligência Artificial e <span className="text-[color:var(--color-primary)]">Sociedade</span>
        </h1>
        <p className="mt-4 max-w-2xl text-white/85">
          Análises profundas sobre como a IA está transformando tecnologia, emprego e sociedade.
        </p>
        <div className="mt-8">
          <Link
            href="#ultimas"
            className="inline-flex items-center rounded-md bg-[color:var(--color-primary)] hover:brightness-110 text-black font-semibold px-5 py-2.5 transition-colors"
          >
            Explorar Notícias
          </Link>
        </div>
      </div>
    </section>
  );
}


