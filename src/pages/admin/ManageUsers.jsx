import { useEffect, useState } from 'react';
import { getAllUsers, toggleUserApproval, deleteUser } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';
import {
  FaUserGraduate, FaChalkboardTeacher, FaSearch,
  FaToggleOn, FaToggleOff, FaTrash, FaFilter
} from 'react-icons/fa';

const ROLES = ['', 'student', 'teacher', 'admin'];

const roleStyle = {
  student: 'bg-blue-50 text-blue-600',
  teacher: 'bg-green-50 text-green-600',
  admin: 'bg-purple-50 text-purple-600',
};

const roleIcon = {
  student: <FaUserGraduate />,
  teacher: <FaChalkboardTeacher />,
};

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('');
  const [search, setSearch] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [actioning, setActioning] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await getAllUsers(roleFilter);
      setUsers(data);
    } catch (err) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const handleToggle = async (id) => {
    setActioning(id + '_toggle');
    try {
      const { data } = await toggleUserApproval(id);
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, isApproved: data.isApproved } : u))
      );
      toast.success(data.isApproved ? 'User approved' : 'User blocked');
    } catch {
      toast.error('Action failed');
    } finally {
      setActioning(null);
    }
  };

  const handleDelete = async (id) => {
    setActioning(id + '_del');
    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      toast.success('User deleted');
    } catch {
      toast.error('Delete failed');
    } finally {
      setActioning(null);
      setConfirmDelete(null);
    }
  };

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Manage Users</h2>
        <p className="text-sm text-gray-500 mt-1">{users.length} user{users.length !== 1 ? 's' : ''} total</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            placeholder="Search by name or email..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <FaFilter className="text-gray-400 text-sm" />
          <select
            className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">All Roles</option>
            <option value="student">Students</option>
            <option value="teacher">Teachers</option>
            <option value="admin">Admins</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <LoadingSpinner />
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg font-semibold">No users found</p>
          <p className="text-sm mt-1">Try adjusting your search or filter.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">User</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">Role</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600 hidden sm:table-cell">Subject</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">Status</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                    {/* User */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm shrink-0">
                          {u.name[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{u.name}</p>
                          <p className="text-xs text-gray-400">{u.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${roleStyle[u.role] || 'bg-gray-100 text-gray-600'}`}>
                        {roleIcon[u.role]}
                        {u.role}
                      </span>
                    </td>

                    {/* Subject */}
                    <td className="px-5 py-4 hidden sm:table-cell text-gray-500">
                      {u.subject || '—'}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${u.isApproved ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${u.isApproved ? 'bg-green-500' : 'bg-red-400'}`} />
                        {u.isApproved ? 'Active' : 'Blocked'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggle(u._id)}
                          disabled={actioning === u._id + '_toggle' || u.role === 'admin'}
                          title={u.isApproved ? 'Block user' : 'Approve user'}
                          className={`p-1.5 rounded-lg transition text-lg disabled:opacity-40 ${
                            u.isApproved
                              ? 'text-green-500 hover:bg-green-50'
                              : 'text-gray-400 hover:bg-gray-100'
                          }`}
                        >
                          {u.isApproved ? <FaToggleOn /> : <FaToggleOff />}
                        </button>
                        <button
                          onClick={() => setConfirmDelete(u)}
                          disabled={u.role === 'admin'}
                          title="Delete user"
                          className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition disabled:opacity-40"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm text-center">
            <div className="text-4xl mb-3">🗑️</div>
            <h3 className="text-lg font-bold mb-1">Delete User?</h3>
            <p className="text-gray-500 text-sm mb-1">
              <span className="font-semibold text-gray-700">{confirmDelete.name}</span>
            </p>
            <p className="text-gray-400 text-xs mb-5">
              All their feedback data will also be permanently removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(confirmDelete._id)}
                disabled={actioning === confirmDelete._id + '_del'}
                className="flex-1 py-2.5 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 disabled:opacity-50 transition"
              >
                {actioning === confirmDelete._id + '_del' ? 'Deleting...' : 'Delete'}
              </button>
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2.5 border rounded-xl font-semibold hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;