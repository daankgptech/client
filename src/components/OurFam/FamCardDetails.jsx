import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEnvelope, FaLinkedin, FaArrowLeft, FaGithub } from "react-icons/fa";
import { MdAddCall } from "react-icons/md";
import { api } from "../../utils/Secure/api";
import LoaderOverlay from "../../utils/LoaderOverlay";

const FamCardDetails = () => {
  const navigate = useNavigate();
  const { year, id } = useParams();

  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get(`/members/${id}`)
      .then((res) => setPerson(res.data))
      .catch(() => setPerson(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <LoaderOverlay />;
  }

  if (!person) {
    return <p className="text-center mt-10">Member not found.</p>;
  }

  const primaryContact =
    Array.isArray(person.contacts) && person.contacts.length > 0
      ? person.contacts[0]
      : null;

  return (
    <div className="min-h-screen w-full px-4 py-6 bg-gray-50 dark:bg-gray-950">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-6xl mx-auto"
      >
        {/* Back */}
        <button
          onClick={() => navigate(`/our-fam/${year}`)}
          className="mb-6 flex items-center gap-2 text-sm text-gray-500 hover:text-rose-500 transition"
        >
          <FaArrowLeft /> Back
        </button>

        {/* Profile Card */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {/* Image */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex justify-center"
            >
              <img
                src={person.imgLink || "https://res.cloudinary.com/dcwwptwzt/image/upload/v1747723143/Avatar_avs1qx.avif"}
                alt={person.name}
                onError={(e) => {
                  e.currentTarget.src = "https://res.cloudinary.com/dcwwptwzt/image/upload/v1747723143/Avatar_avs1qx.avif";
                }}
                className="w-48 h-48 md:w-56 md:h-56 rounded-3xl object-cover border border-gray-300 dark:border-gray-700"
              />
            </motion.div>

            {/* Main Info */}
            <div className="md:col-span-2 text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
                {person.name}
              </h1>

              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {person.branch} · {person.course}
              </p>

              <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-3 text-sm">
                <span className="px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400">
                  Batch {person.batch}
                </span>
                <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                  Hall {person.hall}
                </span>
                <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                  {person.graduated ? "Alumni" : "Currently Enrolled"}
                </span>
              </div>

              {/* Contacts */}
              {(primaryContact?.phone ||
                primaryContact?.email ||
                primaryContact?.linkedIn ||
                primaryContact?.github) && (
                <div className="mt-6 flex justify-center md:justify-start gap-5">
                  {primaryContact?.phone && (
                    <a href={`tel:${primaryContact.phone}`}>
                      <MdAddCall className="text-2xl text-gray-500 hover:text-rose-500 transition hover:scale-110" />
                    </a>
                  )}
                  {primaryContact?.email && (
                    <a href={`mailto:${primaryContact.email}`}>
                      <FaEnvelope className="text-2xl text-gray-500 hover:text-rose-500 transition hover:scale-110" />
                    </a>
                  )}
                  {primaryContact?.linkedIn && (
                    <a
                      href={primaryContact.linkedIn}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <FaLinkedin className="text-2xl text-gray-500 hover:text-rose-500 transition hover:scale-110" />
                    </a>
                  )}
                  {primaryContact?.github && (
                    <a
                      href={primaryContact.github}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <FaGithub className="text-2xl text-gray-500 hover:text-rose-500 transition hover:scale-110" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bio */}
        {person.bio && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-8 bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-6"
          >
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
              About
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {person.bio}
            </p>
          </motion.div>
        )}

        {/* Involvements */}
        {person.involvements?.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Involvements
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {person.involvements.map((inv, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -4 }}
                  className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5"
                >
                  <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    {inv.soc && (
                      <li>
                        <span className="font-medium">Society:</span> {inv.soc}
                      </li>
                    )}
                    {inv.involvementsHall && (
                      <li>
                        <span className="font-medium">Hall:</span>{" "}
                        {inv.involvementsHall}
                      </li>
                    )}
                    {inv.council && (
                      <li>
                        <span className="font-medium">Council:</span>{" "}
                        {inv.council}
                      </li>
                    )}
                    {inv.iit && (
                      <li>
                        <span className="font-medium">Institute:</span>{" "}
                        {inv.iit}
                      </li>
                    )}
                    {inv.extra && (
                      <li>
                        <span className="font-medium">Extra:</span> {inv.extra}
                      </li>
                    )}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default FamCardDetails;
