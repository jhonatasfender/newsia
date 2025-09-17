"use client";

import { useState, useEffect } from "react";
import BannerForm from "./BannerForm";

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
  isOpen: boolean;
  onClose: () => void;
};

export default function BannerModal({ isOpen, onClose }: Props) {
  const [banner, setBanner] = useState<Banner | null>(null);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"list" | "edit">("list");

  const fetchBanners = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch("/api/banner/all");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao carregar banners");
      }

      setBanners(data.banners);
      const activeBanner = data.banners.find((b: Banner) => b.is_active);
      setBanner(activeBanner || null);
    } catch (err) {
      console.error("Erro ao buscar banners:", err);
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchBanners();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = async (data: { title: string; subtitle: string; image_url: string; is_active: boolean }) => {
    try {
      setLoading(true);
      setError(null);

      const url = banner 
        ? `/api/banner/${banner.id}`
        : "/api/banner";
      
      const method = banner ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Erro ao salvar banner");
      }

      await fetchBanners();

      setMode("list");
      setBanner(null);

      if (!banner) {
        onClose();
        window.location.href = "/";
      }
    } catch (err) {
      console.error("Erro ao salvar banner:", err);
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setMode("list");
    onClose();
  };

  const handleEdit = (bannerToEdit: Banner) => {
    setBanner(bannerToEdit);
    setMode("edit");
  };

  const handleToggleActive = async (bannerId: string, currentStatus: boolean) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/banner/${bannerId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: banners.find(b => b.id === bannerId)?.title || "",
          subtitle: banners.find(b => b.id === bannerId)?.subtitle || "",
          image_url: banners.find(b => b.id === bannerId)?.image_url || "",
          is_active: !currentStatus
        }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Erro ao alterar status do banner");
      }

      await fetchBanners(); // Recarregar lista
    } catch (err) {
      console.error("Erro ao alterar status:", err);
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !banner) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
          <div className="text-center">
            <div className="text-black/60">Carregando banner...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            {mode === "edit" ? "Editar Banner" : "Gerenciar Banners"}
          </h3>
          <div className="flex items-center gap-2">
            {mode === "edit" && (
              <button
                onClick={() => setMode("list")}
                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors cursor-pointer"
                title="Voltar para lista"
              >
                <i className="fas fa-arrow-left text-lg"></i>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors cursor-pointer"
            >
              <i className="fas fa-times text-lg"></i>
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {mode === "list" ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  Gerencie os banners do site. Apenas um pode estar ativo por vez.
                </p>
                <button
                  onClick={() => {
                    setBanner(null);
                    setMode("edit");
                  }}
                  className="px-4 py-2 bg-black text-white rounded-md hover:bg-black/80 transition-colors cursor-pointer"
                >
                  <i className="fas fa-plus mr-2"></i>
                  Novo Banner
                </button>
              </div>

              <div className="space-y-3">
                {banners.map((b) => (
                  <div key={b.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        {b.image_url && (
                          <div className="mb-3">
                            <img
                              src={b.image_url}
                              alt={b.title}
                              className="w-full h-24 object-cover rounded-md"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                        <div className="text-lg font-bold text-[color:var(--color-primary)]">
                          {b.title}
                        </div>
                        {b.subtitle && (
                          <div className="text-sm text-gray-600 mt-1">
                            {b.subtitle}
                          </div>
                        )}
                        <div className="text-xs text-gray-500 mt-2">
                          Status: {b.is_active ? (
                            <span className="text-green-600 font-medium">Ativo</span>
                          ) : (
                            <span className="text-gray-500">Inativo</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => handleEdit(b)}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-black text-white cursor-pointer hover:bg-gray-800"
                          title="Editar banner"
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
                          onClick={() => handleToggleActive(b.id, b.is_active)}
                          className={`inline-flex items-center justify-center w-8 h-8 rounded-md text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                            b.is_active 
                              ? "bg-orange-500 hover:bg-orange-600" 
                              : "bg-green-500 hover:bg-green-600"
                          }`}
                          title={b.is_active ? "Desativar banner" : "Ativar banner"}
                          disabled={loading}
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            {b.is_active ? (
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            ) : (
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            )}
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {banners.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    Nenhum banner encontrado.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <p className="text-sm text-gray-600">
                  Edite o banner que aparece no topo do site
                </p>
              </div>

              {banner && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Preview do Banner:</h4>
                  {banner.image_url && (
                    <div className="mb-3">
                      <img
                        src={banner.image_url}
                        alt="Preview do banner"
                        className="w-full h-32 object-cover rounded-md"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  <div className="text-lg font-bold text-[color:var(--color-primary)]">
                    {banner.title}
                  </div>
                  {banner.subtitle && (
                    <div className="text-sm text-gray-600 mt-1">
                      {banner.subtitle}
                    </div>
                  )}
                  <div className="text-xs text-gray-500 mt-2">
                    Status: {banner.is_active ? "Ativo" : "Inativo"}
                  </div>
                </div>
              )}

              <BannerForm
                banner={banner}
                onSave={handleSave}
                onCancel={handleCancel}
                loading={loading}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
