import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

/**
 * TeacherLayout
 * Wraps all teacher pages with the shared Navbar.
 * Uses React Router's <Outlet /> to render child routes.
 */
const TeacherLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="text-center text-xs text-gray-400 py-4 border-t border-gray-100 bg-white">
        © {new Date().getFullYear()} FeedbackPro — Teacher Portal
      </footer>
    </div>
  );
};

export default TeacherLayout;