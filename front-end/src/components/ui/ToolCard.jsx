import { Shuffle } from 'lucide-react';
import { Link } from 'react-router-dom';
import FavoriteButton from './FavoriteButton';
import { useContext } from 'react';
import { ToolsContext } from '../../context/ToolsContext';

export default function ToolCard({ icon, title, description, path, id, isFavorite }) {
  const { toggleFavorite } = useContext(ToolsContext);

  return (
    <div className="relative bg-green-100 text-white p-4 rounded-xl shadow-lg flex flex-col gap-2 border-2 border-transparent hover:border-green-500 transition duration-200">
      <Link to={path} className="flex flex-col gap-2">
        <div className="text-green-500 text-2xl">{icon || <Shuffle />}</div>
        <h3 className="text-lg text-slate-800 font-bold">{title}</h3>
        <p className="text-sm text-slate-800 opacity-80">{description}</p>
      </Link>
      <div className="absolute top-2 right-2">
        <FavoriteButton
          toolId={id}
          toolPath={path}
          isFavorite={isFavorite}
          toggleFavorite={toggleFavorite}
        />
      </div>
    </div>
  );
}