import { useEffect, useState, useMemo } from "react";
import SEO, { seoConfig, Breadcrumbs } from "../utils/SEO";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import formsData from "../components/Forms/formsData";
import FormsCard from "../components/Forms/FormsCard";
import { api } from "../utils/Secure/api";
import { cache } from "../utils/cache";

// Skeleton shimmer component for form cards
const SkeletonCard = () => (
  <div className="animate-shimmer rounded-2xl overflow-hidden bg-white/5 border-[0.5px] border-white/10">
    {/* Image placeholder */}
    <div className="aspect-[16/10] bg-white/10" />
    {/* Content placeholder */}
    <div className="p-4 space-y-3">
      <div className="w-3/4 h-5 rounded bg-white/5" />
      <div className="w-full h-4 rounded bg-white/5" />
      <div className="w-1/2 h-3 rounded bg-white/5" />
    </div>
    {/* Footer placeholder */}
    <div className="border-t border-white/10 p-3">
      <div className="w-full h-8 rounded bg-white/5" />
    </div>
  </div>
);

const BATCH_DENOMINATORS = {
  "'25": 42,
  "'24": 46,
  "'23": 35,
  "'22": 32,
  "'21": 17,
};

const Forms = () => {
  const [dynamicStats, setDynamicStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchStats = async () => {
      try {
        // Check cache first
        const cached = cache.get("/forms/stats?form=farewell");
        if (cached && isMounted) {
          setDynamicStats(cached);
          setLoading(false);
          return;
        }

        const res = await api.get("/forms/stats?form=farewell");
        if (res.status === 200 && isMounted) {
          const statsMap = res.data;
          const formattedPercentages = Object.keys(BATCH_DENOMINATORS).map(
            (batchObj) => ({
              batch: batchObj,
              percentage:
                ((statsMap[batchObj] || 0) / BATCH_DENOMINATORS[batchObj]) *
                100,
            }),
          );
          const statsData = { farewell: formattedPercentages };
          setDynamicStats(statsData);
          // Cache for 5 minutes
          cache.set("/forms/stats?form=farewell", statsData, 5 * 60 * 1000);
        }
      } catch (err) {
        console.error("Error fetching form stats:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    fetchStats();
    return () => {
      isMounted = false;
    };
  }, []);

  const nowIST = useMemo(() => {
    const formatStr = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
    });
    return new Date(formatStr);
  }, []);

  const processedForms = useMemo(() => {
    return formsData.map((item) => {
      const deadlineDate = new Date(item.deadline);
      const formDeadlineIST = new Date(
        deadlineDate.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
      );
      const isExceeded = nowIST > formDeadlineIST;

      const identifier = item.to.split("/").pop();
      const responsePercentage =
        dynamicStats[identifier] || item.responsePercentage;

      return { ...item, isExceeded, deadlineDate, responsePercentage };
    });
  }, [dynamicStats, nowIST]);

  return (
    <div className="min-h-screen transition-colors duration-300">
      <SEO {...seoConfig.forms} />

      <section className="container mx-auto py-12">
        <div className="pb-4">
          <Breadcrumbs items={seoConfig.forms.breadcrumbs} />
        </div>
        <div className="flex items-center gap-3 mb-8">
          <h1 className="text-3xl md:text-5xl font-bold font-space-grotesk tracking-tighter text-white">
            Forms
          </h1> 
        </div>

        {loading ? (
          <>
            <div className="container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
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
        ) : (
          <motion.div initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
           className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-0">
            {processedForms.map((item, index) => (
              <motion.div
               key={index}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.4, delay: index * 0.05 }}>
               <FormsCard key={index} item={item} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>
    </div>
  );
};

export default Forms;
