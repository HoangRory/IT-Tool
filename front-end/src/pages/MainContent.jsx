import ToolCard from "../components/ui/ToolCard";
import { tools } from "../data/tools"; // Import danh sách tool

export default function Home() {
  return (
    <div className="flex-1 bg-gray-100 p-4 overflow-auto">
      <div className="grid grid-cols-3 gap-4">
        {tools.flatMap((category) =>
          category.items.map(({ name, icon, description, path }) => (
            <ToolCard key={name} icon={icon} title={name} description={description} path={path}/>
          ))
        )}
      </div>
    </div>
  );
}

// Để hiển thị danh sách tool, chúng ta sẽ sử dụng một danh sách tools được import từ file tools.js.
