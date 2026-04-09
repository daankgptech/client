import { Download } from "lucide-react";

const DownloadBtn = ({ catching, cover, heading, href }) => (
  <div className="group rounded-xl p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:border-rose-200 dark:hover:border-gray-600 transition-all duration-200 hover:-translate-y-0.5">
    {/* Content */}
    <div className="flex items-start justify-between gap-3">
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 leading-snug line-clamp-2">
          {catching}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
          {cover}
        </p>
        <p className="text-xs text-red-400 mt-2 line-clamp-2">{heading}</p>
      </div>

      {/* Small Download Button - Icon Only */}
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-shrink-0 p-2 rounded-lg bg-rose-500 text-white hover:bg-rose-600 active:scale-95 transition-all duration-150"
        title="Download"
      >
        <Download className="w-4 h-4" />
      </a>
    </div>
  </div>
);

export default DownloadBtn;
