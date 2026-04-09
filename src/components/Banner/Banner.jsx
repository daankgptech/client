import { GiTrophy } from "react-icons/gi";
import { FaHelicopter, FaBus, FaBuilding } from "react-icons/fa";

const EXPLORE_ITEMS = [
  {
    label: "Helipad",
    icon: FaHelicopter,
    color: "bg-red-100 dark:bg-red-500/20",
    link: "https://maps.app.goo.gl/bJGDh9x82obhCeyR9",
  },
  {
    label: "Hangar",
    icon: FaBus,
    color: "bg-green-100 dark:bg-green-500/20",
    link: "https://maps.app.goo.gl/7hXBb4WKcHD6HqR87",
  },
  {
    label: "Gymkhana",
    icon: GiTrophy,
    color: "bg-blue-100 dark:bg-blue-500/20",
    link: "https://maps.app.goo.gl/1gqV1VTQ4cLr6Ut69",
  },
  {
    label: "Nehru Museum",
    icon: FaBuilding,
    color: "bg-yellow-100 dark:bg-yellow-500/20",
    link: "https://maps.app.goo.gl/meC9B6u3ZPxQ8sPA8",
  },
];

const Banner = () => {
  return (
    <>
      <section className="bg-gray-50 dark:bg-gray-900 py-12 md:py-16 mt-10">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-10 items-start">
            {/* Image */}
            <div className="flex justify-center">
              <img
                src="https://res.cloudinary.com/dcwwptwzt/image/upload/v1756335903/explore_ysdbns.avif"
                alt="Explore IIT Kharagpur Campus"
                title="Explore IIT KGP"
                loading="lazy"
                className="w-full max-w-xs rounded-2xl object-cover"
              />
            </div>

            {/* Content */}
            <div className="h-full flex flex-col items-center justify-evenly ">
              <header>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
                  Explore IIT Kharagpur Campus
                </h1>

                <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm md:text-base leading-relaxed">
                  Discover iconic locations across IIT Kharagpur - from aviation
                  facilities to cultural hubs - all in one seamless experience.
                </p>
              </header>

              {/* Cards */}
              <div className="grid grid-cols-2 gap-4">
                {EXPLORE_ITEMS.map((item, index) => {
                  const Icon = item.icon;

                  return (
                    <a
                      key={index}
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      aria-label={`Open ${item.label} location in Google Maps`}
                    >
                      <div
                        className={`p-3 rounded-lg ${item.color} transition`}
                      >
                        <Icon className="text-xl text-gray-800 dark:text-white" />
                      </div>

                      <span className="text-sm md:text-base font-medium text-gray-800 dark:text-gray-200 group-hover:text-blue-600 transition">
                        {item.label}
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Banner;
