import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAuth } from "../utils/Secure/AuthContext";
import { api } from "../utils/Secure/api";
import { slugify } from "../utils/slugify";

const EventsDetails = () => {
  const { isAuthenticated } = useAuth();
  const { slug } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [prevEvent, setPrevEvent] = useState(null);
  const [nextEvent, setNextEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setLoading(true);
        const response = await api.get("/events");
        const allEvents = response.data.data.map((e, index) => ({
          ...e,
          id: e._id || index,
          slug: slugify(e.title),
        }));

        // Find the current event by slug
        const currentIndex = allEvents.findIndex((e) => e.slug === slug);

        if (currentIndex !== -1) {
          setEvent(allEvents[currentIndex]);
          // Set neighbors for navigation
          setPrevEvent(currentIndex > 0 ? allEvents[currentIndex - 1] : null);
          setNextEvent(
            currentIndex < allEvents.length - 1
              ? allEvents[currentIndex + 1]
              : null,
          );
        }
      } catch (error) {
        console.error("Error fetching event details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [slug]); // Re-run when the URL slug changes

  if (loading) {
    return (
      <div className="pt-20 text-center dark:text-white">
        Loading event details...
      </div>
    );
  }

  if (!event) {
    return (
      <div className="pt-20 text-center text-red-500 text-xl">
        Event not found.
      </div>
    );
  }

  return (
    <>
<Helmet>
        {/* Standard metadata */}
        <title>{`${event.title} | DAAN KGP`}</title>
        <meta name="description" content={event.description}/>
        <meta name="keywords" content="DAAN KGP, Dakshana Foundation, Dakshana Alumni Network, Dakshana IIT Kharagpur, Dakshana scholars IIT KGP, IIT Kharagpur alumni network, DAAN IIT Kharagpur, student mentorship IIT Kharagpur, career guidance Dakshana alumni, higher studies guidance IIT KGP, alumni mentorship programs IIT, student support Dakshana scholars, Dakshana community Kharagpur, alumni-student connect IIT KGP, networking for Dakshana alumni, IIT Kharagpur student-alumni network, collaboration among Dakshana scholars, social initiatives Dakshana alumni, outreach programs IIT KGP, volunteering at IIT Kharagpur, giving back to society IIT alumni, awareness campaigns by DAAN, how Dakshana alumni help IIT Kharagpur students, mentorship opportunities for Dakshana scholars, alumni guidance network at IIT Kharagpur, career counseling by Dakshana alumni, Dakshana student community at IIT KGP, daan kgp, daan-kgp, kgpian dakshanite, dakshanites at kgp, dakshanites at iit kgp, kgpian dakshanites, dakshana alumni network at Indian institute of technology Kharagpur, daan at iit kgp, daan at kgp, kgp dakshana, dakshana, iitkgp, kgp, kharagpur" />
        <link rel="canonical" href="https://daankgp.vercel.app/events" />
        {/* Open Graph / Facebook / LinkedIn */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://daankgp.vercel.app/events" />
        <meta property="og:title" content= {`${event.title} | DAAN KGP`}/>
        <meta property="og:description" content={event.description} />
        <meta property="og:image" content="https://res.cloudinary.com/dhv0sckmq/image/upload/v1769529398/Logo_NoBG_op55cy.avif" /> {/* Add a real path to your logo/banner */}
        {/* The Thumbnail Image - This is what shows up in the WhatsApp chat bubble */}
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={event.title} />
        <meta name="twitter:description" content={event.description} />
        <meta name="twitter:image" content="https://res.cloudinary.com/dhv0sckmq/image/upload/v1769529398/Logo_NoBG_op55cy.avif" />
      </Helmet>
      <img
        src={event.image}
        alt={event.title}
        className="mx-auto h-auto md:h-fit w-full object-cover"
      />

      <div className="container bg-gray-100 dark:bg-gray-900 py-6">
        <p className="text-sm text-slate-600 dark:text-gray-500 mb-2">
          on{" "}
          {event.date
            ? new Date(event.date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })
            : "Loading..."}
        </p>
        <h1 className="text-2xl dark:text-gray-300 font-semibold mb-2">
          {event.title}
        </h1>
        <div className="text-gray-700 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">
          {event.description}
        </div>

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
                <p className="text-sm text-gray-500 italic">
                  Drive access restricted to DAAN-KGPians
                </p>
                <Link
                  to="/signin"
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
      <div className="container flex justify-between items-center py-10">
        <button
          onClick={() => navigate(`/events/${prevEvent?.slug}`)}
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
          onClick={() => navigate(`/events/${nextEvent?.slug}`)}
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
    </>
  );
};

export default EventsDetails;
