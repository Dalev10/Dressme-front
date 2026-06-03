/**
 * HeroSection renders the welcome header, signature logo, and call-to-action button,
 * flanked by asymmetric collage grids of stylish outfits matching the design layout.
 */
const HeroSection = ({ onGetStarted }) => {
  return (
    <div className="w-full max-w-[1700px] mx-auto px-4 md:px-8 py-6 flex flex-col xl:flex-row items-center justify-between gap-8 select-none animate-slide-up">
      
      {/* LEFT COLLAGE (2 Columns of Outfits) */}
      <div className="hidden xl:flex w-[24%] shrink-0 flex-row gap-4 items-start">
        {/* Column 1 - Left */}
        <div className="flex flex-col gap-4 w-1/2">
          <div className="overflow-hidden rounded-2xl shadow-md border border-gray-200/50 hover:scale-[1.03] transition-all duration-500 ease-out cursor-pointer group">
            <img 
              src="/assets/outfit_left_1.png" 
              alt="Modelo con sudadera amarilla" 
              className="w-full h-auto object-cover aspect-[3/4.5] group-hover:scale-105 transition-transform duration-700 ease-out" 
            />
          </div>
          <div className="overflow-hidden rounded-2xl shadow-md border border-gray-200/50 hover:scale-[1.03] transition-all duration-500 ease-out cursor-pointer group">
            <img 
              src="/assets/outfit_left_2.png" 
              alt="Modelo con camisa floreada" 
              className="w-full h-auto object-cover aspect-[3/4.5] group-hover:scale-105 transition-transform duration-700 ease-out" 
            />
          </div>
        </div>
        
        {/* Column 2 - Right (Shifted down for asymmetry) */}
        <div className="flex flex-col gap-4 w-1/2 mt-12">
          <div className="overflow-hidden rounded-2xl shadow-md border border-gray-200/50 hover:scale-[1.03] transition-all duration-500 ease-out cursor-pointer group">
            <img 
              src="/assets/outfit_left_3.png" 
              alt="Modelo con casaca de jean" 
              className="w-full h-auto object-cover aspect-[3/4.5] group-hover:scale-105 transition-transform duration-700 ease-out" 
            />
          </div>
          <div className="overflow-hidden rounded-2xl shadow-md border border-gray-200/50 hover:scale-[1.03] transition-all duration-500 ease-out cursor-pointer group">
            <img 
              src="/assets/outfit_left_4.png" 
              alt="Modelo con traje de sastre blanco" 
              className="w-full h-auto object-cover aspect-[3/4.5] group-hover:scale-105 transition-transform duration-700 ease-out" 
            />
          </div>
        </div>
      </div>

      {/* CENTER PILLAR (Logo, Text & Button) */}
      <div className="flex-grow max-w-xl mx-auto flex flex-col items-center justify-center text-center py-12 px-4 z-10">
        
        {/* Dark capsule badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1A1D20]/95 text-white border border-gray-300 shadow-sm backdrop-blur-md mb-8 animate-float">
          <span className="w-2 h-2 rounded-full bg-[#BFA280] animate-pulse"></span>
          <span className="text-xs font-semibold uppercase tracking-wider">Estilo Inteligente</span>
        </div>

        {/* Sophisticated Dark Chrome Serif Logo */}
        <h1 className="dark-chrome-text text-7xl md:text-8xl lg:text-9xl mb-6 select-none relative pb-3">
          DressMe
        </h1>

        {/* Main Tagline */}
        <h2 className="font-sans font-extrabold text-2xl md:text-4xl text-black mb-5 tracking-tight leading-tight mt-4">
          Tu closet virtual, <span className="text-brand-dark">con asistente de estilo</span>
        </h2>

        {/* Description */}
        <p className="font-sans text-base text-gray-700 leading-relaxed font-light mb-10 max-w-lg">
          Organiza tu armario, guarda tus prendas y deja que la IA te ayude a combinar outfits perfectos en segundos.
        </p>

        {/* Call to Action Button */}
        <button
          onClick={onGetStarted}
          className="
            btn-shimmer
            group
            relative
            overflow-hidden
            inline-flex
            items-center
            justify-center
            gap-3
            px-8
            py-4
            rounded-[20px]
            bg-[#1A1D20]
            text-[#FAF8F5]
            font-sans
            font-medium
            text-base
            shadow-lg
            shadow-brand-charcoal/20
            hover:shadow-xl
            hover:shadow-brand-bronze/10
            transition-all
            duration-300
            ease-out
            hover:scale-[1.03]
            active:scale-[0.98]
            cursor-pointer
          "
        >
          <span>Comenzar</span>
          <span className="group-hover:translate-x-1 transition-transform duration-300 text-lg">→</span>
        </button>
      </div>

      {/* RIGHT COLLAGE (2 Columns of Outfits) */}
      <div className="hidden xl:flex w-[26%] shrink-0 flex-row gap-4 items-start">
        {/* Column 1 - Left (Shifted down for asymmetry) */}
        <div className="flex flex-col gap-4 w-1/2 mt-16">
          <div className="overflow-hidden rounded-2xl shadow-md border border-gray-200/50 hover:scale-[1.03] transition-all duration-500 ease-out cursor-pointer group">
            <img
              src="/assets/outfit_right_1.png"
              alt="Modelo con pantalón a rayas y fondo turquesa"
              className="w-full h-auto object-cover aspect-[3/4.5] group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          </div>
          <div className="overflow-hidden rounded-2xl shadow-md border border-gray-200/50 hover:scale-[1.03] transition-all duration-500 ease-out cursor-pointer group">
            <img
              src="/assets/outfit_right_2.png"
              alt="Modelo con sastre azul marino"
              className="w-full h-auto object-cover aspect-[3/4.5] group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          </div>
        </div>

        {/* Column 2 - Right (Baseline alignment) */}
        <div className="flex flex-col gap-4 w-1/2">
          <div className="overflow-hidden rounded-2xl shadow-md border border-gray-200/50 hover:scale-[1.03] transition-all duration-500 ease-out cursor-pointer group">
            <img
              src="/assets/outfit_right_3.png"
              alt="Modelo con camiseta roja y cazadora"
              className="w-full h-auto object-cover aspect-[3/4.5] group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          </div>
          <div className="overflow-hidden rounded-2xl shadow-md border border-gray-200/50 hover:scale-[1.03] transition-all duration-500 ease-out cursor-pointer group">
            <img
              src="/assets/outfit_right_5.png"
              alt="Modelo con abrigo azul en plaza de Milán"
              className="w-full h-auto object-cover aspect-[3/4.5] group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          </div>
        </div>
      </div>

    </div>
  );
};

export default HeroSection;

