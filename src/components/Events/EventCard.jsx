import { Link } from "react-router-dom";

const EventCard = ({ image, date, title, description, slug }) => {
  return (
    <Link
      to={`/events/${slug}`}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      title={title}
      className="block group"
    >
      <div className="p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
        {/* Image */}
        <div className="overflow-hidden rounded-xl ">
          <div className="clip-path-custom">
            <img
              src={image}
              alt={title}
              loading="lazy"
              className="w-full h-[220px] sm:h-[240px] object-cover transition-transform duration-300 group-hover:scale-[1.05]"
            />
          </div>
        </div>

        {/* Date */}
        <p className="pt-3 text-sm text-gray-500 dark:text-gray-400">
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
          <h2 className="line-clamp-1 text-base md:text-lg font-semibold text-gray-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
            {title}
          </h2>

          {/* Description */}
          <p className="line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
