import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useParams, useNavigate } from "react-router-dom";
import DownloadBtn from "../components/Toolkit/DownloadBtn";
import { api } from "../utils/Secure/api"; // Using your configured axios instance

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

  // Fetch data from backend
  useEffect(() => {
    const fetchToolkit = async () => {
      try {
        const response = await api.get("/toolkit"); // Adjust endpoint if needed
        if (response.data.success) {
          setToolkitData(response.data.data);
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
  
  // Get data for the specific tab from the fetched state
  const data = toolkitData ? toolkitData[activeTab] || [] : [];
  
  const activeTabLabel = tabs.find((t) => t.key === activeTab)?.label || "Toolkit";

  const handleTabChange = (key) => {
    navigate(`/toolkit/${key}`);
  };

  if (loading) {
    return (
      <div className="relative container w-full flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-400 py-8 min-h-screen">
      <Helmet>
        <title>{`${activeTabLabel} Toolkit | DAAN KGP`}</title>
        <meta name="description" content="Complete Toolkit for DAAN-KGPians." />
      </Helmet>

      <section data-aos="fade-up" className="container ">
        <h1 className="mt-0 mb-8 border-l-8 border-red-300 dark:border-gray-300 dark:text-gray-200 py-2 pl-2 text-3xl font-semibold">
          Toolkit
        </h1>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {tabs.map(({ key, label }) => {
            const isActive = activeTab === key;
            return (
              <button
                key={key}
                onClick={() => handleTabChange(key)}
                className={`
                  relative px-5 py-2 rounded-full text-sm md:text-base font-medium
                  transition-all duration-300 ease-out
                  ${isActive 
                    ? "bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-lg scale-[1.03]" 
                    : "bg-gray-200/70 text-gray-700 dark:bg-gray-800/70 dark:text-gray-400 hover:bg-rose-300 hover:text-white"
                  }
                `}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {data.length > 0 ? (
            data.map((item, idx) => (
              <div key={idx} className="transition-all duration-500 hover:-translate-y-1">
                <DownloadBtn {...item} />
              </div>
            ))
          ) : (
            <p className="text-center col-span-full py-10">No resources found for this category.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Toolkit;