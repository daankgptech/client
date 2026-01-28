import { useNavigate, useParams } from "react-router-dom";
import { FaLinkedin, FaEnvelope, FaGraduationCap } from "react-icons/fa";
import { MdAddCall } from "react-icons/md";
import { motion } from "framer-motion";

const FamCard = ({ _id, imgLink, name, branch, hall, contacts, graduated }) => {
  const navigate = useNavigate();
  const { year } = useParams();
  const primaryContact = contacts?.[0];
  return (
    <motion.div
      onClick={() => navigate(`/our-fam/${year}/${encodeURIComponent(name)}`)}
      whileHover={{ scale: 1.01 }}
      className="relative flex flex-col justify-around items-center p-2 md:p-3 lg:p-4 border
                 border-gray-300 dark:border-gray-700
                 bg-gradient-to-br from-rose-100 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900
                 rounded-3xl gap-1 md:gap-2 shadow-sm
                 transition-all duration-300 ease-out
      hover:translate-y-2
      hover:shadow-xl hover:shadow-rose-200/50
      dark:hover:shadow-red-900/30 group cursor-pointer"
    >
      {/* Graduation Indicator */}
      <div
        className="absolute top-2 right-2 transition-all duration-300"
        title={graduated ? "Graduated" : "Currently Enrolled"}
      >
        <FaGraduationCap
          className={`text-xl md:text-2xl ${
            graduated ? "text-black dark:text-gray-400" : "text-transparent"
          }`}
        />
      </div>

      {/* Profile Image */}
      <img
        title={`${name}'s Image`}
        src={imgLink || "https://res.cloudinary.com/dcwwptwzt/image/upload/v1747723143/Avatar_avs1qx.avif"}
        alt={name}
        loading="lazy"
        className="rounded-3xl border border-gray-400 dark:border-gray-600 aspect-square object-cover"
      />

      {/* Name */}
      <h1
        className="text-lg md:text-xl font-semibold md:font-bold
                     bg-clip-text text-transparent
                     bg-gradient-to-tr from-red-900 dark:from-gray-600
                     to-orange-600 dark:to-gray-200 text-center"
      >
        {name}
      </h1>

      {/* Branch & Hall */}
      <div className="flex justify-between items-center gap-4 w-full">
        <p className="text-sm md:text-lg text-gray-900 dark:text-gray-400">
          {branch}
        </p>
        <p className="text-sm md:text-lg text-gray-900 dark:text-gray-400">
          {hall}
        </p>
      </div>

      {/* Social Icons */}
      <div className="flex justify-evenly items-center gap-2 md:gap-4 w-full border-t border-gray-300 dark:border-gray-600 pt-2 md:pt-3">
        {primaryContact?.phone && (
          <div className="relative inline-block">
            <a
              // href={`tel:${primaryContact.phone}`}
              title="Call"
              className="peer"
              // onClick={(e) => e.stopPropagation()}
            >
              <MdAddCall
                className="text-lg md:text-xl lg:text-2xl
                                   text-red-700 dark:text-gray-400
                                   hover:scale-[1.10] hover:text-red-500
                                   transition-all duration-300"
              />
            </a>
            {/* // hover tooltip */}
            <div className=" pointer-events-none absolute -right-4 -top-1 w-56 opacity-0 scale-95 peer-hover:opacity-100 peer-hover:scale-100 transition-all duration-500 ease-out rounded-2xl bg-gray-300 dark:bg-slate-900 border border-white dark:border-slate-800 px-2 py-1 text-xs leading-relaxed text-gray-900 dark:text-gray-300 shadow-xl z-50 ">
            See bottom-left corner for VCF.
            </div>
          </div>
        )}

        {primaryContact?.email && (
          <a
            href={`mailto:${primaryContact.email}`}
            title="E-Mail"
            onClick={(e) => e.stopPropagation()}
          >
            <FaEnvelope
              className="text-lg md:text-xl lg:text-2xl
                                   text-red-700 dark:text-gray-400
                                   hover:scale-[1.10] hover:text-red-500
                                   transition-all duration-300"
            />
          </a>
        )}
        {primaryContact?.linkedIn && (
          <a
            href={primaryContact.linkedIn}
            target="_blank"
            rel="noopener noreferrer"
            title="LinkedIn"
            onClick={(e) => e.stopPropagation()}
          >
            <FaLinkedin
              className="text-lg md:text-xl lg:text-2xl
                                   text-red-700 dark:text-gray-400
                                   hover:scale-[1.10] hover:text-red-500
                                   transition-all duration-300"
            />
          </a>
        )}
      </div>
    </motion.div>
  );
};

export default FamCard;
