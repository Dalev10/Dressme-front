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
  Plus,
  ShoppingBag,
  Tag,
  Palette,
  Sparkles,
  Layers,
  Pencil,
  Trash2,
  X,
  Lightbulb,
} from 'lucide-react';

// TODO: quitar mock
const mockPrendas = [
  {
    id: 1,
    name: 'Blazer Camel Estructurado',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80',
    style: 'Clásico',
    type: 'Blazer',
    category: 'Parte superior',
    color: 'Camel',
    ocasion: 'Trabajo',
    clima: 'Templado',
  },
  {
    id: 2,
    name: 'Vestido Midi Floral',
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&q=80',
    style: 'Romántico',
    type: 'Vestido',
    category: 'Vestidos',
    color: 'Multicolor',
    ocasion: 'Casual',
    clima: 'Cálido',
  },
];

const TIPOS_POR_CATEGORIA = {
  'Tops':              ['Camiseta', 'Camisa', 'Blusa', 'Suéter', 'Sudadera', 'Top', 'Crop Top'],
  'Parte Inferior':    ['Jeans', 'Pantalón', 'Shorts', 'Falda', 'Leggings', 'Joggers'],
  'Ropa de Abrigo':    ['Chaqueta', 'Abrigo', 'Blazer', 'Chaleco'],
  'Vestidos y Monos':  ['Vestido', 'Mono', 'Enterizo'],
  'Calzado':           ['Tenis', 'Botas', 'Mocasines y Oxford', 'Sandalias', 'Tacones'],
  'Accesorios':        ['Bolso', 'Sombrero', 'Bufanda y Cinturón', 'Joyería'],
  'Ropa Deportiva':    ['Top Deportivo', 'Shorts Deportivos', 'Chaqueta Deportiva'],
};

const ESTILOS_MOCK = [
  'Athleisure', 'Bohemio', 'Casual de Negocios', 'Formal Clásico', 'Costero',
  'Cottagecore', 'Academia Oscura', 'Vanguardista', 'Minimalista', 'Smart Casual',
  'Streetwear', 'Y2K Retro',
];

