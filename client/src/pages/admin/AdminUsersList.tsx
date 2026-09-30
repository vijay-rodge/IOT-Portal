import React, { useState, useEffect } from 'react';
import { userService } from '../../services/userService';
import { User, UserRole, Pagination } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { Users, Search, Shield, Trash2, AlertTriangle, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';

export const AdminUsersList: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ total: 0, page: 1, limit: 15, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [msg, setMsg] = useState('');

  const fetchUsers = async (page = 1) => {
    setIsLoading(true);
    try {
      const res = await userService.getAllUsers(page, 15, search);
      setUsers(res.users);
      setPagination(res.pagination);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(1);
  }, [search]);

  const handleRoleChange = async (userId: string, currentRole: UserRole) => {
    const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';
    try {
      await userService.updateUserRole(userId, newRole);
      setMsg(`User role updated to ${newRole}`);
      setTimeout(() => setMsg(''), 3000);
      fetchUsers(pagination.page);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update role');
    }
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      await userService.deleteUser(userToDelete.id);
      setUserToDelete(null);
      fetchUsers(pagination.page);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete user');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            User Accounts & Permissions
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage registered student accounts, assign administrative roles, and remove inactive accounts.
          </p>
        </div>
      </div>

      {msg && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>{msg}</span>
        </div>
      )}

      {/* Search Input */}
      <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by user name or email..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <th className="py-3.5 px-4">User</th>
              <th className="py-3.5 px-4">Email</th>
              <th className="py-3.5 px-4">Auth Provider</th>
              <th className="py-3.5 px-4">Role</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="py-10 text-center text-slate-400">
                  Loading users...
                </td>
              </tr>
            ) : users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-brand-500 text-white flex items-center justify-center font-bold text-xs">
                    {u.name.charAt(0).toUpperCase()}
                  </div>
                  <span>{u.name}</span>
                </td>
                <td className="py-3.5 px-4 font-mono text-slate-500">{u.email}</td>
                <td className="py-3.5 px-4">
                  <span className="capitalize px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-600 dark:text-slate-300">
                    {u.authProvider}
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <button
                    disabled={u.id === currentUser?.id}
                    onClick={() => handleRoleChange(u.id, u.role)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors ${
                      u.role === 'ADMIN'
                        ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400 border-purple-200 dark:border-purple-800'
                        : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    } ${u.id === currentUser?.id ? 'cursor-not-allowed opacity-80' : 'hover:scale-105'}`}
                  >
                    {u.role}
                  </button>
                </td>
                <td className="py-3.5 px-4 text-right">
                  {u.id !== currentUser?.id && (
                    <button
                      onClick={() => setUserToDelete(u)}
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/50 text-rose-600 dark:text-rose-400"
                      title="Delete User"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete User Modal */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Delete User Account?</h3>
              <p className="text-xs text-slate-500">
                Are you sure you want to delete <span className="font-semibold">{userToDelete.email}</span>?
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteUser}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md"
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
