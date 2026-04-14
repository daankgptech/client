import React from "react";
import { Users, ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MeetFamilyCard() {
  const navigate = useNavigate();
  const imgArray = [
    "https://res.cloudinary.com/dcwwptwzt/image/upload/v1748290429/Pratik_Choudhury_njqkep.avif",
    "",
    "https://res.cloudinary.com/dcwwptwzt/image/upload/v1747740285/Ashish_kumar_Meena_z9nbod.avif",
    "https://res.cloudinary.com/dcwwptwzt/image/upload/v1748023103/Shani_Maurya_cpux6d.avif",
    "https://res.cloudinary.com/dcwwptwzt/image/upload/v1760806421/UttamMeghwal_ju8s0v.avif",
    "https://res.cloudinary.com/dubu8yxkm/image/upload/v1754513796/Anurag_Sharma_cpmrbh.avif",
  ].reverse();
  return (
    <div
      onClick={() => navigate("/our-fam")}
      className="
    w-full h-full flex flex-col justify-between gap-3
    p-4
    rounded-xl
    bg-white dark:bg-gray-900
    border border-gray-200 dark:border-gray-800
    cursor-pointer
    hover:border-rose-400
    hover:bg-gray-50 dark:hover:bg-gray-800
    transition-colors duration-150
  "
    >
      {/* top */}
      <div className="flex justify-between items-center">
        <div className="p-1.5 rounded-md bg-rose-100 dark:bg-rose-900/30 text-rose-500">
          <Users size={16} />
        </div>

        <ArrowUpRight size={14} className="text-gray-400" />
      </div>

      {/* content */}
      <div>
        <h3 className="text-[11px] uppercase text-gray-500 dark:text-gray-400">
          Community
        </h3>

        <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
          DAAN Family
        </p>
      </div>

      {/* avatars */}
      <div className="flex items-center -space-x-2">
        {imgArray.slice(0, 4).map((src, i) => (
          <img
            key={i}
            src={
              src ||
              `https://ui-avatars.com/api/?name=User&background=fee2e2&color=991b1b&size=32`
            }
            alt="member"
            className="
          w-6 h-6 rounded-full
          border border-gray-200 dark:border-gray-700
          object-cover
        "
          />
        ))}

        {imgArray.length > 4 && (
          <div className="w-6 h-6 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center">
            +{imgArray.length - 4}
          </div>
        )}
      </div>

      {/* footer */}
      <p className="text-[10px] text-gray-400">Explore members</p>
    </div>
  );
}
