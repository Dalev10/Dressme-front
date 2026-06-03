import { useEffect, useRef, useState } from 'react';
import { ChevronRight, ChevronDown, Loader2, LogOut } from 'lucide-react';
import StyleCard from '../components/StyleCard';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';

const OnboardingPage = ({ user, onLogout, onCalibrationCompleted }) => {
  const [cards, setCards] = useState([]);
  const [selections, setSelections] = useState(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
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

  const fetchStyleCards = async () => {
    try {
      setIsLoading(true);

      const token = user?.token ?? localStorage.getItem('authToken');

      const response = await fetch(`${apiBaseUrl}/api/v1/onboarding/style-cards`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: No se pudieron cargar los outfits`);
      }

      let data = await response.json();
      data = data.sort(() => Math.random() - 0.5);

      setCards(data);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      console.error('OnboardingPage - fetchStyleCards:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStyleCards();
  }, []);

  const handleReaction = (cardId, reaction) => {
    setSelections(prev => new Map(prev).set(cardId, reaction));
    setCards(prev => prev.filter(card => card.id !== cardId));
  };

  const handleFinalize = async () => {
    try {
      setIsSubmitting(true);
      setError('');

      const token = user?.token ?? localStorage.getItem('authToken');

      const selectionsArray = Array.from(selections.entries()).map(([styleCardId, reaction]) => ({
        styleCardId,
        reaction,
      }));

      const response = await fetch(`${apiBaseUrl}/api/v1/onboarding/calibrate`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          selections: selectionsArray,
        }),
      });

      let data = null;
      const contentType = response.headers.get('content-type');

      if (contentType?.includes('application/json')) {
        data = await response.json().catch(() => null);
      }

      if (!response.ok) {
        const backendMessage =
          data?.detail ||
          data?.message ||
          `Error ${response.status}`;
        throw new Error(backendMessage);
      }

      const updatedUser = {
        ...(user ?? {}),
        isCalibrated: true,
      };

      if (data?.userId && !updatedUser.id) {
        updatedUser.id = data.userId;
      }

      if (token) {
        updatedUser.token = token;
      }

      localStorage.setItem('dressme_user', JSON.stringify(updatedUser));

      if (onCalibrationCompleted) {
        onCalibrationCompleted(updatedUser);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error en la calibración');
      console.error('OnboardingPage - handleFinalize:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const minSelectionsReached = selections.size >= 5;
  const progressText = `Paso 1 de 3: Define tu estilo (${selections.size} selecciones)`;

  return (
    <div className="relative min-h-screen bg-[#F4F0EA] selection:bg-brand-bronze/20 selection:text-brand-dark overflow-hidden">
      {/* Background wardrobe image – very low opacity */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1920&q=80')", backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.09 }}
      />
      <header className="sticky top-0 z-40 border-b border-brand-dark/5 bg-[#F4F0EA]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="font-serif italic text-2xl font-bold text-brand-dark">
            DressMe
          </div>

          <div className="text-xs font-medium text-brand-dark/70 tracking-wide">
            {progressText}
          </div>

          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={() => setProfileMenuOpen(v => !v)}
              className="flex items-center gap-2 hover:opacity-75 transition-opacity"
            >
              {user?.profilePicture && (
                <img
                  src={user.profilePicture}
                  alt={user.displayName}
                  className="w-8 h-8 rounded-full border border-brand-dark/10 ring-2 ring-gray-400/80 ring-offset-1"
                />
              )}
              <span className="text-sm font-medium text-brand-dark">
                {user?.displayName || 'Usuario'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-brand-dark/50" />
            </button>

            {profileMenuOpen && (
              <div className="absolute right-0 top-full mt-2 glass-effect rounded-2xl shadow-xl p-2 w-44 border border-white/40 z-50">
                <button
                  onClick={() => { setProfileMenuOpen(false); onLogout?.(); }}
                  className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-brand-dark hover:bg-brand-dark/5 transition-colors text-left text-sm font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <section className="text-center mb-12">
          <h1 className="font-serif italic text-5xl font-bold text-brand-dark mb-4">
            Personaliza tu Experiencia
          </h1>
          <p className="text-base text-brand-dark/70 max-w-2xl mx-auto leading-relaxed">
            Dale 'Me gusta' (❤️) a los outfits que usarías y rechaza los que no van contigo para entrenar a tu asistente de IA.
          </p>
        </section>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {error}
          </div>
        )}

        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-brand-dark/40" />
          </div>
        )}

        {!isLoading && cards.length > 0 && (
          <div className="grid grid-cols-3 gap-6 mb-16">
            {cards.map(card => (
              <StyleCard
                key={card.id}
                card={card}
                onReaction={handleReaction}
              />
            ))}
          </div>
        )}

        {!isLoading && cards.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-brand-dark/50 mb-4">
              No hay más outfits por mostrar.
            </p>
            {selections.size > 0 && (
              <p className="text-sm text-brand-dark/40">
                Has realizado {selections.size} selecciones
              </p>
            )}
          </div>
        )}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-[#F4F0EA]/80 backdrop-blur-md border-t border-brand-dark/5 p-6">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={handleFinalize}
            disabled={!minSelectionsReached || isSubmitting}
            className={`btn-shimmer relative overflow-hidden w-full py-3 px-6 rounded-full font-semibold text-white transition-all flex items-center justify-center gap-2 ${
              minSelectionsReached
                ? 'bg-brand-dark hover:bg-brand-dark/90 cursor-pointer'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            } ${isSubmitting ? 'opacity-70' : ''}`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Finalizando...
              </>
            ) : (
              <>
                Finalizar Personalización
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>

          <p className="text-xs text-brand-dark/50 text-center mt-2">
            {selections.size < 5
              ? `Selecciona al menos ${5 - selections.size} outfit(s) más`
              : '✓ Listo para finalizar'}
          </p>
        </div>
      </footer>

      <div className="h-32" />
    </div>
  );
};

export default OnboardingPage;