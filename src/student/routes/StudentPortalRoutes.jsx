import React, { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import useStudentAuthStore from '../stores/studentAuthStore';
import StudentLayout from '../components/layout/StudentLayout';

// Lazy load all student pages
const StudentDashboardPage = lazy(() => import('../pages/StudentDashboardPage'));
const StudentProfilePage = lazy(() => import('../pages/StudentProfilePage'));
const StudentStudyMaterialsPage = lazy(() => import('../pages/StudentStudyMaterialsPage'));
const StudentExamsPage = lazy(() => import('../pages/StudentExamsPage'));
const StudentResultsPage = lazy(() => import('../pages/StudentResultsPage'));
const StudentCertificatesPage = lazy(() => import('../pages/StudentCertificatesPage'));
const StudentPaymentsPage = lazy(() => import('../pages/StudentPaymentsPage'));
const StudentIDCardPage = lazy(() => import('../pages/StudentIDCardPage'));

// Loading fallback
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-[#F8FAFC]">
    <div className="flex flex-col items-center gap-4">
      <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      <p className="text-slate-500 text-sm font-medium">Loading...</p>
    </div>
  </div>
);

const StudentProtectedRoute = ({ children }) => {
  const isAuthenticated = useStudentAuthStore((s) => s.isAuthenticated);
  const isLoading = useStudentAuthStore((s) => s.isLoading);
  const user = useStudentAuthStore((s) => s.user);

  if (isLoading) {
    return <PageLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/student/login" replace />;
  }

  if (user?.roleType !== 'student') {
    return <Navigate to="/erp/dashboard" replace />;
  }

  return children;
};

const StudentPortalRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route
          element={
            <StudentProtectedRoute>
              <StudentLayout />
            </StudentProtectedRoute>
          }
        >
          <Route path="dashboard" element={<StudentDashboardPage />} />
          <Route path="materials" element={<StudentStudyMaterialsPage />} />
          <Route path="exams" element={<StudentExamsPage />} />
          <Route path="results" element={<StudentResultsPage />} />
          <Route path="certificates" element={<StudentCertificatesPage />} />
          <Route path="payments" element={<StudentPaymentsPage />} />
          <Route path="id-card" element={<StudentIDCardPage />} />
          <Route path="profile" element={<StudentProfilePage />} />
          
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default StudentPortalRoutes;
