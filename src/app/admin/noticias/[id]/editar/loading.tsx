import LoadingSpinner from "@/components/LoadingSpinner";

export default function Loading() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
        <h1 className="text-2xl font-extrabold mb-4">Editar Notícia</h1>
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" text="Carregando dados da notícia..." />
        </div>
      </div>
    </main>
  );
}
