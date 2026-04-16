import { useEffect, useState } from 'react';
import { getMyFeedbacks } from '../../services/api';
import FeedbackCard from '../../components/FeedbackCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { FaCommentSlash } from 'react-icons/fa';

const MyFeedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchFeedbacks = async (p = 1) => {
    setLoading(true);
    try {
      const { data } = await getMyFeedbacks(p);
      setFeedbacks(data.feedbacks);
      setPage(data.page);
      setPages(data.pages);
      setTotal(data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks(1);
  }, []);

  const handleDelete = (id) => {
    setFeedbacks((prev) => prev.filter((fb) => fb._id !== id));
    setTotal((prev) => prev - 1);
  };

  const handleUpdate = (updated) => {
    setFeedbacks((prev) =>
      prev.map((fb) => (fb._id === updated._id ? { ...fb, ...updated } : fb))
    );
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">My Feedbacks</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {total} feedback{total !== 1 ? 's' : ''} submitted
          </p>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <LoadingSpinner />
      ) : feedbacks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <FaCommentSlash className="text-gray-300 text-6xl mb-4" />
          <h3 className="text-lg font-semibold text-gray-500">No feedback yet</h3>
          <p className="text-sm text-gray-400 mt-1">Submit your first feedback from the Teachers page.</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {feedbacks.map((fb) => (
              <FeedbackCard
                key={fb._id}
                feedback={fb}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
              />
            ))}
          </div>

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-8">
              <button
                onClick={() => fetchFeedbacks(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 rounded-xl border text-sm font-medium disabled:opacity-40 hover:bg-gray-50 transition"
              >
                ← Prev
              </button>
              <span className="text-sm text-gray-500">
                Page {page} of {pages}
              </span>
              <button
                onClick={() => fetchFeedbacks(page + 1)}
                disabled={page === pages}
                className="px-4 py-2 rounded-xl border text-sm font-medium disabled:opacity-40 hover:bg-gray-50 transition"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyFeedbacks; 