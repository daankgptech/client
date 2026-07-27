import { GiTrophy } from "react-icons/gi";
import { FaHelicopter, FaBus, FaBuilding } from "react-icons/fa";
import { Link } from "react-router-dom";

const EXPLORE_ITEMS = [
  {
    label: "Helipad",
    icon: FaHelicopter,
    color: "bg-white/5",
    link: "https://maps.app.goo.gl/bJGDh9x82obhCeyR9",
  },
  {
    label: "Hangar",
    icon: FaBus,
    color: "bg-white/5",
    link: "https://maps.app.goo.gl/7hXBb4WKcHD6HqR87",
  },
  {
    label: "Gymkhana",
    icon: GiTrophy,
    color: "bg-white/5",
    link: "https://maps.app.goo.gl/1gqV1VTQ4cLr6Ut69",
  },
  {
    label: "Nehru Museum",
    icon: FaBuilding,
    color: "bg-white/5",
    link: "https://maps.app.goo.gl/meC9B6u3ZPxQ8sPA8",
  },
];

const Banner = () => {
  return (
    <>
      <section className="py-14 md:py-24 mt-10 container">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 justify-between">
            {/* Content */}
            <div className="flex flex-col justify-center gap-6">

              <header>
                <h1 className="text-3xl md:text-5xl font-bold font-space-grotesk tracking-tighter text-white leading-tight">
                  Explore IIT Kharagpur Campus
                </h1>

                <p className="mt-4 text-white/60 text-sm md:text-base leading-relaxed max-w-md">
                  Discover iconic locations across IIT Kharagpur - from aviation
                  facilities to cultural hubs - all in one seamless experience.
                </p>
              </header>

              {/* Cards */}
              <div className="grid grid-cols-2 gap-0">
                {EXPLORE_ITEMS.map((item, index) => {
                  const Icon = item.icon;

                  return (
                    <Link
                      key={index}
                      to={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-3 p-3 border-x-[0.01px] border-y-[0.01px] border-white/10 bg-transparent transition-all duration-300 hover:bg-white/5"
                      aria-label={`Open ${item.label} location in Google Maps`}
                    >
                      {/* Icon */}
                      <div
                        className={`p-2 rounded-lg ${item.color} transition`}
                      >
                        <Icon className="text-lg text-white/60 group-hover:text-primary transition-colors" />
                      </div>

                      {/* Label */}
                      <span className="text-xs md:text-sm lg:text-base font-medium text-white/80 group-hover:text-primary transition-colors">
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
              </div>

            </div>

            {/* Image */}
            <div className="flex justify-center">
              <div className="relative p-[2px] rounded-2xl bg-white/5 border border-white/10">
                <div className="overflow-hidden rounded-xl">
                  <img
                    src="https://res.cloudinary.com/dcwwptwzt/image/upload/v1756335903/explore_ysdbns.avif"
                    alt="Explore IIT Kharagpur Campus"
                    title="Explore IIT KGP"
                    loading="lazy"
                    className="w-full max-w-xs sm:max-w-sm object-cover transition-transform duration-500 hover:scale-[1.02] grayscale hover:grayscale-0"
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