import { VscDiffIgnored } from "react-icons/vsc";
import { MdAddCall } from "react-icons/md";
import { IoIosMail } from "react-icons/io";
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

  const currentYear = new Date().getFullYear();
  const batchYear = parseInt(batch, 10);
  const studyYear = currentYear - batchYear;

  const yearLabel = `${studyYear}${
    studyYear === 1
      ? "st"
      : studyYear === 2
      ? "nd"
      : studyYear === 3
      ? "rd"
      : "th"
  } Yr`;

  return (
    <div className="group rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">

      {/* Image */}
      <div className="flex justify-center pt-6">
        <img
          src={
            imgLink ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              name || "User"
            )}&background=fee2e2&color=991b1b`
          }
          alt={name}
          loading="lazy"
          className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover ring-2 ring-rose-200 dark:ring-gray-700 transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="px-4 py-5 text-center space-y-3">

        {/* Name */}
        <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white line-clamp-1">
          {name}
        </h2>

        {/* Council */}
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <VscDiffIgnored className="text-rose-400" />
          <span className="line-clamp-1">{councilInfo}</span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">

          {/* Actions */}
          <div className="flex items-center gap-3">

            {/* Mail */}
            <a
              href={`mailto:${mail}`}
              title={`Mail to ${name}`}
              className="p-2 rounded-lg bg-rose-50 dark:bg-gray-800 text-rose-500 hover:bg-rose-100 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105"
            >
              <IoIosMail />
            </a>

            {/* Call */}
            <ProtectedRoute
              fallback={
                <button
                  onClick={() => navigate("/signin")}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105"
                >
                  <MdAddCall />
                </button>
              }
            >
              <a
                href={`tel:+91${mobile}`}
                title={`Call to ${name}`}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105"
              >
                <MdAddCall />
              </a>
            </ProtectedRoute>

          </div>

          {/* Year */}
          <span className="text-sm md:text-base font-semibold text-rose-600 dark:text-rose-400">
            {yearLabel}
          </span>

        </div>
      </div>
    </div>
  );
};

export default CouncilCard;