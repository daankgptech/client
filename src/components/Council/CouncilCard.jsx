import React from "react";
import { VscDiffIgnored } from "react-icons/vsc";
import { MdAddCall } from "react-icons/md";
import { IoIosMail } from "react-icons/io";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import ProtectedRoute from "../Secure/ProtectedRoute";

const CouncilCard = ({
  name,
  batch,
  contacts = [],
  involvements = [],
  imgLink,
}) => {
  const navigate = useNavigate();
  const mobile = contacts[0]?.phone || "N/A";
  const mail = contacts[0]?.email || "N/A";
  const councilInfo = involvements[0]?.council || "No Portfolio";
  // inside CouncilCard
  const currentYear = new Date().getFullYear(); // e.g., 2025
  const batchYear = parseInt(batch, 10); // batch is from API, e.g., "2023"
  const studyYear = currentYear - batchYear + 1; // 1st Yr, 2nd Yr, ...

  const yearLabel = `${studyYear} ${
    studyYear === 1
      ? "st"
      : studyYear === 2
      ? "nd"
      : studyYear === 3
      ? "rd"
      : "th"
  } Yr`;

  return (
    <div className="shadow-md dark:hover:shadow-gray-500 hover:shadow-red-300 transition-all duration-500 hover:shadow-lg dark:bg-gray-900 dark:text-gray-400 rounded-lg bg-gradient-to-tr from-gray-100 dark:from-gray-800 dark:to-gray-700 to-gray-200">
      <div className="overflow-hidden h-[220px] transition duration-700 rounded-lg flex justify-center items-center">
        {imgLink && (
          <Helmet>
            <link rel="preload" as="image" href={imgLink} />
          </Helmet>
        )}
        {imgLink ? (
          <img
            src={imgLink}
            alt={name}
            width="180px"
            height="180px"
            className="hover:skew-2 hover:scale-[1.04] transition duration-700 rounded-full object-cover aspect-square"
          />
        ) : (
          <div className="w-40 h-40 bg-gray-300 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300">
            No Image
          </div>
        )}
      </div>

      <div className="space-y-2 p-3">
        <h1 className="line-clamp-1 font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-red-700 dark:from-gray-300 to-orange-500 dark:to-gray-100">
          {name}
        </h1>

        <div className="flex items-center gap-2 opacity-70">
          <VscDiffIgnored />
          <span className="dark:text-gray-400">{councilInfo}</span>
        </div>

        <div className="flex items-center justify-between border-t-2 dark:border-gray-600 py-3 !mt-3">
          <div className="opacity-70 flex justify-between items-center gap-4 w-1/4">
            <a
              href={`mailto:${mail}`}
              title="Mail Now"
              className="p-2 rounded-lg border border-rose-200 bg-rose-50 dark:bg-gray-800 text-rose-400 flex items-center hover:bg-rose-100 hover:scale-[1.05] hover:shadow-rose-300 transition-all hover:translate-x-1 hover:-translate-y-1 hover:shadow-lg hover:border-rose-300 duration-300"
            >
              <IoIosMail />
            </a>

            <ProtectedRoute
              fallback={
                <button
                  onClick={() => navigate("/signin")}
                  className="p-2 rounded-lg border border-green-200 bg-green-50 dark:bg-gray-800 text-green-400 flex items-center hover:bg-green-100 hover:scale-[1.05] hover:shadow-green-300 transition-all hover:translate-x-1 hover:-translate-y-1 hover:shadow-lg hover:border-green-300 duration-300"
                >
                  <MdAddCall />
                </button>
              }
            >
              <a
                href={`tel:${mobile}`}
                title="Call Now"
                className="p-2 rounded-lg border border-green-200 bg-green-50 dark:bg-gray-800 text-green-400 flex items-center hover:bg-green-100 hover:scale-[1.05] hover:shadow-green-300 transition-all hover:translate-x-1 hover:-translate-y-1 hover:shadow-lg hover:border-green-300 duration-300"
              >
                <MdAddCall />
              </a>
            </ProtectedRoute>
          </div>

          <div>
            <p className="text-2xl font-semibold text-red-700 dark:text-cyan-700">
              {yearLabel}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CouncilCard;
