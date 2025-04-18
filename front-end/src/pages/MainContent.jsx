import ToolCard from "../components/ui/ToolCard";
import { useContext } from "react";
import { ToolsContext } from "../context/ToolsContext";
import { AuthContext } from "../context/AuthContext";

export default function Home() {
  const { user } = useContext(AuthContext);
  const { tools, favoriteToolIds, isLoading } = useContext(ToolsContext);

  // Filter favorite tools
  const favoriteTools = tools
    .flatMap(category => category.items)
    .filter(tool => favoriteToolIds.includes(tool.id));

  if (isLoading) {
    return (
      <div className="flex-1 bg-gray-100 p-4 overflow-auto">
        <p className="text-gray-600">Loading tools...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-100 p-4 overflow-auto">
      {/* Your Favorite Tools Section */}
      {user && favoriteTools.length > 0 && (
        <>
          <h2 className="text-2xl font-bold mb-4">Your Favorite Tools</h2>
          <div className="grid grid-cols-3 gap-4 mb-8">
            {favoriteTools.map(({ id, name, icon, description, path }) => (
              <ToolCard
                key={id}
                id={id}
                icon={icon}
                title={name}
                description={description}
                path={path}
                isFavorite={true}
              />
            ))}
          </div>
        </>
      )}

      {/* All Tools Section */}
      <h2 className="text-2xl font-bold mb-4">All Tools</h2>
      <div className="grid grid-cols-3 gap-4">
        {tools.flatMap((category) =>
          category.items.map(({ id, name, icon, description, path }) => (
            <ToolCard
              key={id}
              id={id}
              icon={icon}
              title={name}
              description={description}
              path={path}
              isFavorite={favoriteToolIds.includes(id)}
            />
          ))
        )}
      </div>
    </div>
  );
}