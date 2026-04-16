import { useEffect, useState } from 'react';
import { getTeacherDashboard } from '../../services/api';
import FeedbackCard from '../../components/FeedbackCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { FaFilter, FaCommentSlash } from 'react-icons/fa';

const FeedbackReceived = () => {
  const [data, setData] = useState({
    feedbacks: [],
    totalFeedback: 0,
    avgRating: 0,
    subjects: [],
  });
  const [filter, setFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getTeacherDashboard(filter)
      .then((r) => { setData(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [filter]);

  // ✅ Apply status filter client-side (no extra API call)
  const visibleFeedbacks = statusFilter
    ? data.feedbacks.filter((f) => f.status === statusFilter)
    : data.feedbacks;

  // Rating distribution on visible feedbacks
  const ratingCounts = [5, 4, 3, 2, 1].map((r) => ({
    star: r,
    count: data.feedbacks.filter((f) => f.rating === r).length,
  }));
  const maxCount = Math.max(...ratingCounts.map((r) => r.count), 1);
  const barColor = (star) =>
    star >= 4 ? 'bg-green-400' : star === 3 ? 'bg-yellow-400' : 'bg-red-400';

  const approvedCount = data.feedbacks.filter((f) => f.status === 'approved').length;
  const pendingCount  = data.feedbacks.filter((f) => f.status === 'pending').length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Feedback Received</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {data.totalFeedback} total · avg{' '}
            <span className="text-yellow-500 font-semibold">
              {Number(data.avgRating).toFixed(1)} ⭐
            </span>{' '}
            ·{' '}
            <span className="text-green-600 font-semibold">{approvedCount} approved</span>
            {' · '}
            <span className="text-orange-500 font-semibold">{pendingCount} pending</span>
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <FaFilter className="text-gray-400 text-sm" />

          {/* Status filter */}
          <select
            className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
          </select>

          {/* Subject filter */}
          {data.subjects.length > 0 && (
            <select
              className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="">All Subjects</option>
              {data.subjects.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* ── Rating Distribution ── */}
      {!loading && data.feedbacks.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
          <h3 className="text-sm font-semibold text-gray-600 mb-4">Rating Distribution</h3>
          <div className="space-y-2">
            {ratingCounts.map(({ star, count }) => (
              <div key={star} className="flex items-center gap-3">
                <span className="text-xs font-medium text-gray-500 w-10">{star} ★</span>
                <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${barColor(star)}`}
                    style={{ width: `${(count / maxCount) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500 w-5 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Feedback List ── */}
      {loading ? (
        <LoadingSpinner />
      ) : visibleFeedbacks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <FaCommentSlash className="text-gray-300 text-6xl mb-4" />
          <h3 className="text-lg font-semibold text-gray-500">No feedback found</h3>
          <p className="text-sm text-gray-400 mt-1">
            {filter || statusFilter
              ? 'Try a different filter.'
              : "Students haven't submitted feedback yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {visibleFeedbacks.map((fb) => (
            <FeedbackCard
              key={fb._id}
              feedback={fb}
              readOnly // ✅ teacher cannot edit/delete — only view
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FeedbackReceived;