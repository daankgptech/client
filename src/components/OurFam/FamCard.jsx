import { useNavigate, useParams } from "react-router-dom";
import { FaLinkedin, FaEnvelope, FaGraduationCap } from "react-icons/fa";
import { MdAddCall } from "react-icons/md";
import { motion } from "framer-motion";

const FamCard = ({
  id,
  img,
  name,
  branch,
  hall,
  mail,
  linkedIn,
  graduated,
  contacts,
}) => {
  const navigate = useNavigate();
  const { year } = useParams();

  return (
    <motion.div
      onClick={() => navigate(`/our-fam/${year}/${id}`)}
      whileHover={{ scale: 1.01 }}
      className="relative flex flex-col justify-around items-center p-2 md:p-3 lg:p-4
                 border border-gray-400 dark:border-gray-900
                 bg-gradient-to-tr from-gray-100 dark:from-gray-700
                 to-gray-200 dark:to-gray-800
                 rounded-2xl gap-1 md:gap-2 shadow-sm
                 hover:shadow-red-200 dark:hover:shadow-gray-500
                 transition-all duration-300 group cursor-pointer"
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
        src={img}
        alt={name}
        loading="lazy"
        className="rounded-lg border border-gray-400 dark:border-gray-600"
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
        {contacts?.phone && (
          <a
            href={`tel:${contacts.phone}`}
            title="Call"
            onClick={(e) => e.stopPropagation()}
          >
            <MdAddCall
              className="text-lg md:text-xl lg:text-2xl
                                   text-red-700 dark:text-gray-400
                                   hover:scale-[1.10] hover:text-red-500
                                   transition-all duration-300"
            />
          </a>
        )}
        {contacts?.mail && (
          <a
            href={`mailto:${contacts.mail}`}
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
        {contacts?.linkedIn && (
          <a
            href={contacts.linkedIn}
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
