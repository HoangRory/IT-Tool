import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

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
        // Fetch current user data from the server
        const response = await axios.get('http://localhost:5074/api/account/check', {
          withCredentials: true,
        });

        // Fetch upgrade request status
        let statusResponse;
        try {
          statusResponse = await axios.get('http://localhost:5074/api/request/upgrade-requests/status', {
            withCredentials: true,
          });
        } catch (statusError) {
          // If status request fails, assume no pending request
          statusResponse = { data: { status: null } };
        }

        const userData = {
          username: response.data.username,
          role: response.data.role,
          isPremium: response.data.role === 'premium' || response.data.role === 'admin',
          requestStatus: statusResponse.data.status,
        };

        // Update client-side state with server data
        saveUser(userData);
      } catch (error) {
        // If the check fails (e.g., invalid cookie), clear user state
        console.error('Auth check failed:', error);
        saveUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (username, password, from = null) => {
    try {
      const response = await axios.post(
        'http://localhost:5074/api/account/login',
        { username, password },
        { withCredentials: true }
      );

      let statusResponse;
      try {
        statusResponse = await axios.get('http://localhost:5074/api/request/upgrade-requests/status', {
          withCredentials: true,
        });
      } catch (statusError) {
        statusResponse = { data: { status: null } };
      }

      const userData = {
        username: response.data.username,
        role: response.data.role,
        isPremium: response.data.role === 'premium' || response.data.role === 'admin',
        requestStatus: statusResponse.data.status,
      };
      saveUser(userData);

      const targetPath = from?.pathname || (userData.role === 'admin' ? '/admin' : '/');
      navigate(targetPath, { replace: true });

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
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Logout failed:', error);
      saveUser(null);
      navigate('/', { replace: true });
    }
  };

  const updateRequestStatus = (status) => {
    if (user) {
      const updatedUser = { ...user, requestStatus: status };
      saveUser(updatedUser);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, updateRequestStatus }}>
      {children}
    </AuthContext.Provider>
  );
};