import React, { useContext } from 'react';
import SearchBar from '../components/ui/SearchBar';
import ThemeToggle from '../components/ui/ThemeToggle';
import LogOut from '../components/ui/LogOut';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { user } = useContext(AuthContext);

  return (
    <nav className="flex items-center justify-between bg-gray-800 text-white p-4">
      <SearchBar />
      <div className="flex items-center gap-4">
        <Link to="/add-tool">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors">
            Add Tool
          </button>
        </Link>
        <ThemeToggle />
        {user ? (
          <LogOut />
        ) : (
          <Link to="/login">
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition-colors">
              Login
            </button>
          </Link>
        )}
      </div>
    </nav>
  );
}