import { Link } from "react-router-dom";
import { CalendarDays, ArrowRight } from "lucide-react";

const EventComp = () => {
  return (
    <section className="container py-14 md:py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 pl-0">
            <CalendarDays className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold font-space-grotesk tracking-tighter text-white">
            Our Events
          </h2>
        </div>

        {/* Description & Link */}
        <div className="flex flex-col gap-4 justify-center items-center w-full">
          <p className="text-white/60 mb-4 text-left w-full relative">
            From Fresher's Treat to Dakshana Day celebrations, explore all the memorable
            moments and events that bring our DAAN KGP community together.
          </p>
          <Link to="/events" className="bg-[#ff3130] hover:bg-[#d42a29] transition-all duration-300 text-white px-8 py-4 font-bold uppercase tracking-widest text-xs">
            All Events
          </Link>
        </div>
      </div>
    </section>
  );
};

export default EventComp;
