"use client";

import { useState, useEffect } from "react";
import { generateSlugFromTitle } from "@/lib/utils";

type Category = {
  id: string;
  slug: string;
  title: string;
  created_at: string;
};

type Props = {
  category?: Category | null;
  onSave: (category: { title: string; slug: string }) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
};

export default function CategoryForm({ category, onSave, onCancel, loading = false }: Props) {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [errors, setErrors] = useState<{ title?: string; slug?: string }>({});

  useEffect(() => {
    if (category) {
      setTitle(category.title);
      setSlug(category.slug);
    } else {
      setTitle("");
      setSlug("");
    }
    setErrors({});
  }, [category]);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!category) {
      setSlug(generateSlugFromTitle(value));
    }
  };

  const handleSlugChange = (value: string) => {
    const formattedSlug = generateSlugFromTitle(value);
    setSlug(formattedSlug);
  };

  const validateForm = () => {
    const newErrors: { title?: string; slug?: string } = {};

    if (!title.trim()) {
      newErrors.title = "Título é obrigatório";
    }

    if (!slug.trim()) {
      newErrors.slug = "Slug é obrigatório";
    } else if (!/^[a-z0-9-]+$/.test(slug)) {
      newErrors.slug = "Slug deve conter apenas letras minúsculas, números e hífens";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSave({ title: title.trim(), slug: slug.trim() });
    } catch (error) {
      console.error("Erro ao salvar categoria:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Título *
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black/20 ${
            errors.title ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Ex: Tecnologia"
          disabled={loading}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title}</p>
        )}
      </div>

      <div>
        <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
          Slug *
        </label>
        <input
          type="text"
          id="slug"
          value={slug}
          onChange={(e) => handleSlugChange(e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black/20 font-mono text-sm ${
            errors.slug ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Ex: tecnologia"
          disabled={loading}
        />
        {errors.slug && (
          <p className="mt-1 text-sm text-red-600">{errors.slug}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          URL amigável para a categoria (gerado automaticamente)
        </p>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-md transition-colors cursor-pointer"
          disabled={loading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-2 text-sm font-medium text-white bg-black hover:bg-black/80 rounded-md transition-colors disabled:opacity-50 cursor-pointer"
          disabled={loading}
        >
          {loading ? "Salvando..." : category ? "Atualizar" : "Criar"}
        </button>
      </div>
    </form>
  );
}
