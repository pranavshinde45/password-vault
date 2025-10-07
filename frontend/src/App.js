import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext'; // ✅ New context
import Login from './pages/Login';
import Signup from './pages/Signup';
import Vault from './pages/Vault';

function AppContent() { // ✅ Inner component for context access
  const { token } = useAuth(); // ✅ Global token
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen">
      <header className="p-4 bg-white dark:bg-gray-800 shadow">
        <div className="flex justify-between items-center max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold">Secure Vault</h1>
          {token && (
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded"
            >
              {darkMode ? '☀️ Light' : '🌙 Dark'}
            </button>
          )}
        </div>
      </header>
      <Routes>
        <Route path="/" element={token ? <Navigate to="/vault" /> : <Login />} />
        <Route path="/login" element={token ? <Navigate to="/vault" /> : <Login />} />
        <Route path="/signup" element={token ? <Navigate to="/vault" /> : <Signup />} />
        <Route path="/vault" element={token ? <Vault /> : <Navigate to="/" />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider> {/* ✅ Wraps entire app—global state */}
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;