import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Users } from "lucide-react";
import CouncilCard from "./CouncilCard";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../utils/Secure/AuthContext";
import { api } from "../../utils/Secure/api";

// Skeleton shimmer component for council cards
const SkeletonCard = () => (
  <div className="animate-shimmer rounded-2xl p-4 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
    {/* Image placeholder */}
    <div className="flex justify-center pt-4">
      <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-gray-300/70 dark:bg-gray-700/70" />
    </div>
    {/* Content placeholders */}
    <div className="px-4 py-5 text-center space-y-3">
      {/* Name placeholder */}
      <div className="w-full h-5 rounded bg-gray-300/70 dark:bg-gray-700/70 mx-auto" />
      {/* Council placeholder */}
      <div className="w-3/4 h-4 rounded bg-gray-300/60 dark:bg-gray-700/60 mx-auto" />
      {/* Footer placeholder */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700 mt-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gray-300/50 dark:bg-gray-700/50" />
          <div className="w-9 h-9 rounded-lg bg-gray-300/50 dark:bg-gray-700/50" />
        </div>
        <div className="w-12 h-5 rounded bg-gray-300/60 dark:bg-gray-700/60" />
      </div>
    </div>
  </div>
);

const Council = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/home/council");
        setMembers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load council members:", err);
        setMembers([]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const year = new Date().getFullYear - members.batch;

  return (
    <section
      id="council"
      className="container scroll-mt-[100px] bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-gray-300 py-12 md:py-16"
    >
      <div className="container mx-auto px-4 space-y-10">

        {/* Heading */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-rose-50 dark:bg-gray-900 border border-rose-200 dark:border-gray-700">
            <Users className="w-5 h-5 text-rose-500" />
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
            Our DAAN Council Members
          </h1>
        </div>

        {/* Content */}
        {loading ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
            <style>{`
              @keyframes shimmer {
                0% { background-position: -200% 0; }
                100% { background-position: 200% 0; }
              }
              .animate-shimmer {
                background: linear-gradient(90deg, transparent 0%, rgba(156, 163, 175, 0.3) 50%, transparent 100%);
                background-size: 200% 100%;
                animation: shimmer 1.2s linear infinite;
              }
              .dark .animate-shimmer {
                background: linear-gradient(90deg, transparent 0%, rgba(75, 85, 99, 0.3) 50%, transparent 100%);
                background-size: 200% 100%;
              }
            `}</style>
          </>
        ) : members.length === 0 ? (
          <p className="text-center text-base md:text-lg font-medium text-gray-500 dark:text-gray-400">
            No members found.
          </p>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key="council-list"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6"
            >
              {members.map((member, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <CouncilCard {...member} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Spreadsheet / External Button */}
        <div className="text-center mt-8">
          {isAuthenticated ? (
            <a
              href="https://docs.google.com/spreadsheets/d/1cPQRMKplIaWI2JIi5d6z7a6ahofOq8UnZtNLRaMhGdQ/edit?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm md:text-base font-medium
              border border-rose-300 dark:border-gray-700
              text-rose-600 dark:text-rose-400
              bg-rose-50 dark:bg-gray-900
              hover:bg-rose-100 dark:hover:bg-gray-800
              transition-all duration-200 hover:scale-[1.03]"
            >
              View Full Council
            </a>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                Detailed access restricted to DAAN-KGPians
              </p>
              <Link
                to="/signin"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm md:text-base font-medium
                border border-rose-300 dark:border-rose-500/30
                text-rose-600 dark:text-rose-400
                bg-rose-50 dark:bg-gray-900
                hover:bg-rose-100 dark:hover:bg-gray-800
                transition-all duration-200 hover:scale-[1.03]"
              >
                <Lock className="w-4 h-4" />
                Sign In to View Full Council
              </Link>
            </div>
          )}
        </div>

      </div>
    </section>
  );
};

export default Council;