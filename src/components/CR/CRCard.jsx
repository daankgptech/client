import { Phone } from "lucide-react";
import ProtectedRoute from "../Secure/ProtectedRoute";

// Helper functions
export const getSessionFromBatch = (batch) => {
  if (!batch) return "";
  const startYear = Number(batch) + 1;
  const endYear = String(startYear + 1).slice(-2);
  return `${startYear}-${endYear}`;
};

export const getCRStatus = (session) => {
  if (!session) return "";
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  let sessionStartYear;

  if (month >= 10) {
    sessionStartYear = year;
  } else {
    sessionStartYear = year - 1;
  }

  const sessionEndYear = String(sessionStartYear + 1).slice(-2);
  const currentSession = `${sessionStartYear}-${sessionEndYear}`;

  return session === currentSession ? "Current CR" : "Ex CR";
};

const CRCard = ({ cr, navigate }) => {
  const session = getSessionFromBatch(cr.batch);
  const status = getCRStatus(session);
  const isCurrent = status === "Current CR";

  return (
    <div className="w-[280px] sm:w-[320px] group">
      <div className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-800 dark:via-gray-850 dark:to-gray-900 shadow-lg hover:shadow-xl hover:shadow-rose-500/10 dark:hover:shadow-rose-500/5 transition-all duration-500">
        {/* Status badge */}
        {isCurrent && (
          <div className="absolute top-3 right-3 z-10">
            <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-gradient-to-r from-rose-500 to-red-500 text-white shadow-lg animate-pulse">
              Current
            </span>
          </div>
        )}

        {/* Session watermark */}
        <span className="absolute top-3 left-3 text-xs font-mono text-gray-400/60 dark:text-gray-500/60">
          {session}
        </span>

        {/* Content */}
        <div className="p-6 flex flex-col items-center">
          {/* Avatar */}
          <div className="relative mb-4">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-rose-400 to-red-500 blur-md opacity-40 group-hover:opacity-60 transition-opacity" />
            <img
              src={cr.imgLink}
              alt={`${cr.name}'s profile`}
              loading="lazy"
              className="relative w-24 h-24 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-lg group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Name */}
          <h3 className="text-lg font-bold text-gray-800 dark:text-white text-center mb-1 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
            {cr.name}
          </h3>

          {/* Status */}
          <span
            className={`text-sm font-medium mb-3 ${
              isCurrent
                ? "text-rose-500 dark:text-rose-400"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            {status}
          </span>

          {/* Hall info */}
          {cr.hall && (
            <p className="text-xs text-gray-500 dark:text-gray-500 mb-4">
              Hall: {cr.hall}
            </p>
          )}

          {/* Call button */}
          <ProtectedRoute
            fallback={
              <button
                onClick={() => navigate("/signin")}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-600 dark:text-gray-300 text-sm font-medium border border-gray-200 dark:border-gray-600 hover:border-rose-300 dark:hover:border-rose-500/50 hover:from-rose-50 hover:to-rose-100 dark:hover:from-rose-500/10 dark:hover:to-rose-500/20 transition-all duration-300"
              >
                <Phone className="w-4 h-4" />
                Sign in to call
              </button>
            }
          >
            <a
              href={`tel:+91${cr.contacts[0]?.phone}`}
              title={`Call ${cr.name}`}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-red-500 text-white text-sm font-medium shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 hover:scale-105 active:scale-95 transition-all duration-300"
            >
              <Phone className="w-4 h-4" />
              Call
            </a>
          </ProtectedRoute>
        </div>
      </div>
    </div>
  );
};

export default CRCard;
