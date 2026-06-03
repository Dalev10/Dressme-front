import { useState } from 'react';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import OnboardingPage from './pages/OnboardingPage';
import HomePage from './pages/HomePage';
import WardrobeUploadPage from './pages/WardrobeUploadPage';
import WardrobePage from './pages/WardrobePage';
import OutfitsPage from './pages/OutfitsPage';
import FavoritesPage from './pages/FavoritesPage';
import ConfigPage from './pages/ConfigPage';

function App() {
  // RECUPERAR SESIÓN AL RECARGAR LA PÁGINA
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('dressme_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [isFirstTimeUpload, setIsFirstTimeUpload] = useState(false);
  const [prendas, setPrendas] = useState([]);
  const [favoritosData, setFavoritosData] = useState([]);

  const [currentView, setCurrentView] = useState(() => {
    const savedUser = localStorage.getItem('dressme_user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      return parsedUser.isCalibrated ? 'home' : 'onboarding';
    }
    return 'landing';
  });

  const handleLoginSuccess = (userData) => {
    localStorage.setItem('authToken', userData.token);
    localStorage.setItem('dressme_user', JSON.stringify(userData));
    setUser(userData);
    if (!userData.isCalibrated) {
      setCurrentView('onboarding');
    } else {
      setCurrentView('home');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('dressme_user');
    setUser(null);
    setCurrentView('landing');
  };

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
        onPrendaGuardada={(prenda) => setPrendas(prev => [...prev, prenda])}
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
        prendas={prendas}
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
        estilos={[]}
        ocasiones={[]}
        colores={[]}
        climas={[]}
        tiposPrenda={[]}
        categorias={[]}
        prendas={prendas}
        onEliminarPrenda={(id) => setPrendas(prev => prev.filter(p => p.id !== id))}
        onActualizarPrenda={(id, datos) => setPrendas(prev => prev.map(p => p.id === id ? { ...p, ...datos } : p))}
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
        ocasiones={[]}
        climas={[]}
        dressCodes={[]}
        hasPrendas={prendas.length > 0}
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
        ocasiones={[]}
        climas={[]}
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

  // Fallback por defecto
  return <LandingPage onGetStarted={() => setCurrentView('login')} />;
}

export default App;
