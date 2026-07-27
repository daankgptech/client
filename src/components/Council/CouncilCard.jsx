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
    <div className="group p-3 bg-transparent hover:bg-white/5 transition-all duration-300 hover:-translate-y-1 w-[280px]">

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
          className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover ring-2 ring-primary/30 grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="px-4 py-5 text-center space-y-3">

        {/* Name */}
        <h2 className="text-lg md:text-xl font-bold text-white line-clamp-1 group-hover:text-primary transition-colors">
          {name}
        </h2>

        {/* Council */}
        <div className="flex items-center justify-center gap-2 text-sm text-white/60">
          <VscDiffIgnored className="text-primary" />
          <span className="line-clamp-1">{councilInfo}</span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">

          {/* Actions */}
          <div className="flex items-center gap-3">

            {/* Mail */}
            <a
              href={`mailto:${mail}`}
              title={`Mail to ${name}`}
              className="p-2 rounded-lg bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition-all duration-200 hover:scale-105"
            >
              <IoIosMail />
            </a>

            {/* Call */}
            <ProtectedRoute
              fallback={
                <button
                  onClick={() => navigate("/signin")}
                  className="p-2 rounded-lg bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition-all duration-200 hover:scale-105"
                >
                  <MdAddCall />
                </button>
              }
            >
              <a
                href={`tel:+91${mobile}`}
                title={`Call to ${name}`}
                className="p-2 rounded-lg bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition-all duration-200 hover:scale-105"
              >
                <MdAddCall />
              </a>
            </ProtectedRoute>

          </div>

          {/* Year */}
          <span className="text-sm md:text-base font-semibold text-primary">
            {yearLabel}
          </span>

        </div>
      </div>
    </div>
  );
};

export default CouncilCard;