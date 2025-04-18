import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const LogOut = () => {
  const { logout } = useContext(AuthContext);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md transition-colors"
      aria-label="Log out of your account"
    >
      Log Out
    </button>
  );
};

export default LogOut;