import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CouncilCard from "./CouncilCard";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../utils/Secure/AuthContext";
import { api } from "../../utils/Secure/api";

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
        <h1 className="border-l-4 border-rose-400 dark:border-rose-500 pl-4 text-2xl md:text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
          Our DAAN Council Members
        </h1>

        {/* Content */}
        {loading ? (
          <p className="text-center text-base md:text-lg font-medium text-gray-500 dark:text-gray-400">
            Loading...
          </p>
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
                border border-rose-300
                text-rose-600
                hover:bg-rose-50
                transition-all duration-200 hover:scale-[1.03]"
              >
                🔒 Sign In to View Full Council
              </Link>
            </div>
          )}
        </div>

      </div>
    </section>
  );
};

export default Council;