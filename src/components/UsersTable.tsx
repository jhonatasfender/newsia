'use client';

import { useState } from 'react';
import { useUsers, UserWithProfile } from '@/hooks/useUsers';
import GenericModal from './GenericModal';
import LoadingSpinner from './LoadingSpinner';

type Row = {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin' | 'super_admin';
  lastSignIn: string | null;
  createdAt: string;
};

export default function UsersTable() {
  const { users, loading, error, updateUserRole } = useUsers();
  const [selectedUser, setSelectedUser] = useState<UserWithProfile | null>(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [newRole, setNewRole] = useState<'user' | 'admin' | 'super_admin'>('user');
  const [isUpdating, setIsUpdating] = useState(false);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Nunca';
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'super_admin':
        return {
          label: 'Super Admin',
          class: 'bg-red-100 text-red-800'
        };
      case 'admin':
        return {
          label: 'Admin',
          class: 'bg-blue-100 text-blue-800'
        };
      default:
        return {
          label: 'Usuário',
          class: 'bg-gray-100 text-gray-800'
        };
    }
  };

  const handleRoleChange = (user: UserWithProfile) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setShowRoleModal(true);
  };


  const confirmRoleChange = async () => {
    if (selectedUser) {
      setIsUpdating(true);
      await updateUserRole(selectedUser.id, newRole);
      setShowRoleModal(false);
      setSelectedUser(null);
      setIsUpdating(false);
    }
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-800">Erro: {error}</p>
      </div>
    );
  }

  const rows: Row[] = users.map((user) => ({
    id: user.id,
    email: user.email || '',
    name: user.first_name && user.last_name 
      ? `${user.first_name} ${user.last_name}`
      : 'Usuário sem nome',
    role: user.role,
    lastSignIn: user.last_sign_in_at,
    createdAt: user.created_at,
  }));

  return (
    <>
      <div className="overflow-x-auto border border-black/10 rounded-lg bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-black/5">
              <tr>
                <th className="text-left p-3 hidden sm:table-cell">Email</th>
                <th className="text-left p-3 hidden md:table-cell">Role</th>
                <th className="text-left p-3 hidden md:table-cell">Criado em</th>
                <th className="text-center p-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const roleBadge = getRoleBadge(r.role);
                return (
                  <tr key={r.id} className="border-t border-black/10">
                    <td className="p-3 hidden sm:table-cell text-black/70">
                      {r.email}
                    </td>
                    <td className="p-3 hidden md:table-cell">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${roleBadge.class}`}>
                        {roleBadge.label}
                      </span>
                    </td>
                    <td className="p-3 hidden md:table-cell text-black/70">
                      {formatDate(r.createdAt)}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleRoleChange(users.find(u => u.id === r.id)!)}
                        className="inline-flex items-center px-3 h-8 rounded-md bg-blue-500 text-white text-xs cursor-pointer hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Alterar role"
                        disabled={isUpdating}
                      >
                        {isUpdating ? <LoadingSpinner size="sm" /> : 'Alterar Role'}
                      </button>
                    </td>
                  </tr>
                );
              })}
              {rows.length === 0 && (
                <tr>
                  <td className="p-6 text-center text-black/60" colSpan={6}>
                    Nenhum usuário encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
      </div>

      <GenericModal
        isOpen={showRoleModal}
        onClose={() => setShowRoleModal(false)}
        onConfirm={confirmRoleChange}
        title="Alterar Role do Usuário"
        message={`Alterar role de ${selectedUser?.first_name || selectedUser?.email} para:`}
      >
        <div className="mt-4">
          <select
            value={newRole}
            onChange={(e) => setNewRole(e.target.value as 'user' | 'admin' | 'super_admin')}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="user">Usuário</option>
            <option value="admin">Admin</option>
            <option value="super_admin">Super Admin</option>
          </select>
        </div>
      </GenericModal>

    </>
  );
}
