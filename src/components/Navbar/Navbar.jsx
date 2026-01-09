import { useState, useRef, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { FiMenu, FiX, FiChevronDown } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../utils/Secure/AuthContext";
import ThemeToggle from "../../utils/ThemeToggle";
import { Helmet } from "react-helmet";
import { div } from "framer-motion/client";

/* ----------------------------- Data ----------------------------- */

const routes = [
  { name: "Our Fam", link: "/our-fam" },
  { name: "Toolkit", link: "/toolkit" },
  { name: "Forms", link: "/forms" },
  { name: "Academic Stars", link: "/academic-stars" },
];

const authRoutes = [
  { name: "Dashboard", link: "/dashboard" },
  { name: "Diary", link: "/diary" },
  { name: "Profile", link: "/profile" },
  { name: "Reset Password", link: "/forgot-password" },
  { name: "Sign Out", link: "/signout" },
];

/* ----------------------------- Motion ----------------------------- */

const dropdownAnim = {
  hidden: { opacity: 0, scale: 0.95, y: -6 },
  visible: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95, y: -6 },
};

const mobileMenuAnim = {
  hidden: { opacity: 0, height: 0 },
  visible: { opacity: 1, height: "auto" },
  exit: { opacity: 0, height: 0 },
};

/* ----------------------------- Components ----------------------------- */

const Logo = () => (
  <Link to="/" onClick={() => window.scrollTo(0, 0)}>
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
      width={125}
      className="drop-shadow-sm"
    />
  </Link>
);

const NavItem = ({ to, label, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="block px-4 py-2 text-sm rounded-lg text-gray-700 dark:text-gray-300 hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400 transition"
  >
    {label}
  </Link>
);

/* ----------------------------- Navbar ----------------------------- */

export default function Navbar() {
  const { isAuthenticated: authed, loading } = useAuth();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [personalOpen, setPersonalOpen] = useState(false);

  const personalRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (!personalRef.current?.contains(e.target)) {
        setPersonalOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setPersonalOpen(false);
  }, [location.pathname]);
  const mobileDropdownAnim = {
    hidden: {
      height: 0,
      opacity: 0,
    },
    visible: {
      height: "auto",
      opacity: 1,
    },
    exit: {
      height: 0,
      opacity: 0,
    },
  };
  return (
    <nav className="sticky top-0 max-h-14 z-50 backdrop-blur-lg bg-white/80 dark:bg-gray-950/80 border-b border-rose-100 dark:border-gray-800 block md:container">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Logo />

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          <ThemeToggle />

          {routes.map((r) => (
            <NavLink
              key={r.name}
              to={r.link}
              className={({ isActive }) =>
                `text-sm font-medium transition ${
                  isActive
                    ? "text-rose-600 dark:text-rose-400"
                    : "text-gray-600 dark:text-gray-400 hover:text-rose-500"
                }`
              }
            >
              {r.name}
            </NavLink>
          ))}

          {!loading && authed && (
            <div ref={personalRef} className="relative">
              <button
                onClick={() => setPersonalOpen((p) => !p)}
                className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-rose-500 transition"
              >
                Personal
                <FiChevronDown
                  className={`transition ${personalOpen ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {personalOpen && (
                  <motion.div
                    variants={dropdownAnim}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="absolute right-0 mt-3 w-44 rounded-xl bg-white dark:bg-gray-900 border border-rose-100 dark:border-gray-800 shadow-xl"
                  >
                    {authRoutes.map((r) => (
                      <NavItem
                        key={r.name}
                        to={r.link}
                        label={r.name}
                        onClick={() => setPersonalOpen(false)}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {!loading && !authed && (
             <div className="flex gap-4 justify-center items-center">
                  <Link
                    to="/signup"
                    className="px-3 py-1 rounded-3xl text-sm bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-700 hover:scale-105 transition-all duration-300"
                  >
                    Sign Up
                  </Link>
                  <Link
                    to="/signin"
                    className="px-3 py-1 rounded-3xl text-sm bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-700 hover:scale-105 transition-all duration-300"
                  >
                    Sign In
                  </Link>
                </div>
          )}
        </div>

        {/* Mobile toggle */}
        <div className="md:hidden flex items-center gap-3">
          <ThemeToggle />
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="p-2 rounded-xl bg-rose-500/10 text-rose-600"
          >
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            variants={mobileMenuAnim}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="md:hidden overflow-hidden bg-white dark:bg-gray-950 border-t border-rose-100 dark:border-gray-800 absolute top-14 w-full"
          >
            <div className="flex flex-col items-start gap-4 py-4 px-6">
              {routes.map((r) => (
                <NavLink
                  key={r.name}
                  to={r.link}
                  onClick={() => setMenuOpen(false)}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-rose-500 transition"
                >
                  {r.name}
                </NavLink>
              ))}
              {!loading && authed && (
                <div ref={personalRef} className="w-full">
                  <button
                    onClick={() => setPersonalOpen((p) => !p)}
                    className="w-full flex items-center justify-start text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-rose-500 transition"
                  >
                    <span>Personal</span>
                    <FiChevronDown
                      className={`transition-transform duration-300 ${
                        personalOpen ? "rotate-180 text-rose-500" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {personalOpen && (
                      <motion.div
                        variants={mobileDropdownAnim}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{
                          duration: 0.35,
                          ease: "easeOut",
                        }}
                        className="overflow-hidden"
                      >
                        <div className="mt-2 rounded-xl bg-rose-50/60 dark:bg-gray-900 border border-rose-100 dark:border-gray-800 shadow-inner">
                          {authRoutes.map((r) => (
                            <NavItem
                              key={r.name}
                              to={r.link}
                              label={r.name}
                              onClick={() => {
                                setPersonalOpen(false);
                                setMenuOpen(false);
                              }}
                            />
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {!loading && !authed && (
                <div className="flex gap-4 justify-evenly items-center w-full">
                  <Link
                    to="/signup"
                    className="px-5 py-2 rounded-3xl text-sm bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-700"
                  >
                    Sign Up
                  </Link>
                  <Link
                    to="/signin"
                    className="px-5 py-2 rounded-3xl text-sm bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-700"
                  >
                    Sign In
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
