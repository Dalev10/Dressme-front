import { Heart, ThumbsDown } from 'lucide-react';
import { useState } from 'react';

const StyleCard = ({ card, onReaction }) => {
  const [reaction, setReaction] = useState(null);
  const [isExiting, setIsExiting] = useState(false);

  const handleLike = () => {
    setReaction('like');
    setIsExiting(true);
    setTimeout(() => {
      onReaction(card.id, 'like');
    }, 300);
  };

  const handleDislike = () => {
    setReaction('dislike');
    setIsExiting(true);
    setTimeout(() => {
      onReaction(card.id, 'dislike');
    }, 300);
  };

  return (
    <div
      className={`flex flex-col gap-3 transition-all duration-300 ${
        isExiting ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
      }`}
    >
      {/* Imagen */}
      <div className="relative overflow-hidden rounded-2xl bg-gray-200 aspect-[3/4]">
        <img
          src={card.imageUrl}
          alt={card.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Nombre y Descripción */}
      <div className="px-2">
        <h3 className="font-sans font-semibold text-sm text-brand-dark">
          {card.name}
        </h3>
        <p className="text-xs text-brand-dark/60 line-clamp-2">
          {card.semanticDescription}
        </p>
      </div>

      {/* Botones Like/Dislike */}
      <div className="flex gap-2 px-2 pb-2">
        {/* Like Button */}
        <button
          onClick={handleLike}
          disabled={isExiting}
          className={`flex-1 flex items-center justify-center py-2 rounded-full transition-all ${
            reaction === 'like'
              ? 'bg-red-100 shadow-md'
              : 'bg-gray-100 hover:bg-red-50'
          } ${isExiting ? 'opacity-50' : ''}`}
          title="Me gusta"
        >
          <Heart
            size={18}
            className={`transition-all ${
              reaction === 'like'
                ? 'fill-red-500 text-red-500 scale-110'
                : 'text-brand-dark/40'
            }`}
          />
        </button>

        {/* Dislike Button */}
        <button
          onClick={handleDislike}
          disabled={isExiting}
          className={`flex-1 flex items-center justify-center py-2 rounded-full transition-all ${
            reaction === 'dislike'
              ? 'bg-gray-300 shadow-md'
              : 'bg-gray-100 hover:bg-gray-200'
          } ${isExiting ? 'opacity-50' : ''}`}
          title="No me gusta"
        >
          <ThumbsDown
            size={18}
            className={`transition-all ${
              reaction === 'dislike'
                ? 'text-brand-dark scale-110'
                : 'text-brand-dark/40'
            }`}
          />
        </button>
      </div>
    </div>
  );
};

export default StyleCard;
