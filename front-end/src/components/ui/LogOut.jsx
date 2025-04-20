import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';

const LogOut = () => {
  const { logout } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true); // Start loading animation
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error); // Log error for debugging
    } finally {
      setIsLoading(false); // Revert to "Log Out" button, whether success or failure
    }
  };

  return (
    <button
      onClick={handleLogout}
      className={`bg-red-600 text-white font-semibold py-2 px-4 rounded-md flex items-center justify-center transition-colors ${
        isLoading ? 'opacity-75 cursor-not-allowed' : 'hover:bg-red-700'
      }`}
      aria-label="Log out of your account"
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="animate-spin mr-2" size={20} />
          Logging out...
        </>
      ) : (
        'Log Out'
      )}
    </button>
  );
};

export default LogOut;