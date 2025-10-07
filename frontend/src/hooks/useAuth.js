import { useState, useEffect } from 'react';
import axios from 'axios';

export const useAuth = () => {
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

  return { token, password, login, signup, logout };
};