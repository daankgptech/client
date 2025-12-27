import { useEffect, useState } from "react";
import Slider from "react-slick";
import { MdAddCall } from "react-icons/md";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import ProtectedRoute from "../Secure/ProtectedRoute";
import LoaderOverlay from "../../utils/LoaderOverlay";
import { api } from "../../utils/Secure/api";

const sliderSettings = {
  dots: true,
  arrows: false,
  infinite: true,
  speed: 500,
  slidesToShow: 2,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 2000,
  cssEase: "linear",
  pauseOnHover: true,
  pauseOnFocus: true,
  responsive: [
    { breakpoint: 1024, settings: { slidesToShow: 2 } },
    { breakpoint: 640, settings: { slidesToShow: 1 } },
  ],
};

const CR = () => {
  const navigate = useNavigate();
  const [crs, setCrs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCRs = async () => {
      try {
        const { data } = await api.get("/home/cr");
        setCrs(data);
      } catch (err) {
        console.error("Failed to fetch CRs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCRs();
  }, []);
  const getSessionFromBatch = (batch) => {
    if (!batch) return "";
    const startYear = Number(batch) + 1;
    const endYear = String(startYear + 1).slice(-2);
    return `${startYear}-${endYear}`;
  };
  const getCRStatus = (session) => {
    if (!session) return "";

    const currentYear = new Date().getFullYear();
    const currentSessionStart = currentYear;
    const currentSessionEnd = String(currentYear + 1).slice(-2);
    const currentSession = `${currentSessionStart}-${currentSessionEnd}`;

    return session === currentSession ? "Current CR" : "Ex CR";
  };

  if (loading) {
    return <LoaderOverlay />;
  }

  return (
    <div
      id="cr"
      data-aos="fade-up"
      data-aos-duration="300"
      className="py-10 bg-gray-100 dark:bg-gray-900 scroll-mt-[100px]"
    >
      <div className="container">
        {/* Header */}
        <div className="text-center mb-20 max-w-[400px] mx-auto">
          <p className="text-lg md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary dark:from-cyan-100 to-primary/30 dark:to-cyan-400">
            College Representatives
          </p>
          <p className="text-sm text-gray-800 dark:text-gray-400 mt-3">
            As the key point of contact for Dakshana within the college, the CR
            guides students, manages programs, and handles related inquiries.
          </p>
        </div>

        {/* Slider */}
        <div
          data-aos="zoom-in"
          data-aos-duration="300"
          className="max-w-[800px] mx-auto"
        >
          <Slider {...sliderSettings}>
            {crs.map((cr) => {
              const session = getSessionFromBatch(cr.batch);
              const status = getCRStatus(session);
              return (
                <div key={cr._id} className="my-6">
                  <div className="flex flex-col items-center text-center gap-4 shadow-lg p-4 mx-4 rounded-3xl bg-gradient-to-tr from-red-100 dark:from-gray-800 to-red-50 dark:to-gray-700 border border-primary dark:border-transparent relative">
                    <Helmet>
                      <link rel="preload" as="image" href={cr.imgLink} />
                    </Helmet>

                    <img
                      src={cr.imgLink}
                      alt={`${cr.name}'s profile`}
                      width="160"
                      height="160"
                      className="rounded-full object-cover aspect-square"
                    />

                    <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-tr from-red-900 to-red-500 dark:from-gray-500 dark:to-gray-100">
                      {cr.name}
                    </h1>

                    <div className="flex gap-6 items-center">
                      <span className="text-lg font-semibold text-gray-600 dark:text-gray-300">
                        {status}
                      </span>

                      <ProtectedRoute
                        fallback={
                          <button
                            onClick={() => navigate("/signin")}
                            className="p-2 rounded-lg border border-green-200 bg-green-50 dark:bg-gray-800 text-green-400 flex items-center transition-all duration-300 hover:bg-green-100 hover:shadow-lg"
                          >
                            <MdAddCall />
                          </button>
                        }
                      >
                        <a
                          href={`tel:${cr.contacts?.phone}`}
                          title={`Call ${cr.name}`}
                          className="p-2 rounded-lg border border-green-200 bg-green-50 dark:bg-gray-900 text-green-400 flex items-center hover:bg-green-100 hover:scale-105 hover:shadow-green-300 hover:translate-x-1 hover:-translate-y-1 hover:shadow-lg hover:border-green-300 transition-all duration-300"
                        >
                          <MdAddCall />
                        </a>
                      </ProtectedRoute>
                    </div>

                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      {cr.hall}
                    </p>
                    <p className="text-black/30 dark:text-gray-400 text-sm font-serif absolute top-1 right-1">
                      {session}
                    </p>
                  </div>
                </div>
              );
            })}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default CR;
