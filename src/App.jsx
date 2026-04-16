import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Layouts
import StudentLayout from './layouts/StudentLayout';
import TeacherLayout from './layouts/TeacherLayout';
import AdminLayout from './layouts/AdminLayout';

// Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';

import MyFeedbacks from './pages/student/MyFeedbacks';

// Teacher Pages
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import FeedbackReceived from './pages/teacher/FeedbackReceived';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageFeedback from './pages/admin/ManageFeedback';
import TeachersList from './pages/student/TeahcerList';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <Routes>

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ─── Student Routes ─── */}
          <Route
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/teachers"  element={<TeachersList />} />
            <Route path="/student/feedbacks" element={<MyFeedbacks />} />
          </Route>

          {/* ─── Teacher Routes ─── */}
          <Route
            element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <TeacherLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
            <Route path="/teacher/feedbacks" element={<FeedbackReceived />} />
          </Route>

          {/* ─── Admin Routes ─── */}
          <Route
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/admin/dashboard"  element={<AdminDashboard />} />
            <Route path="/admin/users"      element={<ManageUsers />} />
            <Route path="/admin/feedbacks"  element={<ManageFeedback />} />
          </Route>

          {/* 404 — catch-all */}
          <Route path="*" element={<Navigate to="/login" replace />} />

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;