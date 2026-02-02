import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import BrightMindsCard from "../components/OurBrightMinds/BrightMindsCard";
import { api } from "../utils/Secure/api";
import LoaderOverlay from "../utils/LoaderOverlay";
import AnimatedCarousel from "../components/OurBrightMinds/AnimatedCarousel";

const AcademicStars = () => {
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
  <title>Academic Stars | DAAN KGP</title>
  <meta name="description" content="Meet the top academic performers at DAAN KGP. We celebrate batch-wise toppers and Dakshana scholars at IIT Kharagpur who excel in their studies." />
  
  {/* IMPORTANT: Make sure this matches the actual URL of the page */}
  <link rel="canonical" href="https://daan-kgp.vercel.app/academic-stars" />

  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://daan-kgp.vercel.app/academic-stars" />
  <meta property="og:title" content="Academic Stars | DAAN KGP" />
  <meta property="og:description" content="Celebrating academic excellence within the Dakshana Alumni Network at IIT Kharagpur." />
  
  {/* Use a PNG for better compatibility with WhatsApp/LinkedIn */}
  <meta property="og:image" content="https://res.cloudinary.com/dhv0sckmq/image/upload/v1770005960/DAAN_KGP_Logo_rhnogf.png" /> 
</Helmet>
      <section data-aos="fade-up" className="container">
        <h1 className="mt-0 mb-8 border-l-8 border-red-300 dark:border-gray-300 dark:text-gray-200 py-2 pl-2 text-3xl font-semibold container">
          Academic Stars
        </h1>

        {/* Top Performer of Each Batch */}
        <h2 className="text-lg md:text-xl lg:text-2xl font-semibold mb-4 dark:text-gray-300">
          Top Performers from Each Batch
        </h2>
        <AnimatedCarousel>
          {topPerformers.map((item) => (
            <BrightMindsCard key={item.id} {...item} />
          ))}
        </AnimatedCarousel>

        {/* Batch-wise */}
        <h2 className="text-lg md:text-xl lg:text-2xl font-semibold mt-12 dark:text-gray-300">
          Batch-wise Performers
        </h2>

        <div className="flex justify-center gap-4 mt-6 flex-wrap container">
          {yearsDescending.map((year) => (
            <button
              key={year}
              onClick={() => setActiveYear(year)}
              className={`px-4 py-2 rounded-2xl font-medium transition ${
                activeYear === year
                  ? "bg-red-400 text-white"
                  : "bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
              }`}
            >
              '{year.slice(-2)}
            </button>
          ))}
        </div>
        <AnimatedCarousel>
          {data[activeYear]?.map((item) => (
            <BrightMindsCard key={item.id} {...item} />
          ))}
        </AnimatedCarousel>
      </section>
    </div>
  );
};

export default AcademicStars;
