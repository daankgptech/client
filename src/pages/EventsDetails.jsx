import { useParams, useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import EventData from "../components/Events/EventData";
import EventsComp from "../components/Events/EventsComp";
import { useAuth } from "../utils/Secure/AuthContext";

const EventsDetails = () => {
  const { isAuthenticated } = useAuth();
  const { slug } = useParams();
  const navigate = useNavigate();

  // 1. Find the current event and its index in the array
  const currentIndex = EventData.findIndex((e) => e.slug === slug);
  const event = EventData[currentIndex];

  // 2. Determine if Prev/Next exist
  const prevEvent = currentIndex > 0 ? EventData[currentIndex - 1] : null;
  const nextEvent = currentIndex < EventData.length - 1 ? EventData[currentIndex + 1] : null;

  if (!event)
    return (
      <div className="pt-20 text-center text-red-500 text-xl">
        Event not found.
      </div>
    );

  return (
    <>
      <Helmet>
        <title>{`${event.title} | DAAN KGP`}</title>
        <meta name="description" content={event.description} />
      </Helmet>

      <img
        src={event.image}
        alt={event.title}
        className="mx-auto h-auto md:h-fit w-full object-cover"
      />

      <div className="container bg-gray-100 dark:bg-gray-900 py-6">
        <p className="text-sm text-slate-600 dark:text-gray-500 mb-2">
          on {event.date}
        </p>
        <h1 className="text-2xl dark:text-gray-300 font-semibold mb-2">
          {event.title}
        </h1>
        <p className="text-gray-700 dark:text-gray-400 leading-relaxed">
          {event.description}
        </p>
        
        <div className="text-center my-8">
          {event.driveLink ? (
            isAuthenticated ? (
              <a
                href={event.driveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block p-2 rounded-lg border shadow-sm shadow-gray-600 text-red-600 dark:text-gray-400 
                  bg-gradient-to-tr from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 
                  border-gray-300 dark:border-gray-600 transition-all duration-300 
                  hover:from-gray-300 hover:to-gray-400 dark:hover:from-gray-700 dark:hover:to-gray-600 
                  hover:border-gray-500 dark:hover:border-cyan-400 font-medium"
              >
                View Event Drive
              </a>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-gray-500 italic">Drive access restricted to Dakshanites</p>
                <Link
                  to="/sign-in"
                  className="inline-block p-2 rounded-lg border border-rose-300 text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  🔒 Sign In to View Drive
                </Link>
              </div>
            )
          ) : null}
        </div>
      </div>

      {/* Navigation Buttons Row */}
      <div className="container flex justify-between items-center py-4">
        <button
          onClick={() => navigate(`/events/${prevEvent.slug}`)}
          disabled={!prevEvent}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
            !prevEvent 
              ? "opacity-30 cursor-not-allowed grayscale" 
              : "hover:bg-gray-200 dark:hover:bg-gray-800 text-rose-500 font-bold"
          }`}
        >
          ← Later
        </button>

        <button
          onClick={() => navigate(`/events/${nextEvent.slug}`)}
          disabled={!nextEvent}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
            !nextEvent 
              ? "opacity-30 cursor-not-allowed grayscale" 
              : "hover:bg-gray-200 dark:hover:bg-gray-800 text-rose-500 font-bold"
          }`}
        >
          Earlier →
        </button>
      </div>
      {/* <EventsComp /> */}
    </>
  );
};

export default EventsDetails;