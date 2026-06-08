import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Home,
  Shirt,
  Zap,
  Heart,
  Settings,
  HelpCircle,
  ChevronDown,
  LogOut,
  X,
  Lightbulb,
  Wand2,
} from 'lucide-react';
import OutfitHistoryCard from '../components/OutfitHistoryCard';
import FeatureOutfitCard from '../components/FeatureOutfitCard';

const FavoritesPage = ({
  user,
  onLogout,
  onGoToHome,
  onGoToWardrobePage,
  onGoToOutfits,
  onGoToFavorites,
  onGoToConfig,
  onGoToWardrobe,
  ocasiones   = [],
  climas      = [],
  dressCodes  = [],
  favoritosData = [],
  outfitHistory = [],
  onRemoveFavorite = () => {},
  onRemoveFromHistory = () => {},
  onLikeFromHistory = () => {},
}) => {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [showHelpPanel,   setShowHelpPanel]   = useState(false);
  const [filters,         setFilters]          = useState({ ocasion: '', clima: '', dressCode: '' });
  const [appliedFilters,  setAppliedFilters]   = useState({ ocasion: '', clima: '', dressCode: '' });
  const profileMenuRef = useRef(null);

  // Close profile dropdown on outside click
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

  const favoritosIds = useMemo(() => new Set(favoritosData.map((o) => o.id)), [favoritosData]);

  const handleRemoveFavorite = (id) => {
    onRemoveFavorite(id);
    onRemoveFromHistory(id);
  };

  const handleApplyFilters = () => setAppliedFilters({ ...filters });

  const handleClearFilters = () => {
    const empty = { ocasion: '', clima: '', dressCode: '' };
    setFilters(empty);
    setAppliedFilters(empty);
  };

  const favoritosFiltrados = favoritosData.filter((f) => {
    if (appliedFilters.ocasion   && f.ocasion   !== appliedFilters.ocasion)   return false;
    if (appliedFilters.clima     && f.clima     !== appliedFilters.clima)     return false;
    if (appliedFilters.dressCode && f.dressCode !== appliedFilters.dressCode) return false;
    return true;
  });

  return (
    <div className="relative min-h-screen bg-brand-cream overflow-hidden">
      {/* Background wardrobe image – very low opacity */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1920&q=80')", backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.09 }}
      />

      {/* ── SIDEBAR ─────────────────────────────────────────── */}
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
              <Home className="w-5 h-5" /> Inicio
            </button>
            <button
              onClick={() => onGoToWardrobePage && onGoToWardrobePage()}
              className="btn-shimmer relative overflow-hidden flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 text-sm font-medium text-brand-dark hover:bg-brand-charcoal hover:text-white border-2 border-gray-300/50 hover:border-gray-400/50"
            >
              <Shirt className="w-5 h-5" /> Mi Armario
            </button>
            <button
              onClick={() => onGoToOutfits && onGoToOutfits()}
              className="btn-shimmer relative overflow-hidden flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 text-sm font-medium text-brand-dark hover:bg-brand-charcoal hover:text-white border-2 border-gray-300/50 hover:border-gray-400/50"
            >
              <Zap className="w-5 h-5" /> Outfits
            </button>
            <button className="btn-shimmer relative overflow-hidden flex items-center gap-3 px-4 py-3 rounded-2xl bg-brand-charcoal text-white text-sm font-medium border-2 border-gray-400/50">
              <Heart className="w-5 h-5" /> Favoritos
            </button>
            <button
              onClick={() => onGoToConfig && onGoToConfig()}
              className="btn-shimmer relative overflow-hidden flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 text-sm font-medium text-brand-dark hover:bg-brand-charcoal hover:text-white border-2 border-gray-300/50 hover:border-gray-400/50"
            >
              <Settings className="w-5 h-5" /> Configuración
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

      {/* ── MAIN ────────────────────────────────────────────── */}
      <main className="ml-64">

        {/* HEADER */}
        <header className="bg-brand-cream border-b border-brand-sand px-8 py-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-serif font-bold text-brand-dark mb-2">Mis Favoritos</h1>
            <p className="text-brand-dark/60 font-sans text-sm">Outfits que la IA eligió para ti</p>
          </div>

          {/* Profile */}
          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={user.displayName}
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
                  <LogOut className="w-4 h-4" /> Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </header>

        {/* CONTENT */}
        <div className="px-8 py-10 space-y-12">

          {/* ── SECCIÓN 1: MIS OUTFITS FAVORITOS ──────────────── */}
          <section>
            <div className="mb-6">
              <h2 className="text-2xl font-serif font-bold text-brand-dark">Outfits que te Gustaron</h2>
            </div>

            {/* ── FILTROS — siempre visibles ── */}
            <div className="mb-8">
              <div className="flex items-end justify-center gap-6 mb-4">
                {/* Ocasión */}
                <div className="w-52">
                  <label className="text-xs font-semibold text-brand-dark mb-2 block">Ocasión</label>
                  <div className="relative">
                    <select
                      value={filters.ocasion}
                      onChange={(e) => setFilters((p) => ({ ...p, ocasion: e.target.value }))}
                      className="w-full appearance-none rounded-3xl border border-brand-sand bg-white px-3 py-2 pr-8 text-xs text-brand-dark outline-none transition-all duration-200 hover:border-brand-dark/30"
                    >
                      <option value="">— Todos —</option>
                      {Array.isArray(ocasiones) && ocasiones.map((o) => <option key={o.id} value={o.name}>{o.name}</option>)}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-brand-dark/40" />
                  </div>
                </div>

                {/* Clima */}
                <div className="w-52">
                  <label className="text-xs font-semibold text-brand-dark mb-2 block">Clima</label>
                  <div className="relative">
                    <select
                      value={filters.clima}
                      onChange={(e) => setFilters((p) => ({ ...p, clima: e.target.value }))}
                      className="w-full appearance-none rounded-3xl border border-brand-sand bg-white px-3 py-2 pr-8 text-xs text-brand-dark outline-none transition-all duration-200 hover:border-brand-dark/30"
                    >
                      <option value="">— Todos —</option>
                      {Array.isArray(climas) && climas.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-brand-dark/40" />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={handleClearFilters}
                  className="text-xs font-medium text-brand-dark/60 hover:text-brand-dark transition-colors hover:underline"
                >
                  Limpiar filtros
                </button>
                <button
                  onClick={handleApplyFilters}
                  className="btn-shimmer relative inline-flex items-center rounded-full bg-brand-charcoal px-5 py-2 text-xs font-medium text-white transition-all duration-300 hover:opacity-90 overflow-hidden"
                >
                  <span className="relative z-10">Buscar</span>
                </button>
              </div>
            </div>

            {favoritosData.length === 0 ? (
              /* ── ESTADO VACÍO ── */
              <div className="rounded-3xl glass-effect p-16 text-center" style={{ border: '4px solid rgba(209,213,219,0.6)', boxShadow: '0 4px 16px rgba(192,192,192,0.25)' }}>
                <div className="flex items-center justify-center mb-4">
                  <Heart className="w-14 h-14 text-brand-dark/40" />
                </div>
                <h3 className="text-xl font-serif font-bold text-brand-dark mb-2">Aún no tienes favoritos</h3>
                <p className="text-sm text-brand-dark/60 mb-8 max-w-sm mx-auto">
                  Agrega prendas a tu armario, genera outfits con IA y guarda los que más te gusten
                </p>
                <div className="flex items-center justify-center gap-3 flex-wrap">
                  <button
                    onClick={() => onGoToWardrobe && onGoToWardrobe()}
                    className="btn-shimmer relative inline-flex items-center gap-2 rounded-full bg-brand-charcoal px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:opacity-90 overflow-hidden"
                  >
                    <span className="relative z-10">Agregar prendas</span>
                  </button>
                  <button
                    onClick={() => onGoToOutfits && onGoToOutfits()}
                    className="btn-shimmer relative inline-flex items-center gap-2 rounded-full bg-brand-sand px-6 py-3 text-sm font-medium text-brand-dark transition-all duration-300 hover:bg-brand-sand/70 overflow-hidden"
                  >
                    <span className="relative z-10">Generar Outfits</span>
                  </button>
                </div>
              </div>
            ) : (
              /* ── CONTENIDO REAL ── */
              <>
                {favoritosFiltrados.length === 0 ? (
                  <div className="rounded-3xl glass-effect p-12 text-center" style={{ border: '4px solid rgba(209,213,219,0.6)', boxShadow: '0 4px 16px rgba(192,192,192,0.25)' }}>
                    <p className="text-sm text-brand-dark/60 mb-4">
                      No hay favoritos que coincidan con los filtros seleccionados.
                    </p>
                    <button
                      onClick={handleClearFilters}
                      className="text-xs font-medium text-brand-dark hover:underline transition-colors"
                    >
                      Limpiar filtros
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {favoritosFiltrados.map((outfit) => (
                      <FeatureOutfitCard
                        key={outfit.id}
                        outfit={outfit}
                        height="380px"
                        isLiked={true}
                        onDislike={handleRemoveFavorite}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </section>

          {/* ── SECCIÓN 2: OUTFITS PARA TI ──────────────────── */}
          <section>
            <div className="mb-6">
              <h2 className="text-2xl font-serif font-bold text-brand-dark">Outfits para Ti</h2>
              <p className="text-sm text-brand-dark/60 mt-1">Todos los outfits que la IA ha generado para ti</p>
            </div>

            {outfitHistory.length === 0 ? (
              <div className="rounded-3xl glass-effect p-12 text-center" style={{ border: '4px solid rgba(209,213,219,0.6)', boxShadow: '0 4px 16px rgba(192,192,192,0.25)' }}>
                <div className="flex items-center justify-center mb-4">
                  <Wand2 className="w-12 h-12 text-brand-dark/40" />
                </div>
                <h3 className="text-xl font-serif font-bold text-brand-dark mb-2">Aún no hay outfits generados</h3>
                <p className="text-sm text-brand-dark/60 mb-6">Genera outfits con IA y aparecerán aquí</p>
                <button
                  onClick={() => onGoToOutfits && onGoToOutfits()}
                  className="btn-shimmer px-6 py-3 bg-brand-charcoal text-white rounded-full font-medium"
                >
                  Generar Outfits
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[...outfitHistory].reverse().map((outfit) => (
                  <OutfitHistoryCard
                    key={outfit.id}
                    outfit={outfit}
                    isLiked={favoritosIds.has(outfit.id)}
                    onLike={(o) => { onLikeFromHistory(o); onRemoveFromHistory(o.id); }}
                    onDislike={(id) => onRemoveFromHistory(id)}
                  />
                ))}
              </div>
            )}
          </section>

          <div className="h-8" />
        </div>
      </main>
    </div>
  );
};

export default FavoritesPage;
