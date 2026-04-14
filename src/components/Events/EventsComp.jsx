import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, ArrowRight } from "lucide-react";
import EventCard from "./EventCard";
import { api } from "../../utils/Secure/api";
import { cache } from "../../utils/cache";
import { slugify } from "../../utils/slugify";

// Skeleton shimmer component for event cards
const SkeletonCard = () => (
  <div className="animate-shimmer rounded-2xl p-4 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
    <div className="overflow-hidden rounded-xl mb-3">
      <div className="w-full h-[220px] sm:h-[240px] bg-gray-300/70 dark:bg-gray-700/70" />
    </div>
    <div className="w-24 h-4 rounded bg-gray-300/60 dark:bg-gray-700/60 mb-3" />
    <div className="w-full h-5 rounded bg-gray-300/70 dark:bg-gray-700/70 mb-2" />
    <div className="w-full h-4 rounded bg-gray-300/50 dark:bg-gray-700/50 mb-1" />
    <div className="w-2/3 h-4 rounded bg-gray-300/50 dark:bg-gray-700/50" />
  </div>
);

const EventComp = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const cached = cache.get("/events");
        if (cached) {
          setEvents(cached);
          setLoading(false);
          return;
        }

        const response = await api.get("/events");
        const dynamicData = response.data.data.map((event, index) => ({
          ...event,
          id: event._id || index,
          slug: slugify(event.title),
        }));

        setEvents(dynamicData);
        cache.set("/events", dynamicData, 5 * 60 * 1000);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Show only first 3 events on home page
  const displayEvents = events.slice(0, 3);

  return (
    <section
      // id="events"
      className="container py-14 md:py-16 bg-gray-100 dark:bg-gray-950 scroll-mt-[100px]"
    >
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

      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-rose-50 dark:bg-gray-900 border border-rose-200 dark:border-gray-700">
              <CalendarDays className="w-5 h-5 text-rose-500" />
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
              Our Events
            </h2>
          </div>

          {/* View All Button */}
          {!loading && events.length > 3 && (
            <Link
              to="/events"
              className="flex items-center gap-2 text-sm font-medium text-rose-500 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-300 transition-colors"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        {/* Grid - Only 3 events */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))
          ) : displayEvents.length > 0 ? (
            displayEvents.map((item) => <EventCard key={item.id} {...item} />)
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                No events found.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default EventComp;
