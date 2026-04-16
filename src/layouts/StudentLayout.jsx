import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

/**
 * StudentLayout
 * Wraps all student pages with the shared Navbar.
 * Uses React Router's <Outlet /> to render child routes.
 */
const StudentLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="text-center text-xs text-gray-400 py-4 border-t border-gray-100 bg-white">
        © {new Date().getFullYear()} FeedbackPro — Student Portal
      </footer>
    </div>
  );
};

export default StudentLayout;