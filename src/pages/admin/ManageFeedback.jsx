import { useEffect, useState } from 'react';
import { getAllFeedback, deleteFeedback, approveFeedback } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import StarRating from '../../components/StarRating';
import toast from 'react-hot-toast';
import { FaSearch, FaTrash, FaCommentSlash, FaStar, FaCheckCircle } from 'react-icons/fa';

const ManageFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [approvingFeedback, setApprovingFeedback] = useState(null);
  const [adminResponse, setAdminResponse] = useState('');
  const [submittingApproval, setSubmittingApproval] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const { data } = await getAllFeedback();
      setFeedbacks(data);
    } catch {
      toast.error('Failed to load feedback');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setDeleting(true);
    try {
      await deleteFeedback(confirmDelete._id);
      setFeedbacks((prev) => prev.filter((fb) => fb._id !== confirmDelete._id));
      toast.success('Feedback deleted');
    } catch {
      toast.error('Delete failed');
    } finally {
      setDeleting(false);
      setConfirmDelete(null);
    }
  };

  const openApprovalModal = (feedback) => {
    setApprovingFeedback(feedback);
    setAdminResponse(feedback.adminResponse || '');
  };

  const closeApprovalModal = () => {
    setApprovingFeedback(null);
    setAdminResponse('');
  };

  const handleApprove = async () => {
    if (!approvingFeedback) return;
    if (!adminResponse.trim()) {
      toast.error('Approval message is required');
      return;
    }

    setSubmittingApproval(true);
    try {
      const { data } = await approveFeedback(approvingFeedback._id, {
        adminResponse: adminResponse.trim(),
      });
      setFeedbacks((prev) => prev.map((fb) => (fb._id === data._id ? data : fb)));
      toast.success('Feedback approved successfully');
      closeApprovalModal();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Approval failed');
    } finally {
      setSubmittingApproval(false);
    }
  };

  const filtered = feedbacks.filter((fb) => {
    const q = search.toLowerCase();
    const matchSearch =
      fb.studentId?.name?.toLowerCase().includes(q) ||
      fb.teacherId?.name?.toLowerCase().includes(q) ||
      fb.subject?.toLowerCase().includes(q) ||
      fb.comment?.toLowerCase().includes(q) ||
      fb.adminResponse?.toLowerCase().includes(q);
    const matchRating = ratingFilter ? fb.rating === Number(ratingFilter) : true;
    const matchStatus = statusFilter ? (fb.status || 'pending') === statusFilter : true;
    return matchSearch && matchRating && matchStatus;
  });

  const avgRating = feedbacks.length
    ? (feedbacks.reduce((sum, fb) => sum + fb.rating, 0) / feedbacks.length).toFixed(1)
    : '-';
  const pendingCount = feedbacks.filter((fb) => (fb.status || 'pending') === 'pending').length;
  const approvedCount = feedbacks.filter((fb) => fb.status === 'approved').length;

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Manage Feedback</h2>
          <p className="text-sm text-gray-500 mt-1">
            {feedbacks.length} total | avg rating{' '}
            <span className="text-yellow-500 font-semibold">{avgRating} stars</span>
            {' | '}
            <span className="text-orange-500 font-semibold">{pendingCount} pending</span>
            {' | '}
            <span className="text-green-600 font-semibold">{approvedCount} approved</span>
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            placeholder="Search by student, teacher, subject, comment, or admin message..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          value={ratingFilter}
          onChange={(e) => setRatingFilter(e.target.value)}
        >
          <option value="">All Ratings</option>
          {[5, 4, 3, 2, 1].map((r) => (
            <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>
          ))}
        </select>
        <select
          className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
        </select>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <FaCommentSlash className="text-gray-300 text-6xl mb-4" />
          <p className="text-lg font-semibold text-gray-500">No feedback found</p>
          <p className="text-sm text-gray-400 mt-1">Try a different search or filter.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((fb) => {
            const status = fb.status || 'pending';
            const isApproved = status === 'approved';

            return (
              <div
                key={fb._id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm shrink-0">
                      {fb.studentId?.name?.[0]?.toUpperCase() || 'S'}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                        <p className="font-semibold text-sm text-gray-800">{fb.studentId?.name || 'Unknown'}</p>
                        <span className="text-gray-400 text-xs">to</span>
                        <p className="font-semibold text-sm text-indigo-600">{fb.teacherId?.name || 'Unknown'}</p>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <span className="text-xs text-gray-500">{fb.subject}</span>
                        <span className="text-gray-300">|</span>
                        <span className="text-xs text-gray-400">
                          {new Date(fb.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                        <span className="text-gray-300">|</span>
                        {isApproved ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                            <FaCheckCircle className="text-[10px]" /> Approved
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-orange-100 text-orange-600">
                            Pending
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="flex items-center gap-1 text-yellow-500 font-bold text-sm">
                      <FaStar />
                      {fb.rating}/5
                    </div>
                    {!isApproved && (
                      <button
                        onClick={() => openApprovalModal(fb)}
                        className="px-3 py-2 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition"
                      >
                        Approve
                      </button>
                    )}
                    <button
                      onClick={() => setConfirmDelete(fb)}
                      title="Delete feedback"
                      className="p-2 rounded-xl text-red-400 hover:bg-red-50 hover:text-red-600 transition"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>

                <div className="mt-3">
                  <StarRating rating={fb.rating} readOnly />
                  <p className="text-gray-700 text-sm mt-2 leading-relaxed">{fb.comment}</p>
                </div>

                {fb.adminResponse && (
                  <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-3">
                    <p className="text-xs font-semibold text-green-700 mb-1">Admin Message</p>
                    <p className="text-sm text-green-800 leading-relaxed">{fb.adminResponse}</p>
                    {(fb.approvedBy?.name || fb.approvedAt) && (
                      <p className="text-xs text-green-700/80 mt-2">
                        {fb.approvedBy?.name ? `Approved by ${fb.approvedBy.name}` : 'Approved'}
                        {fb.approvedAt
                          ? ` on ${new Date(fb.approvedAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}`
                          : ''}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {approvingFeedback && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg">
            <h3 className="text-lg font-bold text-gray-800">Approve Feedback</h3>
            <p className="text-sm text-gray-500 mt-1">
              This message will be visible to both the student and the teacher.
            </p>

            <div className="mt-4 rounded-xl bg-gray-50 border border-gray-200 p-4 space-y-2">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">{approvingFeedback.studentId?.name || 'Student'}</span>
                {' to '}
                <span className="font-semibold text-indigo-600">{approvingFeedback.teacherId?.name || 'Teacher'}</span>
              </p>
              <p className="text-xs text-gray-500">
                {approvingFeedback.subject} | {approvingFeedback.rating}/5
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">{approvingFeedback.comment}</p>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Message
              </label>
              <textarea
                rows={5}
                value={adminResponse}
                onChange={(e) => setAdminResponse(e.target.value)}
                placeholder="Write the admin response shown after approval..."
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400"
                maxLength={500}
              />
              <p className="text-xs text-gray-400 mt-1 text-right">{adminResponse.length}/500</p>
            </div>

            <div className="flex gap-3 mt-5">
              <button
                onClick={handleApprove}
                disabled={submittingApproval}
                className="flex-1 py-2.5 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50 transition"
              >
                {submittingApproval ? 'Approving...' : 'Approve Feedback'}
              </button>
              <button
                onClick={closeApprovalModal}
                disabled={submittingApproval}
                className="flex-1 py-2.5 border rounded-xl font-semibold hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm text-center">
            <div className="text-4xl mb-3">Delete</div>
            <h3 className="text-lg font-bold mb-1">Delete Feedback?</h3>
            <p className="text-sm text-gray-500 mb-1">
              By <span className="font-semibold text-gray-700">{confirmDelete.studentId?.name}</span>{' '}
              for <span className="font-semibold text-indigo-600">{confirmDelete.teacherId?.name}</span>
            </p>
            <p className="text-xs text-gray-400 mb-5">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-2.5 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 disabled:opacity-50 transition"
              >
                {deleting ? 'Deleting...' : 'Delete'}
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

export default ManageFeedback;
