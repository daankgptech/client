import { Wrench, ArrowRight, ShieldCheck, Zap, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CheckToolkit() {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate("/toolkit")}
      className="
    w-full h-full flex flex-col justify-between gap-4
    p-4
    rounded-xl
    bg-white dark:bg-gray-900
    border border-gray-200 dark:border-gray-800
    cursor-pointer
    hover:border-rose-400
    hover:bg-gray-50 dark:hover:bg-gray-800
    transition-colors duration-150
    md:col-span-2
  "
    >
      {/* header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-rose-100 dark:bg-rose-900/30 text-rose-500">
            <Wrench size={16} />
          </div>

          <div>
            <h3 className="text-[11px] uppercase text-gray-500 dark:text-gray-400">
              Resources
            </h3>
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
              Toolkit
            </p>
          </div>
        </div>

        <ArrowRight size={14} className="text-gray-400" />
      </div>

      {/* features */}
      <div className="flex flex-wrap gap-1 text-[11px]">
        {["Guides", "Safety", "FAQ"].map((item) => (
          <span
            key={item}
            className="
          px-2 py-0.5
          rounded-md
          bg-gray-100 dark:bg-gray-800
          text-gray-600 dark:text-gray-300
        "
          >
            {item}
          </span>
        ))}
      </div>

      {/* footer */}
      <p className="text-[10px] text-gray-400">Support resources</p>
    </div>
  );
}
