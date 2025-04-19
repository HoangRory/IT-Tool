import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { fetchTools } from '../data/tools';
import { AuthContext } from './AuthContext';

export const ToolsContext = createContext();

export const ToolsProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [tools, setTools] = useState([]);
  const [favoriteToolIds, setFavoriteToolIds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadTools = async () => {
    try {
      setIsLoading(true);
      const fetchedTools = await fetchTools();
      console.log('Tools fetched:', fetchedTools);
      setTools(fetchedTools);
    } catch (err) {
      console.error('Failed to load tools:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadFavorites = async () => {
    if (user) {
      try {
        const response = await axios.get('http://localhost:5074/api/tools/favorites', {
          withCredentials: true,
        });
        console.log('Favorites fetched:', response.data);
        setFavoriteToolIds(response.data.map(tool => tool.id));
      } catch (err) {
        console.error('Failed to load favorites:', err);
      }
    } else {
      setFavoriteToolIds([]); // Clear favorites for anonymous users
    }
  };

  const refreshTools = async () => {
    await Promise.all([loadTools(), loadFavorites()]);
  };

  useEffect(() => {
    refreshTools();
  }, [user]);

  const toggleFavorite = async (toolId, currentIsFavorite) => {
    if (!user) {
      return false; // Indicate failure for anonymous users
    }

    if (!toolId || toolId <= 0) {
      console.error(`Cannot toggle favorite: invalid toolId (${toolId})`);
      return false;
    }

    try {
      console.log(`Toggling favorite for toolId: ${toolId}`);
      const response = await axios.post(
        'http://localhost:5074/api/tools/favorite',
        { toolId },
        { withCredentials: true }
      );
      console.log('Toggle response:', response.data);
      
      // Update favoriteToolIds locally
      setFavoriteToolIds(prev => 
        currentIsFavorite 
          ? prev.filter(id => id !== toolId)
          : [...prev, toolId]
      );
      return true; // Indicate success
    } catch (err) {
      console.error('Failed to toggle favorite:', err.response?.data || err.message);
      return false;
    }
  };

  return (
    <ToolsContext.Provider value={{ tools, favoriteToolIds, toggleFavorite, isLoading, refreshTools }}>
      {children}
    </ToolsContext.Provider>
  );
};