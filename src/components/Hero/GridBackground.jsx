// Ultra-lightweight premium grid background - CSS only, zero JS overhead
export default function GridBackground() {
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Base gradient - light in light mode, dark in dark mode */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" />

      {/* Animated grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.15] dark:opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.08) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          animation: "gridDrift 25s linear infinite",
        }}
      />

      {/* Premium glow orbs - orange/rose accent */}
      <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] rounded-full bg-gradient-to-r from-orange-400/20 to-rose-400/15 blur-[100px] animate-pulse-slow dark:from-orange-500/10 dark:to-rose-500/10" />
      <div className="absolute bottom-1/4 right-1/4 w-[35vw] h-[35vw] rounded-full bg-gradient-to-r from-red-400/15 to-rose-400/12 blur-[120px] animate-pulse-slower dark:from-red-500/8 dark:to-rose-500/8" />

      {/* Accent streak - orange/rose */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[1px] bg-gradient-to-r from-transparent via-orange-400/40 to-transparent dark:via-orange-400/30" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60%] h-[1px] bg-gradient-to-r from-transparent via-rose-400/30 to-transparent dark:via-rose-400/20" />

      {/* Radial vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(255,255,255,0.2)_100%)] dark:bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.3)_100%)]" />

      <style>{`
        @keyframes gridDrift {
          0% { background-position: 0 0; }
          100% { background-position: 60px 60px; }
        }
        .animate-pulse-slow { animation: pulse 8s ease-in-out infinite; }
        .animate-pulse-slower { animation: pulse 12s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
