import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import AnimatedCounter from "../../utils/AnimationCounter";
import { api } from "../../utils/Secure/api";
import { cache } from "../../utils/cache";

// Skeleton component matching exact card structure and border layout
const SkeletonCard = () => (
  <div className="w-[45%] sm:w-[30%] md:w-[22%] lg:w-[18%] p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center bg-transparent border-x-[0.1px] border-white/10">
    {/* Number Skeleton */}
    <div className="w-16 sm:w-24 md:w-32 h-8 sm:h-10 md:h-14 rounded-xl bg-white/10 animate-pulse mb-2" />
    {/* Label Skeleton */}
    <div className="w-20 sm:w-24 md:w-28 h-4 sm:h-5 rounded-md bg-white/5 animate-pulse" />
  </div>
);

const CountBanner = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center w-full">
        {/* Subtitle Skeleton */}
        <div className="mt-6 w-64 sm:w-80 md:w-[380px] h-4 sm:h-5 rounded-full bg-white/10 animate-pulse" />

        {/* Stats Skeleton Grid matching actual design */}
        <div className="w-full flex flex-wrap justify-center gap-0 mt-8 px-0 md:px-0">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full">

      {/* Subtitle */}
      <p className="mt-6 text-xs sm:text-sm md:text-base text-white/60 text-center tracking-wide">
        <span className="font-medium text-primary">
          Our story of growth
        </span>{" "}
        has been unfolding since{" "}
        <span className="font-medium text-primary">
          October 2024
        </span>
        .
      </p>

      {/* Stats */}
      <div className="w-full flex flex-wrap justify-center gap-0 mt-8 px-0 md:px-0">
        {stats.map(({ target, label, suffix = "" }, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: i * 0.15 }}
            className="w-[45%] sm:w-[30%] md:w-[22%] lg:w-[18%] p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center bg-transparent hover:bg-white/5 transition-all duration-300 border-x-[0.1px] border-white/10"
          >

            {/* Number */}
            <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-space-grotesk tracking-tighter text-white flex items-center justify-center">
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
            <p className="mt-2 text-sm sm:text-base md:text-lg font-medium text-white/60 text-center">
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
        if (cached && Array.isArray(cached)) {
          setStats(cached);
          setLoading(false);
          return;
        }

        const [overviewRes, councilRes] = await Promise.all([
          api.get("/our-fam/overview"),
          api.get("/home/council"),
        ]);

        const overviewData = overviewRes.data;
        if (!overviewData || !overviewData.BatchWise) {
          throw new Error("Invalid overview data received");
        }
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
    <section className="py-24">
      <CountBanner stats={stats} loading={loading} />
    </section>
  );
}