const WardrobePage = ({
  user,
  onLogout,
  onAddCloth,
  onGoToHome,
  onGoToOutfits,
  onGoToFavorites,
  onGoToConfig,
  prendas = mockPrendas,
  onEliminarPrenda = () => {},
  onActualizarPrenda = () => {},
  estilos = [],
  ocasiones = [],
  colores = [],
  climas = [],
  tiposPrenda = [],
  categorias = []
}) => {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [showHelpPanel,   setShowHelpPanel]   = useState(false);
  const emptyFilters = { estilo: '', ocasion: '', color: '', clima: '', tipoPrenda: '', categoria: '' };
  const [filters, setFilters] = useState(emptyFilters);
  const [appliedFilters, setAppliedFilters] = useState(emptyFilters);
  const profileMenuRef                              = useRef(null);
  const [selectedPrenda,    setSelectedPrenda]    = useState(null);
  const [editMode,          setEditMode]          = useState(false);
  const [editFields,        setEditFields]        = useState({ category: '', type: '', style: '' });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [toast,             setToast]             = useState('');

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
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase();
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => setAppliedFilters({ ...filters });

  const handleClearFilters = () => {
    setFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
  };

  const openModal = (prenda) => {
    setSelectedPrenda(prenda);
    setEditMode(false);
    setEditFields({ category: prenda.category || '', type: prenda.type || '', style: prenda.style || '' });
    setShowDeleteConfirm(false);
  };

  const closeModal = () => {
    setSelectedPrenda(null);
    setEditMode(false);
    setShowDeleteConfirm(false);
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const handleSave = () => {
    // TODO: conectar con API
    onActualizarPrenda(selectedPrenda.id, editFields);
    setSelectedPrenda((prev) => ({ ...prev, ...editFields }));
    setEditMode(false);
    showToast('Cambios guardados');
  };

  const handleDelete = () => {
    // TODO: conectar con API DELETE
    onEliminarPrenda(selectedPrenda.id);
    closeModal();
    showToast('Prenda eliminada');
  };

  const prendasFiltradas = prendas.filter((p) => {
    if (appliedFilters.estilo     && p.style    !== appliedFilters.estilo)     return false;
    if (appliedFilters.ocasion    && p.ocasion  !== appliedFilters.ocasion)    return false;
    if (appliedFilters.color      && p.color    !== appliedFilters.color)      return false;
    if (appliedFilters.clima      && p.clima    !== appliedFilters.clima)      return false;
    if (appliedFilters.tipoPrenda && p.type     !== appliedFilters.tipoPrenda) return false;
    if (appliedFilters.categoria  && p.category !== appliedFilters.categoria)  return false;
    return true;
  });

  return (
    <div className="relative min-h-screen bg-brand-cream overflow-hidden">
      {/* Background wardrobe image – very low opacity */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1920&q=80')", backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.09 }}
      />
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
              className="btn-shimmer relative overflow-hidden flex items-center gap-3 px-4 py-3 rounded-2xl bg-brand-charcoal text-white text-sm font-medium border-2 border-gray-400/50"
            >
              <Shirt className="w-5 h-5" />
              Mi Armario
            </button>
            <button
              onClick={() => onGoToOutfits && onGoToOutfits()}
              className="btn-shimmer relative overflow-hidden flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 text-sm font-medium text-brand-dark hover:bg-brand-charcoal hover:text-white border-2 border-gray-300/50 hover:border-gray-400/50"
            >
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

      <main className="ml-64">
        <header className="bg-brand-cream border-b border-brand-sand px-8 py-8 flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-end gap-6">
            <div>
              <h1 className="text-4xl font-serif font-bold text-brand-dark mb-2">Mis Prendas</h1>
              <p className="text-sm text-brand-dark/60">{prendas.length} prendas</p>
            </div>
            <button
              onClick={() => onAddCloth && onAddCloth()}
              className="btn-shimmer inline-flex items-center gap-2 rounded-full bg-brand-charcoal px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:opacity-90"
            >
              <Plus className="w-4 h-4" />
              Agregar Prenda
            </button>
          </div>

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

        <section className="px-8 py-8 space-y-8">
          {/* Filtros */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-end gap-4">
              {/* Estilo */}
              <div className="flex-1 min-w-[120px]">
                <label className="text-xs font-semibold text-brand-dark mb-2 block">Estilo</label>
                <div className="relative">
                  <select
                    value={filters.estilo}
                    onChange={(e) => handleFilterChange('estilo', e.target.value)}
                    className="w-full appearance-none rounded-3xl border border-brand-sand bg-white px-3 py-2 pr-8 text-xs text-brand-dark outline-none transition-all duration-200 hover:border-brand-dark/30"
                  >
                    <option value="">— Todas —</option>
                    {estilos.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-brand-dark/40" />
                </div>
              </div>

              {/* Ocasión */}
              <div className="flex-1 min-w-[120px]">
                <label className="text-xs font-semibold text-brand-dark mb-2 block">Ocasión</label>
                <div className="relative">
                  <select
                    value={filters.ocasion}
                    onChange={(e) => handleFilterChange('ocasion', e.target.value)}
                    className="w-full appearance-none rounded-3xl border border-brand-sand bg-white px-3 py-2 pr-8 text-xs text-brand-dark outline-none transition-all duration-200 hover:border-brand-dark/30"
                  >
                    <option value="">— Todas —</option>
                    {ocasiones.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-brand-dark/40" />
                </div>
              </div>

              {/* Color */}
              <div className="flex-1 min-w-[120px]">
                <label className="text-xs font-semibold text-brand-dark mb-2 block">Color</label>
                <div className="relative">
                  <select
                    value={filters.color}
                    onChange={(e) => handleFilterChange('color', e.target.value)}
                    className="w-full appearance-none rounded-3xl border border-brand-sand bg-white px-3 py-2 pr-8 text-xs text-brand-dark outline-none transition-all duration-200 hover:border-brand-dark/30"
                  >
                    <option value="">— Todas —</option>
                    {colores.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-brand-dark/40" />
                </div>
              </div>

              {/* Clima */}
              <div className="flex-1 min-w-[120px]">
                <label className="text-xs font-semibold text-brand-dark mb-2 block">Clima</label>
                <div className="relative">
                  <select
                    value={filters.clima}
                    onChange={(e) => handleFilterChange('clima', e.target.value)}
                    className="w-full appearance-none rounded-3xl border border-brand-sand bg-white px-3 py-2 pr-8 text-xs text-brand-dark outline-none transition-all duration-200 hover:border-brand-dark/30"
                  >
                    <option value="">— Todas —</option>
                    {climas.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-brand-dark/40" />
                </div>
              </div>

              {/* Tipo de Prenda */}
              <div className="flex-1 min-w-[120px]">
                <label className="text-xs font-semibold text-brand-dark mb-2 block">Tipo de Prenda</label>
                <div className="relative">
                  <select
                    value={filters.tipoPrenda}
                    onChange={(e) => handleFilterChange('tipoPrenda', e.target.value)}
                    className="w-full appearance-none rounded-3xl border border-brand-sand bg-white px-3 py-2 pr-8 text-xs text-brand-dark outline-none transition-all duration-200 hover:border-brand-dark/30"
                  >
                    <option value="">— Todas —</option>
                    {tiposPrenda.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-brand-dark/40" />
                </div>
              </div>

              {/* Categoría */}
              <div className="flex-1 min-w-[120px]">
                <label className="text-xs font-semibold text-brand-dark mb-2 block">Categoría</label>
                <div className="relative">
                  <select
                    value={filters.categoria}
                    onChange={(e) => handleFilterChange('categoria', e.target.value)}
                    className="w-full appearance-none rounded-3xl border border-brand-sand bg-white px-3 py-2 pr-8 text-xs text-brand-dark outline-none transition-all duration-200 hover:border-brand-dark/30"
                  >
                    <option value="">— Todas —</option>
                    {categorias.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-brand-dark/40" />
                </div>
              </div>

            </div>

            <div className="flex items-center justify-end gap-4">
              <button
                onClick={handleClearFilters}
                className="text-xs font-medium text-brand-dark/60 hover:text-brand-dark transition-colors hover:underline"
              >
                Limpiar filtros
              </button>
              <button
                onClick={handleApplyFilters}
                className="btn-shimmer relative inline-flex items-center rounded-full bg-brand-charcoal px-6 py-2 text-sm font-medium text-white transition-all duration-300 hover:opacity-90 overflow-hidden"
              >
                <span className="relative z-10">Buscar</span>
              </button>
            </div>
          </div>

          {/* Grid de prendas o estado vacío */}
          {prendas.length > 0 ? (
            <div className="grid grid-cols-4 gap-3">
              {prendasFiltradas.map((prenda) => (
                <button
                  key={prenda.id}
                  onClick={() => openModal(prenda)}
                  className="relative group aspect-square rounded-2xl overflow-hidden focus:outline-none"
                >
                  <img
                    src={prenda.image}
                    alt={prenda.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-brand-dark/55 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-1 px-3">
                    <p className="text-white text-sm font-semibold text-center leading-tight">{prenda.name}</p>
                    <p className="text-white/75 text-xs text-center">{prenda.style} — {prenda.type}</p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl glass-effect p-16 text-center" style={{ border: '4px solid rgba(209,213,219,0.6)', boxShadow: '0 4px 16px rgba(192,192,192,0.25)' }}>
              <div className="flex items-center justify-center mb-4">
                <ShoppingBag className="w-16 h-16 text-brand-dark/40" />
              </div>
              <h3 className="text-3xl font-serif font-bold text-brand-dark mb-2">Tu armario está vacío</h3>
              <p className="text-sm text-brand-dark/60 mb-6">Aún no has subido ninguna prenda. ¡Comienza ahora!</p>
              <button
                onClick={() => onAddCloth && onAddCloth()}
                className="btn-shimmer inline-flex items-center gap-2 rounded-full bg-brand-charcoal px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:opacity-90"
              >
                <Plus className="w-4 h-4" />
                Agregar Prenda
              </button>
            </div>
          )}
        </section>
      </main>

      {/* ── PANEL DE DETALLE ──────────────────────────────── */}
      {selectedPrenda && (
        <div
          className="fixed inset-0 bg-brand-dark/60 z-[100] flex items-center justify-center p-8"
          onClick={closeModal}
        >
          <div
            className="relative bg-white rounded-3xl overflow-hidden flex w-full max-w-3xl shadow-[0_32px_80px_rgba(44,42,41,0.25)] border-4 border-gray-300/50"
            style={{ maxHeight: '80vh' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botón cerrar */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-brand-sand/80 backdrop-blur-sm flex items-center justify-center hover:bg-brand-sand transition-colors"
            >
              <X className="w-4 h-4 text-brand-dark" />
            </button>

            {/* Imagen */}
            <div className="w-1/2 flex-shrink-0">
              <img
                src={selectedPrenda.image}
                alt={selectedPrenda.name}
                className="w-full h-full object-cover"
                style={{ maxHeight: '80vh' }}
              />
            </div>

            {/* Detalles */}
            <div className="flex-1 p-8 overflow-y-auto flex flex-col justify-between gap-6">
              <div className="flex flex-col gap-6">
                <h2 className="text-2xl font-serif font-bold text-brand-dark leading-tight pr-8">
                  {selectedPrenda.name}
                </h2>
                <div className="flex flex-col gap-5">
                  {/* Categoría */}
                  <div className="flex items-center gap-3">
                    <Tag className="w-4 h-4 text-brand-dark/40 flex-shrink-0" />
                    <span className="text-xs text-brand-dark/40 w-28 flex-shrink-0">Categoría</span>
                    {editMode ? (
                      <div className="relative flex-1">
                        <select
                          value={editFields.category}
                          onChange={(e) => setEditFields((p) => ({ ...p, category: e.target.value, type: '' }))}
                          className="w-full appearance-none text-sm text-brand-dark font-medium bg-brand-cream border border-brand-sand rounded-xl px-3 py-1 pr-7 outline-none focus:border-brand-dark/30 cursor-pointer"
                        >
                          <option value="">— Selecciona —</option>
                          {Object.keys(TIPOS_POR_CATEGORIA).map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-brand-dark/40" />
                      </div>
                    ) : (
                      <span className="text-sm text-brand-dark font-medium">{selectedPrenda.category || '—'}</span>
                    )}
                  </div>
                  {/* Tipo de prenda — dependiente de Categoría */}
                  <div className="flex items-center gap-3">
                    <Layers className="w-4 h-4 text-brand-dark/40 flex-shrink-0" />
                    <span className="text-xs text-brand-dark/40 w-28 flex-shrink-0">Tipo de prenda</span>
                    {editMode ? (
                      <div className="relative flex-1">
                        <select
                          value={editFields.type}
                          disabled={!editFields.category}
                          onChange={(e) => setEditFields((p) => ({ ...p, type: e.target.value }))}
                          className="w-full appearance-none text-sm text-brand-dark font-medium bg-brand-cream border border-brand-sand rounded-xl px-3 py-1 pr-7 outline-none focus:border-brand-dark/30 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <option value="">{editFields.category ? '— Selecciona —' : 'Selecciona primero una categoría'}</option>
                          {(TIPOS_POR_CATEGORIA[editFields.category] || []).map((tipo) => (
                            <option key={tipo} value={tipo}>{tipo}</option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-brand-dark/40" />
                      </div>
                    ) : (
                      <span className="text-sm text-brand-dark font-medium">{selectedPrenda.type || '—'}</span>
                    )}
                  </div>
                  {/* Color principal — no editable */}
                  <div className="flex items-center gap-3">
                    <Palette className="w-4 h-4 text-brand-dark/40 flex-shrink-0" />
                    <span className="text-xs text-brand-dark/40 w-28 flex-shrink-0">Color principal</span>
                    <span className="text-sm text-brand-dark font-medium">{selectedPrenda.color || '—'}</span>
                  </div>
                  {/* Estilo */}
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-4 h-4 text-brand-dark/40 flex-shrink-0" />
                    <span className="text-xs text-brand-dark/40 w-28 flex-shrink-0">Estilo</span>
                    {editMode ? (
                      <div className="relative flex-1">
                        <select
                          value={editFields.style}
                          onChange={(e) => setEditFields((p) => ({ ...p, style: e.target.value }))}
                          className="w-full appearance-none text-sm text-brand-dark font-medium bg-brand-cream border border-brand-sand rounded-xl px-3 py-1 pr-7 outline-none focus:border-brand-dark/30 cursor-pointer"
                        >
                          <option value="">— Selecciona —</option>
                          {ESTILOS_MOCK.map((estilo) => (
                            <option key={estilo} value={estilo}>{estilo}</option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-brand-dark/40" />
                      </div>
                    ) : (
                      <span className="text-sm text-brand-dark font-medium">{selectedPrenda.style || '—'}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer del panel */}
              <div className="flex items-center justify-between pt-4 border-t border-brand-sand/50">
                {/* Eliminar — izquierda */}
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="inline-flex items-center gap-2 text-sm font-medium text-red-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Eliminar prenda
                </button>

                {/* Editar / Guardar / Cancelar — derecha */}
                {editMode ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditMode(false);
                        setEditFields({ category: selectedPrenda.category || '', type: selectedPrenda.type || '', style: selectedPrenda.style || '' });
                      }}
                      className="btn-shimmer relative inline-flex items-center rounded-full bg-brand-sand px-4 py-1.5 text-xs font-medium text-brand-dark transition-all duration-300 hover:bg-brand-sand/70 overflow-hidden"
                    >
                      <span className="relative z-10">Cancelar</span>
                    </button>
                    <button
                      onClick={handleSave}
                      className="btn-shimmer relative inline-flex items-center rounded-full bg-brand-charcoal px-4 py-1.5 text-xs font-medium text-white transition-all duration-300 hover:opacity-90 overflow-hidden"
                    >
                      <span className="relative z-10">Guardar</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setEditMode(true);
                      setEditFields({ category: selectedPrenda.category || '', type: selectedPrenda.type || '', style: selectedPrenda.style || '' });
                    }}
                    className="btn-shimmer relative inline-flex items-center gap-2 rounded-full bg-brand-sand px-4 py-1.5 text-xs font-medium text-brand-dark transition-all duration-300 hover:bg-brand-sand/70 overflow-hidden"
                  >
                    <Pencil className="w-3.5 h-3.5 relative z-10" />
                    <span className="relative z-10">Editar</span>
                  </button>
                )}
              </div>
            </div>

            {/* ── CONFIRMACIÓN DE ELIMINACIÓN ─────────────────── */}
            {showDeleteConfirm && (
              <div
                className="absolute inset-0 bg-brand-dark/40 rounded-3xl flex items-center justify-center p-8"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-[0_16px_48px_rgba(44,42,41,0.2)] flex flex-col gap-5">
                  <p className="text-sm font-medium text-brand-dark text-center leading-relaxed">
                    ¿Estás segura de que quieres eliminar esta prenda?
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="btn-shimmer relative inline-flex items-center rounded-full bg-brand-sand px-5 py-2 text-xs font-medium text-brand-dark transition-all duration-300 hover:bg-brand-sand/70 overflow-hidden"
                    >
                      <span className="relative z-10">Cancelar</span>
                    </button>
                    <button
                      onClick={handleDelete}
                      className="inline-flex items-center rounded-full bg-red-500 px-5 py-2 text-xs font-medium text-white hover:bg-red-600 transition-colors"
                    >
                      Sí, eliminar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TOAST ─────────────────────────────────────────── */}
      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] px-6 py-3 rounded-full bg-white shadow-[0_8px_32px_rgba(44,42,41,0.15)] border border-brand-sand flex items-center gap-2 pointer-events-none">
          <span className="text-sm font-medium text-green-600">{toast}</span>
        </div>
      )}
    </div>
  );
};

export default WardrobePage;
