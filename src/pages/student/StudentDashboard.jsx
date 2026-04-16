import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getMyFeedbacks, getTeachers } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({ myFeedbacks: 0, teachers: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [fb, tc] = await Promise.all([getMyFeedbacks(), getTeachers()]);
        setStats({ myFeedbacks: fb.data.total, teachers: tc.data.length });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-indigo-600">FeedbackPro — Student</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">Welcome, {user?.name}</span>
          <button onClick={logout} className="text-red-500 hover:text-red-700 font-medium">Logout</button>
        </div>
      </nav>
      <div className="max-w-5xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-gray-500 text-sm">My Feedbacks</p>
            <p className="text-4xl font-bold text-indigo-600 mt-2">{stats.myFeedbacks}</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-gray-500 text-sm">Available Teachers</p>
            <p className="text-4xl font-bold text-green-500 mt-2">{stats.teachers}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link to="/student/teachers" className="bg-indigo-600 text-white rounded-2xl p-6 hover:bg-indigo-700 transition text-center font-semibold">
            Browse Teachers & Submit Feedback
          </Link>
          <Link to="/student/feedbacks" className="bg-white border-2 border-indigo-200 text-indigo-600 rounded-2xl p-6 hover:bg-indigo-50 transition text-center font-semibold">
            View My Feedbacks
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;