import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import StoresPage from './pages/stores/StoresPage';
import StoreDetailPage from './pages/stores/StoreDetailPage';
import CreateStorePage from './pages/stores/CreateStorePage';
import EditStorePage from './pages/stores/EditStorePage';
import MyRatingsPage from './pages/ratings/MyRatingsPage';
import ProfilePage from './pages/profile/ProfilePage';
import SettingsPage from './pages/settings/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';

// Types
import { UserRole } from './types';

// Styles
import './App.css';

// Component to handle auth redirects
const AuthRedirect = () => {
  const { user } = useAuth();
  
  if (user?.role === 'store_owner' || user?.role === 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  return <Navigate to="/" replace />;
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-right" />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="stores" element={<StoresPage />} />
            <Route path="stores/:id" element={<StoreDetailPage />} />
            
            {/* Auth Routes */}
            <Route path="auth" element={<AuthLayout />}>
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="forgot-password" element={<div>Forgot Password</div>} />
              <Route path="reset-password" element={<div>Reset Password</div>} />
            </Route>

            {/* Protected Routes */}
            <Route
              path="dashboard"
              element={
                <ProtectedRoute allowedRoles={['store_owner', 'admin']}>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="stores/create"
              element={
                <ProtectedRoute allowedRoles={['store_owner', 'admin']}>
                  <CreateStorePage />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="stores/:id/edit"
              element={
                <ProtectedRoute allowedRoles={['store_owner', 'admin']}>
                  <EditStorePage />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="my-ratings"
              element={
                <ProtectedRoute>
                  <MyRatingsPage />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="settings/*"
              element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              }
            />
            
            {/* Redirect after auth */}
            <Route path="auth-redirect" element={<AuthRedirect />} />
            
            {/* 404 - Keep this last */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
