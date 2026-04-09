import React, { useEffect, useState, memo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaEnvelope,
  FaLinkedin,
  FaArrowLeft,
  FaGithub,
  FaGraduationCap,
} from "react-icons/fa";
import { MdAddCall } from "react-icons/md";
import { api } from "../../utils/Secure/api";
import LoaderOverlay from "../../utils/LoaderOverlay";
import { Helmet } from "react-helmet-async";

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
  if (
    person.imgLink ==
    "https://res.cloudinary.com/dcwwptwzt/image/upload/v1747723143/Avatar_avs1qx.avif"
  )
    person.imgLink = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=fee2e2&color=991b1b`;
  const avatarUrl =
    person.imgLink ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name)}&background=fee2e2&color=991b1b&size=512`;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 transition-colors duration-500">
      <Helmet>
        <title>{`${person.name} | DAAN KGP`}</title>
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

      <main className="max-w-4xl mx-auto px-6 py-10 md:py-16">
        {/* Navigation */}
        <button
          onClick={() => navigate(`/our-fam/${year}`)}
          className="group mb-10 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-rose-500 transition-colors"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          Back
        </button>

        <div className="flex flex-col md:flex-row gap-10 lg:gap-16">
          {/* Sidebar: Image & Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full md:w-72"
          >
            <div
              onClick={() => setIsLightboxOpen(true)}
              className="relative group cursor-zoom-in overflow-hidden rounded-[2rem] bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 transition-all hover:shadow-xl"
            >
              <img
                src={avatarUrl}
                alt={person.name}
                className="w-full aspect-square object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-[10px] font-bold uppercase tracking-widest bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-sm">
                  View Full
                </span>
              </div>
            </div>

            <div className="mt-6 flex flex-col items-center gap-3">
              <span
                className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
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
            <header className="mb-8">
              <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white tracking-tight mb-3">
                {person.name}
              </h1>
              {person.bio && (
                <p className="text-base md:text-lg text-gray-500 dark:text-gray-400 font-medium leading-relaxed italic border-l-2 border-rose-200 dark:border-rose-900/50 pl-4">
                  {person.bio}
                </p>
              )}
            </header>

            {/* Badges Section */}
            <div className="flex flex-wrap gap-2 mb-10">
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

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-8 mb-12">
              <InfoItem label="Branch" value={person.branch} />
              <InfoItem label="Batch" value={person.batch} />
              <InfoItem label="Hall" value={person.hall} />
              <InfoItem label="Course" value={person.course} />
              <InfoItem label="COE" value={person.coe} />
              <InfoItem label="Parent JNV" value={person.parentJNV} />
            </div>

            {/* Footer Connect */}
            <div className="pt-8 border-t border-gray-100 dark:border-gray-900">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-6">
                Connect
              </h4>
              <div className="flex gap-4">
                <SocialIcon
                  icon={<MdAddCall size={18} />}
                  title="VCF Info"
                  isSpecial
                />
                {primaryContact?.email && (
                  <SocialIcon
                    icon={<FaEnvelope size={16} />}
                    href={`mailto:${primaryContact.email}`}
                  />
                )}
                {primaryContact?.linkedIn && (
                  <SocialIcon
                    icon={<FaLinkedin size={16} />}
                    href={primaryContact.linkedIn}
                    external
                  />
                )}
                {primaryContact?.github && (
                  <SocialIcon
                    icon={<FaGithub size={16} />}
                    href={primaryContact.github}
                    external
                  />
                )}
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

const InfoItem = ({ label, value }) => {
  if (!value) return null;
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
        {label}
      </p>
      <p className="text-sm md:text-base font-medium text-gray-700 dark:text-gray-200">
        {value}
      </p>
    </div>
  );
};

const SocialIcon = ({ icon, href, external, isSpecial }) => {
  const Tag = href ? "a" : "button";
  return (
    <div className="group/tool relative">
      <Tag
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className="flex items-center justify-center w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all border border-transparent hover:border-rose-100 dark:hover:border-rose-900/50"
      >
        {icon}
      </Tag>
      {isSpecial && (
        <span className="absolute -top-10 left-1/2 -translate-x-1/2 scale-0 group-hover/tool:scale-100 transition-all bg-gray-900 text-white text-[9px] font-bold px-2 py-1 rounded-md whitespace-nowrap shadow-xl">
          Check bottom-left for VCF
        </span>
      )}
    </div>
  );
};

export default FamCardDetails;
