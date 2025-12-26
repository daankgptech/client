import React from "react";
import { Users, ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MeetFamilyCard() {
  const navigate = useNavigate();
  const imgArray = [
    "https://res.cloudinary.com/dcwwptwzt/image/upload/v1748290429/Pratik_Choudhury_njqkep.avif",
    "https://res.cloudinary.com/dcwwptwzt/image/upload/v1747723143/Avatar_avs1qx.avif",
    "https://res.cloudinary.com/dcwwptwzt/image/upload/v1747740285/Ashish_kumar_Meena_z9nbod.avif",
    "https://res.cloudinary.com/dcwwptwzt/image/upload/v1748023103/Shani_Maurya_cpux6d.avif",
    "https://res.cloudinary.com/dcwwptwzt/image/upload/v1760806421/UttamMeghwal_ju8s0v.avif",
    "https://res.cloudinary.com/dubu8yxkm/image/upload/v1754513796/Anurag_Sharma_cpmrbh.avif",
  ].reverse();
  return (
    <div
      onClick={() => navigate("/our-fam")}
      className="
        group relative overflow-hidden
        rounded-3xl
        bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300
        dark:from-slate-900 dark:via-slate-800 dark:to-slate-900
        border border-rose-50
        dark:border-slate-700/50
        p-6
        transition-all duration-500
        hover:border-rose-400/40
        dark:hover:border-rose-500/50
        hover:shadow-lg hover:shadow-rose-900/20 
        w-full h-full flex flex-col justify-between items-start
        cursor-pointer
      "
    >
      {/* ambient glow */}
      <div
        className="
          pointer-events-none absolute inset-0
          bg-gradient-to-br from-rose-100/10 via-transparent to-rose-500/10
          opacity-0 group-hover:opacity-100
          transition-opacity duration-500
        "
      />

      {/* Top Header */}
      <div className="relative z-10 w-full flex justify-between items-start">
        <div className="p-2 rounded-2xl bg-rose-500/10 dark:bg-rose-500/20 text-rose-500">
          <Users size={20} />
        </div>
        <div className="text-gray-400 group-hover:text-rose-500 transition-colors">
          <ArrowUpRight size={18} />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <h3 className="text-xs uppercase tracking-widest text-gray-500 dark:text-rose-400/80 font-bold mb-1">
          Community
        </h3>
        <p className="text-lg font-bold text-gray-900 dark:text-gray-100 leading-tight">
          DAAN KGPian Family
        </p>
      </div>

      {/* Decorative Overlapping Avatars */}
      <div className="relative z-10 flex items-center -space-x-3 mt-2">
        {imgArray.slice(0, 4).map((src, i) => (
          <div
            key={i}
            className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-800 bg-gray-300 dark:bg-slate-700 overflow-hidden shadow-sm"
          >
            <img
              src={src}
              alt="member"
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
            />
          </div>
        ))}

        {imgArray.length > 4 && (
          <div className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-800 bg-rose-500 flex items-center justify-center text-[10px] text-white font-bold shadow-sm">
            +{imgArray.length - 4}
          </div>
        )}
      </div>

      {/* Bottom Text */}
      <p className="relative z-10 text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-tighter">
        Click to explore members
      </p>
    </div>
  );
}
