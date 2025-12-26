import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEnvelope, FaLinkedin, FaArrowLeft, FaGithub } from "react-icons/fa";
import { MdAddCall } from "react-icons/md";
import { api } from "../../utils/Secure/api";
import LoaderOverlay from "../../utils/LoaderOverlay";
import { h3 } from "framer-motion/client";

const FamCardDetails = () => {
  const navigate = useNavigate();
  const { year, id } = useParams();

  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get(`/our-fam/members/${id}`)
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
    <div
      className="min-h-screen w-full px-4 py-6 bg-gray-100
      dark:bg-gray-900 container
      transition-all duration-500 ease-out
     p-6 md:p-8"
    >
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
        <div className="bg-transparent">
          <div className="flex flex-wrap-reverse items-center justify-center gap-6 md:gap-0 ">
            {/* Main Info */}
            <div className="w-full md:w-2/3 flex flex-col justify-center items-start container ">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
                {person.name}
              </h1>
              {person.bio && (
                <p className="text-sm italic mb-6 mt-1">- {person.bio}</p>
              )}
              {person.involvements.map((inv, idx) => (
                <motion.div key={idx} className="bg-transparent ">
                  <ul className="flex flex-wrap justify-center md:justify-start gap-2 text-sm">
                    {inv.soc && (
                      <li className="px-3 py-1 rounded-3xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400">
                        {inv.soc}
                      </li>
                    )}
                    {inv.involvementsHall && (
                      <li className="px-3 py-1 rounded-3xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                        {inv.involvementsHall}
                      </li>
                    )}
                    {inv.council && (
                      <li className="px-3 py-1 rounded-3xl bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400">
                        {inv.council}
                      </li>
                    )}
                    {inv.iit && (
                      <li className="px-3 py-1 rounded-3xl bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400">
                        {inv.iit}
                      </li>
                    )}
                    {inv.extra && (
                      <li className="px-3 py-1 rounded-3xl bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400">
                        {inv.extra}
                      </li>
                    )}
                  </ul>
                </motion.div>
              ))}
              <div className="flex flex-col justify-start items-start p-0 mt-6  gap-2 ">
                <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  Details
                </h1>
                <div className="flex flex-col justify-center md:justify-start gap-1 text-sm">
                  <p>
                    <span className="font-semibold">Gender: </span>
                    <span
                      className={`px-3 py-1 rounded-full ${
                        person.gender === "Female"
                          ? "bg-pink-100 text-pink-600 dark:bg-pink-900/20 dark:text-pink-400"
                          : "bg-sky-100 text-sky-600 dark:bg-sky-900/20 dark:text-sky-400"
                      }`}
                    >
                      {" "}
                      {person.gender}
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold">Branch: </span>
                    {person.branch}
                  </p>
                  {person.hall && (
                    <p>
                      <span className="font-semibold">Hall: </span>
                      {person.hall}
                    </p>
                  )}
                  <p>
                    <span className="font-semibold">Batch: </span>
                    {person.batch}
                  </p>
                  {person.course && (
                    <p>
                      <span className="font-semibold">Course: </span>
                      {person.course}
                    </p>
                  )}
                  {person.coe && (
                    <p>
                      <span className="font-semibold">COE: </span>
                      {person.coe}
                    </p>
                  )}
                  <span className="italic font-semibold">
                    {person.graduated ? "*Graduated*" : "*Currently Enrolled*"}
                  </span>
                </div>
              </div>

              {/* Contacts */}
              {(primaryContact?.phone ||
                primaryContact?.email ||
                primaryContact?.linkedIn ||
                primaryContact?.github) && (
                <div className="mt-6 flex justify-center flex-col items-start gap-2">
                  <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    Contacts
                  </h1>
                  <div className="flex justify-center md:justify-start gap-5">
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
                </div>
              )}
            </div>
            {/* Image */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex justify-center  w-full md:w-1/3"
            >
              <img
                src={
                  person.imgLink ||
                  "https://res.cloudinary.com/dcwwptwzt/image/upload/v1747723143/Avatar_avs1qx.avif"
                }
                alt={person.name}
                onError={(e) => {
                  e.currentTarget.src =
                    "https://res.cloudinary.com/dcwwptwzt/image/upload/v1747723143/Avatar_avs1qx.avif";
                }}
                className="w-48 h-48 md:w-56 md:h-56 rounded-3xl object-cover border border-gray-300 dark:border-gray-700"
              />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FamCardDetails;
