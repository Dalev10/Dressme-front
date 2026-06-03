import { useState, useCallback } from 'react';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import OnboardingPage from './pages/OnboardingPage';
import HomePage from './pages/HomePage';
import WardrobeUploadPage from './pages/WardrobeUploadPage';
import WardrobePage from './pages/WardrobePage';
import OutfitsPage from './pages/OutfitsPage';
import FavoritesPage from './pages/FavoritesPage';
import ConfigPage from './pages/ConfigPage';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('dressme_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [currentView, setCurrentView] = useState(() => {
    const saved = localStorage.getItem('dressme_user');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.isCalibrated ? 'home' : 'onboarding';
    }
    return 'landing';
  });

  const [isFirstTimeUpload, setIsFirstTimeUpload] = useState(false);
  const [wardrobeItems, setWardrobeItems]         = useState([]);
  const [catalog, setCatalog]                     = useState({ occasions: [], weathers: [] });
  const [favoritosData, setFavoritosData]         = useState([]);

  // ── API helpers ───────────────────────────────────────────────────────────────

  const loadWardrobe = useCallback(async (userId, token) => {
    try {
      const res = await fetch(
        `${apiBaseUrl}/api/v1/wardrobe/list?userId=${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) return;
      setWardrobeItems(await res.json());
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

  // ── Auth ─────────────────────────────────────────────────────────────────────

  const handleLoginSuccess = (userData) => {
    localStorage.setItem('authToken', userData.token);
    localStorage.setItem('dressme_user', JSON.stringify(userData));
    setUser(userData);
    loadWardrobe(userData.id, userData.token);
    loadCatalog(userData.token);
    setCurrentView(!userData.isCalibrated ? 'onboarding' : 'home');
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('dressme_user');
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
          setCurrentView('wardrobeUpload');
        }}
      />
    );
  }

  if (currentView === 'wardrobeUpload') {
    return (
      <WardrobeUploadPage
        user={user}
        onLogout={handleLogout}
        onUploadComplete={() => setCurrentView('home')}
        isFirstTime={isFirstTimeUpload}
        onPrendaGuardada={handlePrendaGuardada}
      />
    );
  }

  if (currentView === 'home') {
    return (
      <HomePage
        user={user}
        onLogout={handleLogout}
        onGoToOnboarding={() => setCurrentView('onboarding')}
        onGoToWardrobe={() => { setIsFirstTimeUpload(false); setCurrentView('wardrobeUpload'); }}
        onGoToWardrobePage={() => setCurrentView('wardrobePage')}
        onGoToOutfits={() => setCurrentView('outfits')}
        onGoToFavorites={() => setCurrentView('favorites')}
        onGoToConfig={() => setCurrentView('config')}
        wardrobeItems={wardrobeItems}
        favoritosData={favoritosData}
      />
    );
  }

  if (currentView === 'wardrobePage') {
    return (
      <WardrobePage
        user={user}
        onLogout={handleLogout}
        onAddCloth={() => { setIsFirstTimeUpload(false); setCurrentView('wardrobeUpload'); }}
        onGoToHome={() => setCurrentView('home')}
        onGoToWardrobePage={() => setCurrentView('wardrobePage')}
        onGoToOutfits={() => setCurrentView('outfits')}
        onGoToFavorites={() => setCurrentView('favorites')}
        onGoToConfig={() => setCurrentView('config')}
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
        onGoToHome={() => setCurrentView('home')}
        onGoToWardrobe={() => { setIsFirstTimeUpload(false); setCurrentView('wardrobeUpload'); }}
        onGoToWardrobePage={() => setCurrentView('wardrobePage')}
        onGoToOutfits={() => setCurrentView('outfits')}
        onGoToFavorites={() => setCurrentView('favorites')}
        onGoToConfig={() => setCurrentView('config')}
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
        onGoToHome={() => setCurrentView('home')}
        onGoToWardrobePage={() => setCurrentView('wardrobePage')}
        onGoToOutfits={() => setCurrentView('outfits')}
        onGoToFavorites={() => setCurrentView('favorites')}
        onGoToWardrobe={() => { setIsFirstTimeUpload(false); setCurrentView('wardrobeUpload'); }}
        onGoToConfig={() => setCurrentView('config')}
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
        onGoToHome={() => setCurrentView('home')}
        onGoToWardrobePage={() => setCurrentView('wardrobePage')}
        onGoToOutfits={() => setCurrentView('outfits')}
        onGoToFavorites={() => setCurrentView('favorites')}
        onGoToOnboarding={() => setCurrentView('onboarding')}
      />
    );
  }

  return <LandingPage onGetStarted={() => setCurrentView('login')} />;
}

export default App;
