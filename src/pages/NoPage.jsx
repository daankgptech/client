import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import SEO, { seoConfig } from "../utils/SEO";

const NoPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-gray-200 overflow-hidden">
      <SEO {...seoConfig.notFound} />

      {/* 🔥 Soft Background Glow */}
      <div className="absolute w-[400px] h-[400px] bg-rose-500/10 blur-3xl rounded-full animate-pulse-slow" />

      {/* 404 */}
      <motion.h1
        className="relative text-[22vw] md:text-[12rem] font-semibold text-gray-900 dark:text-white tracking-tight"
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        404
      </motion.h1>

      {/* Content */}
      <motion.div
        className="relative text-center mt-6 max-w-xl space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <h2 className="text-2xl md:text-4xl font-semibold text-gray-900 dark:text-white">
          Page Not Found
        </h2>

        <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
          Oops! The page you’re looking for doesn’t exist or has been moved.
          Check the URL or go back to safety.
        </p>

        {/* Button */}
        <button
          onClick={() => {
            if (window.history.length > 1) {
              navigate(-1);
            } else {
              navigate("/");
            }
          }}
          className="mt-5 px-6 py-2.5 md:px-7 md:py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-rose-400 dark:hover:border-rose-500 transition-all duration-200 active:scale-95"
        >
          ← Go Back
        </button>
      </motion.div>

      {/* Animations */}
      <style>{`
        @keyframes pulseSlow {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.15); opacity: 0.7; }
        }
        .animate-pulse-slow {
          animation: pulseSlow 2.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default NoPage;