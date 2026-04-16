import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAdminStats } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminStats().then(r => { setStats(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const cards = [
    { label: 'Total Students', value: stats.totalStudents, color: 'text-blue-600' },
    { label: 'Total Teachers', value: stats.totalTeachers, color: 'text-green-600' },
    { label: 'Total Feedback', value: stats.totalFeedback, color: 'text-purple-600' },
    { label: 'Active Users', value: stats.activeUsers, color: 'text-orange-600' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-indigo-600">FeedbackPro — Admin</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">{user?.name}</span>
          <button onClick={logout} className="text-red-500 hover:text-red-700 font-medium">Logout</button>
        </div>
      </nav>
      <div className="max-w-5xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
        {loading ? <LoadingSpinner /> : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {cards.map(c => (
              <div key={c.label} className="bg-white rounded-2xl shadow p-5 text-center">
                <p className="text-gray-500 text-xs">{c.label}</p>
                <p className={`text-4xl font-bold mt-2 ${c.color}`}>{c.value ?? 0}</p>
              </div>
            ))}
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link to="/admin/users" className="bg-indigo-600 text-white rounded-2xl p-6 text-center font-semibold hover:bg-indigo-700 transition">
            Manage Users
          </Link>
          <Link to="/admin/feedbacks" className="bg-white border-2 border-indigo-200 text-indigo-600 rounded-2xl p-6 text-center font-semibold hover:bg-indigo-50 transition">
            Manage Feedback
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;