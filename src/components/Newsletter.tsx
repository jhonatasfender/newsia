import type { ReactElement } from "react";

export default function Newsletter(): ReactElement {
  return (
    <section className="bg-[#2563eb] text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14 sm:py-16 text-center">
        <h3 className="text-2xl sm:text-3xl font-extrabold">
          Receba as Últimas Novidades em IA
        </h3>
        <p className="mt-2 text-white/85">
          Assine nossa newsletter e seja o primeiro a saber sobre inovações em
          inteligência artificial
        </p>
        <form className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <input
            type="email"
            placeholder="Digite seu email"
            className="h-11 w-full sm:w-[380px] rounded-md bg-white text-black placeholder-black/50 px-4 outline-none"
          />
          <button
            className="h-11 px-5 rounded-md bg-black text-white font-semibold hover:opacity-90"
            type="button"
          >
            Inscrever-se
          </button>
        </form>
        <p className="mt-2 text-sm text-white/80">
          Enviamos apenas conteúdo relevante. Sem spam.
        </p>
      </div>
    </section>
  );
}
