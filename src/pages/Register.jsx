import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FaPlus, FaTimes } from 'react-icons/fa';

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
  });
  const [subjectInput, setSubjectInput] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    // Clear subjects when switching away from teacher
    if (e.target.name === 'role' && e.target.value !== 'teacher') {
      setSubjects([]);
      setSubjectInput('');
    }
  };

  // ✅ Add subject to list
  const handleAddSubject = () => {
    const trimmed = subjectInput.trim();
    if (!trimmed) return toast.error('Please enter a subject name');

    // Case-insensitive duplicate check
    const isDuplicate = subjects.some(
      (s) => s.toLowerCase() === trimmed.toLowerCase()
    );
    if (isDuplicate) return toast.error(`"${trimmed}" is already added`);

    setSubjects((prev) => [...prev, trimmed]);
    setSubjectInput('');
  };

  // Allow pressing Enter to add subject
  const handleSubjectKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSubject();
    }
  };

  // ✅ Remove subject from list
  const handleRemoveSubject = (index) => {
    setSubjects((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) return toast.error('Name is required');
    if (!form.email.trim()) return toast.error('Email is required');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    if (!form.role) return toast.error('Please select a role');
    if (form.role === 'teacher' && subjects.length === 0) {
      return toast.error('Please add at least one subject');
    }

    setLoading(true);
    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role,
        subjects: form.role === 'teacher' ? subjects : [],
      };

      const data = await register(payload);
      toast.success(`Welcome, ${data.name}! 🎉`);
      navigate(`/${data.role}/dashboard`);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.msg ||
        'Registration failed. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-indigo-600 mb-1">Create Account</h1>
        <p className="text-center text-gray-500 mb-8 text-sm">Join FeedbackPro today</p>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Name */}
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
            value={form.name}
            onChange={handleChange}
            required
          />

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email address"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
            value={form.email}
            onChange={handleChange}
            required
          />

          {/* Password */}
          <input
            type="password"
            name="password"
            placeholder="Password (min 6 characters)"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
            value={form.password}
            onChange={handleChange}
            required
            minLength={6}
          />

          {/* Role */}
          <select
            name="role"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm bg-white"
            value={form.role}
            onChange={handleChange}
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>

          {/* ✅ Dynamic Subjects Section — only for teachers */}
          {form.role === 'teacher' && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Subjects You Teach
                <span className="text-red-500 ml-1">*</span>
              </label>

              {/* Input + Add button */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Mathematics"
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
                  value={subjectInput}
                  onChange={(e) => setSubjectInput(e.target.value)}
                  onKeyDown={handleSubjectKeyDown}
                />
                <button
                  type="button"
                  onClick={handleAddSubject}
                  className="flex items-center gap-1.5 px-4 py-3 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition shrink-0"
                >
                  <FaPlus size={12} />
                  Add
                </button>
              </div>

              {/* Subject Tags */}
              {subjects.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {subjects.map((subject, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium border border-indigo-100"
                    >
                      {subject}
                      <button
                        type="button"
                        onClick={() => handleRemoveSubject(index)}
                        className="text-indigo-400 hover:text-indigo-700 transition ml-0.5"
                        title="Remove subject"
                      >
                        <FaTimes size={10} />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {subjects.length === 0 && (
                <p className="text-xs text-gray-400">
                  Add at least one subject. Press Enter or click Add.
                </p>
              )}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-50 text-sm"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-500 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;