import { useEffect, useState } from "react";
import BrightMindsCard from "./BrightMindsCard";
import { api } from "../../utils/Secure/api";
import LoaderOverlay from "../../utils/LoaderOverlay";

const TopPerformers = () => {
  const [data, setData] = useState({});
  const [activeYear, setActiveYear] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/bright-minds")
      .then((res) => {
        setData(res.data);
        const years = Object.keys(res.data).sort((a, b) => b - a);
        setActiveYear(years[0]);
      })
      .catch(console.error)
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <LoaderOverlay />;
  if (!activeYear) return null;

  const yearsDescending = Object.keys(data).sort((a, b) => b - a);
  const topPerformers = yearsDescending.map((year) => ({
    year,
    ...data[year][0],
  }));

  return (
    <div>
      {/* Top Performer of Each Batch */}
      <h1 className="text-lg md:text-xl lg:text-2xl font-semibold mb-2 dark:text-gray-300">
        Top Performers from Each Batch
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {topPerformers.map((item) => (
          <BrightMindsCard key={item.id} {...item} />
        ))}
      </div>

      {/* Batch-wise Tabs */}
      <h1 className="text-lg md:text-xl lg:text-2xl font-semibold mt-10 dark:text-gray-300">
        Batch-wise Performers
      </h1>

      <div className="flex justify-center gap-4 mt-6 flex-wrap">
        {yearsDescending.map((year) => (
          <button
            key={year}
            onClick={() => setActiveYear(year)}
            className={`px-4 py-2 rounded-md font-medium ${
              activeYear === year
                ? "bg-red-400 text-white"
                : "bg-gray-200 dark:bg-gray-800"
            }`}
          >
            '{year.slice(-2)}
          </button>
        ))}
      </div>

      <div className="flex justify-center flex-wrap gap-4 mt-6">
        {data[activeYear]?.map((item) => (
          <BrightMindsCard key={item.id} {...item} />
        ))}
      </div>
    </div>
  );
};

export default TopPerformers;
