"use client";

import { useState } from "react";
import CategoriesTable from "./CategoriesTable";
import CategoryForm from "./CategoryForm";
import ConfirmationModal from "./ConfirmationModal";

type Category = {
  id: string;
  slug: string;
  title: string;
  created_at: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function CategoriesModal({ isOpen, onClose }: Props) {
  const [mode, setMode] = useState<"list" | "create" | "edit">("list");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    category: Category | null;
  }>({ isOpen: false, category: null });

  if (!isOpen) return null;

  const handleCreate = () => {
    setMode("create");
    setSelectedCategory(null);
    setError(null);
  };

  const handleEdit = (category: Category) => {
    setMode("edit");
    setSelectedCategory(category);
    setError(null);
  };

  const handleDelete = (category: Category) => {
    setDeleteModal({ isOpen: true, category });
  };

  const handleBackToList = () => {
    setMode("list");
    setSelectedCategory(null);
    setError(null);
  };

  const handleSave = async (data: { title: string; slug: string }) => {
    try {
      setLoading(true);
      setError(null);

      const url = selectedCategory 
        ? `/api/categories/${selectedCategory.id}`
        : "/api/categories";
      
      const method = selectedCategory ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Erro ao salvar categoria");
      }

      handleBackToList();
    } catch (err) {
      console.error("Erro ao salvar categoria:", err);
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.category) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/categories/${deleteModal.category.id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Erro ao excluir categoria");
      }

      setDeleteModal({ isOpen: false, category: null });
      handleBackToList();
    } catch (err) {
      console.error("Erro ao excluir categoria:", err);
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    switch (mode) {
      case "create":
        return "Nova Categoria";
      case "edit":
        return "Editar Categoria";
      default:
        return "Gerenciar Categorias";
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              {getTitle()}
            </h3>
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors cursor-pointer"
            >
              <i className="fas fa-times text-lg"></i>
            </button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {mode === "list" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">
                    Gerencie as categorias do site
                  </p>
                  <button
                    onClick={handleCreate}
                    className="px-4 py-2 bg-black text-white rounded-md hover:bg-black/80 transition-colors cursor-pointer"
                  >
                    <i className="fas fa-plus mr-2"></i>
                    Nova Categoria
                  </button>
                </div>
                <CategoriesTable
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </div>
            )}

            {(mode === "create" || mode === "edit") && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleBackToList}
                    className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors cursor-pointer"
                  >
                    <i className="fas fa-arrow-left"></i>
                  </button>
                  <p className="text-sm text-gray-600">
                    {mode === "create" 
                      ? "Preencha os dados da nova categoria"
                      : "Edite os dados da categoria"
                    }
                  </p>
                </div>
                <CategoryForm
                  category={selectedCategory}
                  onSave={handleSave}
                  onCancel={handleBackToList}
                  loading={loading}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, category: null })}
        onConfirm={handleConfirmDelete}
        action="delete-category"
        articleTitle={deleteModal.category?.title || ""}
      />
    </>
  );
}
