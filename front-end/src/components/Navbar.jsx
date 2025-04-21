import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import SearchBar from '../components/ui/SearchBar';
import ThemeToggle from '../components/ui/ThemeToggle';
import LogOut from '../components/ui/LogOut';
import SearchModal from '../components/SearchModal';
import UpgradeRequestModal from '../components/UpgradeRequestModal';
import { AuthContext } from '../context/AuthContext';
import { ToolsContext } from '../context/ToolsContext';

export default function Navbar() {
  const { user } = useContext(AuthContext);
  const [openSearch, setOpenSearch] = useState(false);
  const [openUpgradeModal, setOpenUpgradeModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { tools } = useContext(ToolsContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = () => {
    navigate('/login', { state: { from: location } });
  };

  const allTools = tools.flatMap((category) => category.items);

  const filtered = allTools.filter((tool) =>
    tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpenSearch(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
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
          {user && user.isPremium ? (
            <button
              className="bg-purple-500 text-white font-semibold py-2 px-4 rounded-md cursor-default"
              disabled
            >
              Premium User
            </button>
          ) : (
            user && (
              <button
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md transition-colors"
                onClick={() => setOpenUpgradeModal(true)}
              >
                Upgrade Account
              </button>
            )
          )}
          <ThemeToggle />
          {user ? (
            <LogOut />
          ) : (
            <button
              onClick={handleLogin}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition-colors"
            >
              Login
            </button>
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
      <UpgradeRequestModal
        isOpen={openUpgradeModal}
        onClose={() => setOpenUpgradeModal(false)}
      />
    </>
  );
}