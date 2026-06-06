import { useState, useCallback, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import OnboardingPage from './pages/OnboardingPage';
import HomePage from './pages/HomePage';
import WardrobeUploadPage from './pages/WardrobeUploadPage';
import WardrobePage from './pages/WardrobePage';
import OutfitsPage from './pages/OutfitsPage';
import FavoritesPage from './pages/FavoritesPage';
import ConfigPage from './pages/ConfigPage';

const apiBaseUrl     = import.meta.env.VITE_API_BASE_URL     ?? 'http://localhost:8080';
const backServiceUrl = import.meta.env.VITE_BACK_SERVICE_URL ?? 'http://localhost:8081';

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('dressme_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [currentView, setCurrentView] = useState(() => {
    const saved = localStorage.getItem('dressme_user');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (!parsed.isCalibrated) return 'onboarding';
      const savedView = localStorage.getItem('dressme_current_view');
      const validViews = ['home', 'wardrobePage', 'outfits', 'favorites', 'config'];
      return (savedView && validViews.includes(savedView)) ? savedView : 'home';
    }
    return 'landing';
  });

  const navigateTo = useCallback((view) => {
    const persistable = ['home', 'wardrobePage', 'outfits', 'favorites', 'config'];
    if (persistable.includes(view)) localStorage.setItem('dressme_current_view', view);
    else localStorage.removeItem('dressme_current_view');
    setCurrentView(view);
  }, []);

  const [isFirstTimeUpload, setIsFirstTimeUpload] = useState(false);
  const [wardrobeItems, setWardrobeItems]         = useState([]);
  const [catalog, setCatalog]                     = useState({ occasions: [], weathers: [] });
  const [editCatalog, setEditCatalog]             = useState({ categories: [], styles: [] });
  const [favoritosData, setFavoritosData]         = useState([]);

  // ── Carga inicial para sesiones ya activas (refresh de página) ───────────────

  useEffect(() => {
    const token  = localStorage.getItem('authToken');
    const userId = user?.id;
    if (!token || !userId) return;
    const controller = new AbortController();

    // Limpiar prenda borrador huérfana: el usuario subió una prenda pero cerró/recargó
    // la página sin confirmar con "Aceptar y guardar". No debe quedar en el armario.
    const pendingDraftId = localStorage.getItem('pending_clothing_id');
    const cleanupDraft = pendingDraftId
      ? fetch(`${apiBaseUrl}/api/v1/wardrobe/${pendingDraftId}?userId=${userId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        }).catch(() => {}).finally(() => localStorage.removeItem('pending_clothing_id'))
      : Promise.resolve();

    cleanupDraft.then(() => Promise.all([
      fetch(`${apiBaseUrl}/api/v1/wardrobe/catalog/edit`, { headers: { Authorization: `Bearer ${token}` }, signal: controller.signal })
        .then(r => r.ok ? r.json() : null)
        .then(data => { if (data) setEditCatalog({ categories: data.categories || [], styles: data.styles || [] }); })
        .catch(() => {}),
      fetch(`${apiBaseUrl}/api/v1/wardrobe/catalog`, { headers: { Authorization: `Bearer ${token}` }, signal: controller.signal })
        .then(r => r.ok ? r.json() : null)
        .then(data => { if (data) setCatalog({ occasions: (data.occasions || []).map(o => o.name), weathers: (data.weathers || []).map(w => w.name) }); })
        .catch(() => {}),
      fetch(`${apiBaseUrl}/api/v1/wardrobe/list?userId=${userId}`, { headers: { Authorization: `Bearer ${token}` }, signal: controller.signal })
        .then(r => r.ok ? r.json() : null)
        .then(items => {
          if (items) setWardrobeItems(items.map(item => ({ ...item, imageUrl: item.imageUrl?.replace('http://dressme-back:8080', backServiceUrl) })));
        })
        .catch(() => {}),
    ]));
    return () => controller.abort();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // ── API helpers ───────────────────────────────────────────────────────────────

  const loadWardrobe = useCallback(async (userId, token) => {
    try {
      const res = await fetch(
        `${apiBaseUrl}/api/v1/wardrobe/list?userId=${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) return;
      const items = await res.json();
      setWardrobeItems(items.map(item => ({
        ...item,
        imageUrl: item.imageUrl?.replace('http://dressme-back:8080', backServiceUrl),
      })));
    } catch (err) {
      console.error('App: error cargando guardarropa', err);
    }
  }, []);

  const loadCatalog = useCallback(async (token) => {
    try {
      const res = await fetch(
        `${apiBaseUrl}/api/v1/wardrobe/catalog`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) return;
      const data = await res.json();
      setCatalog({
        occasions: (data.occasions || []).map(o => o.name),
        weathers:  (data.weathers  || []).map(w => w.name),
      });
    } catch (err) {
      console.error('App: error cargando catálogo', err);
    }
  }, []);

  const loadEditCatalog = useCallback(async (token) => {
    try {
      const res = await fetch(
        `${apiBaseUrl}/api/v1/wardrobe/catalog/edit`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) return;
      const data = await res.json();
      setEditCatalog({ categories: data.categories || [], styles: data.styles || [] });
    } catch (err) {
      console.error('App: error cargando catálogo de edición', err);
    }
  }, []);

  // ── Auth ─────────────────────────────────────────────────────────────────────

  const handleLoginSuccess = (userData) => {
    localStorage.setItem('authToken', userData.token);
    localStorage.setItem('dressme_user', JSON.stringify(userData));
    setUser(userData);
    loadWardrobe(userData.id, userData.token);
    loadCatalog(userData.token);
    loadEditCatalog(userData.token);
    navigateTo(!userData.isCalibrated ? 'onboarding' : 'home');
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('dressme_user');
    localStorage.removeItem('dressme_current_view');
    setUser(null);
    setWardrobeItems([]);
    setCatalog({ occasions: [], weathers: [] });
    setCurrentView('landing');
  };

  const handlePrendaGuardada = useCallback(() => {
    const token  = localStorage.getItem('authToken');
    const userId = user?.id;
    if (token && userId) loadWardrobe(userId, token);
  }, [user, loadWardrobe]);

  const handleDeletePrenda = useCallback((clothingId) => {
    setWardrobeItems(prev => prev.filter(p => p.id !== clothingId));
  }, []);

  const handleUpdatePrenda = useCallback((clothingId, updated) => {
    setWardrobeItems(prev =>
      prev.map(p => p.id === clothingId ? { ...p, ...updated } : p)
    );
  }, []);

  // ── Views ─────────────────────────────────────────────────────────────────────

  if (currentView === 'login') {
    return (
      <LoginPage
        onBack={() => setCurrentView('landing')}
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  if (currentView === 'onboarding') {
    return (
      <OnboardingPage
        user={user}
        onLogout={handleLogout}
        onCalibrationCompleted={(updatedUser) => {
          setUser(updatedUser);
          localStorage.setItem('dressme_user', JSON.stringify(updatedUser));
          setIsFirstTimeUpload(true);
          navigateTo('wardrobeUpload');
        }}
      />
    );
  }

  if (currentView === 'wardrobeUpload') {
    return (
      <WardrobeUploadPage
        user={user}
        onLogout={handleLogout}
        onUploadComplete={() => navigateTo('home')}
        isFirstTime={isFirstTimeUpload}
        onPrendaGuardada={handlePrendaGuardada}
        editCatalog={editCatalog}
      />
    );
  }

  if (currentView === 'home') {
    return (
      <HomePage
        user={user}
        onLogout={handleLogout}
        onGoToOnboarding={() => navigateTo('onboarding')}
        onGoToWardrobe={() => { setIsFirstTimeUpload(false); navigateTo('wardrobeUpload'); }}
        onGoToWardrobePage={() => navigateTo('wardrobePage')}
        onGoToOutfits={() => navigateTo('outfits')}
        onGoToFavorites={() => navigateTo('favorites')}
        onGoToConfig={() => navigateTo('config')}
        prendas={wardrobeItems.map(item => ({
          id:    item.id,
          image: item.imageUrl,
          name:  item.categoryName ?? 'Prenda',
        }))}
        favoritosData={favoritosData}
      />
    );
  }

  if (currentView === 'wardrobePage') {
    return (
      <WardrobePage
        user={user}
        onLogout={handleLogout}
        onAddCloth={() => { setIsFirstTimeUpload(false); navigateTo('wardrobeUpload'); }}
        onGoToHome={() => navigateTo('home')}
        onGoToWardrobePage={() => navigateTo('wardrobePage')}
        onGoToOutfits={() => navigateTo('outfits')}
        onGoToFavorites={() => navigateTo('favorites')}
        onGoToConfig={() => navigateTo('config')}
        prendas={wardrobeItems}
        onEliminarPrenda={handleDeletePrenda}
        onActualizarPrenda={handleUpdatePrenda}
      />
    );
  }

  if (currentView === 'outfits') {
    return (
      <OutfitsPage
        user={user}
        onLogout={handleLogout}
        onGoToHome={() => navigateTo('home')}
        onGoToWardrobe={() => { setIsFirstTimeUpload(false); navigateTo('wardrobeUpload'); }}
        onGoToWardrobePage={() => navigateTo('wardrobePage')}
        onGoToOutfits={() => navigateTo('outfits')}
        onGoToFavorites={() => navigateTo('favorites')}
        onGoToConfig={() => navigateTo('config')}
        ocasiones={catalog.occasions}
        climas={catalog.weathers}
        dressCodes={[]}
        hasPrendas={wardrobeItems.length > 0}
        onOutfitLiked={(outfit, removeId) => {
          if (removeId) {
            setFavoritosData(prev => prev.filter(o => o.id !== removeId));
          } else {
            setFavoritosData(prev => [...prev, outfit]);
          }
        }}
      />
    );
  }

  if (currentView === 'favorites') {
    return (
      <FavoritesPage
        user={user}
        onLogout={handleLogout}
        onGoToHome={() => navigateTo('home')}
        onGoToWardrobePage={() => navigateTo('wardrobePage')}
        onGoToOutfits={() => navigateTo('outfits')}
        onGoToFavorites={() => navigateTo('favorites')}
        onGoToWardrobe={() => { setIsFirstTimeUpload(false); navigateTo('wardrobeUpload'); }}
        onGoToConfig={() => navigateTo('config')}
        ocasiones={catalog.occasions}
        climas={catalog.weathers}
        dressCodes={[]}
        favoritosData={favoritosData}
        onRemoveFavorite={(id) => setFavoritosData(prev => prev.filter(o => o.id !== id))}
      />
    );
  }

  if (currentView === 'config') {
    return (
      <ConfigPage
        user={user}
        onLogout={handleLogout}
        onGoToHome={() => navigateTo('home')}
        onGoToWardrobePage={() => navigateTo('wardrobePage')}
        onGoToOutfits={() => navigateTo('outfits')}
        onGoToFavorites={() => navigateTo('favorites')}
        onGoToOnboarding={() => navigateTo('onboarding')}
      />
    );
  }

  return <LandingPage onGetStarted={() => setCurrentView('login')} />;
}

export default App;
