import { useEffect, useRef, useState, useCallback } from 'react';
import {
  Home, Shirt, Zap, Heart, Settings, HelpCircle,
  ChevronDown, LogOut, Plus, ShoppingBag,
  Tag, Palette, Sparkles, Layers, Pencil, Trash2, X, Lightbulb, Loader2, Cloud,
} from 'lucide-react';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';

const WardrobePage = ({
  user,
  onLogout,
  onAddCloth,
  onGoToHome,
  onGoToOutfits,
  onGoToFavorites,
  onGoToConfig,
  prendas = [],
  onEliminarPrenda = () => {},
  onActualizarPrenda = () => {},
}) => {
  const [profileMenuOpen,   setProfileMenuOpen]   = useState(false);
  const [showHelpPanel,     setShowHelpPanel]     = useState(false);
  const [selectedDetail,    setSelectedDetail]    = useState(null);   // ClothingDetailResponse
  const [loadingDetail,     setLoadingDetail]     = useState(false);
  const [editMode,          setEditMode]          = useState(false);
  const [editFields,        setEditFields]        = useState({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting,        setIsDeleting]        = useState(false);
  const [isSaving,          setIsSaving]          = useState(false);
  const [editCatalog,       setEditCatalog]       = useState({ categories: [], styles: [], colors: [], occasions: [], weathers: [] });
  const [toast,             setToast]             = useState('');
  const [filterCategory,    setFilterCategory]    = useState('');
  const profileMenuRef = useRef(null);

  // ── Edit catalog ─────────────────────────────────────────────────────────────

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) return;
    fetch(`${apiBaseUrl}/api/v1/wardrobe/catalog/edit`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) setEditCatalog(data); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const parentCategories = editCatalog.categories.filter(c => !c.parentId);

  // ── Open detail modal ─────────────────────────────────────────────────────────

  const openModal = useCallback(async (prenda) => {
    setShowDeleteConfirm(false);
    setEditMode(false);
    setLoadingDetail(true);
    setSelectedDetail({ id: prenda.id, imageUrl: prenda.imageUrl, categoryName: prenda.categoryName });

    const token = localStorage.getItem('authToken');
    try {
      const res    = await fetch(`${apiBaseUrl}/api/v1/wardrobe/${prenda.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const detail = await res.json();
      setSelectedDetail(detail);
      setEditFields({
        categoryId:   detail.categoryId   ?? '',
        categoryName: detail.categoryName ?? '',
        styleId:      detail.styleId      ?? '',
        styleName:    detail.styleName    ?? '',
        colorId:      detail.colorId      ?? '',
        occasionIds:  detail.occasionId   ? [detail.occasionId]  : [],
        weatherIds:   detail.weatherId    ? [detail.weatherId]   : [],
      });
    } catch (err) {
      console.error('WardrobePage: error cargando detalle', err);
    } finally {
      setLoadingDetail(false);
    }
  }, []);

  const closeModal = () => {
    setSelectedDetail(null);
    setEditMode(false);
    setShowDeleteConfirm(false);
  };

  // ── Delete ────────────────────────────────────────────────────────────────────

  const handleDelete = async () => {
    if (!selectedDetail?.id) return;
    setIsDeleting(true);
    const token = localStorage.getItem('authToken');
    try {
      const res = await fetch(
        `${apiBaseUrl}/api/v1/wardrobe/${selectedDetail.id}?userId=${user?.id}`,
        { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.ok || res.status === 204) {
        onEliminarPrenda(selectedDetail.id);
        closeModal();
        showToast('Prenda eliminada');
      }
    } catch (err) {
      console.error('WardrobePage: error eliminando prenda', err);
    } finally {
      setIsDeleting(false);
    }
  };

  // ── Edit save ─────────────────────────────────────────────────────────────────

  const handleSave = async () => {
    if (!selectedDetail?.id || !editFields.categoryId || !editFields.styleId) return;
    setIsSaving(true);
    const token = localStorage.getItem('authToken');
    try {
      const res = await fetch(
        `${apiBaseUrl}/api/v1/wardrobe/${selectedDetail.id}?userId=${user?.id}`,
        {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            typeId:      editFields.categoryId,
            categoryId:  editFields.categoryId,
            styleId:     editFields.styleId,
            colorId:     editFields.colorId     || null,
            occasionIds: editFields.occasionIds || [],
            weatherIds:  editFields.weatherIds  || [],
          }),
        }
      );
      if (res.ok) {
        const updated = await res.json();
        setSelectedDetail(updated);
        onActualizarPrenda(selectedDetail.id, { categoryName: updated.categoryName });
        setEditMode(false);
        showToast('Cambios guardados');
      }
    } catch (err) {
      console.error('WardrobePage: error actualizando prenda', err);
    } finally {
      setIsSaving(false);
    }
  };

  // ── Filter ────────────────────────────────────────────────────────────────────

  const prendasFiltradas = filterCategory
    ? prendas.filter(p => p.categoryName === filterCategory)
    : prendas;

  const getInitials = (name) => (name ?? 'DM').split(' ').map(p => p[0]).join('').toUpperCase();

  return (
    <div className="relative min-h-screen bg-brand-cream overflow-hidden">
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1920&q=80')", backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.09 }}
      />

      {/* SIDEBAR */}
      <aside className="fixed left-0 top-0 w-64 h-screen bg-brand-cream border-r-4 border-gray-300/70 flex flex-col justify-between p-6 z-50">
        <div>
          <div className="font-serif italic text-2xl font-normal text-brand-dark tracking-wide select-none cursor-pointer">DressMe</div>
          <nav className="flex flex-col gap-3 mt-12">
            {[
              { icon: Home,     label: 'Inicio',         action: onGoToHome },
              { icon: Shirt,    label: 'Mi Armario',      action: null,       active: true },
              { icon: Zap,      label: 'Outfits',         action: onGoToOutfits },
              { icon: Heart,    label: 'Favoritos',       action: onGoToFavorites },
              { icon: Settings, label: 'Configuración',   action: onGoToConfig },
            ].map(({ icon: Icon, label, action, active }) => (
              <button
                key={label}
                onClick={() => action?.()}
                className={`btn-shimmer relative overflow-hidden flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium border-2 transition-all duration-200 ${active ? 'bg-brand-charcoal text-white border-gray-400/50' : 'text-brand-dark hover:bg-brand-charcoal hover:text-white border-gray-300/50 hover:border-gray-400/50'}`}
              >
                <Icon className="w-5 h-5" /> {label}
              </button>
            ))}
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
                {['📸 Sube fotos con buena iluminación','👗 Entre más prendas subas, mejores outfits','✨ Calibra tu estilo en Configuración','🎯 Usa los filtros para encontrar prendas','❤️ Guarda tus outfits favoritos'].map((tip, i) => (
                  <li key={i} className="text-xs text-brand-dark/60 leading-relaxed">{tip}</li>
                ))}
              </ul>
            </div>
          )}
          <button onClick={() => setShowHelpPanel(v => !v)} className="flex items-center gap-3 px-4 py-3 rounded-2xl text-brand-dark/60 hover:text-brand-dark hover:bg-brand-sand/40 transition-all duration-200 text-sm font-medium w-full">
            <HelpCircle className="w-5 h-5" /> Ayuda
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="ml-64">
        <header className="bg-brand-cream border-b border-brand-sand px-8 py-8 flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-end gap-6">
            <div>
              <h1 className="text-4xl font-serif font-bold text-brand-dark mb-2">Mis Prendas</h1>
              <p className="text-sm text-brand-dark/60">{prendas.length} prendas</p>
            </div>
            <button
              onClick={() => onAddCloth?.()}
              className="btn-shimmer inline-flex items-center gap-2 rounded-full bg-brand-charcoal px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:opacity-90"
            >
              <Plus className="w-4 h-4" /> Agregar Prenda
            </button>
          </div>

          <div className="relative" ref={profileMenuRef}>
            <button onClick={() => setProfileMenuOpen(!profileMenuOpen)} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              {user?.profilePicture ? (
                <img src={user?.profilePicture} alt={user?.displayName ?? 'Usuario'} className="w-12 h-12 rounded-full object-cover border border-brand-dark/10 ring-2 ring-gray-400/80 ring-offset-1" />
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
                <button onClick={() => { setProfileMenuOpen(false); onLogout(); }} className="w-full flex items-center gap-2 px-4 py-3 text-brand-dark hover:bg-brand-sand/40 transition-colors text-sm font-medium text-left">
                  <LogOut className="w-4 h-4" /> Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </header>

        <section className="px-8 py-8 space-y-8">
          {/* Filtro rápido por categoría */}
          <div className="flex items-center gap-4">
            <label className="text-xs font-semibold text-brand-dark">Categoría</label>
            <div className="relative">
              <select
                value={filterCategory}
                onChange={e => setFilterCategory(e.target.value)}
                className="appearance-none rounded-3xl border border-brand-sand bg-white px-4 py-2 pr-8 text-xs text-brand-dark outline-none transition-all hover:border-brand-dark/30"
              >
                <option value="">— Todas —</option>
                {[...new Set((Array.isArray(prendas) ? prendas : []).map(p => p.categoryName).filter(Boolean))].map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-brand-dark/40" />
            </div>
            {filterCategory && (
              <button onClick={() => setFilterCategory('')} className="text-xs text-brand-dark/50 hover:text-brand-dark underline">
                Limpiar
              </button>
            )}
          </div>

          {/* Grid */}
          {prendas.length > 0 ? (
            <div className="grid grid-cols-4 gap-3">
              {(Array.isArray(prendasFiltradas) ? prendasFiltradas : []).map((prenda) => (
                <button
                  key={prenda.id}
                  onClick={() => openModal(prenda)}
                  className="relative group aspect-square rounded-2xl overflow-hidden focus:outline-none"
                >
                  <img
                    src={prenda.imageUrl}
                    alt={prenda.categoryName || 'Prenda'}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* isProcessed badge */}
                  {!prenda.isProcessed && (
                    <div className="absolute top-2 left-2 bg-amber-400/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                      Analizando
                    </div>
                  )}
                  <div className="absolute inset-0 bg-brand-dark/55 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-1 px-3">
                    <p className="text-white text-sm font-semibold text-center leading-tight">
                      {prenda.categoryName || 'Prenda'}
                    </p>
                    {!prenda.isProcessed && (
                      <p className="text-white/75 text-xs text-center">Análisis IA en curso…</p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl glass-effect p-16 text-center" style={{ border: '4px solid rgba(209,213,219,0.6)' }}>
              <ShoppingBag className="w-16 h-16 text-brand-dark/40 mx-auto mb-4" />
              <h3 className="text-3xl font-serif font-bold text-brand-dark mb-2">Tu armario está vacío</h3>
              <p className="text-sm text-brand-dark/60 mb-6">¡Sube tu primera prenda!</p>
              <button onClick={() => onAddCloth?.()} className="btn-shimmer inline-flex items-center gap-2 rounded-full bg-brand-charcoal px-6 py-3 text-sm font-medium text-white">
                <Plus className="w-4 h-4" /> Agregar Prenda
              </button>
            </div>
          )}
        </section>
      </main>

      {/* ── MODAL DETALLE ─────────────────────────────────────────────────────── */}
      {selectedDetail && (
        <div className="fixed inset-0 bg-brand-dark/60 z-[100] flex items-center justify-center p-8" onClick={closeModal}>
          <div
            className="relative bg-white rounded-3xl overflow-hidden flex w-full max-w-3xl shadow-[0_32px_80px_rgba(44,42,41,0.25)] border-4 border-gray-300/50"
            style={{ maxHeight: '80vh' }}
            onClick={e => e.stopPropagation()}
          >
            <button onClick={closeModal} className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-brand-sand/80 flex items-center justify-center hover:bg-brand-sand transition-colors">
              <X className="w-4 h-4 text-brand-dark" />
            </button>

            {/* Imagen */}
            <div className="w-1/2 flex-shrink-0">
              <img src={selectedDetail.imageUrl} alt="Prenda" className="w-full h-full object-cover" style={{ maxHeight: '80vh' }} />
            </div>

            {/* Info */}
            <div className="flex-1 p-8 overflow-y-auto flex flex-col justify-between gap-6">
              {loadingDetail ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="w-8 h-8 animate-spin text-brand-dark/40" />
                </div>
              ) : (
                <>
                  <div className="flex flex-col gap-5">
                    <div className="flex items-start justify-between">
                      <h2 className="text-xl font-serif font-bold text-brand-dark pr-4">
                        {selectedDetail.categoryName || 'Prenda'}
                      </h2>
                      {!editMode && (
                        <button
                          onClick={() => setEditMode(true)}
                          className="btn-shimmer relative inline-flex items-center gap-2 rounded-full bg-brand-sand px-4 py-1.5 text-xs font-medium text-brand-dark flex-shrink-0"
                        >
                          <Pencil className="w-3.5 h-3.5" /> Editar
                        </button>
                      )}
                    </div>

                    {/* Categoría */}
                    <div className="flex items-center gap-3">
                      <Tag className="w-4 h-4 text-brand-dark/40 flex-shrink-0" />
                      <span className="text-xs text-brand-dark/40 w-28 flex-shrink-0">Categoría</span>
                      {editMode ? (
                        <div className="relative flex-1">
                          <select
                            value={editFields.categoryId}
                            onChange={e => {
                              const cat = editCatalog.categories.find(c => c.id === e.target.value);
                              setEditFields(p => ({ ...p, categoryId: e.target.value, categoryName: cat?.name ?? '' }));
                            }}
                            className="w-full appearance-none text-sm text-brand-dark font-medium bg-brand-cream border border-brand-sand rounded-xl px-3 py-1 pr-7 outline-none focus:border-brand-dark/30 cursor-pointer"
                          >
                            <option value="">— Selecciona —</option>
                            {(Array.isArray(parentCategories) ? parentCategories : []).map(parent => (
                              <option key={parent.id} value={parent.id}>{parent.name}</option>
                            ))}
                          </select>
                          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-brand-dark/40" />
                        </div>
                      ) : (
                        <span className="text-sm text-brand-dark font-medium">
                          {(() => {
                            const cat = editCatalog.categories.find(c => c.id === selectedDetail.categoryId);
                            return cat?.name || selectedDetail.categoryName || '—';
                          })()}
                        </span>
                      )}
                    </div>

                    {/* Estilo */}
                    <div className="flex items-center gap-3">
                      <Sparkles className="w-4 h-4 text-brand-dark/40 flex-shrink-0" />
                      <span className="text-xs text-brand-dark/40 w-28 flex-shrink-0">Estilo</span>
                      {editMode ? (
                        <div className="relative flex-1">
                          <select
                            value={editFields.styleId}
                            onChange={e => {
                              const style = editCatalog.styles.find(s => s.id === e.target.value);
                              setEditFields(p => ({ ...p, styleId: e.target.value, styleName: style?.name ?? '' }));
                            }}
                            className="w-full appearance-none text-sm text-brand-dark font-medium bg-brand-cream border border-brand-sand rounded-xl px-3 py-1 pr-7 outline-none focus:border-brand-dark/30 cursor-pointer"
                          >
                            <option value="">— Selecciona —</option>
                            {(Array.isArray(editCatalog.styles) ? editCatalog.styles : []).map(s => (
                              <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                          </select>
                          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-brand-dark/40" />
                        </div>
                      ) : (
                        <span className="text-sm text-brand-dark font-medium">{selectedDetail.styleName || '—'}</span>
                      )}
                    </div>

                    {/* Color principal */}
                    <div className="flex items-center gap-3">
                      <Palette className="w-4 h-4 text-brand-dark/40 flex-shrink-0" />
                      <span className="text-xs text-brand-dark/40 w-28 flex-shrink-0">Color principal</span>
                      {editMode ? (
                        <div className="relative flex-1">
                          <select
                            value={editFields.colorId}
                            onChange={e => setEditFields(p => ({ ...p, colorId: e.target.value }))}
                            className="w-full appearance-none text-sm text-brand-dark font-medium bg-brand-cream border border-brand-sand rounded-xl px-3 py-1 pr-7 outline-none focus:border-brand-dark/30 cursor-pointer"
                          >
                            <option value="">— Selecciona —</option>
                            {(Array.isArray(editCatalog.colors) ? editCatalog.colors : []).map(c => (
                              <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                          </select>
                          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-brand-dark/40" />
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          {selectedDetail.colorHex && (
                            <span className="w-4 h-4 rounded-full border border-brand-sand/50 flex-shrink-0" style={{ backgroundColor: selectedDetail.colorHex }} />
                          )}
                          <span className="text-sm text-brand-dark font-medium">{selectedDetail.colorName || '—'}</span>
                        </div>
                      )}
                    </div>

                    {/* Ocasión */}
                    <div className="flex items-start gap-3">
                      <Layers className="w-4 h-4 text-brand-dark/40 flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-brand-dark/40 w-28 flex-shrink-0 mt-0.5">Ocasión</span>
                      {editMode ? (
                        <div className="flex flex-wrap gap-1.5 flex-1">
                          {(Array.isArray(editCatalog.occasions) ? editCatalog.occasions : []).map(o => {
                            const selected = (editFields.occasionIds || []).includes(o.id);
                            return (
                              <button
                                key={o.id}
                                type="button"
                                onClick={() => setEditFields(p => ({
                                  ...p,
                                  occasionIds: selected
                                    ? p.occasionIds.filter(id => id !== o.id)
                                    : [...(p.occasionIds || []), o.id],
                                }))}
                                className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                                  selected
                                    ? 'bg-brand-charcoal text-white border-brand-charcoal'
                                    : 'bg-brand-cream text-brand-dark/60 border-brand-sand hover:border-brand-dark/30'
                                }`}
                              >
                                {o.name}
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <span className="text-sm text-brand-dark font-medium mt-0.5">{selectedDetail.occasionName || '—'}</span>
                      )}
                    </div>

                    {/* Clima */}
                    <div className="flex items-start gap-3">
                      <Cloud className="w-4 h-4 text-brand-dark/40 flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-brand-dark/40 w-28 flex-shrink-0 mt-0.5">Clima</span>
                      {editMode ? (
                        <div className="flex flex-wrap gap-1.5 flex-1">
                          {(Array.isArray(editCatalog.weathers) ? editCatalog.weathers : []).map(w => {
                            const selected = (editFields.weatherIds || []).includes(w.id);
                            return (
                              <button
                                key={w.id}
                                type="button"
                                onClick={() => setEditFields(p => ({
                                  ...p,
                                  weatherIds: selected
                                    ? p.weatherIds.filter(id => id !== w.id)
                                    : [...(p.weatherIds || []), w.id],
                                }))}
                                className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                                  selected
                                    ? 'bg-brand-charcoal text-white border-brand-charcoal'
                                    : 'bg-brand-cream text-brand-dark/60 border-brand-sand hover:border-brand-dark/30'
                                }`}
                              >
                                {w.name}
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <span className="text-sm text-brand-dark font-medium mt-0.5">{selectedDetail.weatherName || '—'}</span>
                      )}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-brand-sand/50">
                    <button onClick={() => setShowDeleteConfirm(true)} className="inline-flex items-center gap-2 text-sm font-medium text-red-400 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" /> Eliminar
                    </button>

                    {editMode && (
                      <div className="flex items-center gap-2">
                        <button onClick={() => setEditMode(false)} className="btn-shimmer relative inline-flex items-center rounded-full bg-brand-sand px-4 py-1.5 text-xs font-medium text-brand-dark">
                          Cancelar
                        </button>
                        <button onClick={handleSave} disabled={isSaving} className="btn-shimmer relative inline-flex items-center gap-1 rounded-full bg-brand-charcoal px-4 py-1.5 text-xs font-medium text-white disabled:opacity-60">
                          {isSaving && <Loader2 className="w-3 h-3 animate-spin" />}
                          Guardar
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Confirmación eliminar */}
              {showDeleteConfirm && (
                <div className="absolute inset-0 bg-brand-dark/40 rounded-3xl flex items-center justify-center p-8" onClick={e => e.stopPropagation()}>
                  <div className="bg-white rounded-2xl p-6 max-w-sm w-full flex flex-col gap-5">
                    <p className="text-sm font-medium text-brand-dark text-center">¿Eliminar esta prenda?</p>
                    <div className="flex items-center justify-center gap-3">
                      <button onClick={() => setShowDeleteConfirm(false)} className="btn-shimmer relative inline-flex items-center rounded-full bg-brand-sand px-5 py-2 text-xs font-medium text-brand-dark">
                        Cancelar
                      </button>
                      <button onClick={handleDelete} disabled={isDeleting} className="inline-flex items-center gap-1 rounded-full bg-red-500 px-5 py-2 text-xs font-medium text-white hover:bg-red-600 disabled:opacity-60">
                        {isDeleting && <Loader2 className="w-3 h-3 animate-spin" />}
                        Sí, eliminar
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] px-6 py-3 rounded-full bg-white shadow-lg border border-brand-sand pointer-events-none">
          <span className="text-sm font-medium text-green-600">{toast}</span>
        </div>
      )}
    </div>
  );
};

export default WardrobePage;
