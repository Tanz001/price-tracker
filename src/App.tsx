/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './hooks/useTheme';
import { ToastProvider } from './context/ToastContext';
import { useLenis } from './hooks/useLenis';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { LandingPage } from './pages/LandingPage';
import { ResultsPage } from './pages/ResultsPage';
import { DashboardPage } from './pages/DashboardPage';
import { UnsubscribePage } from './pages/UnsubscribePage';
import { NotFoundPage } from './pages/NotFoundPage';

function AppContent() {
  // Initialize Lenis smooth scroll synced with GSAP ScrollTrigger
  useLenis();
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC] dark:bg-[#0B1020] text-[#0F172A] dark:text-[#F1F5F9] transition-colors duration-200">
      <Navbar />

      <main key={location.pathname} className="flex-1 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/unsubscribe" element={<UnsubscribePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </ToastProvider>
    </ThemeProvider>
  );
}
