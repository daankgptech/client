import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEnvelope, FaLinkedin, FaArrowLeft } from "react-icons/fa";
import { MdAddCall } from "react-icons/md";
import { api } from "../../utils/Secure/api";

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
    return <p className="text-center mt-10">Loading...</p>;
  }

  if (!person) {
    return <p className="text-center mt-10">Member not found.</p>;
  }

  const primaryContact = person.contacts?.[0];

  return (
    <div className="min-h-screen w-full px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto p-6"
      >
        <button
          onClick={() => navigate(`/our-fam/${year}`)}
          className="mb-4 flex items-center gap-2 text-sm text-gray-600 hover:text-red-600"
        >
          <FaArrowLeft /> Back
        </button>

        <h1 className="text-3xl font-bold mb-4">{person.name}</h1>

        <div className="flex flex-wrap gap-6">
          {/* Left */}
          <div className="flex-1 min-w-[280px]">
            <p>
              <span className="font-semibold">Branch:</span> {person.branch}
            </p>
            <p>
              <span className="font-semibold">Hall:</span> {person.hall}
            </p>
            <p>
              <span className="font-semibold">Status:</span>{" "}
              {person.graduated ? "Alumni" : "Currently Enrolled"}
            </p>

            {/* Contacts */}
            {(primaryContact?.phone ||
              primaryContact?.email ||
              primaryContact?.linkedIn) && (
              <>
                <h2 className="mt-6 font-semibold">Contacts</h2>
                <div className="flex gap-4 mt-2">
                  {primaryContact?.phone && (
                    <a href={`tel:${primaryContact.phone}`}>
                      <MdAddCall className="text-2xl text-red-600 hover:scale-105" />
                    </a>
                  )}
                  {primaryContact?.email && (
                    <a href={`mailto:${primaryContact.email}`}>
                      <FaEnvelope className="text-2xl text-red-600 hover:scale-105" />
                    </a>
                  )}
                  {primaryContact?.linkedIn && (
                    <a
                      href={primaryContact.linkedIn}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <FaLinkedin className="text-2xl text-red-600 hover:scale-105" />
                    </a>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Right */}
          <div className="flex-1 min-w-[280px] flex justify-center">
            <img
              src={person.imgLink}
              alt={person.name}
              className="rounded-3xl w-64 h-64 object-cover border"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FamCardDetails;