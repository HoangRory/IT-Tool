import { Shuffle } from "lucide-react";
import { Link } from "react-router-dom";

export default function ToolCard({ icon, title, description, path }) {
  return (
    <Link
      to={path}
      className="bg-gray-800 text-white p-4 rounded-xl shadow-lg flex flex-col gap-2 border-2 border-transparent hover:border-green-500 transition duration-200 cursor-pointer"
    >
      {/* Hiển thị icon */}
      <div className="text-gray-300 text-2xl">{icon || <Shuffle />}</div>

      {/* Hiển thị tiêu đề */}
      <h3 className="text-lg font-bold">{title}</h3>

      {/* Hiển thị mô tả */}
      <p className="text-sm opacity-80">{description}</p>
    </Link>
  );
}
