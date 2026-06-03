import { useState } from 'react';
import { Sparkles, Shirt, Palette, Menu, X, ArrowUpRight } from 'lucide-react';
import HeroSection from '../components/HeroSection';
import FeatureCard from '../components/FeatureCard';

/**
 * LandingPage acts as the main viewport wrapper, coordinating background layout,
 * navbar, features grid, and footer.
 */
const LandingPage = ({ onGetStarted }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-hidden selection:bg-brand-bronze/20 selection:text-brand-dark">
      
      {/* 1. BACKGROUND LAYOUT (Opaque, blurred, and warm overlay for optimal text contrast) */}
      <div className="absolute inset-0 z-0 bg-[#F4F0EA]">
        {/* Armario Image with opacity, cover size, and blur effect */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-35 filter blur-[4px] scale-102"
          style={{ backgroundImage: "url('/assets/wardrobe_bg.png')" }}
        />
        {/* Semi-transparent Beige Claro overlay for high-end look and text readability */}
        <div className="absolute inset-0 bg-[#F4F0EA]/85 backdrop-blur-[2px]" />
      </div>

      {/* 2. NAVIGATION BAR */}
      <header className="relative z-10 px-6 py-6 md:px-12 max-w-7xl w-full mx-auto flex items-center justify-between">
        {/* Minimal Signature Logo */}
        <div className="font-serif italic text-4xl font-normal text-brand-dark tracking-wide select-none cursor-pointer">
          DressMe
        </div>

        {/* Desktop Menu Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-sans font-medium text-brand-dark/75">
          <a href="#features" className="hover:text-brand-dark transition-colors duration-200">Características</a>
          <a href="#about" className="hover:text-brand-dark transition-colors duration-200">Asistente IA</a>
          <span className="w-1 h-1 rounded-full bg-brand-bronze/55"></span>
          <button 
            onClick={onGetStarted}
            className="flex items-center gap-1 hover:text-brand-dark transition-colors duration-200 font-semibold cursor-pointer"
          >
            Iniciar Sesión <ArrowUpRight className="w-4 h-4" />
          </button>
        </nav>

        {/* Mobile Menu Icon */}
        <div className="md:hidden">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-brand-dark focus:outline-none cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-20 left-0 right-0 mx-6 p-6 rounded-3xl glass-effect z-20 shadow-xl border border-white/40 flex flex-col gap-5 text-center font-sans font-medium text-brand-dark/85 md:hidden animate-slide-up">
          <a href="#features" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-brand-dark">Características</a>
          <a href="#about" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-brand-dark">Asistente IA</a>
          <hr className="border-brand-sand/40 my-1" />
          <button 
            onClick={() => {
              setMobileMenuOpen(false);
              onGetStarted();
            }}
            className="py-3 px-6 rounded-full bg-brand-charcoal text-[#FAF8F5] text-sm hover:bg-brand-dark/90 transition-colors"
          >
            Iniciar Sesión
          </button>
        </div>
      )}

      {/* 3. MAIN CONTENT CONTAINER */}
      <main className="relative z-10 flex-grow flex flex-col justify-center items-center py-6">
        
        {/* HERO SECTION */}
        <HeroSection onGetStarted={onGetStarted} />

        {/* 4. FEATURES SECTION */}
        <section id="features" className="w-full max-w-6xl px-6 py-12 md:py-16">
          {/* Subtle section divider */}
          <div className="flex items-center justify-center gap-4 mb-16 max-w-md mx-auto">
            <div className="h-[1px] flex-grow bg-brand-sand/50"></div>
            <span className="font-serif italic text-sm text-brand-bronze">Características clave</span>
            <div className="h-[1px] flex-grow bg-brand-sand/50"></div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch justify-center">
            <FeatureCard 
              icon={Sparkles}
              title="Sugerencias con IA"
              description="Nuestra IA aprende tus preferencias estéticas y te propone combinaciones basadas en tu estilo y el clima actual."
              delayClass="animate-slide-up"
            />
            <FeatureCard 
              icon={Shirt}
              title="Organiza tu guardarropa"
              description="Digitaliza tus prendas fácilmente. Mantén un inventario visual impecable, ordenado y siempre accesible."
              delayClass="animate-slide-up-delay"
            />
            <FeatureCard 
              icon={Palette}
              title="Combina outfits perfectos"
              description="Crea conjuntos elegantes para cualquier ocasión, maximizando el potencial de las prendas que ya posees."
              delayClass="animate-slide-up-delay-more"
            />
          </div>
        </section>
      </main>

      {/* 5. FOOTER */}
      <footer className="relative z-10 px-6 py-8 border-t border-brand-sand/30 bg-[#FAF8F5]/40 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-sans font-light text-brand-dark/50">
          <div className="flex items-center gap-1 select-none">
            <span>© {new Date().getFullYear()} DressMe.</span>
            <span className="font-serif italic font-normal">Estilo conectado.</span>
          </div>
          
          <div className="flex gap-6">
            <a href="#" className="hover:text-brand-dark transition-colors">Términos</a>
            <a href="#" className="hover:text-brand-dark transition-colors">Privacidad</a>
            <a href="#" className="hover:text-brand-dark transition-colors">Soporte</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
