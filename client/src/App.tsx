import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { ProtectedRoute, AdminRoute } from './components/layout/ProtectedRoute';

// Public Pages
import { Home } from './pages/Home';
import { Categories } from './pages/Categories';
import { CategoryDetail } from './pages/CategoryDetail';
import { DevicesBrowse } from './pages/DevicesBrowse';
import { DeviceDetail } from './pages/DeviceDetail';
import { SearchPage } from './pages/SearchPage';
import { About } from './pages/About';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { OAuthCallback } from './pages/OAuthCallback';
import { NotFound } from './pages/NotFound';

// Authenticated User Pages
import { UserDashboard } from './pages/UserDashboard';
import { Profile } from './pages/Profile';
import { Bookmarks } from './pages/Bookmarks';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminDevicesList } from './pages/admin/AdminDevicesList';
import { AdminDeviceForm } from './pages/admin/AdminDeviceForm';
import { AdminCategoriesList } from './pages/admin/AdminCategoriesList';
import { AdminUsersList } from './pages/admin/AdminUsersList';

export const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* Public Routes */}
        <Route index element={<Home />} />
        <Route path="categories" element={<Categories />} />
        <Route path="categories/:slug" element={<CategoryDetail />} />
        <Route path="devices" element={<DevicesBrowse />} />
        <Route path="devices/:slug" element={<DeviceDetail />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="about" element={<About />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password" element={<ResetPassword />} />
        <Route path="oauth/callback" element={<OAuthCallback />} />

        {/* Protected User Routes */}
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="bookmarks"
          element={
            <ProtectedRoute>
              <Bookmarks />
            </ProtectedRoute>
          }
        />

        {/* Admin Only Routes */}
        <Route
          path="admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="admin/devices"
          element={
            <AdminRoute>
              <AdminDevicesList />
            </AdminRoute>
          }
        />
        <Route
          path="admin/devices/new"
          element={
            <AdminRoute>
              <AdminDeviceForm />
            </AdminRoute>
          }
        />
        <Route
          path="admin/devices/:id/edit"
          element={
            <AdminRoute>
              <AdminDeviceForm />
            </AdminRoute>
          }
        />
        <Route
          path="admin/categories"
          element={
            <AdminRoute>
              <AdminCategoriesList />
            </AdminRoute>
          }
        />
        <Route
          path="admin/users"
          element={
            <AdminRoute>
              <AdminUsersList />
            </AdminRoute>
          }
        />

        {/* 404 Fallback */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};
