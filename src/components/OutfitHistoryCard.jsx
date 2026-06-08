import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { useState } from 'react';
import OutfitDetailModal from './OutfitDetailModal';

const OutfitHistoryCard = ({ outfit, onLike, onDislike, isLiked = false }) => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <OutfitDetailModal
        outfit={outfit}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
      <div
        onClick={() => setModalOpen(true)}
        className="group relative rounded-3xl overflow-hidden shadow-[0_12px_40px_rgba(44,42,41,0.08)] hover:shadow-[0_18px_60px_rgba(44,42,41,0.12)] transition-all duration-300 hover:-translate-y-1 flex flex-col border-4 border-gray-300/60 cursor-pointer"
        style={{ height: '380px' }}
      >
      <div className="relative flex-1 overflow-hidden">
      {Array.isArray(outfit.clothingImageUrls) && outfit.clothingImageUrls.length > 0 ? (
        <div className={`grid h-full ${outfit.clothingImageUrls.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
          {outfit.clothingImageUrls.slice(0, 4).map((url, idx) => (
            <img
              key={idx}
              src={url}
              alt={`Prenda ${idx + 1}`}
              className="w-full h-full object-cover"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          ))}
        </div>
      ) : (
        <div className="w-full h-full bg-brand-sand/30 flex items-center justify-center">
          <p className="text-xs text-brand-dark/40">No se pudieron cargar las imágenes</p>
        </div>
      )}

      <div className="absolute top-3 right-3 flex flex-col gap-2">
        <button
          onClick={(e) => { e.stopPropagation(); onLike(outfit); }}
          className={`btn-shimmer w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 overflow-hidden relative ${
            isLiked
              ? 'bg-brand-charcoal text-white'
              : 'bg-white/90 text-brand-dark hover:bg-brand-charcoal hover:text-white'
          }`}
        >
          <ThumbsUp className="w-4 h-4 relative z-10" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDislike(outfit.id); }}
          className="btn-shimmer w-9 h-9 rounded-full flex items-center justify-center bg-white/90 text-brand-dark hover:bg-brand-sand transition-all duration-200 overflow-hidden relative"
        >
          <ThumbsDown className="w-4 h-4 relative z-10" />
        </button>
      </div>
      </div>

      <div className="p-4 bg-white/50 backdrop-blur-sm">
      <p className="text-sm font-semibold text-brand-dark mb-1">
        {Array.isArray(outfit.clothingImageUrls) ? `${outfit.clothingImageUrls.length} prendas` : 'Outfit'}
      </p>
      {outfit.totalScore != null && (
        <p className="text-xs text-brand-dark/60">Score: {Math.round(outfit.totalScore)}%</p>
      )}
      </div>
      </div>
    </>
  );
};

export default OutfitHistoryCard;
