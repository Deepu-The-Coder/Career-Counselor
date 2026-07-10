import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LoadingSpinner from './components/LoadingSpinner';

// Lazy-loaded pages
const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const DashboardLayout = lazy(() => import('./pages/DashboardLayout'));
const DashboardHome = lazy(() => import('./pages/DashboardHome'));
const ChatPage = lazy(() => import('./pages/ChatPage'));
const AssessmentPage = lazy(() => import('./pages/AssessmentPage'));
const RoadmapPage = lazy(() => import('./pages/RoadmapPage'));
const SchemesPage = lazy(() => import('./pages/SchemesPage'));
const ResourcesPage = lazy(() => import('./pages/ResourcesPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const ResumePage = lazy(() => import('./pages/ResumePage'));
const FamilyPage = lazy(() => import('./pages/FamilyPage'));
const RuralOpportunitiesPage = lazy(() => import('./pages/RuralOpportunitiesPage'));

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner fullScreen />;
  return user ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner fullScreen />;
  return user ? <Navigate to="/dashboard" replace /> : children;
};

export default function App() {
  return (
    <Suspense fallback={<LoadingSpinner fullScreen />}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

        {/* Protected dashboard routes */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<DashboardHome />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="assessment" element={<AssessmentPage />} />
          <Route path="roadmap" element={<RoadmapPage />} />
          <Route path="schemes" element={<SchemesPage />} />
          <Route path="resources" element={<ResourcesPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="resume" element={<ResumePage />} />
          <Route path="family" element={<FamilyPage />} />
          <Route path="opportunities" element={<RuralOpportunitiesPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
