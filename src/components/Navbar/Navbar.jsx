import { useState, useRef, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { FiMenu, FiX, FiChevronDown } from "react-icons/fi";
import { useAuth } from "../../utils/Secure/useAuth";
import ThemeToggle from "../../utils/ThemeToggle";
import { Helmet } from "react-helmet";

export default function Navbar() {
  const { isAuthenticated: authed, loading } = useAuth();
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const [personalOpen, setPersonalOpen] = useState(false);

  const personalDesktopRef = useRef(null);
  const personalMobileRef = useRef(null);

  const routes = [
    { name: "Our Fam", link: "/our-fam" },
    { name: "Toolkit", link: "/toolkit" },
    { name: "Forms", link: "/forms" },
    { name: "Our Bright Minds", link: "/our-bright-minds" },
  ];
  const authRoutes = [
    { name: "Dashboard", link: "/dashboard" },
    { name: "Diary", link: "/diary" },
    { name: "Profile", link: "/profile" },
    { name: "Sign Out", link: "/signout" },
  ];
  useEffect(() => {
    const handler = (e) => {
      if (
        personalDesktopRef.current &&
        personalDesktopRef.current.contains(e.target)
      ) {
        return;
      }

      if (
        personalMobileRef.current &&
        personalMobileRef.current.contains(e.target)
      ) {
        return;
      }

      setPersonalOpen(false);
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    setPersonalOpen(false);
    setOpen(false);
  }, [location.pathname]);

  if (loading)
    return (
      <>
        <nav className="md:container sticky max-h-14 top-0 z-50 backdrop-blur-md bg-white dark:bg-gray-950 border-b border-rose-100 dark:border-gray-800 transition-colors duration-300">
          <div className="container mx-auto px-4 py-3 my-0">
            <div className="flex items-center justify-between my-0">
              {/* Logo */}
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
                />
              </Link>
              {/* Desktop Links */}
              <div className="hidden md:flex items-center gap-6">
                <ThemeToggle />
                {routes.map((r) => (
                  <NavLink
                    key={r.name}
                    to={r.link}
                    className={({ isActive }) =>
                      `text-sm transition-colors duration-300 ${
                        isActive
                          ? "text-rose-600 dark:text-rose-400"
                          : "text-gray-600 dark:text-gray-400 hover:text-rose-500 hover:dark:text-gray-300"
                      }`
                    }
                  >
                    {r.name}
                  </NavLink>
                ))}
                {/* Personal Dropdown */}
                {authed && (
                  <div ref={personalDesktopRef} className="relative">
                    <button
                      onClick={() => setPersonalOpen((p) => !p)}
                      className="text-sm transition-colors duration-300 flex gap-1 items-center text-gray-600 dark:text-gray-400 hover:text-rose-500 hover:dark:text-gray-300"
                    >
                      Personal
                      <FiChevronDown
                        size={14}
                        className={`transition-transform duration-300 ${
                          personalOpen ? "rotate-180" : "rotate-0"
                        }`}
                      />
                    </button>

                    <div
                      className={`absolute right-0 mt-3 w-40 rounded-2xl bg-gray-100 dark:bg-gray-900 border border-rose-100 dark:border-gray-800 shadow-lg overflow-hidden transition-all duration-300 transform origin-top-right ${
                        personalOpen
                          ? "scale-100 opacity-100"
                          : "scale-95 opacity-0 pointer-events-none"
                      }`}
                    >
                      {authRoutes.map((r) => (
                        <NavLink
                          key={r.name}
                          to={r.link}
                          onClick={() => setPersonalOpen(false)}
                          className={({ isActive }) =>
                            `block px-4 py-2 text-sm transition-all duration-300 ${
                              isActive
                                ? "text-rose-600 dark:text-rose-400"
                                : "text-gray-600 dark:text-gray-400 hover:text-rose-500 hover:dark:text-gray-300"
                            }`
                          }
                        >
                          {r.name}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile */}
              <div className="flex md:hidden items-center gap-3">
                <ThemeToggle />
                <button
                  onClick={() => setOpen((o) => !o)}
                  className="p-2 rounded-xl bg-rose-500/10 text-rose-500 transition-colors duration-300"
                >
                  {open ? <FiX /> : <FiMenu />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          <div
            className={`md:hidden absolute top-14 right-0 w-full px-4 py-2 bg-gray-100 dark:bg-gray-950 border-t border-rose-100 dark:border-gray-800 transition-all duration-300 overflow-hidden ${
              open ? "max-h-screen opacity-100 py-4" : "max-h-0 opacity-0 py-0"
            }`}
          >
            <div className="flex flex-col gap-3 justify-start items-center">
              {routes.map((r) => (
                <NavLink
                  key={r.name}
                  to={r.link}
                  onClick={() => setOpen(false)}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-rose-500 hover:dark:text-gray-300 transition-all duration-300"
                >
                  {r.name}
                </NavLink>
              ))}
            </div>
          </div>
        </nav>
      </>
    );

  return (
    <nav className="md:container sticky max-h-14 top-0 z-50 backdrop-blur-md bg-white dark:bg-gray-950 border-b border-rose-100 dark:border-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-4 py-3 my-0">
        <div className="flex items-center justify-between my-0">
          {/* Logo */}
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
            />
          </Link>
          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6">
            <ThemeToggle />
            {routes.map((r) => (
              <NavLink
                key={r.name}
                to={r.link}
                className={({ isActive }) =>
                  `text-sm transition-colors duration-300 ${
                    isActive
                      ? "text-rose-600 dark:text-rose-400"
                      : "text-gray-600 dark:text-gray-400 hover:text-rose-500 hover:dark:text-gray-300"
                  }`
                }
              >
                {r.name}
              </NavLink>
            ))}
            {/* Personal Dropdown */}
            {authed && (
              <div ref={personalDesktopRef} className="relative">
                <button
                  onClick={() => setPersonalOpen((p) => !p)}
                  className="text-sm transition-colors duration-300 flex gap-1 items-center text-gray-600 dark:text-gray-400 hover:text-rose-500 hover:dark:text-gray-300"
                >
                  Personal
                  <FiChevronDown
                    size={14}
                    className={`transition-transform duration-300 ${
                      personalOpen ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </button>

                <div
                  className={`absolute right-0 mt-3 w-40 rounded-2xl bg-gray-100 dark:bg-gray-900 border border-rose-100 dark:border-gray-800 shadow-lg overflow-hidden transition-all duration-300 transform origin-top-right ${
                    personalOpen
                      ? "scale-100 opacity-100"
                      : "scale-95 opacity-0 pointer-events-none"
                  }`}
                >
                  {authRoutes.map((r) => (
                    <NavLink
                      key={r.name}
                      to={r.link}
                      onClick={() => setPersonalOpen(false)}
                      className={({ isActive }) =>
                        `block px-4 py-2 text-sm transition-all duration-300 ${
                          isActive
                            ? "text-rose-600 dark:text-rose-400"
                            : "text-gray-600 dark:text-gray-400 hover:text-rose-500 hover:dark:text-gray-300"
                        }`
                      }
                    >
                      {r.name}
                    </NavLink>
                  ))}
                </div>
              </div>
            )}
            {/* Auth Buttons */}
            {!authed && (
              <div className="flex justify-center items-center gap-6">
                <Link
                  to="/signin"
                  className="px-4 py-1.5 rounded-3xl text-sm bg-rose-50 hover:bg-rose-100 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 hover:scale-105 transition-all duration-300"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>

          {/* Mobile */}
          <div className="flex md:hidden items-center gap-3">
            <ThemeToggle />
            <button
              onClick={() => setOpen((o) => !o)}
              className="p-2 rounded-xl bg-rose-500/10 text-rose-500 transition-colors duration-300"
            >
              {open ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute top-14 right-0 w-full px-4 py-2 bg-gray-100 dark:bg-gray-950 border-t border-rose-100 dark:border-gray-800 transition-all duration-300 overflow-hidden ${
          open ? "max-h-screen opacity-100 py-4" : "max-h-0 opacity-0 py-0"
        }`}
      >
        <div className="flex flex-col gap-3 justify-start items-center">
          {routes.map((r) => (
            <NavLink
              key={r.name}
              to={r.link}
              onClick={() => setOpen(false)}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-rose-500 hover:dark:text-gray-300 transition-all duration-300"
            >
              {r.name}
            </NavLink>
          ))}
          {authed && (
            <div
              ref={personalMobileRef}
              className="relative flex flex-col justify-start items-center"
            >
              <button
                onClick={() => setPersonalOpen((p) => !p)}
                className={`text-sm transition-colors duration-300 flex gap-1 items-center ${
                  personalOpen
                    ? "text-rose-600 dark:text-rose-400"
                    : "text-gray-600 dark:text-gray-400 hover:text-rose-500"
                }`}
              >
                Personal
                <FiChevronDown
                  size={14}
                  className={`transition-transform duration-300 ${
                    personalOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>

              <div
                className={`relative right-0 mt-3 w-40 rounded-2xl bg-gray-100 dark:bg-gray-900 border border-rose-100 dark:border-gray-800 shadow-lg overflow-hidden transition-all duration-300 transform origin-top-right ${
                  personalOpen
                    ? "scale-100 opacity-100"
                    : "scale-95 opacity-0 pointer-events-none"
                }`}
              >
                <NavItem
                  to="/dashboard"
                  label="Dashboard"
                  onClick={() => {
                    setPersonalOpen(false);
                    setOpen(false);
                  }}
                />
                <NavItem
                  to="/profile"
                  label="Profile"
                  onClick={() => {
                    setPersonalOpen(false);
                    setOpen(false);
                  }}
                />
                <NavItem
                  to="/signout"
                  label="Sign Out"
                  onClick={() => {
                    setPersonalOpen(false);
                    setOpen(false);
                  }}
                />
              </div>
            </div>
          )}

          {!authed && (
            <div className="flex flex-col gap-3 justify-start items-center">
              <Link
                to="/signin"
                className="px-4 py-1.5 rounded-3xl text-sm bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 hover:scale-105 transition-all duration-300"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

const NavItem = ({ to, label, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="block px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-rose-500/10 hover:text-rose-500 transition-colors duration-300"
  >
    {label}
  </Link>
);
