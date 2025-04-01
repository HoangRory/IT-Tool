import SearchBar from "../components/ui/SearchBar";
import ThemeToggle from "../components/ui/ThemeToggle";
import { Link } from "react-router-dom"; // Import Link from react-router-dom

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between bg-gray-800 text-white p-4">
      <SearchBar />
      <div className="flex items-center gap-4">
        {/* Add Tool Button */}
        <Link to="/add-tool">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors">
            Add Tool
          </button>
        </Link>
        <ThemeToggle />
      </div>
    </nav>
  );
}