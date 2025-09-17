"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { supabaseBrowser } from "@/lib/supabase/client";
import LoadingSpinner from "./LoadingSpinner";

type Props = {
  value?: string;
  onChange: (url: string) => void;
  placeholder?: string;
  className?: string;
};

export default function ImageUpload({ 
  value, 
  onChange, 
  placeholder = "Selecione uma imagem...", 
  className = "",
}: Props) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione apenas arquivos de imagem.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('A imagem deve ter no máximo 5MB.');
      return;
    }

    setIsUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { error } = await supabaseBrowser()
        .storage
        .from('images')
        .upload(fileName, file);

      if (error) {
        console.error('Erro no upload:', error);
        alert('Erro ao fazer upload da imagem. Tente novamente.');
        return;
      }

      const { data: { publicUrl } } = supabaseBrowser()
        .storage
        .from('images')
        .getPublicUrl(fileName);

      setPreview(publicUrl);
      onChange(publicUrl);
    } catch (error) {
      console.error('Erro inesperado:', error);
      alert('Erro inesperado. Tente novamente.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center gap-3">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          id="image-upload"
          disabled={isUploading}
        />
        <label
          htmlFor="image-upload"
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-md border border-black/15 cursor-pointer hover:bg-gray-50 transition-colors ${
            isUploading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isUploading ? (
            <>
              <LoadingSpinner size="sm" />
              Enviando...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              {preview ? 'Alterar Imagem' : 'Selecionar Imagem'}
            </>
          )}
        </label>
        
        {preview && (
          <button
            type="button"
            onClick={handleRemoveImage}
            className="px-3 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
            disabled={isUploading}
          >
            Remover
          </button>
        )}
      </div>

      {preview && (
        <div className="relative w-full max-w-xl aspect-[16/9] rounded-md overflow-hidden border border-black/10">
          <Image
            src={preview}
            alt="Prévia da imagem"
            fill
            className="object-cover"
            onError={() => {
              console.error('Erro ao carregar imagem');
              setPreview(null);
            }}
          />
        </div>
      )}

      {!preview && (
        <div className="w-full h-32 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center text-gray-500">
          <div className="text-center">
            <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="mt-2 text-sm">{placeholder}</p>
          </div>
        </div>
      )}
    </div>
  );
}
