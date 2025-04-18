import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('http://localhost:5074/api/account/check', {
          withCredentials: true,
        });
        console.log(response.data.role);
        setUser({ username: response.data.username, role: response.data.role });
      } catch (error) {
        setUser(null);
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
      const userData = { username: response.data.username, role: response.data.role };
      setUser(userData);
      // Navigate based on role
      console.log("Role:", userData.role);
      const targetPath = userData.role === 'admin' ? '/admin' : '/';
      console.log("Navigating to:", targetPath);
      navigate(targetPath);
      return { success: true, message: response.data.message };
    } catch (error) {
      setUser(null);
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const logout = async () => {
    try {
      await axios.post('http://localhost:5074/api/account/logout', {}, { withCredentials: true });
      setUser(null);
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