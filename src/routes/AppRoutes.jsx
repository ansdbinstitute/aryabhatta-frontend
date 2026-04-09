import React, { lazy, Suspense } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';

// Eager load Home (it's the landing page - needs to be instant)
import Home from '../pages/Home';

// Lazy load all other pages (they don't need to load on initial page visit)
const About = lazy(() => import('../pages/About'));
const Courses = lazy(() => import('../pages/Courses'));
const CourseDetails = lazy(() => import('../pages/CourseDetails'));
const Secretary = lazy(() => import('../pages/Secretary'));
const Contact = lazy(() => import('../pages/Contact'));
const Gallery = lazy(() => import('../pages/Gallery'));
const Notice = lazy(() => import('../pages/Notice'));
const Login = lazy(() => import('../pages/Login'));
const Career = lazy(() => import('../pages/Career'));

// Lazy load portal routes
const ErpRoutes = lazy(() => import('../erp/routes/ErpRoutes'));
const StudentPortalRoutes = lazy(() => import('../student/routes/StudentPortalRoutes'));
const StudentLoginPage = lazy(() => import('../student/pages/StudentLoginPage'));

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh] bg-white">
    <div className="flex flex-col items-center gap-4">
      <Loader2 className="w-10 h-10 text-primary animate-spin" />
      <p className="text-slate-500 text-sm font-medium">Loading...</p>
    </div>
  </div>
);

const PublicLayout = () => (
  <MainLayout>
    <Outlet />
  </MainLayout>
);

const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<PublicLayout />}>
          {/* Public Website - Home is eager loaded */}
          <Route path="/" element={<Home />} />
          
          {/* Lazy loaded public pages */}
          <Route path="/about" element={<About />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetails />} />
          <Route path="/secretary" element={<Secretary />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/notice" element={<Notice />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/career" element={<Career />} />
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Student Portal — MUST come BEFORE /erp/* to prevent wildcard matching */}
        <Route path="/student/login" element={<StudentLoginPage />} />
        <Route path="/student/*" element={<StudentPortalRoutes />} />

        {/* ERP System — all routes under /erp/* */}
        <Route path="/erp/*" element={<ErpRoutes />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
