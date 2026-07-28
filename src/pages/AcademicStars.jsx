import SEO, { seoConfig, Breadcrumbs } from "../utils/SEO";
import { useEffect, useState, useMemo } from "react";
import BrightMindsCard from "../components/OurBrightMinds/BrightMindsCard";
import { api } from "../utils/Secure/api";
import { cache } from "../utils/cache";
import AnimatedCarousel from "../components/OurBrightMinds/AnimatedCarousel";
import { Medal, Milestone } from "lucide-react";

// Lightweight, updated skeleton matching exact Toolkit & BrightMinds card design
const SkeletonCard = () => (
  <div className="flex flex-col justify-between bg-transparent border-white/10 border-[0.5px] p-5 animate-pulse w-full min-w-[260px] max-w-[280px]">
    <div className="flex justify-end mb-2">
      <div className="w-16 h-4 rounded-full bg-white/10" />
    </div>
    <div className="flex justify-center my-4">
      <div className="w-32 h-32 md:w-36 md:h-36 rounded-full bg-white/10" />
    </div>
    <div className="w-3/4 h-5 rounded bg-white/10 mx-auto mb-2" />
    <div className="w-1/2 h-3.5 rounded bg-white/5 mx-auto" />
    <div className="mt-5 pt-3 border-t border-white/10 flex justify-between items-center">
      <div className="w-16 h-3 rounded bg-white/5" />
      <div className="w-20 h-4 rounded bg-white/5" />
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

  return (
    <div className="min-h-screen transition-colors duration-300">
      <SEO {...seoConfig.academicStars} />

      <section className="container mx-auto py-12">
        <div className="pb-4">
          <Breadcrumbs items={seoConfig.academicStars.breadcrumbs} />
        </div>

        {/* Heading matching Forms / Toolkit Page design */}
        <div className="flex items-center gap-3 mb-8">
          <h1 className="text-3xl md:text-5xl font-bold font-space-grotesk tracking-tighter text-white">
            Academic Stars
          </h1>
        </div>

        {loading ? (
          <div className="space-y-10">
            {/* Top Performers skeleton */}
            <div className="space-y-4">
              <div className="w-64 h-6 rounded bg-white/10 mx-auto animate-pulse" />
              <div className="flex gap-4 overflow-hidden py-4">
                {[1, 2, 3, 4].map((i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            </div>

            {/* Batch-wise skeleton */}
            <div className="space-y-6">
              <div className="w-56 h-6 rounded bg-white/10 mx-auto animate-pulse" />
              {/* Tabs skeleton */}
              <div className="flex justify-center flex-wrap gap-2.5 animate-pulse">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-10 w-20 bg-white/5 border-[0.5px] border-white/10" />
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
        ) : activeYear ? (
          <div className="space-y-12">
            {/* Top Performers */}
            <div className="space-y-6">
              <h2 className="text-lg md:text-xl font-bold font-space-grotesk flex gap-2 justify-center items-center text-white mb-6">
                <Medal className="w-5 h-5 text-primary" /> Top Performers from Each Batch
              </h2>

              <AnimatedCarousel>
                {topPerformers.map((item) => (
                  <BrightMindsCard key={item.id} {...item} />
                ))}
              </AnimatedCarousel>
            </div>

            {/* Batch-wise Section */}
            <div className="space-y-6 pt-6">
              <h2 className="text-lg md:text-xl font-bold font-space-grotesk flex gap-2 justify-center items-center text-white mb-6">
                <Milestone className="w-5 h-5 text-primary" /> Batch-wise Performers
              </h2>

              {/* Category / Year Tabs matching Toolkit box tab design */}
              <div className="flex justify-start md:justify-center flex-nowrap overflow-x-auto gap-2.5 mb-10 no-scrollbar select-none">
                {yearsDescending.map((year) => {
                  const isActive = activeYear === year;

                  return (
                    <button
                      key={year}
                      onClick={() => setActiveYear(year)}
                      className={`
                        whitespace-nowrap px-5 py-2.5 text-sm md:text-base font-medium font-space-grotesk
                        border-[0.5px] transition-all duration-200 flex-shrink-0
                        ${
                          isActive
                            ? "bg-primary text-white border-primary shadow-sm"
                            : "bg-transparent border-white/10 text-white/60 hover:bg-white/5 hover:border-white/20 hover:text-white"
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
          </div>
        ) : null}
      </section>
    </div>
  );
};

export default AcademicStars;