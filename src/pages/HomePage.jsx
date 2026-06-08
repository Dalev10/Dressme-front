import { useEffect, useRef, useState } from 'react';
import {
  Home,
  Shirt,
  Zap,
  Heart,
  Settings,
  HelpCircle,
  ChevronDown,
  LogOut,
  Sparkles,
  ShoppingBag,
  Palette,
  Plus,
  Wand2,
  X,
  Lightbulb,
} from 'lucide-react';
import FeatureOutfitCard from '../components/FeatureOutfitCard';

const HomePage = ({ user, onLogout, onGoToOnboarding, onGoToWardrobe, onGoToWardrobePage, onGoToOutfits, onGoToFavorites, onGoToConfig, prendas = [], favoritosData = [] }) => {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [showHelpPanel,   setShowHelpPanel]   = useState(false);
  const profileMenuRef = useRef(null);

  const [outfitHistory, setOutfitHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem('dressme_outfit_history') || '[]'); }
    catch { return []; }
  });

  // Re-leer historial cada vez que el componente monta (usuario navega a home)
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('dressme_outfit_history') || '[]');
      setOutfitHistory(stored);
    } catch { /* ignorar */ }
  }, []);

  // Validar autenticación al cargar
  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    const userData = localStorage.getItem('dressme_user');

    if (!authToken || !userData) {
      window.location.href = '/login';
    }
  }, []);

  // Cerrar menú de perfil al hacer click afuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const features = [
    {
      icon: <Sparkles className="w-8 h-8 stroke-brand-dark" />,
      title: 'Recomendaciones Inteligentes',
      subtitle: 'IA sugiere outfits basados en tu estilo',
    },
    {
      icon: <ShoppingBag className="w-8 h-8 stroke-brand-dark" />,
      title: 'Armario Digital',
      subtitle: 'Organiza todas tus prendas en un lugar',
    },
    {
      icon: <Palette className="w-8 h-8 stroke-brand-dark" />,
      title: 'Personalización de Estilo',
      subtitle: 'Adapta la app a tu preferencia fashion',
    },
  ];

  const getInitials = (name) => {
    if (!name) return 'DM';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const toggleFavorite = (id) => {
    const newFavorites = new Set(favoriteOutfits);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }
    setFavoriteOutfits(newFavorites);
  };

  return (
    <div className="relative min-h-screen bg-brand-cream overflow-hidden">
      {/* Background wardrobe image – very low opacity */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1920&q=80')", backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.09 }}
      />
      {/* SIDEBAR */}
      <aside className="fixed left-0 top-0 w-64 h-screen bg-brand-cream border-r-4 border-gray-300/70 flex flex-col justify-between p-6 z-50">
        {/* Logo */}
        <div className="font-serif italic text-2xl font-normal text-brand-dark tracking-wide select-none cursor-pointer">
          DressMe
        </div>

        {/* Menu Navigation */}
        <nav className="flex flex-col gap-3 flex-1 mt-12">
          {[
            { id: 'home', label: 'Inicio', icon: <Home className="w-5 h-5" />, action: null },
            { id: 'wardrobe', label: 'Mi Armario', icon: <Shirt className="w-5 h-5" />, action: onGoToWardrobePage },
            { id: 'outfits', label: 'Outfits', icon: <Zap className="w-5 h-5" />, action: onGoToOutfits },
            { id: 'favorites', label: 'Favoritos', icon: <Heart className="w-5 h-5" />, action: onGoToFavorites },
            { id: 'settings', label: 'Configuración', icon: <Settings className="w-5 h-5" />, action: onGoToConfig },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => item.action && item.action()}
              className={`btn-shimmer relative overflow-hidden flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 text-sm font-medium ${
                item.id === 'home'
                  ? 'bg-brand-charcoal text-white border-2 border-gray-400/50'
                  : 'text-brand-dark hover:bg-brand-charcoal hover:text-white border-2 border-gray-300/50 hover:border-gray-400/50'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        {/* Help Icon */}
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

      {/* MAIN CONTENT */}
      <main className="ml-64">
        {/* HEADER */}
        <header className="bg-brand-cream border-b border-brand-sand px-8 py-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-serif font-bold text-brand-dark mb-2">
              ¡Bienvenid@ de nuevo{user?.displayName ? `, ${user?.displayName?.split(' ')[0] ?? 'Usuario'}` : ''}!
            </h1>
            <p className="text-brand-dark/60 font-sans text-sm">
              Descubre tu outfit perfecto hoy
            </p>
          </div>

          {/* User Profile */}
          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={user.displayName}
                  className="w-12 h-12 rounded-full object-cover border-2 border-brand-dark/10 ring-2 ring-gray-400/80 ring-offset-1"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-brand-charcoal text-white flex items-center justify-center text-sm font-semibold ring-2 ring-gray-400/80 ring-offset-1">
                  {getInitials(user?.displayName)}
                </div>
              )}
              <div className="text-left">
                <p className="text-sm font-semibold text-brand-dark">
                  {user?.displayName || 'Usuario'}
                </p>
                <p className="text-xs text-brand-dark/60">Entusiasta de la Moda</p>
              </div>
              <ChevronDown className="w-4 h-4 text-brand-dark/40" />
            </button>

            {/* Dropdown Menu */}
            {profileMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 glass-effect rounded-2xl shadow-lg z-50 overflow-hidden">
                <button
                  onClick={() => {
                    setProfileMenuOpen(false);
                    onLogout();
                  }}
                  className="w-full flex items-center gap-2 px-4 py-3 text-brand-dark hover:bg-brand-sand/40 transition-colors text-sm font-medium text-left"
                >
                  <LogOut className="w-4 h-4" />
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </header>

        {/* CONTENT AREA */}
        <div className="px-8 py-10 space-y-12 content-bg relative">
          {/* Sección: Mi Armario */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-serif font-bold text-brand-dark">
                Mi Armario
              </h2>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => onGoToWardrobe && onGoToWardrobe()}
                  className="btn-shimmer inline-flex items-center gap-2 rounded-full bg-brand-charcoal px-5 py-2 text-sm font-medium text-white transition-all duration-300 hover:opacity-90"
                >
                  <Plus className="w-4 h-4" /> Subir prenda
                </button>
                <button
                  onClick={() => onGoToWardrobePage && onGoToWardrobePage()}
                  className="text-sm font-medium text-brand-dark hover:text-brand-dark/70 transition-colors"
                >
                  Ver Todo →
                </button>
              </div>
            </div>

            {prendas.length > 0 ? (
              <div className="flex gap-4 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory">
                {(Array.isArray(prendas) ? prendas : []).map((garment) => (
                  <div
                    key={garment.id}
                    className="flex-shrink-0 w-40 snap-center cursor-pointer hover:opacity-90 transition-opacity"
                  >
                    <div className="rounded-2xl overflow-hidden h-40 mb-2 bg-brand-sand/30 border-4 border-gray-300/60 shadow-[0_4px_16px_rgba(192,192,192,0.25)]">
                      <img
                        src={garment.image}
                        alt={garment.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-sm font-medium text-brand-dark text-center">
                      {garment.name}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex gap-4 overflow-x-auto pb-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex-shrink-0 w-40 snap-center cursor-default">
                    <div className="rounded-2xl h-40 mb-2 bg-brand-sand/55 flex items-center justify-center border-4 border-gray-300/50">
                      {i % 3 === 0 ? (
                        <Shirt className="w-10 h-10 text-brand-dark/40" />
                      ) : i % 3 === 1 ? (
                        <ShoppingBag className="w-10 h-10 text-brand-dark/40" />
                      ) : (
                        <Shirt className="w-10 h-10 text-brand-dark/40" />
                      )}
                    </div>
                    <p className="text-sm text-brand-dark/40 text-center">Sin prenda</p>
                  </div>
                ))}

                <div className="flex-shrink-0 w-40 snap-center">
                  <button
                    onClick={() => onGoToWardrobe && onGoToWardrobe()}
                    className="w-full rounded-2xl h-40 mb-2 flex items-center justify-center border-4 border-dashed border-gray-400/70 bg-transparent cursor-pointer"
                    aria-label="Agregar prenda"
                  >
                    <Plus className="w-10 h-10 text-brand-dark/60" />
                  </button>
                  <button onClick={() => onGoToWardrobe && onGoToWardrobe()} className="text-sm text-brand-dark/40 text-center w-full mt-1">
                    Agregar prenda
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* Banner CTA: Crear Nuevo Outfit */}
          <section>
            <div className="rounded-3xl bg-gradient-to-br from-[#F3EFE9] to-[#F8F5F1] p-8 flex items-center justify-between overflow-hidden relative border-4 border-gray-300/50 shadow-[0_4px_20px_rgba(192,192,192,0.2)]">
              {/* Rectángulos decorativos */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-sand/20 rounded-full blur-3xl -z-0"></div>
              <div className="absolute bottom-6 right-12 w-24 h-24 bg-brand-sand/15 rounded-full blur-2xl -z-0"></div>

                <div className="z-10 max-w-md">
                <h3 className="text-3xl font-serif font-bold text-brand-dark mb-2">
                  Crear Nuevo Outfit
                </h3>
                <p className="text-brand-dark/70 text-sm mb-6">
                  Combina tus prendas y crea looks únicos con la ayuda de nuestra IA
                </p>
                <button onClick={() => onGoToOutfits && onGoToOutfits()} className="btn-shimmer relative px-6 py-3 bg-brand-charcoal text-white rounded-full font-medium overflow-hidden transition-all duration-300">
                  <span className="relative z-10">+ Empezar a Crear</span>
                </button>
              </div>

              {/* Imagen decorativa */}
              <div className="hidden lg:block z-10 relative">
                <div className="w-48 h-48 rounded-3xl bg-brand-sand/30 flex items-center justify-center">
                  <ShoppingBag className="w-24 h-24 text-brand-dark/20" />
                </div>
              </div>
            </div>
          </section>

          {/* Sección: Outfits para Ti */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-serif font-bold text-brand-dark">
                  Outfits para Ti
                </h2>
                <p className="text-sm text-brand-dark/60 mt-1">
                  Combinaciones creadas especialmente para tu estilo
                </p>
              </div>
              <button
                onClick={() => onGoToOutfits && onGoToOutfits()}
                className="text-sm font-medium text-brand-dark hover:text-brand-dark/70 transition-colors"
              >
                Ver Más →
              </button>
            </div>

            {outfitHistory.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {outfitHistory.slice(-4).reverse().map((outfit) => (
                  <FeatureOutfitCard
                    key={outfit.id}
                    outfit={outfit}
                    height="280px"
                    showLikeButtons={true}
                    isLiked={true}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-3xl glass-effect p-12 text-center" style={{ border: '4px solid rgba(209,213,219,0.6)', boxShadow: '0 4px 16px rgba(192,192,192,0.25)' }}>
                <div className="flex items-center justify-center mb-4">
                  <Wand2 className="w-12 h-12 text-brand-dark/40" />
                </div>
                <h3 className="text-xl font-serif font-bold text-brand-dark mb-2">Aún no tenemos outfits para ti</h3>
                <p className="text-sm text-brand-dark/60 mb-6">Sube prendas a tu armario para que nuestra IA pueda proponerte combinaciones perfectas</p>
                <button onClick={() => onGoToWardrobe && onGoToWardrobe()} className="btn-shimmer px-6 py-3 bg-brand-charcoal text-white rounded-full font-medium">
                  Ir a Mi Armario
                </button>
              </div>
            )}
          </section>

          {/* Sección: Tus Favoritos */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-serif font-bold text-brand-dark">
                Tus Favoritos
              </h2>
              <button
                onClick={() => onGoToFavorites && onGoToFavorites()}
                className="text-sm font-medium text-brand-dark hover:text-brand-dark/70 transition-colors"
              >
                Ver Todo →
              </button>
            </div>

            {favoritosData.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(Array.isArray(favoritosData) ? favoritosData : []).map((favorite) => (
                  <FeatureOutfitCard
                    key={favorite.id}
                    outfit={favorite}
                    height="320px"
                    isLiked={true}
                    showLikeButtons={true}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-3xl glass-effect p-12 text-center" style={{ border: '4px solid rgba(209,213,219,0.6)', boxShadow: '0 4px 16px rgba(192,192,192,0.25)' }}>
                <div className="flex items-center justify-center mb-4">
                  <Heart className="w-12 h-12 text-brand-dark/40" />
                </div>
                <h3 className="text-xl font-serif font-bold text-brand-dark mb-2">Aún no tienes favoritos</h3>
                <p className="text-sm text-brand-dark/60 mb-6">Genera recomendaciones de outfits con IA y guarda los que más te gusten</p>
                <button
                  onClick={() => onGoToOutfits && onGoToOutfits()}
                  className="btn-shimmer px-6 py-3 bg-brand-charcoal text-white rounded-full font-medium"
                >
                  Generar outfits con IA
                </button>
              </div>
            )}
          </section>

          {/* Sección: Nuestras Funciones */}
          <section>
            <h2 className="text-2xl font-serif font-bold text-brand-dark mb-6">
              Nuestras Funciones
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((feature, idx) => (
                <div
                  key={idx}
                  className="rounded-3xl bg-gradient-to-br from-[#F3EFE9] to-[#F8F5F1] p-8 text-center hover:shadow-md transition-shadow duration-300 cursor-pointer border-4 border-gray-300/50"
                >
                  <div className="flex justify-center mb-4">{feature.icon}</div>
                  <h3 className="text-lg font-serif font-bold text-brand-dark mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-brand-dark/70">{feature.subtitle}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Spacer */}
          <div className="h-8"></div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;