import React, { useEffect, useState, memo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaEnvelope,
  FaLinkedin,
  FaArrowLeft,
  FaGithub,
  FaGraduationCap,
  FaWhatsapp,
} from "react-icons/fa";
import { HiOutlineOfficeBuilding, HiOutlineHashtag } from "react-icons/hi";
import {
  LuCalendarDays,
  LuCake,
  LuTimer,
  LuMilestone,
  LuMapPin,
  LuBuilding2,
  LuMap,
  LuPhone,
  LuMail,
  LuGithub,
  LuLinkedin,
} from "react-icons/lu";
import { PiTreeStructure, PiBuildings } from "react-icons/pi";
import {
  MdAddCall,
  MdEmail,
  MdOutlineTimeline,
  MdOutlineBed,
  MdBloodtype,
} from "react-icons/md";
import { api } from "../../utils/Secure/api";
import LoaderOverlay from "../../utils/LoaderOverlay";
import { Helmet } from "react-helmet-async";
import { Droplet } from "lucide-react";

const FamCardDetails = () => {
  const navigate = useNavigate();
  const { year, name } = useParams();
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    api
      .get(`/our-fam/members/${name}`)
      .then((res) => {
        if (isMounted) setPerson(res.data);
      })
      .catch(() => {
        if (isMounted) setPerson(null);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [name]);

  if (loading) return <LoaderOverlay />;
  if (!person)
    return (
      <div className="h-screen flex items-center justify-center dark:text-white font-medium">
        Member not found.
      </div>
    );

  const primaryContact = person.contacts?.[0] || null;
  const personal = person.personalInfo || null;
  if (
    person.imgLink ==
    "https://res.cloudinary.com/dcwwptwzt/image/upload/v1747723143/Avatar_avs1qx.avif"
  )
    person.imgLink = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=fee2e2&color=991b1b`;
  const avatarUrl =
    person.imgLink ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name)}&background=fee2e2&color=991b1b&size=512`;
  const linkStyle =
    "flex items-center justify-start gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-rose-600 dark:hover:text-red-400 transition-colors duration-300";
  const pStyle =
    "flex items-center justify-start gap-2 text-sm text-gray-600 dark:text-gray-400";
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 transition-colors duration-500">
      <Helmet>
        <title>{`${person.name} | ${person.branch} | ${person.batch} | DAAN KGP`}</title>
      </Helmet>

      {/* Lightbox */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsLightboxOpen(false)}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md cursor-zoom-out"
          >
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={avatarUrl}
              className="max-h-[85vh] max-w-full rounded-3xl shadow-2xl border border-white/10"
              alt={person.name}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <main className="px-0 md:container mx-auto py-6 md:py-10">
        <div className="w-full justify-start items-center px-4">
          <button
            onClick={() => navigate(`/our-fam/${year}`)}
            className="group mb-4 flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-rose-500 transition-colors"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            Back
          </button>
        </div>

        <div className="w-full container flex flex-col justify-between items-center md:flex-row-reverse gap-10 lg:gap-16">
          {/* Sidebar: Image & Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full md:w-72 px-6"
          >
            <div
              onClick={() => setIsLightboxOpen(true)}
              className="relative group cursor-zoom-in overflow-hidden rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 transition-all hover:shadow-xl"
            >
              <img
                src={avatarUrl}
                alt={person.name}
                className="w-full aspect-square object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-[10px] font-semibold bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-sm">
                  View Full
                </span>
              </div>
            </div>

            <div className="mt-3 flex flex-col items-center gap-3">
              <span
                className={`px-4 py-1.5 rounded-full text-xs font-semibold border ${
                  person.graduated
                    ? "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-400"
                    : "bg-rose-50 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900/30 text-rose-500"
                }`}
              >
                {person.graduated ? "Alumnus" : "Currently Enrolled"}
              </span>
            </div>
          </motion.div>

          {/* Content: Profile Details */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex-1"
          >
            <header className="mb-6">
              <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white tracking-tight mb-3">
                {person.name}
              </h1>
              {person.bio && (
                <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed italic border-l-2 border-rose-200 dark:border-rose-900/50 pl-4">
                  {person.bio}
                </p>
              )}
            </header>
            <div className="flex flex-wrap gap-2 mb-6">
              {person.involvements?.map((inv, idx) => (
                <React.Fragment key={idx}>
                  {inv.soc && <Badge color="rose">{inv.soc}</Badge>}
                  {inv.involvementsHall && (
                    <Badge color="blue">{inv.involvementsHall}</Badge>
                  )}
                  {inv.council && <Badge color="green">{inv.council}</Badge>}
                  {inv.iit && <Badge color="purple">{inv.iit}</Badge>}
                  {inv.extra && <Badge color="yellow">{inv.extra}</Badge>}
                </React.Fragment>
              ))}
            </div>
            <div className="p-2 md:p-4 lg:p-6 rounded-lg border-t border-gray-100 dark:border-gray-900 bg-gray-100 md:bg-white dark:bg-gray-950 dark:md:bg-gray-900 ">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-300 mb-4">
                Details
              </h4>
              <div className="grid grid-cols-2 gap-2 md:gap-3 lg:gap-4">
                {personal?.dob && (
                  <p
                    className={pStyle}
                    title="Date Of Birth"
                    aria-label="Date Of Birth"
                  >
                    <LuCake size={18} />
                    <span>
                      {personal?.dob
                        ? new Date(personal.dob).toLocaleString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "Not Added"}
                    </span>
                  </p>
                )}
                {personal?.bloodGroup && (
                  <p
                    className={pStyle}
                    title="Blood Group"
                    aria-label="Blood Group"
                  >
                    <Droplet size={18} />
                    <span>{personal.bloodGroup}</span>
                  </p>
                )}
                <p className={pStyle} title="Branch" aria-label="Branch">
                  <PiTreeStructure size={18} />
                  <span>{person.branch}</span>
                </p>
                <p className={pStyle} title="Batch" aria-label="Batch">
                  <MdOutlineTimeline size={18} />
                  <span>{person.batch}</span>
                </p>
                <p className={pStyle} title="Hall" aria-label="Hall">
                  <HiOutlineOfficeBuilding size={18} />
                  <span>{person.hall}</span>
                </p>
                <p className={pStyle} title="Course" aria-label="Course">
                  <LuTimer size={18} />
                  <span>{person.course}</span>
                </p>
                <p className={pStyle} title="COE" aria-label="COE">
                  <PiBuildings size={18} />
                  <span className="truncate">{person.coe}</span>
                </p>
                <p
                  className={pStyle}
                  title="Parent JNV"
                  aria-label="Parent JNV"
                >
                  <LuMilestone size={18} />
                  <span className="truncate">{person.parentJNV}</span>
                </p>
                {personal?.city && (
                  <p className={pStyle} title="City" aria-label="City">
                    <LuBuilding2 size={18} />
                    <span>{personal.city}</span>
                  </p>
                )}
                {personal?.state && (
                  <p className={pStyle} title="State" aria-label="State">
                    <LuMapPin size={18} />
                    <span>{personal.state}</span>
                  </p>
                )}
              </div>
              <h4 className="mt-6 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-300 mb-4">
                Connect
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 lg:gap-4">
                <Link
                  to={`tel:+91${primaryContact.phone}`}
                  className={linkStyle}
                >
                  <LuPhone size={18} />
                  <span>+91{primaryContact.phone}</span>
                </Link>
                {primaryContact?.email && (
                  <Link
                    to={`mailto:${primaryContact.email}`}
                    className={linkStyle}
                  >
                    <LuMail size={18} />
                    <span className="truncate">{primaryContact.email}</span>
                  </Link>
                )}
                {primaryContact?.github && (
                  <Link to={`${primaryContact.github}`} className={linkStyle}>
                    <LuGithub size={18} />
                    <span className="truncate">{primaryContact.github}</span>
                  </Link>
                )}
                {primaryContact?.linkedIn && (
                  <Link to={`${primaryContact.linkedIn}`} className={linkStyle}>
                    <LuLinkedin size={18} />
                    <span className="truncate">{primaryContact.linkedIn}</span>
                  </Link>
                )}
                <Link
                  to={`https://wa.me/91${primaryContact.phone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkStyle}
                >
                  <FaWhatsapp size={18} />
                  <span>Chat on WhatsApp</span>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

// Sub-components
const Badge = ({ children, color }) => {
  const styles = {
    rose: "bg-rose-50/50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400 border-rose-100/50 dark:border-rose-900/20",
    blue: "bg-blue-50/50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400 border-blue-100/50 dark:border-blue-900/20",
    green:
      "bg-green-50/50 text-green-600 dark:bg-green-950/20 dark:text-green-400 border-green-100/50 dark:border-green-900/20",
    purple:
      "bg-purple-50/50 text-purple-600 dark:bg-purple-950/20 dark:text-purple-400 border-purple-100/50 dark:border-purple-900/20",
    yellow:
      "bg-yellow-50/50 text-yellow-600 dark:bg-yellow-950/20 dark:text-yellow-400 border-yellow-100/50 dark:border-yellow-900/20",
  };
  return (
    <span
      className={`px-3 py-1 rounded-full text-[11px] font-semibold border ${styles[color]}`}
    >
      {children}
    </span>
  );
};
export default FamCardDetails;
