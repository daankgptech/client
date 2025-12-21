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

  const personalRef = useRef(null);

  const routes = [
    { name: "Our Fam", link: "/our-fam" },
    { name: "Toolkit", link: "/toolkit" },
    { name: "Forms", link: "/forms" },
    { name: "Our Bright Minds", link: "/our-bright-minds" },
  ];

  // Close Personal dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (personalRef.current && !personalRef.current.contains(e.target)) {
        setPersonalOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdown when navigating to dashboard/profile/signout
  useEffect(() => {
    setPersonalOpen(false);
    setOpen(false);
  }, [location.pathname]);

  if (loading) return null;

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-gray-100/80 dark:bg-gray-950/80 border-b border-rose-100 dark:border-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
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

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6">
            {routes.map((r) => (
              <NavLink
                key={r.name}
                to={r.link}
                className={({ isActive }) =>
                  `text-sm transition-colors duration-300 ${
                    isActive
                      ? "text-rose-600 dark:text-rose-400"
                      : "text-gray-600 dark:text-gray-400 hover:text-rose-500"
                  }`
                }
              >
                {r.name}
              </NavLink>
            ))}

            {/* Personal Dropdown */}
            {authed && (
              <div ref={personalRef} className="relative">
                <button
                  onClick={() => setPersonalOpen((p) => !p)}
                  className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-rose-500 transition-colors duration-300"
                >
                  Personal
                  <FiChevronDown size={14} className={`transition-transform duration-300 ${personalOpen ? "rotate-180" : "rotate-0"}`} />
                </button>

                <div
                  className={`absolute right-0 mt-3 w-40 rounded-2xl bg-gray-100 dark:bg-gray-900 border border-rose-100 dark:border-gray-800 shadow-lg overflow-hidden transition-all duration-300 transform origin-top-right ${
                    personalOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"
                  }`}
                >
                  <NavItem to="/dashboard" label="Dashboard" />
                  <NavItem to="/profile" label="Profile" />
                  <NavItem to="/signout" label="Sign Out" />
                </div>
              </div>
            )}

            {/* Auth Buttons */}
            {!authed && (
              <>
                <Link
                  to="/signin"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-rose-500 transition-colors duration-300"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-1.5 rounded-full text-sm bg-rose-600 text-white hover:bg-rose-700 transition-colors duration-300"
                >
                  Sign Up
                </Link>
              </>
            )}

            {/* Theme Toggle */}
            <ThemeToggle />
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
        className={`md:hidden px-4 pb-4 bg-gray-100 dark:bg-gray-950 border-t border-rose-100 dark:border-gray-800 transition-all duration-300 overflow-hidden ${
          open ? "max-h-screen opacity-100 py-4" : "max-h-0 opacity-0 py-0"
        }`}
      >
        <div className="flex flex-col gap-3">
          {routes.map((r) => (
            <NavLink
              key={r.name}
              to={r.link}
              onClick={() => setOpen(false)}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-rose-500 transition-colors duration-300"
            >
              {r.name}
            </NavLink>
          ))}

          {authed && (
            <>
              <span className="mt-2 text-xs uppercase tracking-wide text-gray-500">Personal</span>
              <NavLink to="/dashboard" onClick={() => setOpen(false)}>Dashboard</NavLink>
              <NavLink to="/profile" onClick={() => setOpen(false)}>Profile</NavLink>
              <NavLink to="/signout" onClick={() => setOpen(false)}>Sign Out</NavLink>
            </>
          )}

          {!authed && (
            <div className="flex gap-3 mt-3">
              <Link to="/signin" className="text-sm text-gray-600">Sign In</Link>
              <Link to="/signup" className="px-4 py-1.5 rounded-full text-sm bg-rose-600 text-white">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

/* helpers */
const NavItem = ({ to, label }) => (
  <Link
    to={to}
    className="block px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-rose-500/10 hover:text-rose-500 transition-colors duration-300"
  >
    {label}
  </Link>
);