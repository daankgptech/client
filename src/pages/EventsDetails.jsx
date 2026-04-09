import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Calendar, ArrowLeft, ArrowRight, Lock, ExternalLink } from "lucide-react";
import { useAuth } from "../utils/Secure/AuthContext";
import { api } from "../utils/Secure/api";
import { slugify } from "../utils/slugify";

// Skeleton shimmer component
const SkeletonDetail = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
    {/* Image skeleton */}
    <div className="w-full h-[40vh] sm:h-[50vh] md:h-[60vh] bg-gray-200 dark:bg-gray-800 animate-shimmer" />
    
    {/* Content skeleton */}
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Date skeleton */}
      <div className="w-32 h-4 rounded bg-gray-300/70 dark:bg-gray-700/70 mb-4" />
      
      {/* Title skeleton */}
      <div className="w-3/4 h-8 rounded bg-gray-300/80 dark:bg-gray-700/80 mb-6" />
      
      {/* Description skeleton */}
      <div className="space-y-3">
        <div className="w-full h-4 rounded bg-gray-300/60 dark:bg-gray-700/60" />
        <div className="w-full h-4 rounded bg-gray-300/60 dark:bg-gray-700/60" />
        <div className="w-2/3 h-4 rounded bg-gray-300/60 dark:bg-gray-700/60" />
      </div>
      
      {/* Button skeleton */}
      <div className="w-40 h-10 rounded-lg bg-gray-300/70 dark:bg-gray-700/70 mt-8 mx-auto" />
    </div>
  </div>
);

const EventsDetails = () => {
  const { isAuthenticated } = useAuth();
  const { slug } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [prevEvent, setPrevEvent] = useState(null);
  const [nextEvent, setNextEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setLoading(true);
        const response = await api.get("/events");
        const allEvents = response.data.data.map((e, index) => ({
          ...e,
          id: e._id || index,
          slug: slugify(e.title),
        }));

        const currentIndex = allEvents.findIndex((e) => e.slug === slug);

        if (currentIndex !== -1) {
          setEvent(allEvents[currentIndex]);
          setPrevEvent(currentIndex > 0 ? allEvents[currentIndex - 1] : null);
          setNextEvent(
            currentIndex < allEvents.length - 1
              ? allEvents[currentIndex + 1]
              : null,
          );
        }
      } catch (error) {
        console.error("Error fetching event details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [slug]);

  if (loading) {
    return (
      <>
        <style>{`
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
          .animate-shimmer {
            background-size: 200% 100%;
            animation: shimmer 1.2s linear infinite;
            background-image: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%);
          }
          .dark .animate-shimmer {
            background-image: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%);
          }
        `}</style>
        <SkeletonDetail />
      </>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
            Event not found
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            The event you're looking for doesn't exist.
          </p>
          <Link
            to="/events"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-500 text-white hover:bg-rose-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = event.date
    ? new Date(event.date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <>
      <Helmet>
        <title>{`${event.title} | Events | DAAN KGP`}</title>
        <meta name="description" content={event.description?.slice(0, 160)} />
        <meta name="keywords" content={`${event.title}, DAAN KGP, Dakshana, IIT Kharagpur, Events, Alumni`} />
        <link rel="canonical" href={`https://daankgp.vercel.app/events/${slug}`} />
        
        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://daankgp.vercel.app/events/${slug}`} />
        <meta property="og:title" content={`${event.title} | DAAN KGP`} />
        <meta property="og:description" content={event.description?.slice(0, 160)} />
        <meta property="og:image" content={event.image || "https://res.cloudinary.com/dhv0sckmq/image/upload/v1769529398/Logo_NoBG_op55cy.avif"} />
        <meta property="article:published_time" content={event.date} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${event.title} | DAAN KGP`} />
        <meta name="twitter:description" content={event.description?.slice(0, 160)} />
        <meta name="twitter:image" content={event.image || "https://res.cloudinary.com/dhv0sckmq/image/upload/v1769529398/Logo_NoBG_op55cy.avif"} />
      </Helmet>

      <article className="min-h-screen bg-gray-50 dark:bg-gray-950">
        {/* Hero Image */}
        <div className="relative w-full h-[40vh] sm:h-[50vh] md:h-[60vh] overflow-hidden">
          <img
            src={event.image}
            alt={event.title}
            loading="eager"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent" />
          
          {/* Back button */}
          <Link
            to="/events"
            className="absolute top-4 left-4 p-2 rounded-full bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-700 transition-all shadow-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-8 max-w-4xl -mt-16 relative z-10">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-200 dark:border-gray-800">
            {/* Date */}
            {formattedDate && (
              <div className="flex items-center gap-2 text-rose-500 dark:text-rose-400 mb-4">
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-medium">{formattedDate}</span>
              </div>
            )}

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white mb-6 leading-tight">
              {event.title}
            </h1>

            {/* Description */}
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap text-base sm:text-lg">
                {event.description}
              </p>
            </div>

            {/* Drive Link */}
            {event.driveLink && (
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
                {isAuthenticated ? (
                  <a
                    href={event.driveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-red-500 text-white font-medium shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 hover:scale-105 active:scale-95 transition-all duration-300"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View Event Drive
                  </a>
                ) : (
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 text-center border border-gray-200 dark:border-gray-700">
                    <Lock className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 dark:text-gray-300 font-medium mb-2">
                      Drive access restricted
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      Only DAAN-KGPians can access the event drive
                    </p>
                    <Link
                      to="/signin"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border-2 border-rose-500 text-rose-600 dark:text-rose-400 font-medium hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                    >
                      <Lock className="w-4 h-4" />
                      Sign In to Access
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="container mx-auto px-4 max-w-4xl pb-12">
          <div className="flex justify-between items-center">
            <button
              onClick={() => prevEvent && navigate(`/events/${prevEvent.slug}`)}
              disabled={!prevEvent}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                !prevEvent
                  ? "opacity-40 cursor-not-allowed text-gray-400"
                  : "text-gray-600 dark:text-gray-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10"
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Previous</span>
            </button>

            <Link
              to="/events"
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
            >
              All Events
            </Link>

            <button
              onClick={() => nextEvent && navigate(`/events/${nextEvent.slug}`)}
              disabled={!nextEvent}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                !nextEvent
                  ? "opacity-40 cursor-not-allowed text-gray-400"
                  : "text-gray-600 dark:text-gray-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10"
              }`}
            >
              <span className="hidden sm:inline">Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </article>
    </>
  );
};

export default EventsDetails;
