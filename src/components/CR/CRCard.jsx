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
  if (
    cr.imgLink ==
    "https://res.cloudinary.com/dcwwptwzt/image/upload/v1747723143/Avatar_avs1qx.avif"
  )
    cr.imgLink = `https://ui-avatars.com/api/?name=${encodeURIComponent(cr.name)}&background=fee2e2&color=991b1b`;
  return (
    <div className="w-[280px] sm:w-[320px] group">
      <div className="relative overflow-hidden border-x-[0.02px] border-white/10 bg-transparent hover:bg-white/5 transition-all duration-500">
        {/* Status badge */}
        {isCurrent && (
          <div className="absolute top-3 right-3 z-10">
            <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-primary/20 text-primary border border-primary/30">
              Current
            </span>
          </div>
        )}

        {/* Session watermark */}
        <span className="absolute top-3 left-3 text-xs font-mono text-white/20">
          {session}
        </span>

        {/* Content */}
        <div className="p-6 flex flex-col items-center">
          {/* Avatar */}
          <div className="relative mb-4">
            <div className="absolute inset-0 rounded-full bg-primary blur-md opacity-20 group-hover:opacity-40 transition-opacity" />
            <img
              src={
                cr.imgLink ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  cr.name || "User",
                )}&background=fee2e2&color=991b1b`
              }
              alt={`${cr.name}'s profile`}
              loading="lazy"
              className="relative w-24 h-24 rounded-full object-cover border-[0.5px] border-white/20 grayscale group-hover:grayscale-0 transition-all duration-500"
            />
          </div>

          {/* Name */}
          <h3 className="text-lg font-bold text-white text-center mb-1 group-hover:text-primary transition-colors">
            {cr.name}
          </h3>

          {/* Status */}
          <span
            className={`text-sm font-medium mb-3 ${
              isCurrent
                ? "text-primary"
                : "text-white/40"
            }`}
          >
            {status}
          </span>

          {/* Hall info */}
          {cr.hall && (
            <p className="text-xs text-white/50 mb-4">
              Hall: {cr.hall}
            </p>
          )}

          {/* Call button */}
          <ProtectedRoute
            fallback={
              <button
                onClick={() => navigate("/signin")}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 text-white/60 text-sm font-medium border-[0.5px] border-white/10 hover:border-primary/50 hover:bg-primary/10 hover:text-primary transition-all duration-300"
              >
                <Phone className="w-4 h-4" />
                Sign in to call
              </button>
            }
          >
            <a
              href={`tel:+91${cr.contacts[0]?.phone}`}
              title={`Call ${cr.name}`}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 text-white/80 text-sm font-medium border-[0.5px] border-white/10 hover:border-primary/50 hover:bg-primary/10 hover:text-primary transition-all duration-300"
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
