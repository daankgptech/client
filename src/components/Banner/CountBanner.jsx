import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import AnimatedCounter from "../../utils/AnimationCounter";
import { api } from "../../utils/Secure/api";
import { cache } from "../../utils/cache";

// Skeleton shimmer component
const SkeletonCard = () => (
  <div className="w-[45%] sm:w-[30%] md:w-[22%] lg:w-[18%]">
    <div className="animate-shimmer rounded-2xl p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center min-h-[120px] sm:min-h-[140px] md:min-h-[160px] bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
      <div className="w-16 sm:w-20 md:w-24 h-8 sm:h-10 md:h-12 rounded bg-gray-300/70 dark:bg-gray-700/70 mb-4" />
      <div className="w-20 sm:w-24 md:w-28 h-3 sm:h-4 rounded bg-gray-300/60 dark:bg-gray-700/60" />
    </div>
  </div>
);

const CountBanner = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center w-full">
        <div className="w-40 h-4 rounded bg-gray-200 dark:bg-gray-700 animate-shimmer mb-8 mt-6" />

        <div className="w-full flex flex-wrap justify-center gap-4 md:gap-6 px-4 md:px-8">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>

        <style>{`
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
          .animate-shimmer {
            background-size: 200% 100%;
            animation: shimmer 1.2s linear infinite;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full">

      {/* Subtitle */}
      <p className="mt-6 text-xs sm:text-sm md:text-base text-gray-700 dark:text-gray-400 text-center tracking-wide">
        <span className="font-medium text-rose-600 dark:text-rose-400">
          Our story of growth
        </span>{" "}
        has been unfolding since{" "}
        <span className="font-medium text-rose-600 dark:text-rose-400">
          October 2024
        </span>
        .
      </p>

      {/* Stats */}
      <div className="w-full flex flex-wrap justify-center gap-4 md:gap-6 mt-8 px-4 md:px-8">
        {stats.map(({ target, label, suffix = "" }, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: i * 0.15 }}
            className="w-[45%] sm:w-[30%] md:w-[22%] lg:w-[18%] rounded-2xl p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
          >

            {/* Number */}
            <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-gray-900 dark:text-white flex items-center justify-center">
              {typeof target === "number" ? (
                <>
                  <AnimatedCounter target={target} duration={2000} />
                  {suffix}
                </>
              ) : (
                target
              )}
            </span>

            {/* Label */}
            <p className="mt-2 text-sm sm:text-base md:text-lg font-medium text-gray-600 dark:text-gray-400 text-center">
              {label}
            </p>

          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default function BannerTwo() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check cache first
        const cached = cache.get("banner_stats");
        if (cached) {
          setStats(cached);
          setLoading(false);
          return;
        }

        const [overviewRes, councilRes] = await Promise.all([
          api.get("/our-fam/overview"),
          api.get("/home/council"),
        ]);

        const overviewData = overviewRes.data;
        const totalDaanKgp = overviewData.totalKGPians;
        const councilData = councilRes.data;

        const currentlyEnrolled = overviewData.BatchWise.reduce(
          (acc, curr) => acc + curr.count,
          0
        );

        const currentYearCount =
          overviewData.BatchWise[overviewData.BatchWise.length - 1]?.count || 0;

        const councilCount = councilData.length;

        const dynamicStats = [
          {
            target: totalDaanKgp,
            label: "Total DAAN KGPians",
            suffix: "+",
          },
          {
            target: currentlyEnrolled,
            label: "Currently Enrolled",
          },
          {
            target: currentYearCount,
            label: "Enrolled this year",
          },
          {
            target: councilCount,
            label: "Council Members",
          },
        ];

        setStats(dynamicStats);
        // Cache for 10 minutes (stats don't change often)
        cache.set("banner_stats", dynamicStats, 10 * 60 * 1000);
      } catch (err) {
        console.error("Error fetching banner data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <section className="py-12 bg-gray-100 dark:bg-gray-950">
      <CountBanner stats={stats} loading={loading} />
    </section>
  );
}