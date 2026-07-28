import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaArrowLeft,
  FaWhatsapp,
} from "react-icons/fa";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import {
  LuCake,
  LuTimer,
  LuMilestone,
  LuMapPin,
  LuBuilding2,
  LuPhone,
  LuMail,
  LuGithub,
  LuLinkedin,
} from "react-icons/lu";
import { PiTreeStructure, PiBuildings } from "react-icons/pi";
import {
  MdOutlineTimeline,
} from "react-icons/md";
import { api } from "../../utils/Secure/api";
import { cache } from "../../utils/cache";
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
    
    const fetchDetails = async () => {
      setLoading(true);
      const cacheKey = `/our-fam/members/${name}`;
      try {
        const cached = cache.get(cacheKey);
        if (cached && typeof cached === 'object' && cached.name) {
          if (isMounted) setPerson(cached);
          if (isMounted) setLoading(false);
          return;
        }

        const res = await api.get(`/our-fam/members/${name} `);
        if (res.data && typeof res.data === 'object' && res.data.name) {
          if (isMounted) setPerson(res.data);
          cache.set(cacheKey, res.data, 10 * 60 * 1000);
        } else {
          throw new Error("Invalid data format received");
        }
      } catch (err) {
        console.error("Error fetching person details:", err);
        if (isMounted) setPerson(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDetails();

    return () => {
      isMounted = false;
    };
  }, [name]);

  if (loading) return <LoaderOverlay />;
  if (!person)
    return (
      <div className="h-screen flex items-center justify-center text-white/60 font-medium font-space-grotesk">
        Member not found.
      </div>
    );

  const primaryContact = person.contacts?.[0] || null;
  const personal = person.personalInfo || null;
  if (
    person.imgLink ===
    "https://res.cloudinary.com/dcwwptwzt/image/upload/v1747723143/Avatar_avs1qx.avif"
  )
    person.imgLink = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=fee2e2&color=991b1b`;
  const avatarUrl =
    person.imgLink ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name)}&background=fee2e2&color=991b1b&size=512`;

  const linkStyle =
    "flex items-center justify-start gap-2.5 text-sm text-white/70 hover:text-primary transition-colors duration-200";
  const pStyle =
    "flex items-center justify-start gap-2.5 text-sm text-white/60";

  return (
    <div className="min-h-screen transition-colors duration-300">
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
              className="max-h-[85vh] max-w-full border-[0.5px] border-white/20 shadow-2xl"
              alt={person.name}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <main className="px-4 md:container mx-auto py-6 md:py-10">
        <div className="w-full justify-start items-center mb-6">
          <button
            onClick={() => navigate(`/our-fam/${year}`)}
            className="group inline-flex items-center gap-2 text-xs font-medium text-white/60 hover:text-primary transition-colors"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            Back to Family Overview
          </button>
        </div>

        <div className="w-full flex flex-col justify-between items-center md:flex-row-reverse gap-8 lg:gap-12">
          {/* Sidebar: Image & Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full md:w-80"
          >
            <div
              onClick={() => setIsLightboxOpen(true)}
              className="relative group cursor-zoom-in overflow-hidden bg-transparent border-[0.5px] border-white/10 hover:border-white/20 transition-all duration-300"
            >
              <img
                src={avatarUrl}
                alt={person.name}
                className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                <span className="text-white text-xs font-medium font-space-grotesk bg-black/60 border-[0.5px] border-white/20 px-3 py-1.5">
                  View Full Image
                </span>
              </div>
            </div>

            <div className="mt-4 flex flex-col items-center gap-3">
              <span
                className={`px-4 py-1.5 text-xs font-medium font-space-grotesk border-[0.5px] flex items-center gap-1.5 ${
                  person.graduated
                    ? "bg-primary/90 text-white border-primary"
                    : "bg-primary/10 text-primary border-primary/20"
                }`}
              >
                {person.graduated && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                {person.graduated ? "Alumnus" : "Currently Enrolled"}
              </span>
            </div>
          </motion.div>

          {/* Content: Profile Details */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex-1 w-full"
          >
            <header className="mb-6">
              <h1 className="text-2xl md:text-4xl font-bold font-space-grotesk text-white tracking-tight mb-3">
                {person.name}
              </h1>
              {person.bio && (
                <p className="text-xs md:text-sm text-white/60 font-medium leading-relaxed italic border-l-2 border-primary/40 pl-4">
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
            <div className="p-5 md:p-6 bg-transparent border-[0.5px] border-white/10">
              <h4 className="text-xs font-bold font-space-grotesk uppercase tracking-[0.2em] text-primary mb-4">
                Details
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {personal?.dob && (
                  <p
                    className={pStyle}
                    title="Date Of Birth"
                    aria-label="Date Of Birth"
                  >
                    <LuCake size={18} className="text-primary shrink-0" />
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
                    <Droplet size={18} className="text-primary shrink-0" />
                    <span>{personal.bloodGroup}</span>
                  </p>
                )}
                <p className={pStyle} title="Branch" aria-label="Branch">
                  <PiTreeStructure size={18} className="text-primary shrink-0" />
                  <span>{person.branch}</span>
                </p>
                <p className={pStyle} title="Batch" aria-label="Batch">
                  <MdOutlineTimeline size={18} className="text-primary shrink-0" />
                  <span>{person.batch}</span>
                </p>
                <p className={pStyle} title="Hall" aria-label="Hall">
                  <HiOutlineOfficeBuilding size={18} className="text-primary shrink-0" />
                  <span>{person.hall}</span>
                </p>
                {person.course && (
                  <p className={pStyle} title="Course" aria-label="Course">
                    <LuTimer size={18} className="text-primary shrink-0" />
                    <span>{person.course}</span>
                  </p>
                )}
                <p className={pStyle} title="COE" aria-label="COE">
                  <PiBuildings size={18} className="text-primary shrink-0" />
                  <span className="truncate">{person.coe}</span>
                </p>
                {person.parentJNV && (
                  <p
                    className={pStyle}
                    title="Parent JNV"
                    aria-label="Parent JNV"
                  >
                    <LuMilestone size={18} className="text-primary shrink-0" />
                    <span className="truncate">{person.parentJNV}</span>
                  </p>
                )}
                {personal?.city && (
                  <p className={pStyle} title="City" aria-label="City">
                    <LuBuilding2 size={18} className="text-primary shrink-0" />
                    <span>{personal.city}</span>
                  </p>
                )}
                {personal?.state && (
                  <p className={pStyle} title="State" aria-label="State">
                    <LuMapPin size={18} className="text-primary shrink-0" />
                    <span>{personal.state}</span>
                  </p>
                )}
              </div>

              {primaryContact && (
                <>
                  <div className="my-6 border-t border-white/10" />
                  <h4 className="text-xs font-bold font-space-grotesk uppercase tracking-[0.2em] text-primary mb-4">
                    Connect
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {primaryContact?.phone && (
                      <Link
                        to={`tel:+91${primaryContact.phone}`}
                        className={linkStyle}
                      >
                        <LuPhone size={18} className="text-primary shrink-0" />
                        <span>+91{primaryContact.phone}</span>
                      </Link>
                    )}
                    {primaryContact?.email && (
                      <Link
                        to={`mailto:${primaryContact.email}`}
                        className={linkStyle}
                      >
                        <LuMail size={18} className="text-primary shrink-0" />
                        <span className="truncate">{primaryContact.email}</span>
                      </Link>
                    )}
                    {primaryContact?.github && (
                      <Link to={`${primaryContact.github}`} className={linkStyle}>
                        <LuGithub size={18} className="text-primary shrink-0" />
                        <span className="truncate">{primaryContact.github}</span>
                      </Link>
                    )}
                    {primaryContact?.linkedIn && (
                      <Link to={`${primaryContact.linkedIn}`} className={linkStyle}>
                        <LuLinkedin size={18} className="text-primary shrink-0" />
                        <span className="truncate">{primaryContact.linkedIn}</span>
                      </Link>
                    )}
                    {primaryContact?.phone && (
                      <Link
                        to={`https://wa.me/91${primaryContact.phone}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={linkStyle}
                      >
                        <FaWhatsapp size={18} className="text-primary shrink-0" />
                        <span>Chat on WhatsApp</span>
                      </Link>
                    )}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

// Sub-components
const Badge = ({ children }) => {
  return (
    <span className="px-3 py-1 text-[11px] font-medium font-space-grotesk border-[0.5px] border-white/15 bg-white/5 text-white/80">
      {children}
    </span>
  );
};

export default FamCardDetails;
