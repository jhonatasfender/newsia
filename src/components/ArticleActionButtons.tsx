"use client";

import { useState } from "react";
import Link from "next/link";
import ConfirmationModal from "./ConfirmationModal";
import LoadingSpinner from "./LoadingSpinner";

type Props = {
  articleId: string;
  articleTitle: string;
  isPublished: boolean;
};

export default function ArticleActionButtons({
  articleId,
  articleTitle,
  isPublished,
}: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [action, setAction] = useState<"publish" | "unpublish" | "delete">(
    "publish",
  );
  const [isPublishing, setIsPublishing] = useState(false);
  const [isUnpublishing, setIsUnpublishing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleAction = (actionType: "publish" | "unpublish" | "delete") => {
    setAction(actionType);
    setModalOpen(true);
  };

  const handleConfirm = () => {
    if (action === "publish") {
      setIsPublishing(true);
    } else if (action === "unpublish") {
      setIsUnpublishing(true);
    } else if (action === "delete") {
      setIsDeleting(true);
    }

    setModalOpen(false);

    const form = document.createElement("form");
    form.method = "POST";
    form.action =
      action === "delete" ? "/api/articles/delete" : "/api/articles/publish";

    const articleIdInput = document.createElement("input");
    articleIdInput.type = "hidden";
    articleIdInput.name = "article_id";
    articleIdInput.value = articleId;
    form.appendChild(articleIdInput);

    if (action !== "delete") {
      const actionInput = document.createElement("input");
      actionInput.type = "hidden";
      actionInput.name = "action";
      actionInput.value = action;
      form.appendChild(actionInput);
    }

    document.body.appendChild(form);
    form.submit();
  };

  return (
    <>
      <div className="flex gap-2 justify-end">
        {isPublished ? (
          <button
            onClick={() => handleAction("unpublish")}
            className="inline-flex items-center px-3 h-8 rounded-md bg-orange-500 text-white text-xs cursor-pointer hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Despublicar notícia"
            data-cy="unpublish-button"
            disabled={isUnpublishing || isDeleting}
          >
            {isUnpublishing ? (
              <LoadingSpinner size="sm" />
            ) : (
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                />
              </svg>
            )}
            {isUnpublishing ? "Processando..." : "Despublicar"}
          </button>
        ) : (
          <button
            onClick={() => handleAction("publish")}
            className="inline-flex items-center px-3 h-8 rounded-md bg-green-500 text-white text-xs cursor-pointer hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Publicar notícia"
            data-cy="publish-button"
            disabled={isPublishing || isDeleting}
          >
            {isPublishing ? (
              <LoadingSpinner size="sm" />
            ) : (
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            )}
            {isPublishing ? "Processando..." : "Publicar"}
          </button>
        )}

        <Link
          href={`/admin/noticias/${articleId}/editar`}
          className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-black text-white cursor-pointer hover:bg-gray-800"
          title="Editar notícia"
          data-cy="edit-button"
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
        </Link>

        <button
          onClick={() => handleAction("delete")}
          className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-red-500 text-white cursor-pointer hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Excluir notícia"
          data-cy="delete-button"
          disabled={isDeleting || isPublishing || isUnpublishing}
        >
          {isDeleting ? (
            <LoadingSpinner size="sm" />
          ) : (
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
          )}
        </button>
      </div>

      <ConfirmationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirm}
        action={action}
        articleTitle={articleTitle}
      />
    </>
  );
}
