import Link from "next/link";
import type { ReactElement } from "react";

export default function SiteFooter(): ReactElement {
  return (
    <footer className="bg-black text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="text-xl font-bold text-[color:var(--color-primary)]">
              Impacto AI
            </div>
            <p className="mt-2 text-white/80 max-w-md">
              Sua fonte confiável para as últimas notícias e análises sobre
              inteligência artificial e seu impacto na sociedade.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <button className="w-9 h-9 rounded-md bg-white/10 hover:bg-white/15">
                <i className="fa-brands fa-x-twitter" aria-hidden />
              </button>
              <button className="w-9 h-9 rounded-md bg-white/10 hover:bg-white/15">
                <i className="fa-brands fa-linkedin-in" aria-hidden />
              </button>
              <button className="w-9 h-9 rounded-md bg-white/10 hover:bg-white/15">
                <i className="fa-brands fa-instagram" aria-hidden />
              </button>
            </div>
          </div>
          <div>
            <div className="font-semibold mb-2">Categorias</div>
            <ul className="space-y-1 text-white/85">
              <li>
                <Link href="#tecnologia">Tecnologia</Link>
              </li>
              <li>
                <Link href="#emprego">Emprego</Link>
              </li>
              <li>
                <Link href="#sociedade">Sociedade</Link>
              </li>
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-2">Recursos</div>
            <ul className="space-y-1 text-white/85">
              <li>
                <Link href="#">Newsletter</Link>
              </li>
              <li>
                <Link href="#">Sobre</Link>
              </li>
              <li>
                <Link href="#">Contato</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-white/10 pt-6 text-sm flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="text-white/70">
            © 2025 Impacto AI. Todos os direitos reservados.
          </div>
          <div className="flex items-center gap-4 text-white/70">
            <Link href="#">Privacidade</Link>
            <Link href="#">Termos</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
