import { GiTrophy } from "react-icons/gi";
import { FaHelicopter, FaBus, FaBuilding } from "react-icons/fa";
import { Helmet } from "react-helmet";

const Banner = () => {
  return (
    <>
      <div className="min-h-[550px] bg-gray-100 dark:bg-gray-900">
        <div className="min-h-[550px] flex justify-center items-center backdrop-blur-xl py-12 sm:py-0 ">
          <div className="container">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              {/* Image section */}
              <div data-aos="flip-up">
                <Helmet>
                  <link
                    rel="preload"
                    as="image"
                    href="https://res.cloudinary.com/dcwwptwzt/image/upload/v1756335903/explore_ysdbns.avif"
                  />
                </Helmet>
                <img
                  src="https://res.cloudinary.com/dcwwptwzt/image/upload/v1756335903/explore_ysdbns.avif"
                  alt="Treasure Img"
                  width="100%"
                  height="350px"
                  className="max-w-[450px] mx-auto drop-shadow-[5px_5px_12px_rgba(0,0,0,0.7)] object-cover rounded-3xl"
                />
              </div>
              {/* text content section */}
              <div className="flex flex-col justify-center gap-6 sm:pt-0 lg:px-16">
                <h1
                  data-aos="fade-up"
                  className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-300"
                >
                  Explore all corners of IIT Kharagpur with us
                </h1>
                <p
                  data-aos="fade-up"
                  className="text-sm text-gray-500 dark:text-gray-400 tracking-wide leading-8"
                >
                  IIT Kharagpur's sprawling campus boasts modern facilities,
                  unique infrastructure fostering a dynamic environment for
                  students to grow academically and personally with diverse
                  opportunities.
                  <br />
                </p>
                <div data-aos="zoom-in" className="grid grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <a
                      href="https://maps.app.goo.gl/bJGDh9x82obhCeyR9"
                      target="_blank"
                      title="Map"
                      className="flex items-center gap-4 hover:translate-x-2 transition-all duration-300 hover:text-red-500 text-gray-900 dark:text-gray-500 dark:hover:text-gray-300"
                    >
                      <FaHelicopter className="text-4xl text-gray-900 dark:text-gray-500 h-4 w-4 md:h-12 md:w-12 shadow-lg dark:shadow-md shadow-red-200 p-2 md:p-4 rounded-full bg-red-100 border border-red-300 dark:bg-red-400" />
                      <p>Helipad ➚</p>
                    </a>
                    <a
                      href="https://maps.app.goo.gl/7hXBb4WKcHD6HqR87"
                      target="_blank"
                      title="Map"
                      className="flex items-center gap-4 hover:translate-x-2 transition-all duration-300 hover:text-red-500 text-gray-900 dark:text-gray-500 dark:hover:text-gray-300"
                    >
                      <FaBus className="text-4xl text-gray-900 dark:text-gray-500 h-4 w-4 md:h-12 md:w-12 shadow-lg dark:shadow-md shadow-green-200 p-2 md:p-4 rounded-full bg-green-100 border border-green-300 dark:bg-green-400" />
                      <p>Hangar ➚</p>
                    </a>
                  </div>
                  <div className="space-y-6">
                    <a
                      href="https://maps.app.goo.gl/1gqV1VTQ4cLr6Ut69"
                      target="_blank"
                      title="Map"
                      className="flex items-center gap-4 hover:translate-x-2 transition-all duration-300 hover:text-red-500 text-gray-900 dark:text-gray-500 dark:hover:text-gray-300"
                    >
                      <GiTrophy className="text-4xl text-gray-900 dark:text-gray-500 h-4 w-4 md:h-12 md:w-12 shadow-lg dark:shadow-md shadow-blue-200 p-2 md:p-4 rounded-full bg-blue-100 border border-blue-300 dark:bg-blue-400" />
                      <p>Gymkhana ➚</p>
                    </a>
                    <a
                      href="https://maps.app.goo.gl/meC9B6u3ZPxQ8sPA8"
                      target="_blank"
                      title="Map"
                      className="flex items-center gap-4 hover:translate-x-2 transition-all duration-300 hover:text-red-500 text-gray-900 dark:text-gray-500 dark:hover:text-gray-300"
                    >
                      <FaBuilding className="text-4xl text-gray-900 dark:text-gray-500 h-4 w-4 md:h-12 md:w-12 shadow-lg dark:shadow-md shadow-yellow-200 p-2 md:p-4 rounded-full bg-yellow-100 border border-yellow-300 dark:bg-yellow-400" />
                      <p>Nehru Museum ➚</p>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Banner;
