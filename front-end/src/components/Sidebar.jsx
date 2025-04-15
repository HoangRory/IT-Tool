import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";
import { tools,ToolFetcher } from "../data/tools"; // Import từ file tools.js

export default function Sidebar() {
  const [openSections, setOpenSections] = useState({});
  const location = useLocation();

  const toggleSection = (category) => {
    setOpenSections((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  return (
    <aside className="w-64 bg-gray-900 text-white p-4">
      <Link to="/">
        <h2 className="text-xl font-bold cursor-pointer hover:text-gray-300">
          IT - TOOLS
        </h2>
        <ToolFetcher />
      </Link>
      <nav>
        <ul className="mt-4 space-y-2">
          {tools.map(({ category, icon, items }) => (
            <li key={category}>
              {/* Tiêu đề danh mục */}
              <button
                className="flex items-center justify-between w-full p-2 hover:bg-gray-700 rounded"
                onClick={() => toggleSection(category)}
              >
                <div className="flex items-center gap-2">
                  {icon}
                  <span>{category}</span>
                </div>
                {openSections[category] ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
              </button>

              {/* Danh sách tool trong danh mục */}
              {openSections[category] && (
                <ul className="pl-6 mt-1 space-y-1">
                  {items.map(({ name, path, icon }) => (
                    <li key={name}>
                      <Link
                        to={path}
                        className={`flex items-center gap-2 block p-2 rounded ${
                          location.pathname === path ? "bg-blue-500" : "hover:bg-gray-700"
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
          ))}
        </ul>
      </nav>
    </aside>
  );
}
// Để hiển thị danh sách tool, chúng ta sẽ sử dụng một danh sách tools được import từ file tools.js.