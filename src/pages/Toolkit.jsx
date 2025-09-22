import { useState } from "react";
import { Helmet } from "react-helmet";
import DownloadBtn from "../components/Toolkit/DownloadBtn";
import ToolkitData from "../components/Toolkit/ToolkitData";

const tabs = [
  { key: "erp", label: "ERP" },
  { key: "fresher", label: "Fresher" },
  { key: "academic", label: "Academic" },
  { key: "cdc", label: "CDC Intern" },
];

const Toolkit = () => {
  const [activeTab, setActiveTab] = useState("erp");
  const data = ToolkitData[activeTab] || [];

  return (
    <div className="bg-gray-100 dark:bg-gray-900 dark:text-gray-400">
      <Helmet>
        <title>Toolkit | DAAN KGP</title>
        <meta
          name="description"
          content="Toolkit with ERP, Fresher, CDC Intern, and Academic resources for smooth campus life."
        />
      </Helmet>

      <section data-aos="fade-up" className="container">
        <h1 className="my-8 border-l-8 border-red-300 dark:border-gray-400 py-2 pl-2 text-3xl font-bold">
          Toolkit
        </h1>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {tabs.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-4 py-2 rounded-md font-medium transition-all duration-300 ${
                activeTab === key
                  ? "bg-red-400 dark:bg-red-800 text-white "
                  : "bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-red-300 dark:hover:bg-red-900 hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {data.map((item, idx) => (
            <DownloadBtn key={idx} {...item} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Toolkit;