import { Link } from "react-router-dom";
import {
  FaLongArrowAltRight,
  FaRegCopyright
} from "react-icons/fa";
import { IoIosMail } from "react-icons/io";
import {
  LuFacebook,
  LuHome,
  LuInstagram,
  LuLinkedin
} from "react-icons/lu";
import { Logo } from "../Navbar/Navbar";

const FooterLinks = [
  { title: "Our Fam", link: "/our-fam" },
  { title: "Toolkit", link: "/toolkit" },
  { title: "Forms", link: "/forms" },
  { title: "Events", link: "/events" },
  { title: "Academic Stars", link: "/academic-stars" },
];

const SocialLinks = [
  { href: "https://www.dakshana.org/dakshana-alumni/", title: "Dakshana Home", icon: <LuHome /> },
  { href: "https://www.instagram.com/daan.official1", title: "Instagram", icon: <LuInstagram /> },
  { href: "https://www.facebook.com/share/g/1HgK8eLe43/", title: "Facebook", icon: <LuFacebook /> },
  { href: "https://www.linkedin.com/company/dakshana-alumni-network-daan/", title: "LinkedIn", icon: <LuLinkedin /> },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-black border-t border-gray-100 dark:border-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-8 md:py-10 lg:py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 lg:gap-12">

          {/* Brand Section */}
          <div className="flex justify-center items-start flex-col md:col-span-4 space-y-4">
            <Logo />
            <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400 max-w-xs">
              Connecting Dakshana scholars and alumni at IIT Kharagpur for mentorship,
              career support, and social impact.
            </p>
            <div className="flex gap-4 pt-2">
              {SocialLinks.map(({ href, title, icon }) => (
                <a
                  key={title}
                  href={href}
                  aria-label={title}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg text-gray-400 hover:text-red-500 dark:hover:text-rose-400 transition-all duration-200"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-4 lg:pl-12">
            <h2 className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 dark:text-gray-500 mb-5">
              Navigation
            </h2>
            <ul className="grid grid-cols-2 gap-2">
              {FooterLinks.map(({ title, link }) => (
                <li key={title}>
                  <Link
                    to={link}
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="group flex items-center gap-2 text-[13px] text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-rose-400 transition-colors"
                  >
                    <FaLongArrowAltRight className="text-[10px] opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                    {title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Section */}
          <div className="md:col-span-4">
            <h2 className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 dark:text-gray-500 mb-5">
              Reach Out
            </h2>
            <div className="space-y-3">
              <a
                href="mailto:daan.kgp.tech@gmail.com"
                className="flex items-center gap-3 text-[13px] text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-rose-400 transition-all"
              >
                <IoIosMail className="text-base" />
                <span>daan.kgp.tech@gmail.com</span>
              </a>
              <a
                href="mailto:cr.daan.kgp@gmail.com"
                className="flex items-center gap-3 text-[13px] text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-rose-400 transition-all"
              >
                <IoIosMail className="text-base" />
                <span>cr.daan.kgp@gmail.com</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-6 pt-8 border-t border-gray-100 dark:border-gray-900 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-gray-400">
          <div className="flex items-center gap-1.5">
            <FaRegCopyright />
            <span>{currentYear}</span>
            <span>DAAN KGP</span>
            <span className="hidden md:inline mx-1">|</span>
            <span>All rights reserved.</span>
          </div>

          <div className="flex gap-3">
            <Link to="/before" className="hover:text-gray-900 dark:hover:text-gray-200 transition-colors">Before</Link>
            <Link to="/after" className="hover:text-gray-900 dark:hover:text-gray-200 transition-colors">After</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;