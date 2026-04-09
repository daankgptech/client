import { Helmet } from "react-helmet-async";
import { useEffect, useState, useMemo } from "react";
import BrightMindsCard from "../components/OurBrightMinds/BrightMindsCard";
import { api } from "../utils/Secure/api";
import { cache } from "../utils/cache";
import AnimatedCarousel from "../components/OurBrightMinds/AnimatedCarousel";
import { Medal, Milestone, Trophy } from "lucide-react";

// Skeleton shimmer component for bright minds cards
const SkeletonCard = () => (
  <div className="animate-shimmer rounded-2xl p-4 w-full max-w-[280px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
    {/* Rank badge placeholder */}
    <div className="flex justify-end mb-2">
      <div className="w-16 h-5 rounded-full bg-gray-300/60 dark:bg-gray-700/60" />
    </div>
    {/* Image placeholder */}
    <div className="flex justify-center mt-4 mb-5">
      <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gray-300/70 dark:bg-gray-700/70" />
    </div>
    {/* Name placeholder */}
    <div className="w-3/4 h-5 rounded bg-gray-300/70 dark:bg-gray-700/70 mx-auto mb-2" />
    {/* Dept placeholder */}
    <div className="w-1/2 h-3 rounded bg-gray-300/60 dark:bg-gray-700/60 mx-auto" />
    {/* Footer placeholder */}
    <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
      <div className="w-16 h-3 rounded bg-gray-300/50 dark:bg-gray-700/50" />
      <div className="w-20 h-4 rounded bg-gray-300/60 dark:bg-gray-700/60" />
    </div>
  </div>
);

const AcademicStars = () => {
  const [data, setData] = useState({});
  const [activeYear, setActiveYear] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrightMinds = async () => {
      try {
        // Check cache first
        const cached = cache.get("/bright-minds");
        if (cached) {
          setData(cached);
          const years = Object.keys(cached).sort((a, b) => b - a);
          setActiveYear(years[0]);
          setLoading(false);
          return;
        }

        const res = await api.get("/bright-minds");
        setData(res.data);
        const years = Object.keys(res.data).sort((a, b) => b - a);
        setActiveYear(years[0]);
        // Cache for 10 minutes (academic data doesn't change often)
        cache.set("/bright-minds", res.data, 10 * 60 * 1000);
      } catch (err) {
        console.error("Error fetching bright minds:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBrightMinds();
  }, []);

  const yearsDescending = useMemo(
    () => Object.keys(data).sort((a, b) => b - a),
    [data]
  );

  const topPerformers = useMemo(
    () =>
      yearsDescending.map((year) => ({
        year,
        ...data[year][0],
      })),
    [yearsDescending, data]
  );

  if (loading) {
    return (
      <div className="bg-gray-100 dark:bg-gray-950 min-h-screen py-8">
        <div className="container mx-auto px-4 space-y-10">
          {/* Header skeleton */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-gray-300/70 dark:bg-gray-700/70" />
            <div className="w-40 h-8 rounded bg-gray-300/70 dark:bg-gray-700/70" />
          </div>

          {/* Top Performers skeleton */}
          <div className="space-y-4">
            <div className="w-64 h-6 rounded bg-gray-300/60 dark:bg-gray-700/60 mx-auto" />
            <div className="flex gap-4 overflow-hidden py-4">
              {[1, 2, 3, 4].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          </div>

          {/* Batch-wise skeleton */}
          <div className="space-y-6">
            <div className="w-56 h-6 rounded bg-gray-300/60 dark:bg-gray-700/60 mx-auto" />
            {/* Tabs skeleton */}
            <div className="flex justify-center flex-wrap gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-14 h-8 rounded-full bg-gray-300/60 dark:bg-gray-700/60" />
              ))}
            </div>
            {/* Cards skeleton */}
            <div className="flex gap-4 overflow-hidden py-4">
              {[1, 2, 3, 4].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          </div>
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
      </div>
    );
  }

  if (!activeYear) return null;

  return (
    <div className="bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-gray-300 py-8">
      <Helmet>
        <title>Academic Stars | DAAN KGP</title>
        <meta name="description" content="Meet the top academic performers at DAAN KGP. We celebrate batch-wise toppers and Dakshana scholars at IIT Kharagpur who excel in their studies." />
        <link rel="canonical" href="https://daankgp.vercel.app/academic-stars" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://daankgp.vercel.app/academic-stars" />
        <meta property="og:title" content="Academic Stars | DAAN KGP" />
        <meta property="og:description" content="Celebrating academic excellence within the Dakshana Alumni Network at IIT Kharagpur." />
        <meta property="og:image" content="https://res.cloudinary.com/dhv0sckmq/image/upload/v1770005960/DAAN_KGP_Logo_rhnogf.png" />
      </Helmet>

      <section className="container space-y-10">
        
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 rounded-lg bg-rose-50 dark:bg-gray-900 border border-rose-200 dark:border-gray-700">
            <Trophy className="w-5 h-5 text-rose-500" />
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
            Academic Stars
          </h1>
        </div>

        {/* Top Performers */}
        <div className="space-y-4">
          <h2 className="text-base font-semibold flex gap-2 justify-center items-center sm:text-lg md:text-xl text-gray-700 dark:text-gray-300">
            <Medal className="w-5 h-5 text-rose-500" /> Top Performers from Each Batch
          </h2>

          <AnimatedCarousel>
            {topPerformers.map((item) => (
              <BrightMindsCard key={item.id} {...item} />
            ))}
          </AnimatedCarousel>
        </div>

        {/* Batch-wise Section */}
        <div className="space-y-6">
          <h2 className="text-base flex gap-2 justify-center items-center sm:text-lg md:text-xl font-semibold text-gray-700 dark:text-gray-300 mt-20">
            <Milestone className="w-5 h-5 text-rose-500" /> Batch-wise Performers
          </h2>

          {/* Tabs */}
          <div className="flex justify-center flex-wrap gap-2">
            {yearsDescending.map((year) => {
              const isActive = activeYear === year;

              return (
                <button
                  key={year}
                  onClick={() => setActiveYear(year)}
                  className={`
                    px-4 py-1.5 rounded-full text-sm font-medium
                    transition-all duration-200
                    ${
                      isActive
                        ? "bg-rose-500 text-white shadow-sm"
                        : "bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-700"
                    }
                  `}
                >
                  '{year.slice(-2)}
                </button>
              );
            })}
          </div>

          {/* Cards */}
          <AnimatedCarousel>
            {data[activeYear]?.map((item) => (
              <BrightMindsCard key={item.id} {...item} />
            ))}
          </AnimatedCarousel>
        </div>
      </section>
    </div>
  );
};

export default AcademicStars;