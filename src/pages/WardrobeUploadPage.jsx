import { useState, useRef, useEffect } from 'react';
import {
  Cloud, LogOut, ChevronDown, Loader2, AlertCircle,
  Tag, Layers, Palette, Sparkles, Pencil, X,
} from 'lucide-react';
import GlassContainer from '../components/GlassContainer';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:9000';

const TIPOS_POR_CATEGORIA = {
  'Tops':              ['Camiseta', 'Camisa', 'Blusa', 'Suéter', 'Hoodie', 'Top sin mangas', 'Crop Top'],
  'Partes de abajo':   ['Jeans', 'Pantalón', 'Shorts', 'Falda', 'Leggins', 'Joggers'],
  'Ropa exterior':     ['Chaqueta', 'Abrigo', 'Blazer', 'Chaleco'],
  'Vestidos y Monos':  ['Vestido', 'Mono', 'Romper'],
  'Calzado':           ['Tenis', 'Botas', 'Mocasines', 'Sandalias', 'Tacones'],
  'Accesorios':        ['Bolso', 'Sombrero', 'Bufanda y Cinturón', 'Joyería'],
  'Ropa deportiva':    ['Top deportivo', 'Shorts deportivos', 'Chaqueta deportiva'],
};

const ESTILOS = [
  'Athleisure', 'Bohemio', 'Casual de Negocios', 'Formal Clásico', 'Costero',
  'Cottagecore', 'Academia Oscura', 'Vanguardista', 'Minimalista', 'Smart Casual',
  'Streetwear', 'Y2K Retro',
];

