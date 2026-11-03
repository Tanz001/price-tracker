/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Navigate, Routes, Route, useLocation, useParams } from 'react-router-dom';
import { ThemeProvider } from './hooks/useTheme';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { useLenis } from './hooks/useLenis';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { RequireAuth } from './components/auth/RequireAuth';
import { DashboardLayout } from './layouts/DashboardLayout';
import { LandingPage } from './pages/LandingPage';
import { ResultsPage } from './pages/ResultsPage';
import { UnsubscribePage } from './pages/UnsubscribePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AddProductPage } from './pages/AddProductPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { AdminPage } from './pages/AdminPage';
import { OverviewPage } from './pages/dashboard/OverviewPage';
import { ProductsPage } from './pages/dashboard/ProductsPage';
import { usePresentationSync } from './hooks/usePresentationSync';
import { PresentationBanner } from './components/presentation/PresentationBanner';

function LegacyProductRedirect() {
  const { trackerId } = useParams();
  return <Navigate to={`/dashboard/product/${trackerId}`} replace />;
}

function AppContent() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const isDashboard = location.pathname.startsWith('/dashboard');
  const presentation = usePresentationSync();
  // Disable Lenis while presenting so remote scroll isn't fought by smooth scroll
  useLenis(!isDashboard && !presentation.enabled);

  return (
    <div
      className={`flex flex-col min-h-screen text-[#0F172A] dark:text-[#F1F5F9] transition-colors duration-200 ${
        isDashboard ? 'bg-[#F4F6FB] dark:bg-[#070B16]' : 'bg-[#F8FAFC] dark:bg-[#0B1020]'
      }`}
    >
      {!isDashboard && <Navbar />}
      <PresentationBanner state={presentation} />

      <main
        key={isDashboard ? 'dash' : location.pathname}
        className={`flex-1 ${isDashboard ? '' : 'animate-in fade-in slide-in-from-bottom-2 duration-300'}`}
      >
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/unsubscribe" element={<UnsubscribePage />} />

          {/* Legacy redirects into dashboard shell */}
          <Route path="/add-product" element={<Navigate to="/dashboard/add" replace />} />
          <Route path="/notifications" element={<Navigate to="/dashboard/alerts" replace />} />
          <Route path="/admin" element={<Navigate to="/dashboard/admin" replace />} />
          <Route path="/product/:trackerId" element={<LegacyProductRedirect />} />

          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <DashboardLayout />
              </RequireAuth>
            }
          >
            <Route index element={<OverviewPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="add" element={<AddProductPage />} />
            <Route path="product/:trackerId" element={<ProductDetailPage />} />
            <Route path="alerts" element={<NotificationsPage />} />
            <Route
              path="admin"
              element={
                <RequireAuth adminOnly>
                  <AdminPage />
                </RequireAuth>
              }
            />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {!isAuthPage && !isDashboard && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
