import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { HiMenuAlt3, HiMenuAlt1 } from "react-icons/hi";
import { Helmet } from "react-helmet";
import ResponsiveMenu from "./ResponsiveMenu";
import { NavbarLinks } from "./JSFiles/NavbarData";
import ThemeToggle from "../../utils/ThemeToggle";

const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-gray-50 dark:bg-gray-900 backdrop-blur-sm text-gray-900 dark:text-gray-200 shadow-md dark:shadow-lg">
      {/* Top Marquee */}
      <div className="bg-gradient-to-r from-red-600 to-red-400 dark:from-gray-900 dark:to-gray-600 text-gray-200 dark:text-gray-300 sm:block hidden">
        <div className="container py-[2px]">
          <div className="animate-marquee whitespace-nowrap">
            <p className="text-sm inline-block px-4">
              Grey skies, green vibes, and that unmistakable KGP spark ~ monsoon
              season is here to charge us up.
            </p>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="container sm:py-0 flex justify-between items-center m-3">
        {/* Logo */}
        <Link
          to="/"
          onClick={() => window.scrollTo(0, 0)}
          className="flex items-center gap-2"
        >
          <Helmet>
            <link
              rel="preload"
              as="image"
              href="https://res.cloudinary.com/dubu8yxkm/image/upload/v1754643304/Logo_mnu1fh.avif"
            />
          </Helmet>
          <img
            src="https://res.cloudinary.com/dubu8yxkm/image/upload/v1754643304/Logo_mnu1fh.avif"
            alt="DAAN KGP Logo"
            width="125"
            height="50"
          />
        </Link>

        {/* Desktop Nav Links */}
        <ul className="hidden md:flex items-center gap-6">
          {NavbarLinks.map(({ name, link }) => (
            <li key={name}>
              <NavLink
                to={link}
                className={({ isActive }) =>
                  isActive
                    ? "text-red-500 font-semibold border-b-2 border-red-500 dark:text-gray-200 dark:border-gray-200"
                    : "text-gray-700 hover:text-red-300 dark:text-gray-400 dark:hover:text-gray-300 transition-all"
                }
              >
                {name}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* External Links (Desktop only) */}
          <div className="hidden md:flex gap-4">
            <a
              href="https://www.dakshana.org/"
              target="_blank"
              rel="noopener noreferrer"
              title="Dakshana Foundation"
              className="bg-gradient-to-tr p-1 from-gray-100 to-gray-200 dark:from-gray-950 dark:to-gray-800 border transition-all duration-300 text-gray-900 dark:text-gray-400 rounded-lg text-center hover:bg-gradient-to-tr hover:from-gray-300 hover:to-gray-400 dark:hover:from-gray-900 dark:hover:to-gray-700 hover:border-gray-500 dark:border-gray-600 dark:hover:border-gray-500 shadow-sm shadow-gray-600 dark:shadow-gray-500"
            >
              <img
                src="https://res.cloudinary.com/dcwwptwzt/image/upload/v1754520270/DakshanaLogo_ouuxyh.avif"
                alt="Dakshana Foundation Logo"
                width="35"
                height="35"
              />
            </a>
            <a
              href="https://erp.iitkgp.ac.in/"
              target="_blank"
              rel="noopener noreferrer"
              title="ERP IIT Kharagpur"
              className="bg-gradient-to-tr p-2 text-sm from-gray-100 to-gray-200 dark:from-gray-950 dark:to-gray-800 border transition-all duration-300 text-gray-900 dark:text-gray-400 rounded-lg text-center hover:bg-gradient-to-tr hover:from-gray-300 hover:to-gray-400 dark:hover:from-gray-900 dark:hover:to-gray-700 hover:border-gray-500 dark:border-gray-600 dark:hover:border-gray-500 shadow-sm  shadow-gray-600 dark:shadow-gray-500"
            >
              ERP
            </a>
          </div>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setShowMenu((prev) => !prev)}
            className="md:hidden p-1 text-gray-900 dark:text-gray-400"
            aria-label="Toggle menu"
          >
            {showMenu ? <HiMenuAlt1 size={30} /> : <HiMenuAlt3 size={30} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <ResponsiveMenu showMenu={showMenu} setShowMenu={setShowMenu} />
    </nav>
  );
};

export default Navbar;
