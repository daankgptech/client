import { useEffect, useState, useCallback, useRef } from "react";
import { Phone, ChevronLeft, ChevronRight, User, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProtectedRoute from "../Secure/ProtectedRoute";
import { api } from "../../utils/Secure/api";

// Skeleton shimmer component
const SkeletonCard = () => (
  <div className="flex-shrink-0 w-[280px] sm:w-[300px] mx-2">
    <div className="animate-shimmer bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 rounded-2xl p-6 flex flex-col items-center">
      <div className="w-24 h-24 rounded-full bg-gray-300/80 dark:bg-gray-600/80 mb-4" />
      <div className="w-32 h-5 rounded bg-gray-300/70 dark:bg-gray-600/70 mb-3" />
      <div className="w-20 h-4 rounded bg-gray-300/60 dark:bg-gray-600/60 mb-4" />
      <div className="w-16 h-10 rounded-lg bg-gray-300/50 dark:bg-gray-600/50" />
    </div>
  </div>
);

// Lightweight custom carousel - no external dependencies
const Carousel = ({ children, autoPlay = true, interval = 4000 }) => {
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
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
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
            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:scale-110 transition-all shadow-lg"
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => goTo(currentIndex + 1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:scale-110 transition-all shadow-lg"
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
                  ? "w-6 bg-rose-500"
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

// Helper functions
const getSessionFromBatch = (batch) => {
  if (!batch) return "";
  const startYear = Number(batch) + 1;
  const endYear = String(startYear + 1).slice(-2);
  return `${startYear}-${endYear}`;
};

const getCRStatus = (session) => {
  if (!session) return "";
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  let sessionStartYear;

  if (month >= 10) {
    sessionStartYear = year;
  } else {
    sessionStartYear = year - 1;
  }

  const sessionEndYear = String(sessionStartYear + 1).slice(-2);
  const currentSession = `${sessionStartYear}-${sessionEndYear}`;

  return session === currentSession ? "Current CR" : "Ex CR";
};

// CR Card component
const CRCard = ({ cr, navigate }) => {
  const session = getSessionFromBatch(cr.batch);
  const status = getCRStatus(session);
  const isCurrent = status === "Current CR";

  return (
    <div className="w-[280px] sm:w-[320px] group">
      <div className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-800 dark:via-gray-850 dark:to-gray-900 shadow-lg hover:shadow-xl hover:shadow-rose-500/10 dark:hover:shadow-rose-500/5 transition-all duration-500">
        {/* Status badge */}
        {isCurrent && (
          <div className="absolute top-3 right-3 z-10">
            <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-gradient-to-r from-rose-500 to-red-500 text-white shadow-lg animate-pulse">
              Current
            </span>
          </div>
        )}

        {/* Session watermark */}
        <span className="absolute top-3 left-3 text-xs font-mono text-gray-400/60 dark:text-gray-500/60">
          {session}
        </span>

        {/* Content */}
        <div className="p-6 flex flex-col items-center">
          {/* Avatar */}
          <div className="relative mb-4">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-rose-400 to-red-500 blur-md opacity-40 group-hover:opacity-60 transition-opacity" />
            <img
              src={cr.imgLink}
              alt={`${cr.name}'s profile`}
              loading="lazy"
              className="relative w-24 h-24 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-lg group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Name */}
          <h3 className="text-lg font-bold text-gray-800 dark:text-white text-center mb-1 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
            {cr.name}
          </h3>

          {/* Status */}
          <span
            className={`text-sm font-medium mb-3 ${
              isCurrent
                ? "text-rose-500 dark:text-rose-400"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            {status}
          </span>

          {/* Hall info */}
          <p className="text-xs text-gray-500 dark:text-gray-500 mb-4">
            Hall: {cr.hall}
          </p>

          {/* Call button */}
          <ProtectedRoute
            fallback={
              <button
                onClick={() => navigate("/signin")}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-600 dark:text-gray-300 text-sm font-medium border border-gray-200 dark:border-gray-600 hover:border-rose-300 dark:hover:border-rose-500/50 hover:from-rose-50 hover:to-rose-100 dark:hover:from-rose-500/10 dark:hover:to-rose-500/20 transition-all duration-300"
              >
                <Phone className="w-4 h-4" />
                Sign in to call
              </button>
            }
          >
            <a
              href={`tel:+91${cr.contacts[0]?.phone}`}
              title={`Call ${cr.name}`}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-red-500 text-white text-sm font-medium shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 hover:scale-105 active:scale-95 transition-all duration-300"
            >
              <Phone className="w-4 h-4" />
              Call
            </a>
          </ProtectedRoute>
        </div>
      </div>
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
        const { data } = await api.get("/home/cr");
        setCrs(data);
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
      data-aos="fade-up"
      data-aos-duration="300"
      className="py-16 bg-gray-50 dark:bg-gray-900 scroll-mt-[100px]"
    >
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

      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 max-w-lg mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full bg-gradient-to-r from-rose-100 to-red-100 dark:from-rose-500/10 dark:to-red-500/10 border border-rose-200 dark:border-rose-500/20">
            <Sparkles className="w-3 h-3 text-rose-500" />
            <span className="text-xs font-medium text-rose-600 dark:text-rose-400 uppercase tracking-wide">
              Leadership
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-3">
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
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                <User className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 dark:text-gray-400">
                No representatives found
              </p>
            </div>
          ) : (
            <Carousel autoPlay={crs.length > 1} interval={5000}>
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
