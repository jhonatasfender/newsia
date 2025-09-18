import { requireSuperAdmin } from '@/lib/middleware/auth';
import UsersTable from '@/components/UsersTable';

export default async function UsersPage() {
  await requireSuperAdmin();

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gerenciamento de Usuários</h1>
            <p className="mt-1 text-sm text-gray-500">
              Gerencie usuários e suas permissões no sistema.
            </p>
          </div>
          
          <UsersTable />
        </div>
      </div>
    </main>
  );
}
