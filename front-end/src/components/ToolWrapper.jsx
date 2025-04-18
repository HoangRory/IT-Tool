import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FavoriteButton from './ui/FavoriteButton';

const ToolWrapper = ({ toolPath, children }) => {
  const [tool, setTool] = useState(null);

  useEffect(() => {
    const fetchTool = async () => {
      try {
        const response = await axios.get(`http://localhost:5074/api/tools/${toolPath}`, {
          withCredentials: true,
        });
        setTool(response.data);
      } catch (err) {
        console.error('Failed to load tool:', err);
      }
    };
    fetchTool();
  }, [toolPath]);

  if (!tool) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{tool.name}</h2>
        <FavoriteButton toolId={tool.id} toolPath={toolPath} />
      </div>
      {children}
    </div>
  );
};

export default ToolWrapper;