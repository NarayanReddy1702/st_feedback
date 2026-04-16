import { useState } from 'react';
import { deleteFeedback, updateFeedback } from '../services/api';
import StarRating from './StarRating';
import toast from 'react-hot-toast';
import { FaTrash, FaPencilAlt, FaStar, FaLock, FaCheckCircle } from 'react-icons/fa';

const FeedbackCard = ({ feedback: fb, onDelete, onUpdate, readOnly = false }) => {
  const [editing, setEditing] = useState(false);
  const [comment, setComment] = useState(fb.comment);
  const [rating, setRating] = useState(fb.rating);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const status = fb.status || 'pending';
  const isApproved = status === 'approved';
  const canModify = !readOnly && !isApproved;

  const handleSave = async () => {
    if (!comment.trim() || comment.trim().length < 10) {
      toast.error('Comment must be at least 10 characters');
      return;
    }

    setSaving(true);
    try {
      const { data } = await updateFeedback(fb._id, { comment, rating });
      onUpdate?.(data);
      setEditing(false);
      toast.success('Feedback updated');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteFeedback(fb._id);
      onDelete?.(fb._id);
      toast.success('Feedback deleted');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Delete failed');
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  const handleCancelEdit = () => {
    setEditing(false);
    setComment(fb.comment);
    setRating(fb.rating);
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
              {fb.studentId?.name && (
                <>
                  <p className="font-semibold text-sm text-gray-800">{fb.studentId.name}</p>
                  <span className="text-gray-400 text-xs">to</span>
                </>
              )}
              <p className="font-semibold text-sm text-indigo-600">
                {fb.teacherId?.name || 'Unknown Teacher'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-0.5">
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
              {isApproved && !readOnly && (
                <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                  <FaLock className="text-[10px]" /> Locked
                </span>
              )}
            </div>
          </div>

          {canModify && !editing && (
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setEditing(true)}
                title="Edit feedback"
                className="p-2 rounded-xl text-blue-400 hover:bg-blue-50 hover:text-blue-600 transition"
              >
                <FaPencilAlt />
              </button>
              <button
                onClick={() => setConfirmDelete(true)}
                title="Delete feedback"
                className="p-2 rounded-xl text-red-400 hover:bg-red-50 hover:text-red-600 transition"
              >
                <FaTrash />
              </button>
            </div>
          )}
        </div>

        {editing ? (
          <div className="mt-4 space-y-3">
            <StarRating rating={rating} setRating={setRating} />
            <textarea
              rows={3}
              maxLength={500}
              className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <p className="text-xs text-gray-400 text-right">{comment.length}/500</p>
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-indigo-500 text-white rounded-xl text-sm font-semibold hover:bg-indigo-600 disabled:opacity-50 transition"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 border rounded-xl text-sm font-semibold hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-3">
            <div className="flex items-center gap-1 text-yellow-500 font-bold text-sm mb-1">
              <FaStar />
              <span>{fb.rating}/5</span>
            </div>
            <StarRating rating={fb.rating} readOnly />
            <p className="text-gray-700 text-sm mt-2 leading-relaxed">{fb.comment}</p>
          </div>
        )}

        {isApproved && fb.adminResponse && (
          <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-3">
            <p className="text-xs font-semibold text-green-700 mb-1">Admin Response</p>
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

      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm text-center">
            <div className="text-4xl mb-3">Delete</div>
            <h3 className="text-lg font-bold mb-1">Delete this feedback?</h3>
            <p className="text-sm text-gray-500 mb-1">
              For <span className="font-semibold text-indigo-600">{fb.teacherId?.name}</span>
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
                onClick={() => setConfirmDelete(false)}
                className="flex-1 py-2.5 border rounded-xl font-semibold hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FeedbackCard;
