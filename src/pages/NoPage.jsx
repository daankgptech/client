import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const NoPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      {/* Animated 404 Text */}
      <motion.h1
        className="text-9xl font-extrabold md:text-[15rem] text-red-500 dark:text-gray-400"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 120 }}
      >
        404
      </motion.h1>

      {/* Descriptive Message */}
      <motion.div
        className="text-center mt-6 max-w-xl space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <h2 className="text-3xl md:text-5xl font-bold ">Page Not Found</h2>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300">
          Oops! The page you’re looking for doesn’t exist or has been moved.
          Check the URL or go back to safety.
        </p>

        {/* Action Button */}
        <button
          onClick={() => {
            if (window.history.length > 1) {
              navigate(-1);
            } else {
              navigate("/");
            }
          }}
          className="mt-4 px-6 py-3 md:px-8 md:py-4 rounded-lg bg-gradient-to-r from-red-400 dark:from-gray-500 dark:to-gray-800 to-red-600 hover:from-red-500 hover:to-red-700 text-gray-100 font-semibold shadow-lg transform transition hover:scale-105 "
        >
          ← Go Back
        </button>
      </motion.div>
    </div>
  );
};

export default NoPage;
