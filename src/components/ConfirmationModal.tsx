"use client";

type ActionType = "publish" | "unpublish" | "delete";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  action: ActionType;
  articleTitle: string;
};

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  action,
  articleTitle,
}: Props) {
  if (!isOpen) return null;

  const getActionConfig = () => {
    switch (action) {
      case "publish":
        return {
          title: "Publicar Notícia",
          message: `Tem certeza que deseja publicar "${articleTitle}"?`,
          confirmText: "Publicar",
          confirmColor: "bg-green-500 hover:bg-green-600",
        };
      case "unpublish":
        return {
          title: "Despublicar Notícia",
          message: `Tem certeza que deseja despublicar "${articleTitle}"?`,
          confirmText: "Despublicar",
          confirmColor: "bg-orange-500 hover:bg-orange-600",
        };
      case "delete":
        return {
          title: "Excluir Notícia",
          message: `Tem certeza que deseja excluir "${articleTitle}"? Esta ação não pode ser desfeita.`,
          confirmText: "Excluir",
          confirmColor: "bg-red-500 hover:bg-red-600",
        };
      default:
        return {
          title: "Confirmar Ação",
          message: "Tem certeza que deseja continuar?",
          confirmText: "Confirmar",
          confirmColor: "bg-blue-500 hover:bg-blue-600",
        };
    }
  };

  const config = getActionConfig();

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" data-cy="confirmation-modal">
      <div className="bg-white rounded-xl shadow-xl max-w-sm w-full transform transition-all">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">
            {config.title}
          </h3>
        </div>
        
        <div className="px-6 py-4">
          <p className="text-gray-600 leading-relaxed">
            {config.message}
          </p>
        </div>
        
        <div className="px-6 py-4 bg-gray-50 rounded-b-xl flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            className={`px-4 py-2 text-sm font-medium text-white ${config.confirmColor} rounded-lg cursor-pointer transition-colors`}
          >
            {config.confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
