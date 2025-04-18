import React, { useContext } from 'react';
import SearchBar from '../components/ui/SearchBar';
import ThemeToggle from '../components/ui/ThemeToggle';
import LogOut from '../components/ui/LogOut';
import SearchModal from '../components/SearchModal';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { ToolsContext } from "../context/ToolsContext";

export default function Navbar() {
  const { user } = useContext(AuthContext);
  const [openSearch, setOpenSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { tools } = useContext(ToolsContext);

  const allTools = tools.flatMap((category) => category.items);

  const filtered = allTools.filter((tool) =>
    tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault(); // Prevent browser search
        setOpenSearch(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <nav className="flex items-center justify-between text-white p-4">
        <SearchBar onClick={() => setOpenSearch(true)} />
        <div className="flex items-center gap-4">
          {user && user.role === 'admin' && (
            <Link to="/admin">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors">
                Admin
              </button>
            </Link>
          )}
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
      <SearchModal
        isOpen={openSearch}
        onClose={() => setOpenSearch(false)}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        results={filtered}
      />
    </>
  );
}