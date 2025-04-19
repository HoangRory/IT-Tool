import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  // Load user từ localStorage nếu có
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  const saveUser = (data) => {
    if (data) {
      localStorage.setItem('user', JSON.stringify(data));
    } else {
      localStorage.removeItem('user');
    }
    setUser(data);
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('http://localhost:5074/api/account/check', {
          withCredentials: true,
        });

        const userData = {
          username: response.data.username,
          role: response.data.role,
          isPremium: response.data.role === 'premium' || response.data.role === 'admin',
        };
        saveUser(userData);
      } catch (error) {
        saveUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (username, password) => {
    try {
      const response = await axios.post(
        'http://localhost:5074/api/account/login',
        { username, password },
        { withCredentials: true }
      );

      const userData = {
        username: response.data.username,
        role: response.data.role,
        isPremium: response.data.role === 'premium' || response.data.role === 'admin',
      };
      saveUser(userData);

      const targetPath = userData.role === 'admin' ? '/admin' : '/';
      console.log('Navigating to:', targetPath);
      navigate(targetPath);

      return { success: true, message: response.data.message };
    } catch (error) {
      saveUser(null);
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const logout = async () => {
    try {
      await axios.post('http://localhost:5074/api/account/logout', {}, { withCredentials: true });
      saveUser(null);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
