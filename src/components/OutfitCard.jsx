import { Shirt } from 'lucide-react';

/**
 * Reusable outfit card matching the OutfitsPage style.
 * Props:
 *   outfit          — outfit object with clothingImageUrls, ocasion, clima, dressCode, totalScore
 *   height          — card height (default '380px')
 *   onClick         — optional click handler on the card
 *   topAction       — optional JSX rendered in the top-right corner (like/dislike buttons, heart, etc.)
 *   showScore       — show totalScore in the bottom panel (default false)
 */
const OutfitCard = ({ outfit, height = '380px', onClick, topAction, showScore = false }) => {
  return (
    <div
      onClick={onClick}
      className={`rounded-3xl overflow-hidden relative group shadow-[0_12px_40px_rgba(44,42,41,0.08)] hover:shadow-[0_18px_60px_rgba(44,42,41,0.12)] transition-all duration-300 hover:-translate-y-1${onClick ? ' cursor-pointer' : ''}`}
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

      {topAction && (
        <div className="absolute top-3 right-3 z-10">
          {topAction}
        </div>
      )}
    </div>
  );
};

export default OutfitCard;
