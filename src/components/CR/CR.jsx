import Slider from "react-slick";
import { MdAddCall } from "react-icons/md";
import { Helmet } from "react-helmet";
import { CRData } from "./CRData";
import { useNavigate } from "react-router-dom";
import ProtectedRoute from "../Secure/ProtectedRoute";

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
    { breakpoint: 1024, settings: { slidesToShow: 2, initialSlide: 2 } },
    { breakpoint: 640, settings: { slidesToShow: 1 } },
  ],
};

const CR = () => {
  const navigate = useNavigate();

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
            {CRData.map(
              ({ id, name, status, hall, img, session, mobile }) => (
                <div key={id} className="my-6">
                  <div className="flex flex-col items-center text-center gap-4 shadow-lg p-4 mx-4 rounded-xl bg-gradient-to-tr from-red-100 dark:from-gray-800 to-red-50 dark:to-gray-700 border border-primary dark:border-transparent relative">
                    <Helmet>
                      <link rel="preload" as="image" href={img} />
                    </Helmet>

                    <img
                      src={img}
                      alt={`${name}'s profile`}
                      width="160"
                      height="160"
                      className="rounded-full"
                    />

                    <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-tr from-red-900 to-red-500 dark:from-gray-500 dark:to-gray-100">
                      {name}
                    </h1>

                    <div className="flex gap-6 items-center">
                      <span className="text-lg font-semibold text-gray-600 dark:text-gray-300">
                        {status} CR
                      </span>

                      <ProtectedRoute
                        fallback={
                          <button
                            onClick={() => navigate("/signin")}
                            className="p-2 rounded-lg border border-green-200 bg-green-50 dark:bg-gray-800 text-green-400 flex items-center hover:bg-green-100 hover:scale-[1.05] hover:shadow-green-300 transition-all hover:translate-x-1 hover:-translate-y-1 hover:shadow-lg hover:border-green-300 duration-300"
                          >
                            <MdAddCall />
                          </button>
                        }
                      >
                        <a
                          href={`tel:${mobile}`}
                          title={`Call ${name}`}
                          className="p-2 rounded-lg border border-green-200 bg-green-50 dark:bg-gray-900 text-green-400 flex items-center hover:bg-green-100 hover:scale-105 hover:shadow-green-300 hover:translate-x-1 hover:-translate-y-1 hover:shadow-lg hover:border-green-300 transition-all duration-300"
                        >
                          <MdAddCall />
                        </a>
                      </ProtectedRoute>
                    </div>

                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      {hall}
                    </p>

                    <p className="text-black/30 dark:text-gray-400 text-sm font-serif absolute top-1 right-1">
                      {session}
                    </p>
                  </div>
                </div>
              )
            )}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default CR;