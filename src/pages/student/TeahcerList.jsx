import { useEffect, useState } from 'react';
import { getTeachers, submitFeedback } from '../../services/api';
import StarRating from '../../components/StarRating';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { FaChalkboardTeacher, FaBook, FaCommentDots } from 'react-icons/fa';

const TeachersList = () => {
  const [teachers, setTeachers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ rating: 0, comment: '', subject: '' });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getTeachers()
      .then((r) => { setTeachers(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // ✅ When teacher is selected, reset form and pre-set empty subject
  const handleSelectTeacher = (teacher) => {
    setSelected(teacher);
    setForm({ rating: 0, comment: '', subject: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.rating) return toast.error('Please select a rating');
    if (!form.subject) return toast.error('Please select a subject');
    if (form.comment.trim().length < 10)
      return toast.error('Comment must be at least 10 characters');

    setSubmitting(true);
    try {
      await submitFeedback({ teacherId: selected._id, ...form });
      toast.success('Feedback submitted and marked as pending');
      setSelected(null);
      setForm({ rating: 0, comment: '', subject: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Teachers</h2>
        <p className="text-sm text-gray-500 mt-1">
          {teachers.length} teacher{teachers.length !== 1 ? 's' : ''} available
        </p>
      </div>

      {/* Teachers Grid */}
      {teachers.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <FaChalkboardTeacher className="text-6xl mx-auto mb-4 text-gray-300" />
          <p className="font-semibold text-gray-500">No teachers available yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {teachers.map((teacher) => (
            <div
              key={teacher._id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow"
            >
              {/* Teacher Info */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-lg shrink-0">
                  {teacher.name[0].toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-800 truncate">{teacher.name}</p>
                  <p className="text-xs text-gray-400">{teacher.email}</p>
                </div>
              </div>

              {/* ✅ Dynamic subjects from DB as tags */}
              {teacher.subjects && teacher.subjects.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {teacher.subjects.map((subj) => (
                    <span
                      key={subj}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-medium"
                    >
                      <FaBook size={9} />
                      {subj}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400 mb-4">No subjects listed</p>
              )}

              {/* Give Feedback Button */}
              <button
                onClick={() => handleSelectTeacher(teacher)}
                disabled={!teacher.subjects || teacher.subjects.length === 0}
                className="w-full py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaCommentDots />
                Give Feedback
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ✅ Feedback Modal with dynamic subjects */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">

            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold shrink-0">
                {selected.name[0].toUpperCase()}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Feedback for {selected.name}</h3>
                <p className="text-xs text-gray-400">Fill in all fields below</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Rating <span className="text-red-500">*</span>
                </label>
                <StarRating
                  rating={form.rating}
                  setRating={(r) => setForm({ ...form, rating: r })}
                />
              </div>

              {/* ✅ Subject Dropdown — fully dynamic from teacher's subjects array */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Subject <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  required
                >
                  <option value="">Select a subject</option>
                  {/* ✅ Only this teacher's subjects — no hardcoded list */}
                  {selected.subjects.map((subj) => (
                    <option key={subj} value={subj}>
                      {subj}
                    </option>
                  ))}
                </select>
              </div>

              {/* Comment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Comment <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="Write your feedback (min 10 characters)..."
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  value={form.comment}
                  onChange={(e) => setForm({ ...form, comment: e.target.value })}
                  required
                  minLength={10}
                />
                <p className="text-xs text-gray-400 mt-1">
                  {form.comment.length}/500 characters
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 font-medium text-sm transition"
                >
                  {submitting ? 'Submitting...' : 'Submit Feedback'}
                </button>
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="flex-1 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 font-medium text-sm transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeachersList;
