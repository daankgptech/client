import React from "react";
import { GiTrophy } from "react-icons/gi";
import { FaHelicopter, FaBus, FaBuilding } from "react-icons/fa";
import { Helmet } from "react-helmet";

const EXPLORE_ITEMS = [
  { label: "Helipad", icon: FaHelicopter, color: "red", id: "https://maps.app.goo.gl/bJGDh9x82obhCeyR9" },
  { label: "Hangar", icon: FaBus, color: "green", id: "https://maps.app.goo.gl/7hXBb4WKcHD6HqR87" },
  { label: "Gymkhana", icon: GiTrophy, color: "blue", id: "https://maps.app.goo.gl/1gqV1VTQ4cLr6Ut69" },
  { label: "Nehru Museum", icon: FaBuilding, color: "yellow", id: "https://maps.app.goo.gl/meC9B6u3ZPxQ8sPA8" },
];

// Helper to handle the repetitive Tailwind color classes
const getColorClasses = (color) => {
  const themes = {
    red: "bg-red-100 border-red-300 shadow-red-200 dark:bg-red-400",
    green: "bg-green-100 border-green-300 shadow-green-200 dark:bg-green-400",
    blue: "bg-blue-100 border-blue-300 shadow-blue-200 dark:bg-blue-400",
    yellow: "bg-yellow-100 border-yellow-300 shadow-yellow-200 dark:bg-yellow-400",
  };
  return themes[color] || "";
};

const Banner = () => {
  const bannerImg = "https://res.cloudinary.com/dcwwptwzt/image/upload/v1756335903/explore_ysdbns.avif";

  return (
    <>
      <Helmet>
        <link rel="preload" as="image" href={bannerImg} />
      </Helmet>
      
      <div className=" bg-gray-100 dark:bg-gray-900 flex justify-start items-center backdrop-blur-xl py-12 sm:py-0">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
            
            {/* Image section */}
            <div data-aos="flip-up">
              <img
                src={bannerImg}
                alt="Explore IIT KGP"
                className="w-1/2 mx-auto drop-shadow-[5px_5px_12px_rgba(0,0,0,0.7)] object-cover rounded-3xl"
              />
            </div>

            {/* Text content section */}
            <div className="flex flex-col justify-center gap-6 sm:pt-0 lg:px-16">
              <h1 data-aos="fade-up" className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-300">
                Explore all corners of IIT Kharagpur with us
              </h1>
              
              <p data-aos="fade-up" className="text-sm text-gray-500 dark:text-gray-400 tracking-wide leading-8">
                IIT Kharagpur's sprawling campus boasts modern facilities and unique infrastructure,
                fostering a dynamic environment for students to grow academically and personally.
              </p>

              <div data-aos="zoom-in" className="grid grid-cols-2 gap-6">
                {EXPLORE_ITEMS.map((item) => (
                  <a
                    key={item.id}
                    href={item.id}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`View ${item.label} on Map`}
                    className="flex items-center gap-4 hover:translate-x-2 transition-all duration-300 group hover:text-red-500 text-gray-900 dark:text-gray-500 dark:hover:text-gray-300"
                  >
                    <item.icon 
                      className={`text-4xl h-10 w-10 md:h-12 md:w-12 p-2 md:p-4 rounded-full border shadow-lg dark:shadow-md transition-colors text-gray-900 ${getColorClasses(item.color)}`} 
                    />
                    <p className="text-sm md:text-base font-medium">{item.label} ➚</p>
                  </a>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default Banner;