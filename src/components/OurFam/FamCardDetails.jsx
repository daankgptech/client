import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowLeft, FaArrowRight, FaEnvelope, FaLinkedin } from "react-icons/fa";
import batchDataMap from "./JSFiles/BatchDataMap";

const FamCardDetails = () => {
  const navigate = useNavigate();
  const { year, id } = useParams();

  const fullYear = 2000 + Number(year);
  const batch = batchDataMap[fullYear];

  if (!batch) {
    return <p className="text-center mt-10">Invalid year.</p>;
  }

  const data = batch.data;
  const index = data.findIndex(
  (item, i) => String(item.id ?? i) === id
);

  if (index === -1) {
    return <p className="text-center mt-10">Member not found.</p>;
  }

  const person = data[index];
  const prevPerson = data[index - 1];
  const nextPerson = data[index + 1];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex justify-center items-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-gray-200 dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
      >
        <h1 className="text-2xl font-bold text-center mb-6">
          {person.name}
        </h1>

        <img
          src={person.img}
          alt={person.name}
          className="rounded-xl mx-auto mb-6 border"
        />

        <div className="text-center space-y-2">
          <p><b>Branch:</b> {person.branch}</p>
          <p><b>Hall:</b> {person.hall}</p>
        </div>

        <div className="flex justify-center gap-6 mt-6">
          {person.mail && (
            <a href={`mailto:${person.mail}`}>
              <FaEnvelope className="text-2xl text-red-600 hover:text-rose-500" />
            </a>
          )}
          {person.linkedIn && (
            <a href={person.linkedIn} target="_blank" rel="noreferrer">
              <FaLinkedin className="text-2xl text-red-600 hover:text-rose-500" />
            </a>
          )}
        </div>

        <div className="flex justify-between mt-8">
          <button
            disabled={!prevPerson}
            onClick={() => navigate(`/our-fam/${year}/${prevPerson.id ?? index - 1}`)}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-rose-300 disabled:opacity-40"
          >
            <FaArrowLeft />
          </button>

          <button
            onClick={() => navigate(`/our-fam/${year}`)}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-rose-300"
          >
            Back
          </button>

          <button
            disabled={!nextPerson}
            onClick={() => navigate(`/our-fam/${year}/${nextPerson.id ?? index + 1}`)}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-rose-300 disabled:opacity-40"
          >
            <FaArrowRight />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default FamCardDetails;