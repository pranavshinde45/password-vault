import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [password, setPassword] = useState(''); // In-memory for encryption

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  const login = async (email, pass) => {
    try {
      const res = await axios.post('/api/login', { email, password: pass });
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setPassword(pass); // Sync after token
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Login failed' };
    }
  };

  const signup = async (email, pass) => {
    try {
      const res = await axios.post('/api/signup', { email, password: pass });
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setPassword(pass);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Signup failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setPassword('');
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ token, password, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};