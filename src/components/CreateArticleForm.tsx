"use client";

import { useState } from "react";
import Image from "next/image";
import EditorJsField from "@/components/EditorJsField";
import LoadingSpinner from "@/components/LoadingSpinner";

type Category = {
  id: string;
  title: string;
  slug: string;
};

type Props = {
  categories: Category[];
};

export default function CreateArticleForm({ categories }: Props) {
  const [imageUrl, setImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    setIsSubmitting(true);
  };

  return (
    <form action="/api/articles/create" method="POST" className="grid gap-3" onSubmit={handleSubmit}>
      <div>
        <label className="text-sm font-medium" htmlFor="image_url">
          Imagem do banner (URL)
        </label>
        <input
          id="image_url"
          name="image_url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://..."
          className="mt-1 w-full h-10 px-3 rounded-md border border-black/15"
          data-cy="image-url-input"
        />
        {imageUrl && (() => {
          try {
            new URL(imageUrl);
            return (
              <div className="mt-2">
                <div className="relative w-full max-w-xl aspect-[16/9] rounded-md overflow-hidden border border-black/10">
                  <Image
                    src={imageUrl}
                    alt="Prévia do banner"
                    fill
                    className="object-cover"
                    onError={() => {
                      // Hide image on error
                    }}
                  />
                </div>
              </div>
            );
          } catch {
            return null;
          }
        })()}
      </div>
      <div>
        <label className="text-sm font-medium" htmlFor="title">
          Título
        </label>
        <input
          id="title"
          name="title"
          required
          className="mt-1 w-full h-10 px-3 rounded-md border border-black/15"
          data-cy="title-input"
        />
      </div>
      <div>
        <label className="text-sm font-medium" htmlFor="slug">
          Slug
        </label>
        <input
          id="slug"
          name="slug"
          required
          placeholder="url-amigavel-para-a-noticia"
          className="mt-1 w-full h-10 px-3 rounded-md border border-black/15"
        />
      </div>
      <div>
        <label className="text-sm font-medium" htmlFor="excerpt">
          Resumo
        </label>
        <textarea
          id="excerpt"
          name="excerpt"
          placeholder="Breve descrição da notícia..."
          rows={3}
          className="mt-1 w-full px-3 py-2 rounded-md border border-black/15 resize-none"
          data-cy="excerpt-input"
        />
      </div>
      <div>
        <label className="text-sm font-medium" htmlFor="category_id">
          Categoria
        </label>
        <select
          id="category_id"
          name="category_id"
          className="mt-1 w-full h-10 px-3 rounded-md border border-black/15"
          data-cy="category-select"
        >
          <option value="">Selecione uma categoria (opcional)</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.title}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-sm font-medium">Conteúdo</label>
        <EditorJsField hiddenInputId="body" />
      </div>
      <div>
        <label className="text-sm font-medium" htmlFor="minutes">
          Minutos de leitura
        </label>
        <input
          id="minutes"
          name="minutes"
          type="number"
          placeholder="5"
          className="mt-1 w-full h-10 px-3 rounded-md border border-black/15"
          data-cy="minutes-input"
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          id="publish_now"
          name="publish_now"
          type="checkbox"
          className="h-4 w-4 rounded border-black/15"
          data-cy="publish-now-checkbox"
        />
        <label className="text-sm font-medium" htmlFor="publish_now">
          Publicar imediatamente
        </label>
      </div>
      <div className="mt-2 flex gap-3">
        <button
          className="h-10 px-4 rounded-md bg-black text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          type="submit"
          data-cy="submit-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <LoadingSpinner size="sm" />
              Criando...
            </>
          ) : (
            "Criar Notícia"
          )}
        </button>
        <a
          className="h-10 px-4 rounded-md border border-black/15 inline-flex items-center cursor-pointer"
          href="/admin"
        >
          Cancelar
        </a>
      </div>
    </form>
  );
}
