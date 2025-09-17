"use client";

import { useState } from "react";
import CategoriesModal from "./CategoriesModal";
import BannerModal from "./BannerModal";

export default function AdminClient() {
  const [isCategoriesModalOpen, setIsCategoriesModalOpen] = useState(false);
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);

  return (
    <>
      <div className="flex gap-3">
        <button
          onClick={() => setIsBannerModalOpen(true)}
          className="h-10 px-4 rounded-md bg-gray-100 text-black hover:bg-gray-200 inline-flex items-center transition-colors cursor-pointer"
        >
          <i className="fas fa-edit mr-2"></i>
          Banner
        </button>
        <button
          onClick={() => setIsCategoriesModalOpen(true)}
          className="h-10 px-4 rounded-md bg-gray-100 text-black hover:bg-gray-200 inline-flex items-center transition-colors cursor-pointer"
        >
          <i className="fas fa-tags mr-2"></i>
          Categorias
        </button>
      </div>

      <BannerModal
        isOpen={isBannerModalOpen}
        onClose={() => setIsBannerModalOpen(false)}
      />
      <CategoriesModal
        isOpen={isCategoriesModalOpen}
        onClose={() => setIsCategoriesModalOpen(false)}
      />
    </>
  );
}
