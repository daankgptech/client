import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CouncilCard from "./CouncilCard";
import { useNavigate } from "react-router-dom";
import ProtectedRoute from "../Secure/ProtectedRoute";
import { api } from "../../utils/Secure/api";

const Council = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/council");
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
      className="scroll-mt-[100px] bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-300 py-10"
    >
      <div className="container space-y-10" data-aos="fade-up">
        <h1 className="border-l-8 border-red-300 dark:border-gray-300 py-2 pl-3 text-3xl font-bold">
          Our DAAN Council Members
        </h1>

        {loading ? (
          <p className="text-center text-lg font-semibold">Loading...</p>
        ) : members.length === 0 ? (
          <p className="text-center text-lg font-semibold">No members found.</p>
        ) : (
          <AnimatePresence>
            <motion.div
              key="council-list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
            >
              {members.map((member, i) => (
                <CouncilCard key={i} {...member} />
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Spreadsheet / External Button */}
        <div className="text-center mt-6">
          <ProtectedRoute
            fallback={
              <button
                onClick={() => navigate("/signin")}
                className="inline-block p-2 rounded-lg border shadow-sm text-red-600 dark:text-gray-400
                bg-gradient-to-tr from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700
                border-gray-300 dark:border-gray-600 transition-all duration-300
                hover:from-gray-300 hover:to-gray-400 dark:hover:from-gray-700 dark:hover:to-gray-600
                hover:border-gray-500 dark:hover:border-cyan-400"
              >
                View Full Council
              </button>
            }
          >
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block p-2 rounded-lg border shadow-sm text-red-600 dark:text-gray-400
              bg-gradient-to-tr from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700
              border-gray-300 dark:border-gray-600 transition-all duration-300
              hover:from-gray-300 hover:to-gray-400 dark:hover:from-gray-700 dark:hover:to-gray-600
              hover:border-gray-500 dark:hover:border-cyan-400"
            >
              View Full Council
            </a>
          </ProtectedRoute>
        </div>
      </div>
    </section>
  );
};

export default Council;