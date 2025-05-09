import React, { useState, useContext } from 'react';
import { Heart } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const FavoriteButton = ({ toolId, toolPath, isFavorite: initialIsFavorite, toggleFavorite }) => {
  const { user } = useContext(AuthContext);
  const [showPopup, setShowPopup] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState(null);
  const navigate = useNavigate();

  // Normalize toolPath
  const normalizedToolPath = toolPath.startsWith('/') ? toolPath : `/${toolPath}`;

  const handleMouseEnter = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
    }
    const timeout = setTimeout(() => {
      setShowPopup(true);
    }, 200);
    setHoverTimeout(timeout);
  };

  const handleMouseLeave = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    setShowPopup(false);
  };

  const handleFavoriteToggle = async () => {
    if (!user) {
      setShowPopup(true);
      return;
    }

    if (!toolId || toolId <= 0) {
      console.error(`Cannot toggle favorite: invalid toolId (${toolId}) for toolPath: ${normalizedToolPath}`);
      return;
    }

    await toggleFavorite(toolId, initialIsFavorite);
  };

  const popupMessage = user
    ? initialIsFavorite
      ? 'Remove from favorites'
      : 'Favorite this tool'
    : 'Please log in to favorite this tool';

  return (
    <div className="relative">
      <button
        onClick={handleFavoriteToggle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`p-2 rounded-full ${
          initialIsFavorite ? 'text-red-500' : 'text-green-400 hover:text-green-100'
        } hover:bg-green-400 transition-colors`}
        aria-label={initialIsFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        <Heart className={initialIsFavorite ? 'fill-red-500' : ''} />
      </button>
      {showPopup && (
        <div className="absolute top-full w-28 mt-2 bg-white text-gray-600 p-2 rounded-lg shadow-lg text-sm z-10">
          {popupMessage}
          {!user && (
            <>
              {' '}
              <button
                onClick={() => navigate('/login')}
                className="text-green-400 hover:text-green-600 font-semibold"
              >
                log in
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default FavoriteButton;