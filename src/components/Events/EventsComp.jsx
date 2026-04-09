import { useState, useEffect } from "react";
import { CalendarDays } from "lucide-react";
import EventCard from "./EventCard";
import { api } from "../../utils/Secure/api";
import { slugify } from "../../utils/slugify";

// Skeleton shimmer component for event cards
const SkeletonCard = () => (
  <div className="animate-shimmer rounded-2xl p-4 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
    {/* Image placeholder */}
    <div className="overflow-hidden rounded-xl mb-3">
      <div className="w-full h-[220px] sm:h-[240px] bg-gray-300/70 dark:bg-gray-700/70" />
    </div>
    {/* Date placeholder */}
    <div className="w-24 h-4 rounded bg-gray-300/60 dark:bg-gray-700/60 mb-3" />
    {/* Title placeholder */}
    <div className="w-full h-5 rounded bg-gray-300/70 dark:bg-gray-700/70 mb-2" />
    {/* Description placeholder */}
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
        const response = await api.get("/events");

        // Transform the data to include the slug and id
        const dynamicData = response.data.data.map((event, index) => ({
          ...event,
          id: event._id || index,
          slug: slugify(event.title),
        }));

        setEvents(dynamicData);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <section
      id="events"
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
        <div className="flex items-center gap-3 mb-10">
          <div className="p-2 rounded-lg bg-rose-50 dark:bg-gray-900 border border-rose-200 dark:border-gray-700">
            <CalendarDays className="w-5 h-5 text-rose-500" />
          </div>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
            Our Events
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
          {loading ? (
            // Skeleton loading state
            Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))
          ) : events.length > 0 ? (
            events.map((item) => <EventCard key={item.id} {...item} />)
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
