import { useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { NavbarLinks } from "../Navbar/JSFiles/NavbarData";
import { HiX } from "react-icons/hi"; // Close icon

const ResponsiveMenu = ({ showMenu, setShowMenu }) => {
  const menuRef = useRef(null);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setShowMenu]);

  return (
    <div
      ref={menuRef}
      className={`fixed top-0 bottom-0 z-20 h-[55vh] w-full px-8 pt-6 pb-6 flex flex-col justify-evenly shadow-md transition-all duration-300 md:hidden ${
        showMenu ? "left-0" : "-left-full"
      } bg-gray-50 text-gray-900 dark:bg-gray-800 dark:text-gray-400`}
    >
      {/* Close Button */}
      <button
        onClick={() => setShowMenu(false)}
        className="absolute top-4 right-4 p-2 pb-4 rounded-full text-gray-900 dark:text-gray-400 transition-all duration-300"
        aria-label="Close menu"
      >
        <HiX size={24} />
      </button>

      {/* Header Links (Dakshana + ERP) */}
      <div className="flex justify-between items-center mt-6">
        <a
          href="https://www.dakshana.org/"
          target="_blank"
          rel="noopener noreferrer"
          title="Dakshana Foundation"
          className="bg-gray-200 dark:bg-gray-700 p-1 rounded-lg border border-gray-300 dark:border-gray-600"
        >
          <img
            src="https://res.cloudinary.com/dcwwptwzt/image/upload/v1754520270/DakshanaLogo_ouuxyh.avif"
            alt="Dakshana Foundation"
            width="50"
            height="50"
          />
        </a>
        <a
          href="https://erp.iitkgp.ac.in/"
          target="_blank"
          rel="noopener noreferrer"
          title="ERP IIT Kharagpur"
          className="bg-gray-200 dark:bg-gray-700 w-[50px] h-[50px] flex justify-center items-center rounded-lg border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-400"
        >
          ERP
        </a>
      </div>

      {/* Navigation */}
      <nav className="mt-12">
        <ul className="space-y-4 text-xl">
          {NavbarLinks.map(({ name, link }) => (
            <li key={name}>
              <NavLink
                to={link}
                onClick={() => setShowMenu(false)}
                className={({ isActive }) =>
                  isActive
                    ? "text-red-500 dark:text-gray-200 font-semibold border-b-2 border-red-500 dark:border-gray-200 rounded-lg"
                    : "text-gray-700 dark:text-gray-400 hover:text-red-300 dark:hover:text-gray-300 transition-all"
                }
              >
                {name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default ResponsiveMenu;
