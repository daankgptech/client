import { FaDownload } from "react-icons/fa";

const DownloadBtn = ({ catching, cover, heading, href }) => (
  <div
    className="
      group relative h-full
      rounded-2xl p-5
      bg-gradient-to-br from-rose-100 via-gray-100 to-gray-200
      dark:from-gray-900 dark:via-gray-800 dark:to-gray-900
      border border-gray-300 dark:border-gray-700
      transition-all duration-500 ease-out
      hover:-translate-y-2
      hover:shadow-xl hover:shadow-rose-200/50
      dark:hover:shadow-red-900/30
      flex flex-col justify-between gap-4
    "
  >
    {/* Text */}
    <div className="space-y-2">
      <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-200">
        {catching}
      </h1>

      <p className="text-sm md:text-base text-gray-700 dark:text-gray-500">
        {cover}
      </p>
    </div>

    {/* Download Button */}
    <a
      href={href}
      download={heading}
      target="_blank"
      rel="noopener noreferrer"
      className="
        inline-flex items-center justify-between gap-3
        self-start px-4 py-2 rounded-xl
        bg-gradient-to-r from-rose-500 to-red-600
        text-white font-medium
        shadow-md shadow-rose-300/40
        dark:shadow-red-900/40
        transition-all duration-300
        hover:scale-[1.05]
        hover:shadow-lg
        active:scale-[0.98]
      "
    >
      <span>{heading}</span>
      <FaDownload className="text-sm" />
    </a>
  </div>
);

export default DownloadBtn;