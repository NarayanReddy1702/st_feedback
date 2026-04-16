import { Outlet, NavLink } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { FaTachometerAlt, FaUsers, FaComments } from 'react-icons/fa';

const sideLinks = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: <FaTachometerAlt /> },
  { to: '/admin/users', label: 'Manage Users', icon: <FaUsers /> },
  { to: '/admin/feedbacks', label: 'Manage Feedback', icon: <FaComments /> },
];

/**
 * AdminLayout
 * Provides a sidebar layout for all admin pages.
 * Sidebar is hidden on mobile (Navbar handles mobile nav).
 */
const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 gap-6">
        {/* Sidebar — desktop only */}
        <aside className="hidden lg:flex flex-col w-56 shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 sticky top-24">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">Admin Menu</p>
            <nav className="space-y-1">
              {sideLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`
                  }
                >
                  <span>{link.icon}</span>
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;