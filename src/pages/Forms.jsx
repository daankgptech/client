import { useEffect, useState, useMemo } from "react";
import { ClipboardList } from "lucide-react";
import SEO, { seoConfig, Breadcrumbs } from "../utils/SEO";

import formsData from "../components/Forms/formsData";
import FormsCard from "../components/Forms/FormsCard";
import { api } from "../utils/Secure/api";
import { cache } from "../utils/cache";

// Skeleton shimmer component for form cards
const SkeletonCard = () => (
  <div className="animate-shimmer rounded-2xl overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
    {/* Image placeholder */}
    <div className="aspect-[16/10] bg-gray-300/70 dark:bg-gray-700/70" />
    {/* Content placeholder */}
    <div className="p-4 space-y-3">
      <div className="w-3/4 h-5 rounded bg-gray-300/70 dark:bg-gray-700/70" />
      <div className="w-full h-4 rounded bg-gray-300/60 dark:bg-gray-700/60" />
      <div className="w-1/2 h-3 rounded bg-gray-300/50 dark:bg-gray-700/50" />
    </div>
    {/* Footer placeholder */}
    <div className="border-t border-gray-100 dark:border-gray-800 p-3">
      <div className="w-full h-8 rounded bg-gray-300/50 dark:bg-gray-700/50" />
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
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
      <SEO {...seoConfig.forms} />

      <section className="container mx-auto py-12">
        <div className="pb-4">
          <Breadcrumbs items={seoConfig.forms.breadcrumbs} />
        </div>
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 rounded-lg bg-rose-50 dark:bg-gray-900 border border-rose-200 dark:border-gray-700">
            <ClipboardList className="w-5 h-5 text-rose-500" />
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
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
          <div className="container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {processedForms.map((item, index) => (
              <FormsCard key={index} item={item} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Forms;
