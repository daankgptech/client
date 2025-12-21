import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import EventData from "../components/Events/EventData";
import EventsComp from "../components/Events/EventsComp";
import ProtectedRoute from "../components/Secure/ProtectedRoute";

const EventsDetails = () => {
  const { slug } = useParams();
  const event = EventData.find((e) => e.slug === slug);
  const navigate = useNavigate();

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

      <div className="container bg-gray-100 dark:bg-gray-900 py-4">
        <p className="text-sm text-slate-600 dark:text-gray-500 mb-2">
          on {event.date}
        </p>
        <h1 className="text-2xl dark:text-gray-300 font-semibold mb-2">
          {event.title}
        </h1>
        <p className="text-gray-700 dark:text-gray-400">{event.description}</p>

        {event.driveLink && (
          <div className="text-center my-4">
            <ProtectedRoute
              fallback={
                <button
                  onClick={() => navigate("/signin")}
                  className="inline-block p-2 rounded-lg border shadow-sm shadow-gray-600 text-red-600 dark:text-gray-400 
        bg-gradient-to-tr from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 
        border-gray-300 dark:border-gray-600 transition-all duration-300 
        hover:from-gray-300 hover:to-gray-400 dark:hover:from-gray-700 dark:hover:to-gray-600 
        hover:border-gray-500 dark:hover:border-cyan-400"
                >
                  View Event Drive
                </button>
              }
            >
              <a
                href={event.driveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block p-2 rounded-lg border shadow-sm shadow-gray-600 text-red-600 dark:text-gray-400 
        bg-gradient-to-tr from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 
        border-gray-300 dark:border-gray-600 transition-all duration-300 
        hover:from-gray-300 hover:to-gray-400 dark:hover:from-gray-700 dark:hover:to-gray-600 
        hover:border-gray-500 dark:hover:border-cyan-400"
              >
                View Event Drive
              </a>
            </ProtectedRoute>
          </div>
        )}
      </div>

      <EventsComp />
    </>
  );
};

export default EventsDetails;
