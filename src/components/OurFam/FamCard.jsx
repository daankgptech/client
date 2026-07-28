import React, { memo, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaLinkedin, FaEnvelope } from "react-icons/fa";
import { MdAddCall } from "react-icons/md";

const FamCard = memo(
  ({ name, imgLink, branch, hall, contacts = [], graduated }) => {
    const navigate = useNavigate();
    const { year } = useParams();

    const primary = contacts[0];
    if (
      imgLink ===
      "https://res.cloudinary.com/dcwwptwzt/image/upload/v1747723143/Avatar_avs1qx.avif"
    )
      imgLink = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=fee2e2&color=991b1b`;
    // Stable avatar (no random flicker)
    const avatar = useMemo(
      () =>
        imgLink ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(
          name,
        )}&background=fee2e2&color=991b1b`,
      [imgLink, name],
    );

    const go = () => {
      navigate(`/our-fam/${year}/${encodeURIComponent(name)}`);
    };

    return (
      <div
        onClick={go}
        className="group cursor-pointer flex flex-col justify-between overflow-hidden bg-transparent border-white/10 border-[0.5px] hover:bg-white/5 hover:border-white/20 hover:-translate-y-1 transition-all duration-300 ease-out p-4"
      >
        {/* IMAGE */}
        <div className="relative aspect-square bg-white/5 overflow-hidden border-b border-white/10">
          <img
            src={avatar}
            alt={name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Graduation dot / badge */}
          {graduated && (
            <span className="absolute top-2 right-2 text-[9px] font-semibold text-white bg-primary/90 backdrop-blur-sm px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              Alumni
            </span>
          )}
        </div>

        {/* CONTENT */}
        <div className="pt-3 flex flex-col justify-between flex-1">
          <div>
            <h3 className="text-base font-bold font-space-grotesk text-white group-hover:text-primary transition-colors leading-snug truncate">
              {name}
            </h3>

            <p className="text-xs text-white/60 truncate mt-1">
              {branch} · {hall}
            </p>
          </div>

          {/* ACTIONS */}
          {(primary?.phone || primary?.email || primary?.linkedIn) && (
            <div className="flex items-center gap-3 mt-3 border-t border-white/10 pt-2.5">
              {primary?.phone && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    window.location.href = `tel:${primary.phone}`;
                  }}
                  title="Call"
                  className="text-white/40 hover:text-primary transition-colors"
                >
                  <MdAddCall size={16} />
                </button>
              )}

              {primary?.email && (
                <a
                  href={`mailto:${primary.email}`}
                  onClick={(e) => e.stopPropagation()}
                  title="Email"
                  className="text-white/40 hover:text-primary transition-colors"
                >
                  <FaEnvelope size={14} />
                </a>
              )}

              {primary?.linkedIn && (
                <a
                  href={primary.linkedIn}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  title="LinkedIn"
                  className="text-white/40 hover:text-primary transition-colors"
                >
                  <FaLinkedin size={14} />
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    );
  },
);

FamCard.displayName = "FamCard";
export default FamCard;
