/**
 * A reusable card container with soft glassmorphic background, subtle borders, and soft shadow.
 */
const GlassContainer = ({ children, className = '', hoverEffect = false }) => {
  return (
    <div
      className={`
        glass-effect
        rounded-3xl
        shadow-sm
        transition-all
        duration-500
        ease-out
        ${hoverEffect ? 'hover:shadow-md hover:translate-y-[-4px] hover:border-white/60 hover:bg-white/70' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default GlassContainer;