const WardrobeUploadPage = ({ user, onLogout, onUploadComplete, isFirstTime = false, onPrendaGuardada = () => {} }) => {
  const [isDragging,        setIsDragging]        = useState(false);
  const [isUploading,       setIsUploading]       = useState(false);
  const [uploadError,       setUploadError]       = useState('');
  const [selectedFile,      setSelectedFile]      = useState(null);
  const [profileMenuOpen,   setProfileMenuOpen]   = useState(false);
  const [aiResult,          setAiResult]          = useState(null);
  const [editMode,          setEditMode]          = useState(false);
  const [editedData,        setEditedData]        = useState({});
  const [showConfirmModal,  setShowConfirmModal]  = useState(false);
  const [previewUrl,        setPreviewUrl]        = useState(null);
  const fileInputRef   = useRef(null);
  const profileMenuRef = useRef(null);

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    const userData  = localStorage.getItem('dressme_user');
    if (!authToken || !userData) window.location.href = '/login';
  }, []);

  useEffect(() => {
    if (!selectedFile) { setPreviewUrl(null); return; }
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [selectedFile]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const handleUpload = async () => {
    if (!selectedFile) { setUploadError('Por favor selecciona una imagen'); return; }

    setIsUploading(true);
    setUploadError('');

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      const token    = localStorage.getItem('authToken');
      const response = await fetch(`${apiBaseUrl}/api/v1/wardrobe/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) {
        let errorMessage = `Error ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          if (response.status === 500) errorMessage = 'Error del servidor. Verifica que el archivo sea válido y no exceda 1MB.';
          else if (response.status === 413) errorMessage = 'El archivo es demasiado grande. Máximo 1MB permitido.';
          else if (response.status === 400) errorMessage = 'Solicitud inválida. Verifica el formato del archivo.';
          else if (response.status === 401) errorMessage = 'Sesión expirada. Por favor inicia sesión de nuevo.';
        }
        throw new Error(errorMessage);
      }

      const responseData = await response.json();
      // TODO: ajustar campos según respuesta real del API
      setAiResult(responseData);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Error al subir la imagen');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveEdit = () => {
    setAiResult((prev) => ({ ...prev, ...editedData }));
    setEditMode(false);
  };

  const handleAccept = () => {
    // TODO: llamar API para confirmar/actualizar características
    onPrendaGuardada({
      id: Date.now(),
      name: aiResult.type || 'Nueva prenda',
      image: previewUrl || '',
      style: aiResult.style,
      type: aiResult.type,
      category: aiResult.category,
      color: aiResult.color,
    });
    setShowConfirmModal(true);
  };

  const handleUploadAnother = () => {
    setAiResult(null);
    setSelectedFile(null);
    setEditMode(false);
    setEditedData({});
    setShowConfirmModal(false);
  };

  const handleLogout = () => onLogout();

  return (
    <div className="relative min-h-screen bg-[#F4F0EA] flex flex-col overflow-hidden">
      {/* Background wardrobe image – very low opacity */}
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
                  onClick={handleLogout}
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

      {/* MAIN CONTENT */}
      <main className="flex-grow flex flex-col items-center justify-center px-6 py-12 md:py-16">
        <div className="max-w-2xl w-full">

          {/* HERO TEXT */}
          <div className="text-center mb-12 md:mb-16 animate-slide-up">
            <h1 className="text-4xl md:text-5xl font-serif italic font-normal text-brand-dark mb-4">
              Lleva tu armario al mundo digital
            </h1>
            <p className="text-lg md:text-xl text-brand-dark/70 font-sans font-normal">
              Subir tus prendas es el primer paso para crear outfits inteligentes. Nuestra IA las analizará automáticamente.
            </p>
          </div>

          {/* DROPZONE */}
          <GlassContainer className="p-8 md:p-12 mb-8 animate-slide-up-delay">
            <div
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`
                flex flex-col items-center justify-center py-16 md:py-20 px-6 rounded-3xl
                border-2 border-dashed transition-all duration-300 cursor-pointer
                ${isDragging ? 'border-brand-bronze bg-brand-bronze/5' : 'border-brand-dark/20 hover:border-brand-bronze/50'}
              `}
            >
              <div className={`
                w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center mb-6 transition-all duration-300
                ${isDragging ? 'bg-brand-bronze/20' : 'bg-brand-dark/5'}
              `}>
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
                    Formatos permitidos: JPG, PNG, GIF, WebP (máximo 8MB)
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

            {/* AI Benefits */}
            <div className="mt-8 p-6 rounded-2xl bg-brand-dark/5 border border-brand-dark/10">
              <p className="text-sm font-semibold text-brand-dark mb-4">Lo que nuestra IA analizará:</p>
              <ul className="space-y-3 text-sm text-brand-dark/70">
                {['Identificación de Color', 'Tipo de prenda', 'Categoría y Estilo', 'Análisis de Estilo Único'].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="text-brand-bronze font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {uploadError && (
              <div className="mt-6 p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{uploadError}</p>
              </div>
            )}
          </GlassContainer>

          {/* ACTION BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up-delay-more">
            <button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              className={`
                px-8 py-4 rounded-full font-semibold text-base md:text-lg transition-all duration-300
                flex items-center justify-center gap-2 min-w-[200px]
                ${selectedFile && !isUploading ? 'bg-brand-dark text-white hover:opacity-90' : 'bg-brand-dark/50 text-white/70 cursor-not-allowed'}
                btn-shimmer relative overflow-hidden
              `}
            >
              {isUploading && <Loader2 className="w-5 h-5 animate-spin" />}
              Sube tu prenda →
            </button>
            <button
              onClick={() => onUploadComplete && onUploadComplete()}
              className="px-8 py-4 rounded-full font-semibold text-base md:text-lg transition-all duration-300 border-2 border-brand-dark text-brand-dark hover:bg-brand-dark/5"
            >
              {isFirstTime ? 'Continuar' : 'Salir'}
            </button>
          </div>
        </div>
      </main>

      {/* ── MODAL DE RESULTADO IA ──────────────────────────── */}
      {aiResult && !showConfirmModal && (
        <div className="fixed inset-0 bg-brand-dark/60 z-[100] flex items-center justify-center p-8">
          <div className="relative bg-white rounded-3xl overflow-hidden flex w-full max-w-4xl max-h-[90vh] shadow-[0_32px_80px_rgba(44,42,41,0.25)] border-4 border-gray-300/50">
            {/* Botón cerrar */}
            <button
              onClick={() => { setAiResult(null); setEditMode(false); }}
              className="absolute top-4 right-4 z-10 flex items-center justify-center w-8 h-8 rounded-full border border-brand-dark/15 bg-transparent text-brand-dark/50 hover:text-brand-dark hover:border-brand-dark/30 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Imagen izquierda */}
            <div className="w-1/2 flex-shrink-0 min-h-[400px]">
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Prenda subida"
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Detalles derecha */}
            <div className="flex-1 pl-8 pb-8 pt-14 pr-14 flex flex-col justify-between gap-6 min-h-fit">
              <div>
                {/* Título + Editar/Guardar/Cancelar en la misma fila */}
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
                        setEditedData({ category: aiResult.category || '', type: aiResult.type || '', style: aiResult.style || '' });
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
                          value={editedData.category}
                          onChange={(e) => setEditedData((p) => ({ ...p, category: e.target.value, type: '' }))}
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
                      <span className="text-sm text-brand-dark font-medium">{aiResult.category || '—'}</span>
                    )}
                  </div>

                  {/* Tipo de Prenda — dependiente de Categoría */}
                  <div className="flex items-center gap-3">
                    <Layers className="w-4 h-4 text-brand-dark/40 flex-shrink-0" />
                    <span className="text-xs text-brand-dark/40 w-28 flex-shrink-0">Tipo de prenda</span>
                    {editMode ? (
                      <div className="relative flex-1">
                        <select
                          value={editedData.type}
                          disabled={!editedData.category}
                          onChange={(e) => setEditedData((p) => ({ ...p, type: e.target.value }))}
                          className="w-full appearance-none text-sm text-brand-dark font-medium bg-brand-cream border border-brand-sand rounded-xl px-3 py-1 pr-7 outline-none focus:border-brand-dark/30 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <option value="">{editedData.category ? '— Selecciona —' : 'Selecciona primero una categoría'}</option>
                          {(TIPOS_POR_CATEGORIA[editedData.category] || []).map((tipo) => (
                            <option key={tipo} value={tipo}>{tipo}</option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-brand-dark/40" />
                      </div>
                    ) : (
                      <span className="text-sm text-brand-dark font-medium">{aiResult.type || '—'}</span>
                    )}
                  </div>

                  {/* Color principal — no editable */}
                  <div className="flex items-center gap-3">
                    <Palette className="w-4 h-4 text-brand-dark/40 flex-shrink-0" />
                    <span className="text-xs text-brand-dark/40 w-28 flex-shrink-0">Color principal</span>
                    <span className="text-sm text-brand-dark font-medium">{aiResult.color || '—'}</span>
                  </div>

                  {/* Estilo */}
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-4 h-4 text-brand-dark/40 flex-shrink-0" />
                    <span className="text-xs text-brand-dark/40 w-28 flex-shrink-0">Estilo</span>
                    {editMode ? (
                      <div className="relative flex-1">
                        <select
                          value={editedData.style}
                          onChange={(e) => setEditedData((p) => ({ ...p, style: e.target.value }))}
                          className="w-full appearance-none text-sm text-brand-dark font-medium bg-brand-cream border border-brand-sand rounded-xl px-3 py-1 pr-7 outline-none focus:border-brand-dark/30 cursor-pointer"
                        >
                          <option value="">— Selecciona —</option>
                          {ESTILOS.map((estilo) => (
                            <option key={estilo} value={estilo}>{estilo}</option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-brand-dark/40" />
                      </div>
                    ) : (
                      <span className="text-sm text-brand-dark font-medium">{aiResult.style || '—'}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Aceptar — solo en modo lectura */}
              {!editMode && (
                <div className="pt-4 border-t border-brand-sand/50">
                  <button
                    onClick={handleAccept}
                    className="btn-shimmer relative inline-flex items-center justify-center w-full rounded-full bg-brand-charcoal px-6 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:opacity-90 overflow-hidden"
                  >
                    <span className="relative z-10">Aceptar y guardar prenda</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL DE CONFIRMACIÓN ─────────────────────────── */}
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
