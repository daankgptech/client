import { useEffect, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, User, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api } from "../../utils/Secure/api";
import { cache } from "../../utils/cache";
import CRCard from "./CRCard";

// Skeleton shimmer component
const SkeletonCard = () => (
  <div className="flex-shrink-0 w-[260px] sm:w-[300px] mx-2">
    <div className="animate-shimmer rounded-2xl p-6 flex flex-col items-center bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-300/70 dark:bg-gray-700/70 mb-4" />
      <div className="w-28 h-4 rounded bg-gray-300/60 dark:bg-gray-700/60 mb-3" />
      <div className="w-20 h-3 rounded bg-gray-300/50 dark:bg-gray-700/50 mb-4" />
      <div className="w-14 h-9 rounded-lg bg-gray-300/40 dark:bg-gray-700/40" />
    </div>
  </div>
);

// Lightweight custom carousel - no external dependencies
const Carousel = ({ children, autoPlay = true, interval = 3000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const childCount = Array.isArray(children) ? children.length : 1;

  const goTo = useCallback(
    (index) => {
      setCurrentIndex((prev) => {
        if (index < 0) return childCount - 1;
        if (index >= childCount) return 0;
        return index;
      });
    },
    [childCount],
  );

  useEffect(() => {
    if (!autoPlay || isHovered) return;
    const timer = setInterval(() => goTo(currentIndex + 1), interval);
    return () => clearInterval(timer);
  }, [autoPlay, isHovered, currentIndex, goTo, interval]);

  const childrenArray = Array.isArray(children) ? children : [children];

  return (
    <div
      className="relative overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Slides container */}
      <div
        className="flex transition-transform duration-500 ease-out will-change-transform"
        style={{ transform: `translate3d(-${currentIndex * 100}%,0,0)` }}
      >
        {childrenArray.map((child, i) => (
          <div key={i} className="w-full flex-shrink-0 flex justify-center">
            {child}
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      {childCount > 1 && (
        <>
          <button
            onClick={() => goTo(currentIndex - 1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105"
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => goTo(currentIndex + 1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105"
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Dots indicator */}
      {childCount > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {childrenArray.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === currentIndex
                  ? "w-5 bg-rose-500"
                  : "w-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const CR = () => {
  const navigate = useNavigate();
  const [crs, setCrs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCRs = async () => {
      try {
        // Check cache first
        const cached = cache.get("/home/cr");
        if (cached && Array.isArray(cached)) {
          setCrs(cached);
          setLoading(false);
          return;
        }

        const { data } = await api.get("/home/cr");
        if (Array.isArray(data)) {
          setCrs(data);
          // Cache for 5 minutes
          cache.set("/home/cr", data, 5 * 60 * 1000);
        } else {
          throw new Error("Invalid data format received");
        }
      } catch (err) {
        console.error("Failed to fetch CRs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCRs();
  }, []);

  return (
    <section
      id="cr"
      // data-aos="fade-up"
      // data-aos-duration="300"
      className="py-14 md:py-16 bg-gray-100 dark:bg-gray-950 scroll-mt-[100px]"
    >
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

      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10 max-w-md mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full bg-rose-50 dark:bg-gray-900 border border-rose-200 dark:border-gray-700">
            <Sparkles className="w-3 h-3 text-rose-500" />
            <span className="text-xs font-medium text-rose-600 dark:text-rose-400 uppercase tracking-wide">
              Leadership
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white mb-2 tracking-tight">
            College Representatives
          </h2>

          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            Key point of contact for Dakshana within the college. They guide
            students, manage programs, and handle related inquiries.
          </p>
        </div>

        {/* Carousel */}
        <div className="relative">
          {loading ? (
            <div className="flex justify-center overflow-hidden">
              {[1, 2].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : crs.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                <User className="w-7 h-7 text-gray-400" />
              </div>
              <p className="text-gray-500 dark:text-gray-400">
                No representatives found
              </p>
            </div>
          ) : (
            <Carousel autoPlay={crs.length > 1} interval={3000}>
              {crs.map((cr) => (
                <CRCard key={cr._id} cr={cr} navigate={navigate} />
              ))}
            </Carousel>
          )}
        </div>
      </div>
    </section>
  );
};

export default CR;