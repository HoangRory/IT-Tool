import { useState } from "react";

export default function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(true);

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="p-2 bg-gray-600 rounded-lg"
    >
      {darkMode ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
}
