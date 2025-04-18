import React, { useState, useContext, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const FavoriteButton = ({ toolId, toolPath, isFavorite: initialIsFavorite, toggleFavorite }) => {
  const { user } = useContext(AuthContext);
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite || false);
  const [showPopup, setShowPopup] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState(null);
  const navigate = useNavigate();

  // Normalize toolPath
  const normalizedToolPath = toolPath.startsWith('/') ? toolPath : `/${toolPath}`;

  // Sync isFavorite with initialIsFavorite when it changes
  useEffect(() => {
    setIsFavorite(initialIsFavorite || false);
  }, [initialIsFavorite]);

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

    const success = await toggleFavorite(toolId, isFavorite);
    if (success) {
      setIsFavorite(!isFavorite);
    }
  };

  const popupMessage = user
    ? isFavorite
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
          isFavorite ? 'text-red-500' : 'text-gray-400'
        } hover:bg-gray-700 transition-colors`}
        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        <Heart className={isFavorite ? 'fill-red-500' : ''} />
      </button>
      {showPopup && (
        <div className="absolute top-full mt-2 bg-gray-800 text-white p-2 rounded shadow-lg text-sm z-10">
          {popupMessage}
          {!user && (
            <>
              {' '}
              <button
                onClick={() => navigate('/login')}
                className="text-blue-400 hover:underline"
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