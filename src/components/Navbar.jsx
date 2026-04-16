import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  FaBars, FaTimes, FaUserGraduate, FaChalkboardTeacher,
  FaUserShield, FaTachometerAlt, FaSignOutAlt, FaUsers,
  FaComments, FaStar
} from 'react-icons/fa';

const navLinks = {
  student: [
    { to: '/student/dashboard', label: 'Dashboard', icon: <FaTachometerAlt /> },
    { to: '/student/teachers', label: 'Teachers', icon: <FaChalkboardTeacher /> },
    { to: '/student/feedbacks', label: 'My Feedbacks', icon: <FaStar /> },
  ],
  teacher: [
    { to: '/teacher/dashboard', label: 'Dashboard', icon: <FaTachometerAlt /> },
    { to: '/teacher/feedbacks', label: 'Received Feedback', icon: <FaComments /> },
  ],
  admin: [
    { to: '/admin/dashboard', label: 'Dashboard', icon: <FaTachometerAlt /> },
    { to: '/admin/users', label: 'Manage Users', icon: <FaUsers /> },
    { to: '/admin/feedbacks', label: 'Manage Feedback', icon: <FaComments /> },
  ],
};

const roleIcons = {
  student: <FaUserGraduate />,
  teacher: <FaChalkboardTeacher />,
  admin: <FaUserShield />,
};

const roleColors = {
  student: 'text-blue-600',
  teacher: 'text-green-600',
  admin: 'text-purple-600',
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  if (!user) return null;

  const links = navLinks[user.role] || [];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={`/${user.role}/dashboard`} className="flex items-center gap-2">
            <span className="text-2xl font-extrabold text-indigo-600 tracking-tight">FeedbackPro</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <span className="text-base">{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right: User Info + Logout */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full">
              <span className={`text-sm ${roleColors[user.role]}`}>{roleIcons[user.role]}</span>
              <span className="text-sm font-medium text-gray-700">{user.name}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold capitalize
                ${user.role === 'student' ? 'bg-blue-100 text-blue-600' :
                  user.role === 'teacher' ? 'bg-green-100 text-green-600' :
                  'bg-purple-100 text-purple-600'}`}>
                {user.role}
              </span>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <FaSignOutAlt />
              Logout
            </button>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pb-4 pt-2 space-y-1">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                location.pathname === link.to
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
          <div className="border-t border-gray-100 pt-3 mt-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`text-sm ${roleColors[user.role]}`}>{roleIcons[user.role]}</span>
              <span className="text-sm font-medium text-gray-700">{user.name}</span>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;