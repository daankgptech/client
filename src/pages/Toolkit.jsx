import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, useNavigate } from "react-router-dom";
import { Wrench } from "lucide-react";
import DownloadBtn from "../components/Toolkit/DownloadBtn";
import { api } from "../utils/Secure/api";
import { cache } from "../utils/cache";

// Skeleton shimmer component for toolkit cards
const SkeletonCard = () => (
  <div className="animate-shimmer rounded-xl p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
    <div className="flex items-start justify-between gap-3">
      <div className="flex-1 min-w-0 space-y-2">
        <div className="w-full h-4 rounded bg-gray-300/70 dark:bg-gray-700/70" />
        <div className="w-3/4 h-3 rounded bg-gray-300/60 dark:bg-gray-700/60" />
      </div>
      <div className="w-8 h-8 rounded-lg bg-gray-300/50 dark:bg-gray-700/50 flex-shrink-0" />
    </div>
  </div>
);

const tabs = [
  { key: "erp", label: "ERP" },
  { key: "fresher", label: "Fresher" },
  { key: "academic", label: "Academic" },
  { key: "cdc", label: "CDC Intern" },
];

const Toolkit = () => {
  const { tab } = useParams();
  const navigate = useNavigate();

  const [toolkitData, setToolkitData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchToolkit = async () => {
      try {
        // Check cache first
        const cached = cache.get("/toolkit");
        if (cached) {
          setToolkitData(cached);
          setLoading(false);
          return;
        }

        const response = await api.get("/toolkit");
        if (response.data.success) {
          setToolkitData(response.data.data);
          // Cache for 15 minutes (toolkit data rarely changes)
          cache.set("/toolkit", response.data.data, 15 * 60 * 1000);
        }
      } catch (error) {
        console.error("Error fetching toolkit data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchToolkit();
  }, []);

  const activeTab = tabs.some(({ key }) => key === tab) ? tab : "erp";
  const data = toolkitData ? toolkitData[activeTab] || [] : [];
  const activeTabLabel =
    tabs.find((t) => t.key === activeTab)?.label || "Toolkit";

  const handleTabChange = (key) => {
    navigate(`/toolkit/${key}`);
  };

  if (loading) {
    return (
      <div className="bg-gray-100 dark:bg-gray-950 min-h-screen py-8">
        <div className="container mx-auto px-4">
          {/* Header skeleton */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-gray-300/70 dark:bg-gray-700/70" />
            <div className="w-32 h-8 rounded bg-gray-300/70 dark:bg-gray-700/70" />
          </div>
          {/* Tabs skeleton */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-20 h-9 rounded-full bg-gray-300/60 dark:bg-gray-700/60"
              />
            ))}
          </div>
          {/* Cards skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
        <style>{`
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
          .animate-shimmer {
            background: linear-gradient(90deg, transparent 0%, rgba(156, 163, 175, 0.3) 50%, transparent 100%);
            background-size: 200% 100%;
            animation: shimmer 1.2s linear infinite;
          }
          .dark .animate-shimmer {
            background: linear-gradient(90deg, transparent 0%, rgba(75, 85, 99, 0.3) 50%, transparent 100%);
            background-size: 200% 100%;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-gray-300 py-8 min-h-screen">
      <Helmet>
        {/* KEEPING META TAGS EXACTLY SAME */}
        <title>{`${activeTabLabel} Toolkit | DAAN KGP`}</title>
        <meta name="description" content="Complete Toolkit for DAAN-KGPians." />
        <meta
          name="keywords"
          content="DAAN KGP, Dakshana Foundation, Dakshana Alumni Network, Dakshana IIT Kharagpur, Dakshana scholars IIT KGP, IIT Kharagpur alumni network, DAAN IIT Kharagpur, student mentorship IIT Kharagpur, career guidance Dakshana alumni, higher studies guidance IIT KGP, alumni mentorship programs IIT, student support Dakshana scholars, Dakshana community Kharagpur, alumni-student connect IIT KGP, networking for Dakshana alumni, IIT Kharagpur student-alumni network, collaboration among Dakshana scholars, social initiatives Dakshana alumni, outreach programs IIT KGP, volunteering at IIT Kharagpur, giving back to society IIT alumni, awareness campaigns by DAAN, how Dakshana alumni help IIT Kharagpur students, mentorship opportunities for Dakshana scholars, alumni guidance network at IIT Kharagpur, career counseling by Dakshana alumni, Dakshana student community at IIT KGP, daan kgp, daan-kgp, kgpian dakshanite, dakshanites at kgp, dakshanites at iit kgp, kgpian dakshanites, dakshana alumni network at Indian institute of technology Kharagpur, daan at iit kgp, daan at kgp, kgp dakshana, dakshana, iitkgp, kgp, kharagpur"
        />
        <link rel="canonical" href="https://daankgp.vercel.app/toolkit" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://daankgp.vercel.app/toolkit" />
        <meta
          property="og:title"
          content={`${activeTabLabel} Toolkit | DAAN KGP`}
        />
        <meta
          property="og:description"
          content="Complete Toolkit for DAAN-KGPians."
        />
        <meta
          property="og:image"
          content="https://res.cloudinary.com/dhv0sckmq/image/upload/v1769529398/Logo_NoBG_op55cy.avif"
        />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={`${activeTabLabel} Toolkit | DAAN KGP`}
        />
        <meta
          name="twitter:description"
          content="Complete Toolkit for DAAN-KGPians."
        />
        <meta
          name="twitter:image"
          content="https://res.cloudinary.com/dhv0sckmq/image/upload/v1769529398/Logo_NoBG_op55cy.avif"
        />
      </Helmet>

      <section className="container">
        {/* Heading */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 rounded-lg bg-rose-50 dark:bg-gray-900 border border-rose-200 dark:border-gray-700">
            <Wrench className="w-5 h-5 text-rose-500" />
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
            Toolkit
          </h1>
        </div>

        <div className="flex justify-start md:justify-center flex-nowrap overflow-x-auto gap-2 mb-10 no-scrollbar select-none">
          {tabs.map(({ key, label }) => {
            const isActive = activeTab === key;
            return (
              <button
                key={key}
                onClick={() => handleTabChange(key)}
                className={`
          whitespace-nowrap px-4 py-2 rounded-full text-sm md:text-base font-medium
          border transition-all duration-200 flex-shrink-0
          ${
            isActive
              ? "bg-rose-500 text-white border-rose-500"
              : "bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-400 hover:border-rose-400 hover:text-rose-500"
          }
        `}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {data.length > 0 ? (
            data.map((item, idx) => (
              <div
                key={idx}
                className="transition-transform duration-200 hover:-translate-y-1"
              >
                <DownloadBtn {...item} />
              </div>
            ))
          ) : (
            <p className="text-center col-span-full py-10 text-gray-500 dark:text-gray-400">
              No resources found for this category.
            </p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Toolkit;
