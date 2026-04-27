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
      imgLink ==
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
        className="
          group cursor-pointer rounded-2xl overflow-hidden
          bg-white dark:bg-gray-900
          border border-neutral-200 dark:border-neutral-800
          transition-colors duration-200
          hover:border-rose-300 dark:hover:border-rose-800
        "
      >
        {/* IMAGE */}
        <div className="relative aspect-square bg-neutral-100 dark:bg-neutral-900">
          <img
            src={avatar}
            alt={name}
            loading="lazy"
            decoding="async"
            className="
              w-full h-full object-cover
              transition-transform duration-300
              group-hover:scale-[1.03]
            "
          />

          {/* Graduation dot (minimal indicator) */}
          {graduated && (
            <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-rose-500" />
          )}
        </div>

        {/* CONTENT */}
        <div className="p-3">
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">
            {name}
          </h3>

          <p className="text-[11px] mt-0.5 text-neutral-500 dark:text-neutral-400 truncate">
            {branch} · {hall}
          </p>

          {/* ACTIONS */}
          <div className="flex items-center gap-3 mt-3">
            {primary?.phone && (
              <button
                onClick={(e) => e.stopPropagation()}
                className="
                  text-neutral-400 hover:text-rose-500
                  transition-colors
                "
              >
                <MdAddCall size={16} />
              </button>
            )}

            {primary?.email && (
              <a
                href={`mailto:${primary.email}`}
                onClick={(e) => e.stopPropagation()}
                className="
                  text-neutral-400 hover:text-rose-500
                  transition-colors
                "
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
                className="
                  text-neutral-400 hover:text-rose-500
                  transition-colors
                "
              >
                <FaLinkedin size={14} />
              </a>
            )}
          </div>
        </div>
      </div>
    );
  },
);

FamCard.displayName = "FamCard";
export default FamCard;
