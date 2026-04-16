import { useEffect, useState } from 'react';
import { getTeacherDashboard } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import StarRating from '../../components/StarRating';
import LoadingSpinner from '../../components/LoadingSpinner';

const TeacherDashboard = () => {
  const { user, logout } = useAuth();
  const [data, setData] = useState({ feedbacks: [], totalFeedback: 0, avgRating: 0, subjects: [] });
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getTeacherDashboard(filter)
      .then(r => { setData(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [filter]);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-indigo-600">FeedbackPro — Teacher</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">Welcome, {user?.name}</span>
          <button onClick={logout} className="text-red-500 hover:text-red-700 font-medium">Logout</button>
        </div>
      </nav>
      <div className="max-w-5xl mx-auto p-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow p-6 text-center">
            <p className="text-gray-500 text-sm">Total Feedback</p>
            <p className="text-4xl font-bold text-indigo-600 mt-2">{data.totalFeedback}</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-6 text-center">
            <p className="text-gray-500 text-sm">Average Rating</p>
            <p className="text-4xl font-bold text-yellow-500 mt-2">{data.avgRating} ⭐</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-6 text-center">
            <p className="text-gray-500 text-sm">Subjects Taught</p>
            <p className="text-4xl font-bold text-green-500 mt-2">{data.subjects.length}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <h3 className="text-lg font-semibold">Recent Feedback</h3>
          <select className="ml-auto px-3 py-2 border rounded-xl text-sm"
            value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="">All Subjects</option>
            {data.subjects.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>

        {loading ? <LoadingSpinner /> : (
          <div className="space-y-4">
            {data.feedbacks.length === 0 ? (
              <div className="text-center text-gray-500 py-10">No feedback received yet.</div>
            ) : data.feedbacks.map(fb => (
              <div key={fb._id} className="bg-white rounded-2xl shadow p-5">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold">{fb.studentId?.name}</p>
                    <p className="text-sm text-gray-500">{fb.subject}</p>
                  </div>
                  <StarRating rating={fb.rating} readOnly />
                </div>
                <p className="text-gray-700 text-sm">{fb.comment}</p>
                <p className="text-xs text-gray-400 mt-2">{new Date(fb.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;