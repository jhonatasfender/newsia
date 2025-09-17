"use client";

import { useState } from "react";
import EditorJsField from "@/components/EditorJsField";
import ImageUpload from "@/components/ImageUpload";
import LoadingSpinner from "@/components/LoadingSpinner";

type Category = {
  id: string;
  title: string;
  slug: string;
};

type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string | null;
  image_url: string | null;
  minutes: number | null;
  category_id: string | null;
  author: string | null;
};

type Props = {
  article: Article;
  categories: Category[];
  initialBlocks: any;
};

export default function EditArticleForm({ article, categories, initialBlocks }: Props) {
  const [imageUrl, setImageUrl] = useState(article.image_url || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    setIsSubmitting(true);
  };

  return (
    <form
      action={`/api/articles/${article.id}/update`}
      method="POST"
      className="grid gap-3"
      onSubmit={handleSubmit}
    >
      <input type="hidden" name="id" value={article.id} />
      
      <div>
        <label className="text-sm font-medium">
          Imagem do banner
        </label>
        <ImageUpload
          value={imageUrl}
          onChange={setImageUrl}
          placeholder="Selecione uma imagem para o banner..."
        />
        <input
          type="hidden"
          name="image_url"
          value={imageUrl}
        />
      </div>
      
      <div>
        <label className="text-sm font-medium" htmlFor="title">
          Título
        </label>
        <input
          id="title"
          name="title"
          defaultValue={article.title}
          required
          className="mt-1 w-full h-10 px-3 rounded-md border border-black/15"
        />
      </div>
      
      <div>
        <label className="text-sm font-medium" htmlFor="slug">
          Slug
        </label>
        <input
          id="slug"
          name="slug"
          defaultValue={article.slug}
          required
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
          defaultValue={article.excerpt ?? ""}
          placeholder="Breve descrição da notícia..."
          rows={3}
          className="mt-1 w-full px-3 py-2 rounded-md border border-black/15 resize-none"
        />
      </div>
      
      <div>
        <label className="text-sm font-medium" htmlFor="author">
          Autor/Redator
        </label>
        <input
          id="author"
          name="author"
          defaultValue={article.author ?? ""}
          required
          placeholder="Nome do autor da notícia"
          className="mt-1 w-full h-10 px-3 rounded-md border border-black/15"
        />
      </div>
      
      <div>
        <label className="text-sm font-medium" htmlFor="category_id">
          Categoria
        </label>
        <select
          id="category_id"
          name="category_id"
          required
          defaultValue={article.category_id ?? ""}
          className="mt-1 w-full h-10 px-3 rounded-md border border-black/15"
        >
          {categories?.map((category) => (
            <option key={category.id} value={category.id}>
              {category.title}
            </option>
          ))}
        </select>
      </div>
      
      <div>
        <label className="text-sm font-medium">Conteúdo</label>
        <EditorJsField initialData={initialBlocks} hiddenInputId="body" />
      </div>
      
      <div>
        <label className="text-sm font-medium" htmlFor="minutes">
          Minutos
        </label>
        <input
          id="minutes"
          name="minutes"
          type="number"
          defaultValue={article.minutes ?? ""}
          placeholder="5"
          className="mt-1 w-full h-10 px-3 rounded-md border border-black/15"
        />
      </div>
      
      <div className="mt-2 flex gap-3">
        <button
          className="h-10 px-4 rounded-md bg-black text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <LoadingSpinner size="sm" />
              Salvando...
            </>
          ) : (
            "Salvar Alterações"
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
