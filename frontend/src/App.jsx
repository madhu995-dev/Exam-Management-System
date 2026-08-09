import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layouts
import AdminLayout from './components/layout/AdminLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import VerifyOtpPage from './pages/auth/VerifyOtpPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import ChangePasswordPage from './pages/auth/ChangePasswordPage';

// Dashboards
import AdminDashboardPage from './pages/dashboard/AdminDashboardPage';
import FacultyDashboardPage from './pages/dashboard/FacultyDashboardPage';
import StudentDashboardPage from './pages/dashboard/StudentDashboardPage';

// Module Pages
import ProfilePage from './pages/profile/ProfilePage';
import DepartmentListPage from './pages/department/DepartmentListPage';
import FacultyListPage from './pages/faculty/FacultyListPage';
import StudentListPage from './pages/student/StudentListPage';
import SubjectListPage from './pages/subject/SubjectListPage';
import BlockListPage from './pages/block/BlockListPage';
import RoomListPage from './pages/room/RoomListPage';
import ExamSeriesListPage from './pages/series/ExamSeriesListPage';
import ExamListPage from './pages/exam/ExamListPage';
import StudentSubjectPage from './pages/studentsubject/StudentSubjectPage';
import SeatAllocationPage from './pages/seatallocation/SeatAllocationPage';
import InvigilatorAssignmentPage from './pages/invigilator/InvigilatorAssignmentPage';
import HallTicketPage from './pages/hallticket/HallTicketPage';
import AttendancePage from './pages/attendance/AttendancePage';
import ResultPage from './pages/result/ResultPage';
import BulkImportPage from './pages/bulk/BulkImportPage';
import ReportPage from './pages/report/ReportPage';
import NotificationPage from './pages/notification/NotificationPage';
import SettingPage from './pages/setting/SettingPage';

const RootRedirect = () => {
  const { isAuthenticated, role } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
  if (role === 'FACULTY') return <Navigate to="/faculty/dashboard" replace />;
  if (role === 'STUDENT') return <Navigate to="/student/dashboard" replace />;
  return <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/verify-otp" element={<VerifyOtpPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* Root Redirect */}
          <Route path="/" element={<RootRedirect />} />

          {/* Admin-Only Dashboard */}
          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
              <Route path="/departments" element={<DepartmentListPage />} />
              <Route path="/faculties" element={<FacultyListPage />} />
              <Route path="/blocks" element={<BlockListPage />} />
              <Route path="/rooms" element={<RoomListPage />} />
              <Route path="/bulk-import" element={<BulkImportPage />} />
              <Route path="/settings" element={<SettingPage />} />
            </Route>
          </Route>

          {/* Faculty-Only Dashboard */}
          <Route element={<ProtectedRoute allowedRoles={['FACULTY']} />}>
            <Route element={<AdminLayout />}>
              <Route path="/faculty/dashboard" element={<FacultyDashboardPage />} />
            </Route>
          </Route>

          {/* Student-Only Dashboard */}
          <Route element={<ProtectedRoute allowedRoles={['STUDENT']} />}>
            <Route element={<AdminLayout />}>
              <Route path="/student/dashboard" element={<StudentDashboardPage />} />
            </Route>
          </Route>

          {/* Shared Admin & Faculty Routes */}
          <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'FACULTY']} />}>
            <Route element={<AdminLayout />}>
              <Route path="/invigilator-assignments" element={<InvigilatorAssignmentPage />} />
              <Route path="/reports" element={<ReportPage />} />
            </Route>
          </Route>

          {/* Shared All Roles Routes (ADMIN, FACULTY, STUDENT) */}
          <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'FACULTY', 'STUDENT']} />}>
            <Route element={<AdminLayout />}>
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/change-password" element={<ChangePasswordPage />} />
              <Route path="/students" element={<StudentListPage />} />
              <Route path="/subjects" element={<SubjectListPage />} />
              <Route path="/examination-series" element={<ExamSeriesListPage />} />
              <Route path="/exams" element={<ExamListPage />} />
              <Route path="/student-subjects" element={<StudentSubjectPage />} />
              <Route path="/seat-allocations" element={<SeatAllocationPage />} />
              <Route path="/hall-tickets" element={<HallTicketPage />} />
              <Route path="/attendance" element={<AttendancePage />} />
              <Route path="/results" element={<ResultPage />} />
              <Route path="/notifications" element={<NotificationPage />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
