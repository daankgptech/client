import { Link } from "react-router-dom";
import { CalendarDays, ArrowRight } from "lucide-react";

const EventComp = () => {
  return (
    <section className="container py-14 md:py-16 bg-gray-100 dark:bg-gray-950">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-rose-50 dark:bg-gray-900 border border-rose-200 dark:border-gray-700">
            <CalendarDays className="w-5 h-5 text-rose-500" />
          </div>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
            Our Events
          </h2>
        </div>

        {/* Description & Link */}
        <div className="flex flex-col gap-4 justify-center items-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            From Fresher's Treat to Dakshana Day celebrations, explore all the memorable 
            moments and events that bring our DAAN KGP community together.
          </p>
          <Link
            to="/events"
            className="inline-flex items-center gap-2 text-sm font-medium text-rose-500 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-300 transition-all duration-300 hover:underline decoration-dashed"
          >
            View All Events
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default EventComp;
