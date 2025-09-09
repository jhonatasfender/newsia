import Link from "next/link";
import { supabaseServer } from "@/lib/supabase/server";

type Row = {
  id: string;
  slug: string;
  title: string;
  minutes: number | null;
  published_at: string | null;
};

import type { ReactElement } from "react";

export default async function ArticlesTable(): Promise<ReactElement> {
  const supabase = await supabaseServer();
  const { data, error } = await supabase
    .from("articles")
    .select("id, slug, title, minutes, published_at")
    .order("published_at", { ascending: false, nullsFirst: false });

  const rows: Row[] = data ?? [];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
      {error && (
        <p className="text-sm text-red-600">Erro ao carregar artigos.</p>
      )}
      <div className="overflow-x-auto border border-black/10 rounded-lg bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-black/5">
            <tr>
              <th className="text-left p-3">Título</th>
              <th className="text-left p-3 hidden sm:table-cell">Slug</th>
              <th className="text-left p-3 hidden md:table-cell">
                Publicado em
              </th>
              <th className="text-left p-3 hidden md:table-cell">Min</th>
              <th className="text-right p-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-black/10">
                <td className="p-3">{r.title}</td>
                <td className="p-3 hidden sm:table-cell text-black/70">
                  {r.slug}
                </td>
                <td className="p-3 hidden md:table-cell text-black/70">
                  {r.published_at
                    ? new Date(r.published_at).toLocaleString("pt-BR")
                    : "—"}
                </td>
                <td className="p-3 hidden md:table-cell text-black/70">
                  {r.minutes ?? "—"}
                </td>
                <td className="p-3 text-right">
                  <Link
                    href={`/admin/noticias/${r.id}/editar`}
                    className="inline-flex items-center px-3 h-8 rounded-md bg-black text-white"
                  >
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td className="p-6 text-center text-black/60" colSpan={5}>
                  Nenhum artigo encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
