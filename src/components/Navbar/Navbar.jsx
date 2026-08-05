import { useState, useRef, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../utils/Secure/AuthContext";
import {
  Menu,
  X,
  ChevronDown,
  LayoutDashboard,
  BookOpen,
  User,
  LogOut,
  Sparkles,
  ArrowRight,
} from "lucide-react";

/* ----------------------------- Data ----------------------------- */

const routes = [
  { name: "Our Fam", link: "/our-fam" },
  { name: "Toolkit", link: "/toolkit" },
  { name: "Forms", link: "/forms" },
  { name: "Events", link: "/events" },
  { name: "Academic Stars", link: "/academic-stars" },
];

const authRoutes = [
  { name: "Dashboard", link: "/dashboard", icon: LayoutDashboard },
  { name: "Diary", link: "/diary", icon: BookOpen },
  { name: "Profile", link: "/profile", icon: User },
  { name: "Sign Out", link: "/signout", icon: LogOut },
];

/* ----------------------------- Logo ----------------------------- */

export const Logo = ({ onClick }) => (
  <Link to="/" onClick={onClick} className="flex items-center gap-2.5 group">
    <img
      src="https://res.cloudinary.com/dhv0sckmq/image/upload/v1769529398/Logo_NoBG_op55cy.avif"
      alt="DAAN KGP Logo"
      className="w-7 h-7 sm:w-8 sm:h-8 drop-shadow-sm rounded-sm transition-transform duration-300 group-hover:scale-105"
    />
    <div className="text-lg font-space-grotesk font-bold text-primary tracking-tighter">DAAN<span className="font-space-grotesk text-primary-hover text-[10px]">@</span>KGP</div>
  </Link>
);

/* ----------------------------- Main Navbar Component ----------------------------- */

export default function Navbar() {
  const { isAuthenticated: authed, loading } = useAuth();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [personalOpen, setPersonalOpen] = useState(false);
  const personalRef = useRef(null);

  // Close desktop dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (!personalRef.current?.contains(e.target)) {
        setPersonalOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMenuOpen(false);
    setPersonalOpen(false);
  }, [location.pathname]);

  // Lock body scroll when full-page mobile overlay menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [menuOpen]);

  // Animation variants
  const desktopDropdownAnim = {
    hidden: { opacity: 0, scale: 0.95, y: -8 },
    visible: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: -8 },
  };

  const overlayContainerAnim = {
    hidden: { opacity: 0, y: "-100%" },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: "-100%" },
  };

  const overlayListAnim = {
    visible: {
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const overlayItemAnim = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <>
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 w-full bg-black/70 backdrop-blur-2xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Logo onClick={() => window.scrollTo(0, 0)} />

          {/* Desktop Nav Items (lg screens and above) */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8 font-['Inter']">
            {routes.map((r) => (
              <NavLink
                key={r.name}
                to={r.link}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors duration-300 ${isActive ? "text-[#ff3130]" : "text-white/70 hover:text-white"
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
                  className="flex items-center gap-1.5 text-sm font-medium text-white/70 hover:text-white transition-colors py-1 px-2.5 rounded-lg hover:bg-white/5"
                >
                  <span>User</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-300 ${personalOpen ? "rotate-180 text-[#ff3130]" : ""
                      }`}
                  />
                </button>

                <AnimatePresence>
                  {personalOpen && (
                    <motion.div
                      variants={desktopDropdownAnim}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      className="absolute right-0 mt-2 w-52 py-2 rounded-xl bg-[#09090b]/95 backdrop-blur-2xl border border-white/10 shadow-2xl z-50 space-y-0.5"
                    >
                      {authRoutes.map((r) => {
                        const Icon = r.icon;
                        return (
                          <Link
                            key={r.name}
                            to={r.link}
                            onClick={() => setPersonalOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                          >
                            <Icon className="w-4 h-4 text-[#ff3130]" />
                            <span>{r.name}</span>
                          </Link>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {!loading && !authed && (
              <div className="flex items-center gap-3">
                <Link
                  to="/signin"
                  className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-white/80 border border-white/20 hover:border-white hover:text-white transition-all duration-300"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider bg-[#ff3130] text-white hover:bg-[#d42a29] transition-all duration-300 shadow-md shadow-[#ff3130]/20"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile & Tablet Hamburger Toggle Button (< lg screens) */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Open Navigation Menu"
              className=" text-white hover:text-white/90 active:scale-95 transition-all"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Full-Page Mobile Overlay Navigation Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            variants={overlayContainerAnim}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden fixed inset-0 z-50 bg-[#000000]/95 backdrop-blur-3xl flex flex-col justify-between overflow-y-auto"
          >
            {/* Top Bar of Overlay */}
            <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 h-16 flex items-center justify-between border-b border-white/10 shrink-0">
              <Logo onClick={() => setMenuOpen(false)} />
              <button
                onClick={() => setMenuOpen(false)}
                aria-label="Close Navigation Menu"
                className=" text-white hover:text-white/90 active:scale-95 transition-all"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Middle Nav Links Section */}
            <div className="px-6 sm:px-10 py-8 flex-1 flex flex-col justify-center max-w-xl w-full mx-auto space-y-8">
              <motion.ul
                variants={overlayListAnim}
                initial="hidden"
                animate="visible"
                className="space-y-4"
              >
                {routes.map((r) => {
                  const isActive = location.pathname === r.link;
                  return (
                    <motion.li key={r.name} variants={overlayItemAnim}>
                      <NavLink
                        to={r.link}
                        onClick={() => setMenuOpen(false)}
                        className={`group flex items-center justify-between text-2xl sm:text-3xl font-space-grotesk font-bold tracking-tight transition-all duration-300 ${isActive ? "text-[#ff3130]" : "text-white/80 hover:text-white"
                          }`}
                      >
                        <span className="flex items-center gap-3">
                          {isActive && <span className="w-2.5 h-2.5 rounded-full bg-[#ff3130]" />}
                          {r.name}
                        </span>
                        <ArrowRight className="w-5 h-5 opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 text-[#ff3130] transition-all duration-300" />
                      </NavLink>
                    </motion.li>
                  );
                })}
              </motion.ul>

              {/* Personal Section Collapsible on Mobile */}
              {!loading && authed && (
                <div className="pt-4 border-t border-white/10 space-y-3">
                  <button
                    onClick={() => setPersonalOpen((p) => !p)}
                    className="w-full flex items-center justify-between text-xl font-space-grotesk font-bold text-white/90"
                  >
                    <span className="flex items-center gap-2">
                      User
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 transition-transform duration-300 ${personalOpen ? "rotate-180 text-[#ff3130]" : ""
                        }`}
                    />
                  </button>

                  <AnimatePresence>
                    {personalOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden space-y-1.5 pl-4 border-l-2 border-[#ff3130]/30"
                      >
                        {authRoutes.map((r) => {
                          const Icon = r.icon;
                          const isActive = location.pathname === r.link;
                          return (
                            <Link
                              key={r.name}
                              to={r.link}
                              onClick={() => setMenuOpen(false)}
                              className={`flex items-center gap-3 py-2.5 text-base font-medium transition-colors ${isActive ? "text-[#ff3130]" : "text-white/70 hover:text-white"
                                }`}
                            >
                              <Icon className="w-4 h-4 text-[#ff3130]" />
                              <span>{r.name}</span>
                            </Link>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* CTA Buttons in Overlay if unauthenticated */}
              {!loading && !authed && (
                <div className="pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Link
                    to="/signin"
                    onClick={() => setMenuOpen(false)}
                    className="w-full py-3.5 rounded-xl border border-white/20 text-center font-space-grotesk font-bold text-sm text-white hover:bg-white/10 transition-all"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMenuOpen(false)}
                    className="w-full py-3.5 rounded-xl bg-[#ff3130] text-center font-space-grotesk font-bold text-sm text-white hover:bg-[#d42a29] transition-all shadow-lg shadow-[#ff3130]/30"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Footer info in Overlay */}
            <div className="p-6 text-center text-xs text-white/40 border-t border-white/10 shrink-0 font-mono">
              DAAN@KGP · DakshanA Alumni Network at IIT Kharagpur
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
