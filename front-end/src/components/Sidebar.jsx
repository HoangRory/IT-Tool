import { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, ChevronRight, Heart, Users, Plus, Wrench, UserCheck } from "lucide-react";
import { ToolsContext } from "../context/ToolsContext";
import { AuthContext } from "../context/AuthContext";

export default function Sidebar() {
  const { tools, favoriteToolIds, isLoading } = useContext(ToolsContext);
  const { user } = useContext(AuthContext);
  const [openSections, setOpenSections] = useState({});
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith('/admin');
  const isAdminUser = user && user.role === 'admin';

  const toggleSection = (category) => {
    setOpenSections((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  // Create favorite tools category
  const favoriteTools = tools
    .flatMap(category => category.items)
    .filter(tool => favoriteToolIds.includes(tool.id))
    .map(({ name, path, icon }) => ({ name, path, icon }));

  const favoriteCategory = user && favoriteTools.length > 0 ? [{
    category: "Your Favorite Tools",
    icon: <Heart size={18} />,
    items: favoriteTools
  }] : [];

  // Combine favorite category with regular categories for non-admin routes
  const allCategories = [...favoriteCategory, ...tools];

  if (isLoading) {
    return (
      <aside className="w-64 fixed top-0 left-0 h-screen bg-green-700 text-white p-4 overflow-y-auto z-50">
        <Link to="/">
          <h2 className="text-xl font-bold cursor-pointer hover:text-gray-300">
            IT - TOOLS
          </h2>
        </Link>
        <div className="mt-4">Loading tools...</div>
      </aside>
    );
  }

  return (
    <aside className="w-64 fixed top-0 left-0 h-screen bg-green-700 text-white p-4 overflow-y-auto z-50">
      <Link to="/">
        <h2 className="text-xl font-bold cursor-pointer hover:text-gray-300">
          IT - TOOLS
        </h2>
      </Link>
      <nav>
        <ul className="mt-4 space-y-2">
          {isAdminRoute && isAdminUser ? (
            <>
              <li>
                <Link
                  to="/admin"
                  className={`flex items-center gap-2 block p-2 rounded ${
                    location.pathname === '/admin' ? "bg-blue-500" : "hover:bg-green-600"
                  }`}
                >
                  <Users size={18} />
                  <span>User Management</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/tool-management"
                  className={`flex items-center gap-2 block p-2 rounded ${
                    location.pathname === '/admin/tool-management' ? "bg-blue-500" : "hover:bg-green-600"
                  }`}
                >
                  <Wrench size={18} />
                  <span>Tool Management</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/upgrade-request"
                  className={`flex items-center gap-2 block p-2 rounded ${
                    location.pathname === '/admin/upgrade-requests' ? "bg-blue-500" : "hover:bg-green-600"
                  }`}
                >
                  <UserCheck size={18} />
                  <span>Upgrade Requests</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/add-tool"
                  className={`flex items-center gap-2 block p-2 rounded ${
                    location.pathname === '/admin/add-tool' ? "bg-blue-500" : "hover:bg-green-600"
                  }`}
                >
                  <Plus size={18} />
                  <span>Add Tool</span>
                </Link>
              </li>
            </>
          ) : (
            allCategories.map(({ category, icon, items }) => (
              <li key={category}>
                {/* Category header */}
                <button
                  className="flex items-center justify-between w-full p-2 hover:bg-green-600 rounded"
                  onClick={() => toggleSection(category)}
                >
                  <div className="flex items-center gap-2">
                    {icon}
                    <span>{category}</span>
                  </div>
                  {openSections[category] ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                </button>

                {/* Tool list in category */}
                {openSections[category] && (
                  <ul className="pl-6 mt-1 space-y-1">
                    {items.map(({ name, path, icon }) => (
                      <li key={name}>
                        <Link
                          to={path}
                          className={`flex items-center gap-2 block p-2 rounded ${
                            location.pathname === path ? "bg-blue-500" : "hover:bg-green-600"
                          }`}
                        >
                          {icon}
                          <span>{name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))
          )}
        </ul>
      </nav>
    </aside>
  );
}