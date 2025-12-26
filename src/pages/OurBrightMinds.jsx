import { Helmet } from "react-helmet";
import { useEffect, useState } from "react";
import BrightMindsCard from "../components/OurBrightMinds/BrightMindsCard";
import { api } from "../utils/Secure/api";
import LoaderOverlay from "../utils/LoaderOverlay";

const OurBrightMinds = () => {
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
    <div className="dark:bg-gray-900 dark:text-gray-400 py-8">
      <Helmet>
        <title>Our Bright Minds | DAAN KGP</title>
        <meta
          name="description"
          content="This page highlights our bright minds and their hard work, the reason behind our success."
        />
      </Helmet>

      <section data-aos="fade-up" className="container">
        <h1 className="mt-0 mb-8 border-l-8 border-red-300 dark:border-gray-300 dark:text-gray-200 py-2 pl-2 text-3xl font-bold">
          Our Bright Minds
        </h1>

        {/* Top Performer of Each Batch */}
        <h2 className="text-lg md:text-xl lg:text-2xl font-semibold mb-4 dark:text-gray-300">
          Top Performers from Each Batch
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {topPerformers.map((item) => (
            <BrightMindsCard key={item.id} {...item} />
          ))}
        </div>

        {/* Batch-wise */}
        <h2 className="text-lg md:text-xl lg:text-2xl font-semibold mt-12 dark:text-gray-300">
          Batch-wise Performers
        </h2>

        <div className="flex justify-center gap-4 mt-6 flex-wrap">
          {yearsDescending.map((year) => (
            <button
              key={year}
              onClick={() => setActiveYear(year)}
              className={`px-4 py-2 rounded-md font-medium transition ${
                activeYear === year
                  ? "bg-red-400 text-white"
                  : "bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
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
      </section>
    </div>
  );
};

export default OurBrightMinds;
