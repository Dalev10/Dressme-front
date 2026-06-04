import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Cloud, LogOut, ChevronDown, Loader2, AlertCircle,
  Tag, Layers, Palette, Sparkles, Pencil, X,
} from 'lucide-react';
import GlassContainer from '../components/GlassContainer';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';

const POLL_INTERVAL_MS = 2500;
const POLL_TIMEOUT_MS  = 60000;

const WardrobeUploadPage = ({ user, onLogout, onUploadComplete, isFirstTime = false, onPrendaGuardada = () => {}, editCatalog: editCatalogProp }) => {
  const [isDragging,       setIsDragging]       = useState(false);
  const [isUploading,      setIsUploading]       = useState(false);
  const [isAnalyzing,      setIsAnalyzing]       = useState(false);
  const [uploadError,      setUploadError]       = useState('');
  const [selectedFile,     setSelectedFile]      = useState(null);
  const [profileMenuOpen,  setProfileMenuOpen]   = useState(false);
  const [aiResult,         setAiResult]          = useState(null);
  const [editMode,         setEditMode]          = useState(false);
  const [editedData,       setEditedData]        = useState({});
  const [showConfirmModal, setShowConfirmModal]  = useState(false);
  const [previewUrl,       setPreviewUrl]        = useState(null);
  const editCatalog = editCatalogProp ?? { categories: [], styles: [] };
  const [isSaving,         setIsSaving]          = useState(false);

  const fileInputRef      = useRef(null);
  const profileMenuRef    = useRef(null);
  const pollTimerRef      = useRef(null);
  const editCatalogRef    = useRef(editCatalog);
  useEffect(() => { editCatalogRef.current = editCatalog; }, [editCatalog]);

  // ── Preview URL ───────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!selectedFile) { setPreviewUrl(null); return; }
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [selectedFile]);

  // ── Click outside profile menu ────────────────────────────────────────────────

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ── Cleanup polling on unmount ─────────────────────────────────────────────────

  useEffect(() => () => { if (pollTimerRef.current) clearTimeout(pollTimerRef.current); }, []);

  // ── Derived catalog helpers ───────────────────────────────────────────────────

  const parentCategories = editCatalog.categories.filter(c => !c.parentId);
  const childrenOf = (parentId) => editCatalog.categories.filter(c => c.parentId === parentId);

  // ── File validation ───────────────────────────────────────────────────────────

  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const MAX_SIZE = 8 * 1024 * 1024;

  const validateFile = (file) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      setUploadError('Solo se permiten imágenes (JPG, PNG, GIF, WebP)');
      return false;
    }
    if (file.size > MAX_SIZE) {
      setUploadError('El archivo no puede superar 8MB');
      return false;
    }
    setUploadError('');
    return true;
  };

  const handleDragEnter = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); };
  const handleDragOver  = (e) => { e.preventDefault(); e.stopPropagation(); };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0 && validateFile(files[0])) setSelectedFile(files[0]);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) setSelectedFile(file);
  };

  // ── Polling until AI finishes ─────────────────────────────────────────────────

  const pollDetail = useCallback((clothingId, deadline) => {
    const token = localStorage.getItem('authToken');

    pollTimerRef.current = setTimeout(async () => {
      try {
        const res  = await fetch(`${apiBaseUrl}/api/v1/wardrobe/${clothingId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const detail = await res.json();

        if (detail.isProcessed) {
          setIsAnalyzing(false);
          const catEntry = editCatalogRef.current.categories.find(c => c.id === detail.categoryId);
          setAiResult({
            id:          detail.id,
            imageUrl:    detail.imageUrl,
            category:    detail.categoryName    ?? '—',
            style:       detail.styleName       ?? '—',
            color:       detail.colorName       ?? '—',
            ocasion:     detail.occasionName    ?? '—',
            clima:       detail.weatherName     ?? '—',
            categoryId:  detail.categoryId,
            typeId:      catEntry?.parentId ?? detail.categoryId,
            styleId:     detail.styleId,
          });
        } else if (Date.now() < deadline) {
          pollDetail(clothingId, deadline);
        } else {
          // Timeout — mostrar lo que haya aunque isProcessed=false
          setIsAnalyzing(false);
          setAiResult({
            id:       detail.id,
            imageUrl: detail.imageUrl,
            category: detail.categoryName ?? '—',
            style:    '—',
            color:    '—',
            ocasion:  '—',
            clima:    '—',
          });
          setUploadError('El análisis tardó más de lo esperado. Puedes editar la prenda manualmente.');
        }
      } catch (err) {
        setIsAnalyzing(false);
        setUploadError('Error consultando el resultado del análisis.');
      }
    }, POLL_INTERVAL_MS);
  }, []);

  // ── Upload ────────────────────────────────────────────────────────────────────

  const handleUpload = async () => {
    if (!selectedFile) { setUploadError('Por favor selecciona una imagen'); return; }

    setIsUploading(true);
    setUploadError('');

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('userId', user?.id ?? localStorage.getItem('userId'));

      const token    = localStorage.getItem('authToken');
      const response = await fetch(`${apiBaseUrl}/api/v1/wardrobe/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) {
        let msg = `Error ${response.status}`;
        try { const err = await response.json(); msg = err.message || msg; } catch {}
        throw new Error(msg);
      }

      const item = await response.json();
      // La prenda es un borrador hasta que el usuario confirme con "Aceptar y guardar".
      // Guardamos el id para poder descartarla si cierra el modal o recarga la página.
      localStorage.setItem('pending_clothing_id', item.id);
      setIsUploading(false);
      setIsAnalyzing(true);
      pollDetail(item.id, Date.now() + POLL_TIMEOUT_MS);

    } catch (err) {
      setIsUploading(false);
      setUploadError(err instanceof Error ? err.message : 'Error al subir la imagen');
    }
  };

  // ── Edit save ─────────────────────────────────────────────────────────────────

  const handleSaveEdit = () => {
    setAiResult(prev => ({
      ...prev,
      category:   editedData.categoryName  ?? prev.category,
      style:      editedData.styleName     ?? prev.style,
      categoryId: editedData.categoryId    ?? prev.categoryId,
      typeId:     editedData.typeId        ?? prev.typeId,
      styleId:    editedData.styleId       ?? prev.styleId,
      _edited:    true,
    }));
    setEditMode(false);
  };

  // ── Discard draft ─────────────────────────────────────────────────────────────
  // Borra la prenda no confirmada. Se llama al cerrar el modal sin guardar.

  const discardDraft = useCallback(() => {
    const clothingId = aiResult?.id ?? localStorage.getItem('pending_clothing_id');
    if (pollTimerRef.current) clearTimeout(pollTimerRef.current);
    localStorage.removeItem('pending_clothing_id');
    setAiResult(null);
    setEditMode(false);
    setEditedData({});
    setIsAnalyzing(false);

    if (clothingId) {
      const token  = localStorage.getItem('authToken');
      const userId = user?.id ?? localStorage.getItem('userId');
      fetch(`${apiBaseUrl}/api/v1/wardrobe/${clothingId}?userId=${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }
  }, [aiResult, user]);

  // ── Accept & save ─────────────────────────────────────────────────────────────

  const handleAccept = async () => {
    if (!aiResult?.id) return;
    setIsSaving(true);
    // Confirmada: ya no es borrador.
    localStorage.removeItem('pending_clothing_id');

    try {
      // If user manually edited category or style, PATCH to backend
      if (aiResult._edited && aiResult.categoryId && aiResult.styleId) {
        const token = localStorage.getItem('authToken');
        await fetch(
          `${apiBaseUrl}/api/v1/wardrobe/${aiResult.id}?userId=${user?.id}`,
          {
            method: 'PATCH',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              typeId:     aiResult.typeId ?? aiResult.categoryId,
              categoryId: aiResult.categoryId,
              styleId:    aiResult.styleId,
            }),
          }
        );
      }
    } catch (err) {
      console.error('WardrobeUploadPage: error actualizando prenda', err);
    } finally {
      setIsSaving(false);
      onPrendaGuardada();
      setShowConfirmModal(true);
    }
  };

  const handleUploadAnother = () => {
    setAiResult(null);
    setSelectedFile(null);
    setEditMode(false);
    setEditedData({});
    setShowConfirmModal(false);
    setUploadError('');
  };

  return (
    <div className="relative min-h-screen bg-[#F4F0EA] flex flex-col overflow-hidden">
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1920&q=80')", backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.09 }}
      />

      {/* HEADER */}
      <header className="relative z-10 px-6 py-6 md:px-12">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="font-serif italic text-2xl font-normal text-brand-dark tracking-wide select-none">
            DressMe
          </div>
          {isFirstTime && (
            <div className="text-center text-sm md:text-base text-brand-dark/70 font-sans font-medium">
              <span className="text-brand-bronze">Paso 3 de 3:</span> Tu Armario Virtual
            </div>
          )}
          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="flex items-center gap-3 hover:opacity-75 transition-opacity"
            >
              {user?.profilePicture && (
                <img
                  src={user.profilePicture}
                  alt={user.displayName}
                  className="w-10 h-10 rounded-full object-cover border border-brand-dark/10 ring-2 ring-gray-400/80 ring-offset-1"
                />
              )}
              <div className="hidden md:flex flex-col items-end">
                <p className="text-sm font-semibold text-brand-dark">{user?.displayName || 'Usuario'}</p>
                <p className="text-xs text-brand-dark/60">{user?.email?.split('@')[0] || ''}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-brand-dark/60" />
            </button>
            {profileMenuOpen && (
              <div className="absolute right-0 top-full mt-2 glass-effect rounded-2xl shadow-xl p-4 w-48 border border-white/40 animate-slide-up z-20">
                <button
                  onClick={onLogout}
                  className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-brand-dark hover:bg-brand-dark/5 transition-colors text-left"
                >
                  <LogOut className="w-4 h-4" />
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="flex-grow flex flex-col items-center justify-center px-6 py-12 md:py-16">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-12 md:mb-16 animate-slide-up">
            <h1 className="text-4xl md:text-5xl font-serif italic font-normal text-brand-dark mb-4">
              Lleva tu armario al mundo digital
            </h1>
            <p className="text-lg md:text-xl text-brand-dark/70 font-sans font-normal">
              Sube tus prendas y nuestra IA las analizará automáticamente.
            </p>
          </div>

          <GlassContainer className="p-8 md:p-12 mb-8 animate-slide-up-delay">
            <div
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`flex flex-col items-center justify-center py-16 md:py-20 px-6 rounded-3xl border-2 border-dashed transition-all duration-300 cursor-pointer ${isDragging ? 'border-brand-bronze bg-brand-bronze/5' : 'border-brand-dark/20 hover:border-brand-bronze/50'}`}
            >
              <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center mb-6 transition-all duration-300 ${isDragging ? 'bg-brand-bronze/20' : 'bg-brand-dark/5'}`}>
                <Cloud className={`w-10 h-10 md:w-12 md:h-12 ${isDragging ? 'text-brand-bronze' : 'text-brand-dark/60'}`} />
              </div>
              {selectedFile ? (
                <div className="text-center">
                  <p className="text-lg font-semibold text-brand-dark mb-1">{selectedFile.name}</p>
                  <p className="text-sm text-brand-dark/60">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              ) : (
                <>
                  <p className="text-lg md:text-xl font-semibold text-brand-dark mb-2 text-center">
                    Arrastra tus prendas aquí o haz clic para seleccionar
                  </p>
                  <p className="text-sm text-brand-dark/60 text-center">
                    Formatos: JPG, PNG, GIF, WebP (máximo 8MB)
                  </p>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {isAnalyzing && (
              <div className="mt-6 p-4 rounded-2xl bg-brand-sand/40 border border-brand-sand flex items-center gap-3">
                <Loader2 className="w-5 h-5 text-brand-dark/60 animate-spin flex-shrink-0" />
                <p className="text-sm text-brand-dark/70">Analizando tu prenda con IA... esto tarda unos segundos.</p>
              </div>
            )}

            {uploadError && (
              <div className="mt-6 p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{uploadError}</p>
              </div>
            )}
          </GlassContainer>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up-delay-more">
            <button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading || isAnalyzing}
              className={`px-8 py-4 rounded-full font-semibold text-base md:text-lg transition-all duration-300 flex items-center justify-center gap-2 min-w-[200px] btn-shimmer relative overflow-hidden ${selectedFile && !isUploading && !isAnalyzing ? 'bg-brand-dark text-white hover:opacity-90' : 'bg-brand-dark/50 text-white/70 cursor-not-allowed'}`}
            >
              {(isUploading || isAnalyzing) && <Loader2 className="w-5 h-5 animate-spin" />}
              {isUploading ? 'Subiendo...' : isAnalyzing ? 'Analizando...' : 'Sube tu prenda →'}
            </button>
            <button
              onClick={() => {
                // Si hay un borrador sin confirmar (análisis en curso), descártalo antes de salir.
                if (localStorage.getItem('pending_clothing_id')) discardDraft();
                onUploadComplete && onUploadComplete();
              }}
              className="px-8 py-4 rounded-full font-semibold text-base md:text-lg transition-all duration-300 border-2 border-brand-dark text-brand-dark hover:bg-brand-dark/5"
            >
              {isFirstTime ? 'Continuar' : 'Salir'}
            </button>
          </div>
        </div>
      </main>

      {/* ── MODAL RESULTADO IA ─────────────────────────────────────────────────── */}
      {aiResult && !showConfirmModal && (
        <div className="fixed inset-0 bg-brand-dark/60 z-[100] flex items-center justify-center p-8">
          <div className="relative bg-white rounded-3xl overflow-hidden flex w-full max-w-4xl max-h-[90vh] shadow-[0_32px_80px_rgba(44,42,41,0.25)] border-4 border-gray-300/50">
            <button
              onClick={discardDraft}
              className="absolute top-4 right-4 z-10 flex items-center justify-center w-8 h-8 rounded-full border border-brand-dark/15 bg-transparent text-brand-dark/50 hover:text-brand-dark hover:border-brand-dark/30 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Imagen */}
            <div className="w-1/2 flex-shrink-0 min-h-[400px]">
              {previewUrl && (
                <img src={previewUrl} alt="Prenda subida" className="w-full h-full object-cover" />
              )}
            </div>

            {/* Detalles */}
            <div className="flex-1 pl-8 pb-8 pt-14 pr-14 flex flex-col justify-between gap-6 min-h-fit">
              <div>
                <div className="flex items-start justify-between mb-1">
                  <h2 className="text-2xl font-serif font-bold text-brand-dark leading-tight">
                    Características detectadas
                  </h2>
                  {editMode ? (
                    <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                      <button
                        onClick={() => { setEditMode(false); setEditedData({}); }}
                        className="btn-shimmer relative inline-flex items-center rounded-full bg-brand-sand px-4 py-1.5 text-xs font-medium text-brand-dark transition-all duration-300 hover:bg-brand-sand/70 overflow-hidden"
                      >
                        <span className="relative z-10">Cancelar</span>
                      </button>
                      <button
                        onClick={handleSaveEdit}
                        className="btn-shimmer relative inline-flex items-center rounded-full bg-brand-charcoal px-4 py-1.5 text-xs font-medium text-white transition-all duration-300 hover:opacity-90 overflow-hidden"
                      >
                        <span className="relative z-10">Guardar</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setEditMode(true);
                        setEditedData({
                          categoryId:   aiResult.categoryId,
                          categoryName: aiResult.category,
                          styleId:      aiResult.styleId,
                          styleName:    aiResult.style,
                        });
                      }}
                      className="btn-shimmer relative inline-flex items-center gap-2 rounded-full bg-brand-sand px-4 py-1.5 text-xs font-medium text-brand-dark transition-all duration-300 hover:bg-brand-sand/70 overflow-hidden flex-shrink-0 ml-4"
                    >
                      <Pencil className="w-3.5 h-3.5 relative z-10" />
                      <span className="relative z-10">Editar</span>
                    </button>
                  )}
                </div>
                <p className="text-sm text-brand-dark/60 mb-6">Nuestra IA analizó tu prenda</p>

                <div className="flex flex-col gap-5">
                  {/* Categoría */}
                  <div className="flex items-center gap-3">
                    <Tag className="w-4 h-4 text-brand-dark/40 flex-shrink-0" />
                    <span className="text-xs text-brand-dark/40 w-28 flex-shrink-0">Categoría</span>
                    {editMode ? (
                      <div className="relative flex-1">
                        <select
                          value={editedData.categoryId ?? ''}
                          onChange={(e) => {
                            const cat = editCatalog.categories.find(c => c.id === e.target.value);
                            setEditedData(p => ({
                              ...p,
                              categoryId:   e.target.value,
                              categoryName: cat?.name ?? '',
                              typeId:       cat?.parentId ?? e.target.value,
                            }));
                          }}
                          className="w-full appearance-none text-sm text-brand-dark font-medium bg-brand-cream border border-brand-sand rounded-xl px-3 py-1 pr-7 outline-none focus:border-brand-dark/30 cursor-pointer"
                        >
                          <option value="">— Selecciona —</option>
                          {parentCategories.map(parent => (
                            <optgroup key={parent.id} label={parent.name}>
                              {childrenOf(parent.id).map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                              ))}
                            </optgroup>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-brand-dark/40" />
                      </div>
                    ) : (
                      <span className="text-sm text-brand-dark font-medium">{aiResult.category}</span>
                    )}
                  </div>

                  {/* Color */}
                  <div className="flex items-center gap-3">
                    <Palette className="w-4 h-4 text-brand-dark/40 flex-shrink-0" />
                    <span className="text-xs text-brand-dark/40 w-28 flex-shrink-0">Color principal</span>
                    <span className="text-sm text-brand-dark font-medium">{aiResult.color}</span>
                  </div>

                  {/* Estilo */}
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-4 h-4 text-brand-dark/40 flex-shrink-0" />
                    <span className="text-xs text-brand-dark/40 w-28 flex-shrink-0">Estilo</span>
                    {editMode ? (
                      <div className="relative flex-1">
                        <select
                          value={editedData.styleId ?? ''}
                          onChange={(e) => {
                            const style = editCatalog.styles.find(s => s.id === e.target.value);
                            setEditedData(p => ({ ...p, styleId: e.target.value, styleName: style?.name ?? '' }));
                          }}
                          className="w-full appearance-none text-sm text-brand-dark font-medium bg-brand-cream border border-brand-sand rounded-xl px-3 py-1 pr-7 outline-none focus:border-brand-dark/30 cursor-pointer"
                        >
                          <option value="">— Selecciona —</option>
                          {editCatalog.styles.map(s => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-brand-dark/40" />
                      </div>
                    ) : (
                      <span className="text-sm text-brand-dark font-medium">{aiResult.style}</span>
                    )}
                  </div>

                  {/* Ocasión */}
                  <div className="flex items-center gap-3">
                    <Layers className="w-4 h-4 text-brand-dark/40 flex-shrink-0" />
                    <span className="text-xs text-brand-dark/40 w-28 flex-shrink-0">Ocasión</span>
                    <span className="text-sm text-brand-dark font-medium">{aiResult.ocasion}</span>
                  </div>

                  {/* Clima */}
                  <div className="flex items-center gap-3">
                    <Cloud className="w-4 h-4 text-brand-dark/40 flex-shrink-0" />
                    <span className="text-xs text-brand-dark/40 w-28 flex-shrink-0">Clima</span>
                    <span className="text-sm text-brand-dark font-medium">{aiResult.clima}</span>
                  </div>
                </div>
              </div>

              {!editMode && (
                <div className="pt-4 border-t border-brand-sand/50">
                  <button
                    onClick={handleAccept}
                    disabled={isSaving}
                    className="btn-shimmer relative inline-flex items-center justify-center w-full rounded-full bg-brand-charcoal px-6 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:opacity-90 overflow-hidden disabled:opacity-60"
                  >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    <span className="relative z-10">{isSaving ? 'Guardando...' : 'Aceptar y guardar prenda'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL CONFIRMACIÓN ─────────────────────────────────────────────────── */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-brand-dark/60 z-[100] flex items-center justify-center p-8">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-[0_32px_80px_rgba(44,42,41,0.25)] flex flex-col gap-5 text-center border-4 border-gray-300/50">
            <h3 className="text-2xl font-serif font-bold text-brand-dark">¡Prenda guardada!</h3>
            <p className="text-sm text-brand-dark/60">¿Qué deseas hacer ahora?</p>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleUploadAnother}
                className="btn-shimmer relative inline-flex items-center justify-center w-full rounded-full bg-brand-sand px-6 py-2.5 text-sm font-medium text-brand-dark transition-all duration-300 hover:bg-brand-sand/70 overflow-hidden"
              >
                <span className="relative z-10">Subir otra prenda</span>
              </button>
              <button
                onClick={() => onUploadComplete && onUploadComplete()}
                className="btn-shimmer relative inline-flex items-center justify-center w-full rounded-full bg-brand-charcoal px-6 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:opacity-90 overflow-hidden"
              >
                <span className="relative z-10">Ir al inicio</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WardrobeUploadPage;
