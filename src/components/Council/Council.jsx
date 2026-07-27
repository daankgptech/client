import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Lock, Users } from "lucide-react";
import CouncilCard from "./CouncilCard";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../utils/Secure/AuthContext";
import { api } from "../../utils/Secure/api";
import { cache } from "../../utils/cache";

// Skeleton shimmer component for council cards
const SkeletonCard = () => (
  <div className="flex-none w-[280px] snap-center animate-shimmer rounded-2xl p-4 bg-white/5 border-[0.5px] border-white/10">
    {/* Image placeholder */}
    <div className="flex justify-center pt-4">
      <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-white/10" />
    </div>
    {/* Content placeholders */}
    <div className="px-4 py-5 text-center space-y-3">
      {/* Name placeholder */}
      <div className="w-full h-5 rounded bg-white/5 mx-auto" />
      {/* Council placeholder */}
      <div className="w-3/4 h-4 rounded bg-white/5 mx-auto" />
      {/* Footer placeholder */}
      <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-white/5" />
          <div className="w-9 h-9 rounded-lg bg-white/5" />
        </div>
        <div className="w-12 h-5 rounded bg-white/5" />
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

        // Check cache first
        const cached = cache.get("/home/council");
        if (cached) {
          setMembers(Array.isArray(cached) ? cached : []);
          setLoading(false);
          return;
        }

        const { data } = await api.get("/home/council");
        const membersData = Array.isArray(data) ? data : [];
        setMembers(membersData);
        // Cache for 5 minutes
        cache.set("/home/council", membersData, 5 * 60 * 1000);
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
      className="container scroll-mt-[100px] py-14 md:py-24"
    >
      <div className="container mx-auto px-4 space-y-10">

        {/* Heading */}
        <div className="flex items-center gap-3">
          <div className="p-2 pl-0">
            <Users className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-space-grotesk tracking-tighter text-white">
            Our DAAN Council Members
          </h1>
        </div>

        {/* Content */}
        {loading ? (
          <>
            <div className="flex overflow-x-auto gap-0 pb-8 snap-x snap-mandatory no-scrollbar pr-0">
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
          <p className="text-center text-base md:text-lg font-medium text-white/60">
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
              className="flex overflow-x-auto gap-0 pb-8 snap-x snap-mandatory no-scrollbar pr-10"
            >
              {members.map((member, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex-none snap-center"
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
            <Link
              to="https://docs.google.com/spreadsheets/d/1cPQRMKplIaWI2JIi5d6z7a6ahofOq8UnZtNLRaMhGdQ/edit?usp=sharing" target="_blank"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-white transition-all duration-300 hover:underline decoration-dashed"
            >Full Council
            </Link>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-white/40 italic">
                Detailed access restricted to DAAN-KGPians
              </p>
              <Link
                to="/signin"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm md:text-base font-medium
                border-[0.5px] border-white/10
                text-primary
                bg-white/5
                hover:bg-white/10
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