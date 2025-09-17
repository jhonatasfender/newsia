"use client";

import { useState, useEffect } from "react";

type CategoryRow = {
  id: string;
  slug: string;
  title: string;
  created_at: string;
};

type Props = {
  onEdit: (category: CategoryRow) => void;
  onDelete: (category: CategoryRow) => void;
};

export default function CategoriesTable({ onEdit, onDelete }: Props) {
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch("/api/categories");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao carregar categorias");
      }

      setCategories(data.categories);
    } catch (err) {
      console.error("Erro ao buscar categorias:", err);
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleRefresh = () => {
    fetchCategories();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-black/60">Carregando categorias...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-black text-white rounded-md hover:bg-black/80 transition-colors cursor-pointer"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-black/10 rounded-lg bg-white">
      <table className="min-w-full text-sm">
        <thead className="bg-black/5">
          <tr>
            <th className="text-left p-3">Título</th>
            <th className="text-left p-3">Slug</th>
            <th className="text-left p-3 hidden md:table-cell">Criado em</th>
            <th className="text-center p-3">Ações</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id} className="border-t border-black/10">
              <td className="p-3 font-medium">{category.title}</td>
              <td className="p-3 text-black/70 font-mono text-xs">
                {category.slug}
              </td>
              <td className="p-3 hidden md:table-cell text-black/70">
                {new Date(category.created_at).toLocaleString("pt-BR")}
              </td>
              <td className="p-3 text-center">
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => onEdit(category)}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-black text-white cursor-pointer hover:bg-gray-800"
                    title="Editar categoria"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDelete(category)}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-red-500 text-white cursor-pointer hover:bg-red-600"
                    title="Excluir categoria"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {categories.length === 0 && (
            <tr>
              <td className="p-6 text-center text-black/60" colSpan={4}>
                Nenhuma categoria encontrada.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
