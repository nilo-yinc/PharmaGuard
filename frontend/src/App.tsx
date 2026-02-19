import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingScreen from './pages/LoadingScreen';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserDashboard from './pages/UserDashboard';
import AnalyzePage from './pages/AnalyzePage';
import ReportPage from './pages/ReportPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  const [showLoading, setShowLoading] = useState(() => {
    // Only show loading once per session
    const hasLoaded = sessionStorage.getItem('pg_loaded');
    return !hasLoaded;
  });

  const handleLoadingComplete = () => {
    sessionStorage.setItem('pg_loaded', 'true');
    setShowLoading(false);
  };

  return (
    <ThemeProvider>
      <AuthProvider>
        {/* Loading Screen — only once per session */}
        <AnimatePresence>
          {showLoading && (
            <LoadingScreen onComplete={handleLoadingComplete} />
          )}
        </AnimatePresence>

        {!showLoading && (
          <Routes>
            <Route element={<MainLayout />}>
              {/* Public routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Routes (auth disabled for dev) */}
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/analyze" element={<AnalyzePage />} />
              <Route path="/report/:id" element={<ReportPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
          </Routes>
        )}
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
