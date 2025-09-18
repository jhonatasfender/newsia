import { requireAdmin, isSuperAdmin } from "@/lib/middleware/auth";
import ArticlesTable from "@/components/ArticlesTable";
import AdminClient from "@/components/AdminClient";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin - Impacto IA",
  description: "Painel administrativo do Impacto IA",
};

export default async function AdminHome() {
  await requireAdmin();
  const isSuperAdminUser = await isSuperAdmin();

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold">
              Admin • Notícias
            </h1>
            <p className="text-sm text-black/70">
              Listagem de matérias cadastradas
            </p>
          </div>
          <div className="flex gap-3">
            <AdminClient />
            {isSuperAdminUser && (
              <Link
                href="/admin/usuarios"
                className="h-10 px-4 rounded-md bg-gray-600 text-white inline-flex items-center"
              >
                Gerenciar Usuários
              </Link>
            )}
            <Link
              href="/admin/noticias/criar"
              className="h-10 px-4 rounded-md bg-black text-white inline-flex items-center"
            >
              Criar Notícia
            </Link>
          </div>
        </div>
      </div>
      <ArticlesTable />
    </main>
  );
}
