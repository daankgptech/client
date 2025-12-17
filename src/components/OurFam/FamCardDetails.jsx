import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaArrowLeft,
  FaArrowRight,
  FaEnvelope,
  FaLinkedin,
} from "react-icons/fa";
import batchDataMap from "./JSFiles/BatchDataMap";
import { MdAddCall } from "react-icons/md";

const FamCardDetails = () => {
  const navigate = useNavigate();
  const { year, id } = useParams();

  const fullYear = 2000 + Number(year);
  const batch = batchDataMap[fullYear];

  if (!batch) {
    return <p className="text-center mt-10">Invalid year.</p>;
  }

  const data = batch.data;
  const index = data.findIndex((item, i) => String(item.id ?? i) === id);

  if (index === -1) {
    return <p className="text-center mt-10">Member not found.</p>;
  }

  const person = data[index];
  const prevPerson = data[index - 1];
  const nextPerson = data[index + 1];

  return (
    <div className="min-h-screen min-w-full bg-transparent flex justify-start items-start px-4 container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-screen min-w-full bg-transparent rounded-2xl p-6 container"
      >
        <h1 className="text-2xl font-bold text-left mb-3">{person.name}</h1>

        <div className="flex justify-between min-w-full flex-wrap-reverse">
          {/* 1st div-left */}
          <div className="flex flex-col justify-center items-start w-full md:w-1/2">
            <h2 className="w-full text-xl font-semibold m1-2">Profile</h2>
            {/* Involvements */}
            <div className="flex flex-wrap my-4 text-sm gap-1">
              {person.involvements?.council?.length > 0 && (
                <p className="bg-red-200 dark:bg-red-700 text-red-700 dark:text-red-200 py-1 px-2 rounded-3xl text-sm border border-red-400 dark:border-red-500">
                  {person.involvements.council.join(", ")}
                </p>
              )}

              {person.involvements?.hall?.length > 0 && (
                <p className="bg-blue-200 dark:bg-blue-700 text-blue-700 dark:text-blue-200 py-1 px-2 rounded-2xl text-sm border border-blue-400 dark:border-blue-500">
                  {person.involvements.hall.join(", ")}
                </p>
              )}

              {person.involvements?.soc?.length > 0 && (
                <p className="bg-green-200 dark:bg-green-700 text-green-700 dark:text-green-200 py-1 px-2 rounded-2xl text-sm border border-green-400 dark:border-green-500">
                  {person.involvements.soc.join(", ")}
                </p>
              )}

              {person.involvements?.iit?.length > 0 && (
                <p className="bg-purple-200 dark:bg-purple-700 text-purple-700 dark:text-purple-200 py-1 px-2 rounded-2xl text-sm border border-purple-400 dark:border-purple-500">
                  {person.involvements.iit.join(", ")}
                </p>
              )}
              {person.involvements?.extra && (
                <p className="bg-yellow-200 dark:bg-yellow-700 text-yellow-700 dark:text-yellow-200 py-1 px-2 rounded-2xl text-sm border border-yellow-400 dark:border-yellow-500">
                  {person.involvements.extra}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2 justify-start text-sm my-6">
              <p>
                <span className="font-semibold">Graduation Status: </span>
                {person.graduated ? "Alumni" : "Currently Enrolled"}
              </p>
              {person.branch && (
                <p>
                  <span className="font-semibold">Branch</span> :{" "}
                  {person.branch}
                </p>
              )}
              {person.hall && (
                <p>
                  <span className="font-semibold">Hall</span> : {person.hall}
                </p>
              )}
              {person.coe && (
                <p>
                  <span className="font-semibold">COE:</span> {person.coe}
                </p>
              )}
            </div>

            {(person.contacts?.phone ||
              person.contacts?.mail ||
              person.contacts?.linkedIn) && (
              <>
                <h2 className="mt-6 font-semibold">Contacts:</h2>
                <div className="flex justify-start items-center gap-6 mt-3">
                  {person.contacts?.phone && (
                    <a href={`tel:${person.contacts.phone}`}>
                      <MdAddCall className="text-2xl text-red-600 hover:text-rose-500 hover:scale-105 transition-all duration-300" />
                    </a>
                  )}
                  {person.contacts?.mail && (
                    <a href={`mailto:${person.contacts.mail}`}>
                      <FaEnvelope className="text-2xl text-red-600 hover:text-rose-500 hover:scale-105 transition-all duration-300" />
                    </a>
                  )}
                  {person.contacts?.linkedIn && (
                    <a
                      href={person.contacts.linkedIn}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <FaLinkedin className="text-2xl text-red-600 hover:text-rose-500 hover:scale-105 transition-all duration-300" />
                    </a>
                  )}
                </div>
              </>
            )}
          </div>
          {/* 2nd div-right */}
          <div className="w-full md:w-1/2 flex justify-center items-center">
            <img
              src={person.img}
              alt={person.name}
              width={200}
              className="rounded-3xl mx-auto mb-6 border"
            />
          </div>
        </div>

        <div className="flex justify-between mt-8 min-w-full">
          <button
            disabled={!prevPerson}
            onClick={() =>
              navigate(`/our-fam/${year}/${prevPerson?.id ?? index - 1}`)
            }
            className="px-2 py-1 rounded-lg bg-gray-300 dark:text-gray-200 dark:bg-gray-600 hover:bg-rose-300 dark:hover:bg-gray-500 disabled:opacity-40 transition-all duration-300"
          >
            <FaArrowLeft />
          </button>

          <button
            onClick={() => navigate(`/our-fam/${year}`)}
            className="px-2 py-1 rounded-lg bg-gray-300 dark:text-gray-200 dark:bg-gray-600 hover:bg-rose-300 dark:hover:bg-gray-500 disabled:opacity-40 transition-all duration-300"
          >
            Back
          </button>

          <button
            disabled={!nextPerson}
            onClick={() =>
              navigate(`/our-fam/${year}/${nextPerson?.id ?? index + 1}`)
            }
            className="px-2 py-1 rounded-lg bg-gray-300 dark:text-gray-200 dark:bg-gray-600 hover:bg-rose-300 dark:hover:bg-gray-500 disabled:opacity-40 transition-all duration-300"
          >
            <FaArrowRight />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default FamCardDetails;
