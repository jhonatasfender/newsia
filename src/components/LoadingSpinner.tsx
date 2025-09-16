"use client";

import type { ReactElement } from "react";

type Props = {
  size?: "sm" | "md" | "lg";
  text?: string;
};

export default function LoadingSpinner({
  size = "md",
  text,
}: Props): ReactElement {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-gray-300 border-t-black`}
        role="status"
        aria-label="Carregando"
      />
      {text && <span className="text-sm text-gray-600">{text}</span>}
    </div>
  );
}
