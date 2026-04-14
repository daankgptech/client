import { useState, useEffect } from "react";
import { CalendarDays } from "lucide-react";
import SEO, { seoConfig, Breadcrumbs } from "../utils/SEO";
import EventCard from "../components/Events/EventCard";
import { api } from "../utils/Secure/api";
import { cache } from "../utils/cache";
import { slugify } from "../utils/slugify";

// Skeleton shimmer component
const SkeletonCard = () => (
  <div className="animate-shimmer rounded-2xl p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
    <div className="overflow-hidden rounded-xl mb-3">
      <div className="w-full h-[200px] bg-gray-300/70 dark:bg-gray-700/70" />
    </div>
    <div className="w-20 h-3 rounded bg-gray-300/60 dark:bg-gray-700/60 mb-3" />
    <div className="w-full h-5 rounded bg-gray-300/70 dark:bg-gray-700/70 mb-2" />
    <div className="w-3/4 h-4 rounded bg-gray-300/50 dark:bg-gray-700/50" />
  </div>
);

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Check cache first
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
        // Cache for 5 minutes
        cache.set("/events", dynamicData, 5 * 60 * 1000);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 py-8">
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

      <SEO {...seoConfig.events} />

      <section className="container">
        {/* Breadcrumbs */}
        <div className="pb-4">
          <Breadcrumbs items={seoConfig.events.breadcrumbs} />
        </div>

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 rounded-lg bg-rose-50 dark:bg-gray-900 border border-rose-200 dark:border-gray-700">
            <CalendarDays className="w-5 h-5 text-rose-500" />
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
            Events
          </h1>
        </div>

        {/* Events Count */}
        {!loading && events.length > 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            {events.length} event{events.length !== 1 ? 's' : ''} found
          </p>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))
          ) : events.length > 0 ? (
            events.map((item) => <EventCard key={item.id} {...item} />)
          ) : (
            <div className="col-span-full text-center py-16">
              <CalendarDays className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                No events found.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Events;
