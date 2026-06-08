const FeatureCard = ({ icon: Icon, title, description, delayClass = 'animate-slide-up' }) => {
  return (
    <div
      className={`group rounded-3xl bg-gradient-to-br from-[#F3EFE9] to-[#F8F5F1] p-8 flex flex-col items-center text-center max-w-sm w-full mx-auto border-4 border-gray-300/50 hover:shadow-md transition-all duration-300 ${delayClass}`}
    >
      {/* Icon Wrapper with a warm, soft gradient circle */}
      <div className="w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-tr from-brand-sand/50 to-brand-beige/80 mb-6 shadow-inner group-hover:scale-110 transition-transform duration-500 ease-out border border-white/40">
        {Icon && (
          <Icon className="w-7 h-7 text-brand-dark/80 group-hover:text-brand-bronze transition-colors duration-300" strokeWidth={1.5} />
        )}
      </div>

      {/* Feature Title */}
      <h3 className="font-sans font-semibold text-lg text-brand-dark mb-3 tracking-tight">
        {title}
      </h3>

      {/* Feature Description */}
      <p className="font-sans text-sm text-brand-dark/70 leading-relaxed font-light">
        {description}
      </p>
    </div>
  );
};

export default FeatureCard;
