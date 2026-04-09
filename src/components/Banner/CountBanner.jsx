import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import AnimatedCounter from "../../utils/AnimationCounter";
import { api } from "../../utils/Secure/api";

// Skeleton shimmer component - lightweight CSS-only animation
const SkeletonCard = () => (
  <div className="w-[45%] sm:w-[30%] md:w-[22%] lg:w-[18%]">
    <div className="animate-shimmer bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 rounded-2xl p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center min-h-[120px] sm:min-h-[140px] md:min-h-[160px]">
      <div className="w-16 sm:w-20 md:w-24 h-8 sm:h-10 md:h-12 rounded-lg bg-gray-300/80 dark:bg-gray-600/80 mb-4" />
      <div className="w-20 sm:w-24 md:w-28 h-3 sm:h-4 rounded bg-gray-300/60 dark:bg-gray-600/60" />
    </div>
  </div>
);

const CountBanner = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center w-full">
        <div className="w-48 h-4 sm:h-5 rounded bg-gray-200 dark:bg-gray-700 animate-shimmer mb-8 mt-6" />
        <div className="w-full flex flex-wrap justify-center gap-4 md:gap-8 px-4 md:px-8 lg:px-12">
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
            animation: shimmer 1.5s ease-in-out infinite;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full">
      <p className="mt-6 text-xs sm:text-sm md:text-base text-gray-800 dark:text-gray-400 text-center italic tracking-wide">
        <span className="font-semibold text-rose-700 dark:text-gray-300">
          Our story of growth
        </span>{" "}
        has been unfolding since{" "}
        <span className="font-semibold text-rose-700 dark:text-gray-300">
          October 2024
        </span>
        .
      </p>

      <div className="w-full flex flex-wrap justify-center gap-4 md:gap-8 mt-8 px-4 md:px-8 lg:px-12">
        {stats.map(({ target, label, suffix = "" }, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: i * 0.2 }}
            className="bg-gradient-to-br from-rose-600 via-red-500 to-rose-400 
                       dark:from-gray-800 dark:via-gray-700 dark:to-gray-600 
                       rounded-2xl p-4 sm:p-6 md:p-8 
                       flex flex-col items-center justify-center 
                       shadow-lg hover:shadow-red-300 dark:hover:shadow-gray-500 
                       transition-all duration-500 w-[45%] sm:w-[30%] md:w-[22%] lg:w-[18%]"
          >
            <span
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold 
                             flex items-center justify-center text-center 
                             bg-clip-text text-transparent 
                             bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-600 
                             dark:from-gray-200 dark:via-gray-300 dark:to-gray-400"
            >
              {typeof target === "number" ? (
                <>
                  <AnimatedCounter target={target} duration={2500} />
                  {suffix}
                </>
              ) : (
                target
              )}
            </span>
            <p className="mt-2 text-sm sm:text-base md:text-lg font-medium text-gray-700 dark:text-gray-300 text-center tracking-wide">
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
        // Run both API calls in parallel for better performance
        const [overviewRes, councilRes] = await Promise.all([
          api.get("/our-fam/overview"),
          api.get("/home/council"),
        ]);
        const overviewData = overviewRes.data;
        const totalDaanKgp = overviewData.totalKGPians;
        const councilData = councilRes.data;

        // 1. Calculate Currently Enrolled (from non-graduated list)
        const currentlyEnrolled = overviewData.BatchWise.reduce(
          (acc, curr) => acc + curr.count,
          0,
        );

        // 2. "This Year" (Latest Batch)
        const currentYearCount =
          overviewData.BatchWise[overviewData.BatchWise.length - 1]?.count || 0;

        // 3. Council Member Count (Dynamic from Council API)
        const councilCount = councilData.length;

        const dynamicStats = [
          {
            target: totalDaanKgp, // Note: To make this 100% dynamic, your /overview needs to return a total count including graduated: true
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
