import { useEffect } from "react";

const FlashPage = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(onFinish, 2200);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-300 flex flex-col items-center justify-center z-50 overflow-hidden">

      {/* 🔥 Soft Glow Background Pulse */}
      <div className="absolute w-[500px] h-[500px] bg-rose-500/10 rounded-full blur-3xl animate-pulse-slow" />

      {/* ✨ Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <span
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* 🎯 Content */}
      <div className="relative flex flex-col items-center text-center">

        {/* MAIN TITLE */}
        <h1 className="text-[16vw] md:text-[10vw] font-semibold tracking-tight flex overflow-hidden">
          {"DAAN KGP".split("").map((char, i) => (
            <span key={i} className="letter">
              {char}
            </span>
          ))}
        </h1>

        {/* SUBTITLE */}
        <h3 className="mt-2 text-[4vw] md:text-[2vw] opacity-0 animate-fade-up-delay text-gray-600 dark:text-gray-400">
          DakshanA Alumni Network at IIT Kharagpur
        </h3>

        {/* TAGLINE */}
        <p className="mt-2 text-sm md:text-base opacity-0 animate-fade-up-delay-2 text-rose-600 dark:text-rose-400">
          Welcomes you ...
        </p>
      </div>

      {/* 🔥 Animations */}
      <style>{`
        /* LETTER REVEAL */
        .letter {
          display: inline-block;
          opacity: 0;
          transform: translateY(40px) scale(0.9);
          animation: letterIn 0.6s ease forwards;
        }
        .letter:nth-child(1) { animation-delay: 0.05s; }
        .letter:nth-child(2) { animation-delay: 0.1s; }
        .letter:nth-child(3) { animation-delay: 0.15s; }
        .letter:nth-child(4) { animation-delay: 0.2s; }
        .letter:nth-child(5) { animation-delay: 0.25s; }
        .letter:nth-child(6) { animation-delay: 0.3s; }
        .letter:nth-child(7) { animation-delay: 0.35s; }
        .letter:nth-child(8) { animation-delay: 0.4s; }

        @keyframes letterIn {
          0% {
            opacity: 0;
            transform: translateY(40px) scale(0.9);
          }
          60% {
            opacity: 1;
            transform: translateY(-5px) scale(1.05);
          }
          100% {
            transform: translateY(0) scale(1);
          }
        }

        /* SUBTEXT FADE */
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-up-delay {
          animation: fadeUp 0.8s ease forwards;
          animation-delay: 0.8s;
        }

        .animate-fade-up-delay-2 {
          animation: fadeUp 0.8s ease forwards;
          animation-delay: 1.2s;
        }

        /* GLOW PULSE */
        @keyframes pulseSlow {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.2); opacity: 0.8; }
        }

        .animate-pulse-slow {
          animation: pulseSlow 2s ease-in-out infinite;
        }

        /* PARTICLES */
        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: rgba(244, 63, 94, 0.4);
          border-radius: 50%;
          top: 100%;
          animation: floatUp 2s linear infinite;
        }

        @keyframes floatUp {
          from {
            transform: translateY(0);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          to {
            transform: translateY(-120vh);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default FlashPage;