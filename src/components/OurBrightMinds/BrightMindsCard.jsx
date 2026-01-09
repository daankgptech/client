import { Helmet } from "react-helmet";

const BrightMindsCard = ({
  imgLink,
  name,
  dept,
  Year,
  cg,
  position,
  colour,
}) => (
  <div
    className="
      group relative flex flex-col items-center justify-between
      p-3 md:p-4 lg:p-5 rounded-3xl
      bg-gradient-to-br from-rose-100 via-gray-100 to-gray-200
      dark:from-gray-900 dark:via-gray-800 dark:to-gray-900
      border border-gray-300/70 dark:border-gray-700
      transition-all duration-500 ease-out
      hover:-translate-y-2 hover:shadow-xl
      hover:shadow-rose-200/50 dark:hover:shadow-red-900/30
    "
  >
    <Helmet>
      <link rel="preload" as="image" href={imgLink} />
    </Helmet>

    {/* Rank Badge */}
    {position && (
      <div
        className="
          absolute top-3 right-3 z-10
          px-3 py-1 rounded-full text-xs md:text-sm font-semibold
          text-rose-50
          bg-gradient-to-r from-rose-500 to-red-600
          shadow-md shadow-rose-300/50
          dark:shadow-red-900/40
          scale-95 group-hover:scale-100
          transition-transform duration-300
        "
      >
        {position}
        {/* {position === 1 ? "st" : position === "2" ? "nd" : "rd"} */}
      </div>
    )}

    {/* Image */}
    <div className="relative mt-2 mb-3">
      <div
        className="
          absolute inset-0 rounded-full
          bg-gradient-to-tr from-rose-400 to-red-500
          blur-xl opacity-20
          group-hover:opacity-30 transition-opacity duration-500
        "
      />
      <img
        src={imgLink}
        alt={name}
        className="
          relative rounded-full
          w-[170px] md:w-[210px] lg:w-[230px]
          border border-gray-300 dark:border-gray-600
          shadow-lg
          transition-transform duration-500
          group-hover:scale-[1.03] object-cover aspect-square
        "
      />
    </div>

    {/* Name */}
    <h1 className="text-lg md:text-xl font-semibold text-center text-gray-800 dark:text-gray-300 truncate">
      {name}
    </h1>

    {/* Department */}
    <p className="text-sm md:text-base text-gray-600 dark:text-gray-500">
      {dept}
    </p>

    {/* Meta */}
    <div
      className="
        mt-2 w-full flex justify-between items-center
        px-4 py-2 rounded-xl
        bg-gray-200/60 dark:bg-gray-800/60
        text-sm md:text-base
        text-gray-700 dark:text-gray-400
      "
    >
      <span>{Year}</span>
      <span className="font-medium text-rose-600 dark:text-rose-400">{cg}</span>
    </div>
  </div>
);

export default BrightMindsCard;
