import SearchBar from "../components/ui/SearchBar";
import ThemeToggle from "../components/ui/ThemeToggle";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between bg-gray-800 text-white p-4">
      <SearchBar />
      <ThemeToggle />
    </nav>
  );
}
