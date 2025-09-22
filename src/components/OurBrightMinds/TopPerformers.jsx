import { useState } from "react";
import BrightMindsCard from "./BrightMindsCard";
import topThreeData from "./TopPerformersData";

const yearLabels = {
  2024: "'24",
  2023: "'23",
  2022: "'22",
  2021: "'21",
};

// Descending order of years
const yearsDescending = Object.keys(yearLabels).sort((a, b) => b - a);

const TopPerformers = () => {
  const [activeYear, setActiveYear] = useState(yearsDescending[0]);

  // Get top performer of each year for the "TopOne" section
  const topPerformers = yearsDescending.map((year) => ({
    year,
    ...topThreeData[year][0],
  }));

  return (
    <div>
      {/* Top Performer of Each Batch */}
      <h1 className="text-lg md:text-xl lg:text-2xl font-semibold mb-2 dark:text-gray-300">
        Top Performers from Each Batch
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
        {topPerformers.map((item) => (
          <div key={item.year}>
            <BrightMindsCard {...item} />
          </div>
        ))}
      </div>

      {/* Batch-wise Performers Tabs */}
      <h1 className="text-lg md:text-xl lg:text-2xl font-semibold mt-10 dark:text-gray-300">
        Batch-wise Performers
      </h1>
      <div className="flex justify-center gap-4 mt-6 flex-wrap">
        {yearsDescending.map((year) => (
          <button
            key={year}
            onClick={() => setActiveYear(year)}
            className={`px-4 py-2 rounded-md font-medium transition-all duration-300  ${
              activeYear === year
                ? "bg-red-400 dark:bg-red-800 text-white "
                : "bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-red-300 dark:hover:bg-red-900 hover:text-white"
            }`}
          >
            {yearLabels[year]}
          </button>
        ))}
      </div>
      <div className="flex justify-center items-center flex-wrap gap-4 md:gap-6 lg:gap-8 mt-6">
        {topThreeData[activeYear]?.map((item) => (
          <BrightMindsCard key={item.id} {...item} />
        ))}
      </div>
    </div>
  );
};

export default TopPerformers;
