"use client";

import { useState, useEffect } from "react";
import ImageUpload from "./ImageUpload";

type Banner = {
  id: string;
  title: string;
  subtitle: string | null;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

type Props = {
  banner?: Banner | null;
  onSave: (banner: { title: string; subtitle: string; image_url: string; is_active: boolean }) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
};

export default function BannerForm({ banner, onSave, onCancel, loading = false }: Props) {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [errors, setErrors] = useState<{ title?: string }>({});

  useEffect(() => {
    if (banner) {
      setTitle(banner.title);
      setSubtitle(banner.subtitle || "");
      setImageUrl(banner.image_url || "");
      setIsActive(banner.is_active);
    } else {
      setTitle("");
      setSubtitle("");
      setImageUrl("");
      setIsActive(false);
    }
    setErrors({});
  }, [banner]);

  const validateForm = () => {
    const newErrors: { title?: string } = {};

    if (!title.trim()) {
      newErrors.title = "Título é obrigatório";
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
      await onSave({ 
        title: title.trim(), 
        subtitle: subtitle.trim() || "", 
        image_url: imageUrl.trim() || "",
        is_active: isActive 
      });
    } catch (error) {
      console.error("Erro ao salvar banner:", error);
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
          onChange={(e) => setTitle(e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black/20 ${
            errors.title ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Ex: Impacto IA"
          disabled={loading}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title}</p>
        )}
      </div>

      <div>
        <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700 mb-1">
          Subtítulo
        </label>
        <input
          type="text"
          id="subtitle"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black/20"
          placeholder="Ex: Inteligência Artificial e Sociedade"
          disabled={loading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Imagem do Banner
        </label>
        <ImageUpload
          value={imageUrl}
          onChange={setImageUrl}
          placeholder="Selecione uma imagem para o banner..."
        />
        <p className="mt-1 text-xs text-gray-500">
          Imagem que aparecerá no banner do site
        </p>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="is_active"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
          className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
          disabled={loading}
        />
        <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
          Banner ativo (aparece no site)
        </label>
      </div>
      <p className="text-xs text-gray-500 -mt-2">
        ⚠️ Apenas um banner pode estar ativo por vez. Ativar este banner desativará automaticamente os outros.
      </p>

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
          {loading ? "Salvando..." : "Salvar"}
        </button>
      </div>
    </form>
  );
}
