import { Link } from "react-router-dom";

const EventCard = ({ image, date, title, description, slug }) => {
  return (
    <Link
      to={`/events/${slug}`}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      title={title}
      className="block group"
    >
      <div className="p-4 md:p-6 bg-transparent transition-all duration-300 hover:-translate-y-1 hover:bg-white/5">
        {/* Image */}
        <div className="overflow-hidden ">
          <div className="clip-path-custom">
            <img
              src={image}
              alt={title}
              loading="lazy"
              className="w-full h-[220px] sm:h-[240px] object-cover transition-transform duration-500 grayscale group-hover:grayscale-0 group-hover:scale-[1.05]"
            />
          </div>
        </div>

        {/* Date */}
        <p className="pt-3 text-sm text-white/40">
          {date
            ? new Date(date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })
            : "Loading..."}
        </p>

        {/* Content */}
        <div className="space-y-2 py-2">
          {/* Title */}
          <h2 className="line-clamp-1 text-base md:text-lg font-bold text-white group-hover:text-primary transition-colors">
            {title}
          </h2>

          {/* Description */}
          <p className="line-clamp-2 text-sm text-white/60">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
