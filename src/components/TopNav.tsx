import Link from "next/link";
import Image from "next/image";
import { supabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import { NewsRepository } from "@/data/news.repository";
import { getActiveBanner } from "@/hooks/useBanner";
import type { ReactElement } from "react";

async function signOut() {
  "use server";
  const supabase = await supabaseServer();
  await supabase.auth.signOut();
  redirect("/login");
}

export default async function TopNav(): Promise<ReactElement> {
  noStore();
  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const newsRepo = new NewsRepository();
  const categories = await newsRepo.getCategories();
  const banner = await getActiveBanner();

  return (
    <header className="w-full bg-black text-white sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 h-14 flex items-center">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-bold text-[color:var(--color-primary)]"
        >
          <Image
            src="/logo.png"
            alt={`${banner.title} Logo`}
            width={32}
            height={32}
            className="w-8 h-8"
          />
          Impacto IA
        </Link>

        {/* Center menu */}
        <nav className="mx-auto hidden md:flex items-center gap-8 text-sm text-white/85">
          {categories.map((category) => (
            <Link
              key={category.id}
              className="hover:text-white"
              href={`/categoria/${category.slug}`}
            >
              {category.title}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-3">
          <div className="hidden sm:block">
            <div className="relative">
              <input
                aria-label="Buscar"
                placeholder="Buscar..."
                className="h-9 w-60 rounded-md bg-white/10 placeholder-white/60 text-white pl-9 pr-3 outline-none border border-white/10 focus:border-[color:var(--color-primary)]/60"
              />
              <i
                className="fa-solid fa-magnifying-glass absolute left-2.5 top-1/2 -translate-y-1/2 text-white/60"
                aria-hidden
              />
            </div>
          </div>

          {user ? (
            <form action={signOut}>
              <button className="h-9 px-3 rounded-md bg-white text-black text-sm font-semibold cursor-pointer">
                Sair
              </button>
            </form>
          ) : (
            <Link
              href="/login"
              className="h-9 px-3 inline-flex items-center rounded-md bg-white text-black text-sm font-semibold"
            >
              Entrar
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
