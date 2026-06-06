import { useEffect, useRef, useState } from 'react';
import {
  Home,
  Shirt,
  Zap,
  Heart,
  Settings,
  HelpCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  AlertCircle,
  Loader2,
  X,
  Lightbulb,
} from 'lucide-react';

const mockOutfits = [
  {
    id: 1,
    name: 'Look Casual Chic',
    occasion: 'Casual',
    garments: 3,
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80',
  },
  {
    id: 2,
    name: 'Estilo Ejecutivo',
    occasion: 'Trabajo',
    garments: 4,
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&q=80',
  },
  {
    id: 3,
    name: 'Tarde de Verano',
    occasion: 'Casual',
    garments: 3,
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&q=80',
  },
  {
    id: 4,
    name: 'Noche Elegante',
    occasion: 'Formal',
    garments: 5,
    image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&q=80',
  },
  {
    id: 5,
    name: 'Weekend Vibes',
    occasion: 'Casual',
    garments: 3,
    image: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=400&q=80',
  },
  {
    id: 6,
    name: 'Brunch Look',
    occasion: 'Social',
    garments: 4,
    image: 'https://images.unsplash.com/photo-1529139574466-a303027614b3?w=400&q=80',
  },
];

const OutfitsPage = ({
  user,
  onLogout,
  onGoToHome,
  onGoToWardrobe,
  onGoToWardrobePage,
  onGoToOutfits,
  onGoToFavorites,
  onGoToConfig,
  ocasiones = [],
  climas = [],
  dressCodes = [],
  hasPrendas = false,
  onOutfitLiked = () => {},
}) => {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [showHelpPanel,   setShowHelpPanel]   = useState(false);
  const [filters, setFilters] = useState({ ocasion: '', clima: '', dressCode: '' });
  const [generated, setGenerated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [ghostIndex,    setGhostIndex]    = useState(0);
  const [recomIndex,    setRecomIndex]    = useState(0);
  const [likedOutfits, setLikedOutfits] = useState(new Set());
  const [dislikedOutfits, setDislikedOutfits] = useState(new Set());
  const profileMenuRef = useRef(null);

  const VISIBLE = 3;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = (name) => {
    if (!name) return 'DM';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase();
  };

  // TODO: conectar con POST /api/v1/outfits/generate cuando el endpoint exista
  const handleGenerate = () => {
    setLoading(true);
    setGenerated(false);
    setCarouselIndex(0);
    setTimeout(() => {
      setLoading(false);
      setGenerated(true);
    }, 1500);
  };

  const handlePrev = () => {
    setCarouselIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCarouselIndex((prev) => Math.min(mockOutfits.length - VISIBLE, prev + 1));
  };

  const handleLike = (id) => {
    const newLiked = new Set(likedOutfits);
    const newDisliked = new Set(dislikedOutfits);
    if (newLiked.has(id)) {
      newLiked.delete(id);
      onOutfitLiked(null, id);
    } else {
      newLiked.add(id);
      newDisliked.delete(id);
      const outfit = mockOutfits.find((o) => o.id === id);
      if (outfit) onOutfitLiked(outfit);
    }
    setLikedOutfits(newLiked);
    setDislikedOutfits(newDisliked);
  };

  const handleDislike = (id) => {
    const newDisliked = new Set(dislikedOutfits);
    const newLiked = new Set(likedOutfits);
    if (newDisliked.has(id)) {
      newDisliked.delete(id);
    } else {
      newDisliked.add(id);
      if (newLiked.has(id)) onOutfitLiked(null, id);
      newLiked.delete(id);
    }
    setDislikedOutfits(newDisliked);
    setLikedOutfits(newLiked);
  };

  const visibleOutfits = mockOutfits.slice(carouselIndex, carouselIndex + VISIBLE);

  return (
    <div className="relative min-h-screen bg-brand-cream overflow-hidden">
      {/* Background wardrobe image – very low opacity */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1920&q=80')", backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.09 }}
      />
      {/* SIDEBAR */}
      <aside className="fixed left-0 top-0 w-64 h-screen bg-brand-cream border-r-4 border-gray-300/70 flex flex-col justify-between p-6 z-50">
        <div>
          <div className="font-serif italic text-2xl font-normal text-brand-dark tracking-wide select-none cursor-pointer">
            DressMe
          </div>
          <nav className="flex flex-col gap-3 mt-12">
            <button
              onClick={() => onGoToHome && onGoToHome()}
              className="btn-shimmer relative overflow-hidden flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 text-sm font-medium text-brand-dark hover:bg-brand-charcoal hover:text-white border-2 border-gray-300/50 hover:border-gray-400/50"
            >
              <Home className="w-5 h-5" />
              Inicio
            </button>
            <button
              onClick={() => onGoToWardrobePage && onGoToWardrobePage()}
              className="btn-shimmer relative overflow-hidden flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 text-sm font-medium text-brand-dark hover:bg-brand-charcoal hover:text-white border-2 border-gray-300/50 hover:border-gray-400/50"
            >
              <Shirt className="w-5 h-5" />
              Mi Armario
            </button>
            <button className="btn-shimmer relative overflow-hidden flex items-center gap-3 px-4 py-3 rounded-2xl bg-brand-charcoal text-white text-sm font-medium border-2 border-gray-400/50">
              <Zap className="w-5 h-5" />
              Outfits
            </button>
            <button
              onClick={() => onGoToFavorites && onGoToFavorites()}
              className="btn-shimmer relative overflow-hidden flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 text-sm font-medium text-brand-dark hover:bg-brand-charcoal hover:text-white border-2 border-gray-300/50 hover:border-gray-400/50"
            >
              <Heart className="w-5 h-5" />
              Favoritos
            </button>
            <button
              onClick={() => onGoToConfig && onGoToConfig()}
              className="btn-shimmer relative overflow-hidden flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 text-sm font-medium text-brand-dark hover:bg-brand-charcoal hover:text-white border-2 border-gray-300/50 hover:border-gray-400/50"
            >
              <Settings className="w-5 h-5" />
              Configuración
            </button>
          </nav>
        </div>
        <div className="relative">
          {showHelpPanel && (
            <div className="absolute bottom-full left-0 mb-3 w-72 bg-white rounded-3xl shadow-[0_8px_32px_rgba(44,42,41,0.15)] p-5 z-50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-brand-bronze" />
                  <h3 className="font-serif font-bold text-brand-dark text-sm">Tips de uso</h3>
                </div>
                <button onClick={() => setShowHelpPanel(false)} className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-brand-sand/60 transition-colors">
                  <X className="w-3.5 h-3.5 text-brand-dark/60" />
                </button>
              </div>
              <ul className="flex flex-col gap-3">
                {['📸 Sube fotos con buena iluminación para que la IA identifique mejor tus prendas','👗 Entre más prendas subas, mejores outfits podrá recomendarte la IA','✨ Calibra tu estilo en Configuración para recomendaciones más precisas','🎯 Usa los filtros de Ocasión y Clima para encontrar el outfit perfecto','❤️ Guarda tus outfits favoritos dándoles like para encontrarlos fácilmente'].map((tip, i) => (
                  <li key={i} className="text-xs text-brand-dark/60 leading-relaxed">{tip}</li>
                ))}
              </ul>
            </div>
          )}
          <button onClick={() => setShowHelpPanel((v) => !v)} className="flex items-center gap-3 px-4 py-3 rounded-2xl text-brand-dark/60 hover:text-brand-dark hover:bg-brand-sand/40 transition-all duration-200 text-sm font-medium w-full">
            <HelpCircle className="w-5 h-5" />
            Ayuda
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="ml-64">
        {/* HEADER */}
        <header className="bg-brand-cream border-b border-brand-sand px-8 py-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-serif font-bold text-brand-dark mb-2">Outfits para Ti</h1>
            <p className="text-brand-dark/60 font-sans text-sm">Deja que la IA combine tu ropa perfectamente</p>
          </div>
          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              {user?.profilePicture ? (
                <img
                  src={user?.profilePicture}
                  alt={user?.displayName ?? 'Usuario'}
                  className="w-12 h-12 rounded-full object-cover border border-brand-dark/10 ring-2 ring-gray-400/80 ring-offset-1"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-brand-charcoal text-white flex items-center justify-center text-sm font-semibold ring-2 ring-gray-400/80 ring-offset-1">
                  {getInitials(user?.displayName)}
                </div>
              )}
              <div className="text-left hidden lg:block">
                <p className="text-sm font-semibold text-brand-dark">{user?.displayName || 'Usuario'}</p>
                <p className="text-xs text-brand-dark/60">Entusiasta de la Moda</p>
              </div>
              <ChevronDown className="w-4 h-4 text-brand-dark/40" />
            </button>
            {profileMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 glass-effect rounded-2xl shadow-lg z-50 overflow-hidden">
                <button
                  onClick={() => { setProfileMenuOpen(false); onLogout(); }}
                  className="w-full flex items-center gap-2 px-4 py-3 text-brand-dark hover:bg-brand-sand/40 transition-colors text-sm font-medium text-left"
                >
                  <LogOut className="w-4 h-4" />
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </header>

        {/* CONTENT */}
        <div className="px-8 py-10 space-y-10">

          {/* FILTROS */}
          <section className="rounded-3xl bg-gradient-to-br from-[#F3EFE9] to-[#F8F5F1] p-8 border-4 border-gray-300/50">
            <p className="text-2xl font-serif font-bold text-brand-dark mb-4">Generar nuevo outfit</p>
            <div className="flex flex-wrap items-end gap-4">
              {/* Ocasión */}
              <div className="flex-1 min-w-[140px]">
                <label className="text-xs font-semibold text-brand-dark mb-2 block">Ocasión</label>
                <div className="relative">
                  <select
                    value={filters.ocasion}
                    onChange={(e) => setFilters((p) => ({ ...p, ocasion: e.target.value }))}
                    className="w-full appearance-none rounded-3xl border border-brand-sand bg-white px-4 py-2.5 pr-8 text-xs text-brand-dark outline-none transition-all duration-200 hover:border-brand-dark/30"
                  >
                    <option value="">Seleccionar...</option>
                    {(Array.isArray(ocasiones) ? ocasiones : []).map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3 w-3 -translate-y-1/2 text-brand-dark/40" />
                </div>
              </div>

              {/* Clima */}
              <div className="flex-1 min-w-[140px]">
                <label className="text-xs font-semibold text-brand-dark mb-2 block">Clima</label>
                <div className="relative">
                  <select
                    value={filters.clima}
                    onChange={(e) => setFilters((p) => ({ ...p, clima: e.target.value }))}
                    className="w-full appearance-none rounded-3xl border border-brand-sand bg-white px-4 py-2.5 pr-8 text-xs text-brand-dark outline-none transition-all duration-200 hover:border-brand-dark/30"
                  >
                    <option value="">Seleccionar...</option>
                    {(Array.isArray(climas) ? climas : []).map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3 w-3 -translate-y-1/2 text-brand-dark/40" />
                </div>
              </div>

              {/* Dress Code */}
              <div className="flex-1 min-w-[140px]">
                <label className="text-xs font-semibold text-brand-dark mb-2 block">Dress Code</label>
                <div className="relative">
                  <select
                    value={filters.dressCode}
                    onChange={(e) => setFilters((p) => ({ ...p, dressCode: e.target.value }))}
                    className="w-full appearance-none rounded-3xl border border-brand-sand bg-white px-4 py-2.5 pr-8 text-xs text-brand-dark outline-none transition-all duration-200 hover:border-brand-dark/30"
                  >
                    <option value="">Seleccionar...</option>
                    {(Array.isArray(dressCodes) ? dressCodes : []).map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3 w-3 -translate-y-1/2 text-brand-dark/40" />
                </div>
              </div>

            </div>

            {/* Botón Generar */}
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="btn-shimmer relative mx-auto flex items-center justify-center gap-2 rounded-full bg-brand-charcoal px-12 py-4 text-base font-medium text-white transition-all duration-300 hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden mt-4"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              <span className="relative z-10">{loading ? 'Generando...' : '✦ Generar Outfit'}</span>
            </button>
          </section>

          {/* CARRUSEL */}
          <section>
            {/* Estado fantasma — no se ha generado nada */}
            {!generated && !loading && (
              <div>
                <p className="text-xs text-brand-dark/40 text-center mb-4">
                  Selecciona los filtros y presiona Generar
                </p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setGhostIndex((p) => Math.max(0, p - 1))}
                    disabled={ghostIndex === 0}
                    className="flex-shrink-0 w-10 h-10 rounded-full border border-brand-sand bg-white flex items-center justify-center text-brand-dark hover:bg-brand-sand/40 transition-all duration-200 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="grid grid-cols-3 gap-6 flex-1">
                    {Array.from({ length: 6 }).slice(ghostIndex, ghostIndex + VISIBLE).map((_, i) => (
                      <div
                        key={ghostIndex + i}
                        className="rounded-3xl overflow-hidden opacity-30 blur-[1px] bg-brand-sand/60"
                        style={{ height: '380px' }}
                      >
                        <div className="h-full flex flex-col items-center justify-center gap-3">
                          <Sparkles className="w-12 h-12 text-brand-dark/50" />
                          <p className="text-sm text-brand-dark/50 font-medium">Genera tu primer outfit</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setGhostIndex((p) => Math.min(6 - VISIBLE, p + 1))}
                    disabled={ghostIndex >= 6 - VISIBLE}
                    className="flex-shrink-0 w-10 h-10 rounded-full border border-brand-sand bg-white flex items-center justify-center text-brand-dark hover:bg-brand-sand/40 transition-all duration-200 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Loading spinner */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="w-12 h-12 text-brand-dark/40 animate-spin" />
                <p className="text-sm text-brand-dark/50">Combinando tu armario...</p>
              </div>
            )}

            {/* Estado activo — outfits generados */}
            {generated && !loading && (
              <>
                {!hasPrendas ? (
                  <div className="rounded-3xl glass-effect p-16 text-center" style={{ border: '4px solid rgba(209,213,219,0.6)', boxShadow: '0 4px 16px rgba(192,192,192,0.25)' }}>
                    <div className="flex items-center justify-center mb-4">
                      <AlertCircle className="w-12 h-12 text-brand-dark/40" />
                    </div>
                    <h3 className="text-xl font-serif font-bold text-brand-dark mb-2">Necesitas más prendas</h3>
                    <p className="text-sm text-brand-dark/60 mb-6">
                      Agrega al menos 1 prenda de cada categoria a tu armario para generar outfits
                    </p>
                    <button
                      onClick={() => onGoToWardrobe && onGoToWardrobe()}
                      className="btn-shimmer inline-flex items-center gap-2 rounded-full bg-brand-charcoal px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:opacity-90 overflow-hidden relative"
                    >
                      <span className="relative z-10">Ir a Mi Armario</span>
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    {/* Flechas de navegación */}
                    <div className="flex items-center gap-4">
                      <button
                        onClick={handlePrev}
                        disabled={carouselIndex === 0}
                        className="flex-shrink-0 w-10 h-10 rounded-full border border-brand-sand bg-white flex items-center justify-center text-brand-dark hover:bg-brand-sand/40 transition-all duration-200 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>

                      <div className="grid grid-cols-3 gap-6 flex-1">
                        {visibleOutfits.map((outfit) => (
                          <div
                            key={outfit.id}
                            className="rounded-3xl overflow-hidden relative group cursor-pointer shadow-[0_12px_40px_rgba(44,42,41,0.08)] hover:shadow-[0_18px_60px_rgba(44,42,41,0.12)] transition-all duration-300 hover:-translate-y-1"
                            style={{ height: '380px' }}
                          >
                            {/* Imagen */}
                            <img
                              src={outfit.image}
                              alt={outfit.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />

                            {/* Panel inferior semitransparente */}
                            <div className="absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm p-4">
                              <p className="text-sm font-semibold text-brand-dark">{outfit.name}</p>
                              <p className="text-xs text-brand-dark/60">{outfit.occasion} · {outfit.garments} prendas</p>
                            </div>

                            {/* Botones like/dislike */}
                            <div className="absolute top-3 right-3 flex flex-col gap-2">
                              <button
                                onClick={(e) => { e.stopPropagation(); handleLike(outfit.id); }}
                                className={`btn-shimmer w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 overflow-hidden relative ${
                                  likedOutfits.has(outfit.id)
                                    ? 'bg-brand-charcoal text-white'
                                    : 'bg-white/90 text-brand-dark hover:bg-brand-charcoal hover:text-white'
                                }`}
                              >
                                <ThumbsUp className="w-4 h-4 relative z-10" />
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); handleDislike(outfit.id); }}
                                className={`btn-shimmer w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 overflow-hidden relative ${
                                  dislikedOutfits.has(outfit.id)
                                    ? 'bg-brand-sand text-brand-dark'
                                    : 'bg-white/90 text-brand-dark hover:bg-brand-sand'
                                }`}
                              >
                                <ThumbsDown className="w-4 h-4 relative z-10" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={handleNext}
                        disabled={carouselIndex >= mockOutfits.length - VISIBLE}
                        className="flex-shrink-0 w-10 h-10 rounded-full border border-brand-sand bg-white flex items-center justify-center text-brand-dark hover:bg-brand-sand/40 transition-all duration-200 disabled:cursor-not-allowed"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Indicadores de posición */}
                    <div className="flex justify-center gap-2 mt-6">
                      {Array.from({ length: mockOutfits.length - VISIBLE + 1 }).map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCarouselIndex(i)}
                          className={`w-2 h-2 rounded-full transition-all duration-200 ${
                            i === carouselIndex ? 'bg-brand-charcoal w-6' : 'bg-brand-sand'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </section>

          {/* RECOMENDADOS PARA TI */}
          <section className="mt-8">
            <div className="mb-6">
              <h2 className="text-2xl font-serif font-bold text-brand-dark">Recomendados para Ti</h2>
              <p className="text-sm text-brand-dark/60 mt-1">Basado en tu estilo y preferencias</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setRecomIndex((p) => Math.max(0, p - 1))}
                disabled={recomIndex === 0}
                className="flex-shrink-0 w-10 h-10 rounded-full border border-brand-sand bg-white flex items-center justify-center text-brand-dark hover:bg-brand-sand/40 transition-all duration-200 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="grid grid-cols-3 gap-6 flex-1">
                {[Sparkles, Shirt, Heart, Zap, ThumbsUp, ThumbsDown].slice(recomIndex, recomIndex + VISIBLE).map((Icon, i) => (
                  <div
                    key={recomIndex + i}
                    className="rounded-3xl overflow-hidden bg-brand-sand/60 flex flex-col items-center justify-center gap-3"
                    style={{ height: '380px', opacity: 0.45, filter: 'blur(0.6px)' }}
                  >
                    <Icon className="w-12 h-12 text-brand-dark/40" />
                    <p className="text-sm text-brand-dark/50 font-medium text-center px-8">
                      Genera outfits para ver recomendaciones
                    </p>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setRecomIndex((p) => Math.min(6 - VISIBLE, p + 1))}
                disabled={recomIndex >= 6 - VISIBLE}
                className="flex-shrink-0 w-10 h-10 rounded-full border border-brand-sand bg-white flex items-center justify-center text-brand-dark hover:bg-brand-sand/40 transition-all duration-200 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            {!hasPrendas && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => onGoToWardrobe && onGoToWardrobe()}
                  className="btn-shimmer relative inline-flex items-center gap-2 rounded-full bg-brand-charcoal px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:opacity-90 overflow-hidden"
                >
                  <span className="relative z-10">Agregar mis primeras prendas</span>
                </button>
              </div>
            )}
          </section>

          <div className="h-8" />
        </div>
      </main>
    </div>
  );
};

export default OutfitsPage;