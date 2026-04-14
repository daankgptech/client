import { GiTrophy } from "react-icons/gi";
import { FaHelicopter, FaBus, FaBuilding } from "react-icons/fa";

const EXPLORE_ITEMS = [
  {
    label: "Helipad",
    icon: FaHelicopter,
    color: "bg-rose-100 dark:bg-rose-500/10",
    link: "https://maps.app.goo.gl/bJGDh9x82obhCeyR9",
  },
  {
    label: "Hangar",
    icon: FaBus,
    color: "bg-gray-200 dark:bg-gray-700/40",
    link: "https://maps.app.goo.gl/7hXBb4WKcHD6HqR87",
  },
  {
    label: "Gymkhana",
    icon: GiTrophy,
    color: "bg-rose-50 dark:bg-rose-500/10",
    link: "https://maps.app.goo.gl/1gqV1VTQ4cLr6Ut69",
  },
  {
    label: "Nehru Museum",
    icon: FaBuilding,
    color: "bg-gray-100 dark:bg-gray-700/30",
    link: "https://maps.app.goo.gl/meC9B6u3ZPxQ8sPA8",
  },
];

const Banner = () => {
  return (
    <>
      <section className="bg-gray-100 dark:bg-gray-950 py-12 md:py-16 mt-10 container">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-10 md:gap-14 items-center ">
{/* Content */}
            <div className="flex flex-col justify-center gap-6">

              <header>
                <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white leading-tight tracking-tight">
                  Explore IIT Kharagpur Campus
                </h1>

                <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm md:text-base leading-relaxed max-w-md">
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
                      className="group flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 hover:-translate-y-0.5"
                      aria-label={`Open ${item.label} location in Google Maps`}
                    >
                      {/* Icon */}
                      <div
                        className={`p-2 rounded-lg ${item.color} transition`}
                      >
                        <Icon className="text-lg text-gray-800 dark:text-gray-200" />
                      </div>

                      {/* Label */}
                      <span className="text-xs md:text-sm lg:text-base font-medium text-gray-800 dark:text-gray-200 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                        {item.label}
                      </span>
                    </a>
                  );
                })}
              </div>

            </div>
            {/* Image */}
            <div className="flex justify-center">
              <div className="relative p-[2px] rounded-2xl bg-gradient-to-tr from-rose-400/50 to-gray-300 dark:to-gray-700">
                <div className="overflow-hidden">
                  <img
                    src="https://res.cloudinary.com/dcwwptwzt/image/upload/v1756335903/explore_ysdbns.avif"
                    alt="Explore IIT Kharagpur Campus"
                    title="Explore IIT KGP"
                    loading="lazy"
                    className="w-full max-w-xs sm:max-w-sm object-cover transition-transform duration-300 hover:scale-[1.02]"
                  />
                </div>
              </div>
            </div>

            
          </div>
        </div>
      </section>
    </>
  );
};

export default Banner;