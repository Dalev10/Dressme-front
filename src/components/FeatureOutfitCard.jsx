import { Shirt, Heart } from 'lucide-react';
import { useState } from 'react';
import OutfitDetailModal from './OutfitDetailModal';

/**
 * FeatureCard for outfit display matching the OutfitsPage style.
 * Shows like/dislike buttons and can manage liked state.
 * Props:
 *   outfit          — outfit object with clothingImageUrls, ocasion, clima, dressCode, totalScore
 *   height          — card height (default '380px')
 *   onClick         — optional click handler on the card
 *   onLike          — callback when like button is clicked
 *   onDislike       — callback when dislike button is clicked
 *   isLiked         — whether outfit is currently liked (default true for favorites)
 *   showScore       — show totalScore in the bottom panel (default false)
 *   showLikeButtons — show like/dislike buttons (default true)
 */
const FeatureOutfitCard = ({
  outfit,
  height = '380px',
  onClick,
  onLike,
  onDislike,
  isLiked = true,
  showScore = false,
  showLikeButtons = true,
}) => {
  const [liked, setLiked] = useState(isLiked);
  const [modalOpen, setModalOpen] = useState(false);

  const handleLike = (e) => {
    e.stopPropagation();
    if (!liked) {
      setLiked(true);
      onLike?.(outfit);
    }
  };

  const handleDislike = (e) => {
    e.stopPropagation();
    setLiked(false);
    onDislike?.(outfit.id);
  };

  const handleCardClick = (e) => {
    if (!showLikeButtons) {
      onClick?.(e);
    } else {
      setModalOpen(true);
    }
  };

  return (
    <>
      <OutfitDetailModal
        outfit={outfit}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
      <div
        onClick={handleCardClick}
        className={`rounded-3xl overflow-hidden relative group shadow-[0_12px_40px_rgba(44,42,41,0.08)] hover:shadow-[0_18px_60px_rgba(44,42,41,0.12)] transition-all duration-300 hover:-translate-y-1 cursor-pointer`}
        style={{ height }}
      >
      {Array.isArray(outfit.clothingImageUrls) && outfit.clothingImageUrls.length > 0 ? (
        <div className={`grid h-full ${outfit.clothingImageUrls.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
          {outfit.clothingImageUrls.slice(0, 4).map((url, idx) => (
            <img
              key={idx}
              src={url}
              alt={`Prenda ${idx + 1}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          ))}
        </div>
      ) : (
        <div className="w-full h-full bg-brand-sand/30 flex items-center justify-center">
          <Shirt className="w-12 h-12 text-brand-dark/20" />
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm p-4">
        <p className="text-sm font-semibold text-brand-dark">
          {Array.isArray(outfit.clothingImageUrls) ? `${outfit.clothingImageUrls.length} prendas` : 'Outfit'}
        </p>
        {outfit.ocasion && (
          <p className="text-xs text-brand-dark/60">{outfit.ocasion}{outfit.clima ? ` · ${outfit.clima}` : ''}</p>
        )}
        {showScore && outfit.totalScore != null && (
          <p className="text-xs text-brand-dark/60">Score: {Math.round(outfit.totalScore)}%</p>
        )}
      </div>

      {showLikeButtons && (
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <button
            onClick={handleLike}
            className={`btn-shimmer w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 overflow-hidden relative ${
              liked
                ? 'bg-brand-charcoal text-white'
                : 'bg-white/90 text-brand-dark hover:bg-brand-charcoal hover:text-white'
            }`}
            aria-label="Guardar en favoritos"
          >
            <Heart className="w-4 h-4 relative z-10" fill={liked ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={handleDislike}
            className="btn-shimmer w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 overflow-hidden relative bg-white/90 text-brand-dark hover:bg-red-100 hover:text-red-600"
            aria-label="No me interesa"
          >
            <span className="text-base leading-none">✕</span>
          </button>
        </div>
      )}
      </div>
    </>
  );
};

export default FeatureOutfitCard;
