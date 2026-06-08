import { X } from 'lucide-react';

const OutfitDetailModal = ({ outfit, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div
        className="relative bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="sticky top-4 right-4 absolute z-10 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-md"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5 text-brand-dark" />
        </button>

        {/* Content */}
        <div className="p-6 md:p-8">
          {/* Title */}
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-brand-dark mb-2">
            {Array.isArray(outfit.clothingImageUrls) ? `${outfit.clothingImageUrls.length} Prendas` : 'Outfit'}
          </h2>

          {/* Info */}
          {(outfit.ocasion || outfit.clima || outfit.dressCode) && (
            <div className="flex flex-wrap gap-4 mb-8 text-sm text-brand-dark/60">
              {outfit.ocasion && <span>📍 {outfit.ocasion}</span>}
              {outfit.clima && <span>☁️ {outfit.clima}</span>}
              {outfit.dressCode && <span>👔 {outfit.dressCode}</span>}
            </div>
          )}

          {/* Images Grid */}
          {Array.isArray(outfit.clothingImageUrls) && outfit.clothingImageUrls.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {outfit.clothingImageUrls.map((url, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl overflow-hidden aspect-square shadow-md hover:shadow-lg transition-shadow"
                >
                  <img
                    src={url}
                    alt={`Prenda ${idx + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '';
                      e.currentTarget.parentElement.innerHTML = '<div class="w-full h-full bg-brand-sand/30 flex items-center justify-center"><p class="text-xs text-brand-dark/40">Sin imagen</p></div>';
                    }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl bg-brand-sand/30 p-12 text-center">
              <p className="text-brand-dark/60">No hay imágenes disponibles</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OutfitDetailModal;
