import { Helmet } from "react-helmet";
import { useParams, useNavigate } from "react-router-dom";
import DownloadBtn from "../components/Toolkit/DownloadBtn";
import ToolkitData from "../components/Toolkit/ToolkitData";

const tabs = [
  { key: "erp", label: "ERP" },
  { key: "fresher", label: "Fresher" },
  { key: "academic", label: "Academic" },
  { key: "cdc", label: "CDC Intern" },
];

const Toolkit = () => {
  const { tab } = useParams();
  const navigate = useNavigate();

  const activeTab = tabs.some(({ key }) => key === tab) ? tab : "erp";
  const data = ToolkitData[activeTab] || [];

  const handleTabChange = (key) => {
    navigate(`/toolkit/${key}`);
  };

  return (
    <div className=" bg-gradient-to-b from-gray-200 to-gray-100 dark:from-gray-800 dark:to-gray-900 text-gray-900 dark:text-gray-400 py-8">
      <Helmet>
        <title>Toolkit | DAAN KGP</title>
        <meta
          name="description"
          content="Toolkit with ERP, Fresher, CDC Intern, and Academic resources for smooth campus life."
        />
      </Helmet>

      <section data-aos="fade-up" className="container">
        {/* Header */}
        <h1 className="mt-0 mb-8 pl-4 border-l-8 border-rose-400 text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-200">
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
                  transition-all duration-500 ease-out
                  ${
                    isActive
                      ? `
                        bg-gradient-to-r from-rose-500 to-red-600
                        text-white shadow-lg shadow-rose-300/40
                        dark:shadow-red-900/40
                        scale-[1.03]
                      `
                      : `
                        bg-gray-200/70 text-gray-700
                        dark:bg-gray-800/70 dark:text-gray-400
                        hover:bg-rose-300 hover:text-white
                        dark:hover:bg-red-900
                      `
                  }
                `}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div
          className="
            grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
            gap-4 md:gap-6 lg:gap-8
          "
        >
          {data.map((item, idx) => (
            <div
              key={idx}
              className="
                transition-all duration-500
                hover:-translate-y-1
              "
            >
              <DownloadBtn {...item} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Toolkit;