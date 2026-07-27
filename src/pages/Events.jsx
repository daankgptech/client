import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CalendarDays } from "lucide-react";
import SEO, { seoConfig, Breadcrumbs } from "../utils/SEO";
import EventCard from "../components/Events/EventCard";
import { api } from "../utils/Secure/api";
import { cache } from "../utils/cache";
import { slugify } from "../utils/slugify";

// Skeleton shimmer component
const SkeletonCard = () => (
  <div className="animate-shimmer rounded-2xl p-4 bg-white/5 border-[0.5px] border-white/10">
    <div className="overflow-hidden rounded-xl mb-3">
      <div className="w-full h-[200px] bg-white/10" />
    </div>
    <div className="w-20 h-3 rounded bg-white/5 mb-3" />
    <div className="w-full h-5 rounded bg-white/5 mb-2" />
    <div className="w-3/4 h-4 rounded bg-white/5" />
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
    <div className="min-h-screen transition-colors duration-300">
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

      <section className="container mx-auto py-12">
        <div className="pb-4">
          <Breadcrumbs items={seoConfig.forms.breadcrumbs} />
        </div>
        <div className="flex items-center gap-3 mb-8">
          <h1 className="text-3xl md:text-5xl font-bold font-space-grotesk tracking-tighter text-white">
            Events
          </h1>
        </div>

        {/* Events Count */}
        {/* {!loading && events.length > 0 && (
          <p className="text-sm text-white/60 mb-6">
            {events.length} event{events.length !== 1 ? 's' : ''} found
          </p>
        )} */}

        <motion.div 
          className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-0 bg-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))
          ) : events.length > 0 ? (
            events.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <EventCard {...item} />
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <CalendarDays className="w-12 h-12 mx-auto text-white/20 mb-4" />
              <p className="text-white/60">
                No events found.
              </p>
            </div>
          )}
        </motion.div>
      </section>
    </div>
  );
};

export default Events;
