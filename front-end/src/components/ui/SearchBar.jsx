import { Search } from "lucide-react";

export default function SearchBar({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center bg-gray-700 w-1/2 text-white p-2 rounded-lg cursor-text"
    >
      <Search className="text-gray-400 w-5 h-5 mr-2" />
      <span className="text-white text-sm opacity-60">Search tools (Ctrl + K)</span>
    </button>
  );
}
