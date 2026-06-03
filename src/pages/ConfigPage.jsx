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
  User,
  Link,
  Sparkles,
  X,
  Lightbulb,
} from 'lucide-react';

const ConfigPage = ({
  user,
  onLogout,
  onGoToHome,
  onGoToWardrobePage,
  onGoToOutfits,
  onGoToFavorites,
  onGoToOnboarding,
}) => {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [showHelpPanel,   setShowHelpPanel]   = useState(false);
  const [editingName, setEditingName]         = useState(false);
  const [nameValue, setNameValue]             = useState(user?.displayName || '');
  const profileMenuRef = useRef(null);

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
            <button
              onClick={() => onGoToFavorites && onGoToFavorites()}
              className="btn-shimmer relative overflow-hidden flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 text-sm font-medium text-brand-dark hover:bg-brand-charcoal hover:text-white border-2 border-gray-300/50 hover:border-gray-400/50"
            >
              <Heart className="w-5 h-5" /> Favoritos
            </button>
            <button className="btn-shimmer relative overflow-hidden flex items-center gap-3 px-4 py-3 rounded-2xl bg-brand-charcoal text-white text-sm font-medium border-2 border-gray-400/50">
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
            <h1 className="text-4xl font-serif font-bold text-brand-dark mb-2">Configuración</h1>
            <p className="text-brand-dark/60 font-sans text-sm">Gestiona tu perfil y preferencias</p>
          </div>

          {/* Profile block */}
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
        <div className="px-8 py-10 space-y-6">

          {/* ── FILA 1: Mi Perfil + Cuenta Conectada ──────────── */}
          <div className="grid grid-cols-3 gap-6 items-stretch">

            {/* CARD 1: MI PERFIL (col-span-2) */}
            <div className="col-span-2 bg-white rounded-3xl shadow-[0_4px_24px_rgba(44,42,41,0.06)] border-4 border-gray-300/50 p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <User className="w-5 h-5 text-brand-dark" />
                  <h2 className="text-base font-sans font-bold text-brand-dark">Mi Perfil</h2>
                </div>

                <div className="flex items-start gap-6">
                  {user?.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt={user?.displayName}
                      className="w-20 h-20 rounded-full object-cover border border-brand-dark/10 flex-shrink-0 ring-2 ring-gray-400/80 ring-offset-1"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-brand-charcoal text-white flex items-center justify-center text-xl font-semibold flex-shrink-0 ring-2 ring-gray-400/80 ring-offset-1">
                      {getInitials(user?.displayName)}
                    </div>
                  )}

                  <div className="flex-1 min-w-0 pt-1">
                    {editingName ? (
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <input
                          autoFocus
                          value={nameValue}
                          onChange={(e) => setNameValue(e.target.value)}
                          className="font-serif font-bold text-xl text-brand-dark bg-brand-cream border border-brand-sand rounded-xl px-3 py-1.5 outline-none focus:border-brand-dark/30 w-full max-w-xs"
                        />
                        <button
                          onClick={() => setEditingName(false)}
                          className="text-xs font-semibold text-brand-dark hover:underline flex-shrink-0"
                        >
                          Guardar
                        </button>
                        <button
                          onClick={() => { setNameValue(user?.displayName || ''); setEditingName(false); }}
                          className="text-xs font-medium text-brand-dark/50 hover:text-brand-dark flex-shrink-0"
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <p className="font-serif font-bold text-xl text-brand-dark mb-0.5 truncate">
                        {nameValue || user?.displayName || 'Usuario'}
                      </p>
                    )}
                    <p className="text-sm text-brand-dark/60 mb-3 truncate">{user?.email}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                {!editingName && (
                  <button
                    onClick={() => setEditingName(true)}
                    className="btn-shimmer relative inline-flex items-center rounded-full bg-brand-sand px-4 py-1.5 text-xs font-medium text-brand-dark transition-all duration-300 hover:bg-brand-sand/70 overflow-hidden"
                  >
                    <span className="relative z-10">Editar nombre</span>
                  </button>
                )}
              </div>
            </div>

            {/* CARD 2: CUENTA CONECTADA (col-span-1) */}
            <div className="col-span-1 bg-white rounded-3xl shadow-[0_4px_24px_rgba(44,42,41,0.06)] border-4 border-gray-300/50 p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <Link className="w-5 h-5 text-brand-dark" />
                  <h2 className="text-base font-sans font-bold text-brand-dark">Cuenta Conectada</h2>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <svg className="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    <span className="text-sm font-bold text-brand-dark">Google</span>
                  </div>
                  <p className="text-sm text-brand-dark/60 truncate">{user?.email}</p>
                </div>
              </div>

              <div className="mt-4">
                <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 flex-shrink-0">
                  Conectado
                </span>
              </div>
            </div>
          </div>

          {/* ── FILA 2: Mi Perfil de Estilo + Sesión ──────────── */}
          <div className="grid grid-cols-2 gap-6 items-stretch">

            {/* CARD 3: MI PERFIL DE ESTILO */}
            <div className="bg-white rounded-3xl shadow-[0_4px_24px_rgba(44,42,41,0.06)] border-4 border-gray-300/50 p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles className="w-5 h-5 text-brand-dark" />
                  <h2 className="text-base font-sans font-bold text-brand-dark">Mi Perfil de Estilo</h2>
                </div>

                <div className="flex flex-col gap-4">
                  {user?.isCalibrated ? (
                    <span className="inline-flex items-center self-start rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                      Calibrado
                    </span>
                  ) : (
                    <span className="inline-flex items-center self-start rounded-full bg-brand-sand/70 px-3 py-1 text-xs font-semibold text-brand-dark/50">
                      Sin calibrar
                    </span>
                  )}
                  <p className="text-sm text-brand-dark/60">
                    Tu perfil de estilo permite que la IA te recomiende outfits personalizados.
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <button
                  onClick={() => onGoToOnboarding && onGoToOnboarding()}
                  className="btn-shimmer relative inline-flex items-center rounded-full bg-brand-charcoal px-6 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:opacity-90 overflow-hidden"
                >
                  <span className="relative z-10">Recalibrar mi estilo</span>
                </button>
              </div>
            </div>

            {/* CARD 4: SESIÓN */}
            <div className="bg-white rounded-3xl shadow-[0_4px_24px_rgba(44,42,41,0.06)] border-4 border-gray-300/50 p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <LogOut className="w-5 h-5 text-brand-dark" />
                  <h2 className="text-base font-sans font-bold text-brand-dark">Sesión</h2>
                </div>
                <p className="text-sm text-brand-dark/60 mb-5">Cierra tu sesión en este dispositivo.</p>
              </div>

              <div className="mt-4">
                <button
                  onClick={() => onLogout && onLogout()}
                  className="inline-flex items-center rounded-full border border-red-200 px-6 py-2.5 text-sm font-medium text-red-500 bg-transparent hover:bg-red-50 transition-colors duration-200"
                >
                  Cerrar sesión
                </button>
              </div>
            </div>
          </div>

          <div className="h-8" />
        </div>
      </main>
    </div>
  );
};

export default ConfigPage;
