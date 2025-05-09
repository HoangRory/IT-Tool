import { Shuffle } from 'lucide-react';
import { Link } from 'react-router-dom';
import FavoriteButton from './FavoriteButton';
import { useContext } from 'react';
import { ToolsContext } from '../../context/ToolsContext';
import { useState } from 'react';
import PremiumRequiredModal from './../PremiumRequiredModal';
import { AuthContext } from '../../context/AuthContext';

export default function ToolCard({ icon, title, description, path, id, isFavorite, isPremium = false }) {
  const { toggleFavorite } = useContext(ToolsContext);
  const { user } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const handleClick = (e) => {
    if (isPremium && !user?.isPremium) {
      e.preventDefault(); // ngăn chuyển trang
      setShowModal(true); // mở modal
    }
  };

  return (
    <div className="relative bg-green-100 text-white p-4 rounded-xl shadow-lg flex flex-col gap-2 border-2 border-transparent hover:border-green-500 transition duration-200">
      {isPremium && (
        <img
          src="/images/premium.png"
          alt="Premium"
          className="absolute top-3 left-10 w-6 h-6"
        />
      )}
      <Link to={path} onClick={handleClick} className="flex flex-col gap-2">
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
      {showModal && <PremiumRequiredModal onClose={() => setShowModal(false)} />}
    </div>
  );
}