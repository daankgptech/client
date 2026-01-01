import { Link } from "react-router-dom";

const EventCard = ({ image, date, title, description, slug }) => {
  return (
    <Link
      to={`/events/${slug}`}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      title={title}
    >
      <div className="p-4 rounded-3xl border border-rose-300 dark:border-transparent bg-gradient-to-tr from-rose-200 to-rose-100 dark:from-gray-700 dark:to-gray-800 dark:bg-gray-900 shadow-lg transition duration-500 hover:shadow-xl dark:text-gray-400">
        <div className="overflow-hidden">
          <img
            src={image}
            alt={title}
            loading="lazy"
            className="w-full h-[250px] object-cover rounded-2xl border border-rose-500 dark:border-gray-400 shadow-sm shadow-rose-300"
          />
        </div>

        <p className="pt-2 text-slate-600 dark:text-gray-500">{date}</p>

        <div className="space-y-2 py-3">
          <h1 className="line-clamp-1 font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-700 to-orange-500 dark:text-gray-300">
            {title}
          </h1>
          <p className="line-clamp-2 text-rose-700/80 dark:text-gray-400">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
