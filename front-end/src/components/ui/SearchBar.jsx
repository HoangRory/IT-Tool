import { Search } from "lucide-react";

export default function SearchBar({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center bg-white w-1/2 p-2 rounded-lg cursor-text"
    >
      <Search className="text-gray-400 w-5 h-5 mr-2" />
      <span className="text-black text-sm opacity-60">Search tools (Ctrl + K)</span>
    </button>
  );
}
