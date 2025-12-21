import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

import formsData from "../components/Forms/formsData";
import ResponsePercentage from "../components/Forms/ResponsePercentage";

const Forms = () => {
  useEffect(() => {
    document.title = "Our Forms | DAAN KGP";
  }, []);

  const now = new Date();
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="min-h-[80vh] bg-gradient-to-b from-gray-200 to-gray-100 dark:from-gray-800 dark:to-gray-900 text-gray-900 dark:text-gray-400">
      <Helmet>
        <meta
          name="description"
          content="This page includes our forms related queries."
        />
      </Helmet>

      <section data-aos="fade-up" className="container py-6">
        {/* Header */}
        <h1 className="my-10 pl-4 border-l-8 border-rose-400 text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-200">
          Our Forms
        </h1>

        {/* Cards */}
        <div className="flex flex-wrap justify-center items-start gap-6">
          {formsData.map((item, index) => {
            const deadlineDate = new Date(item.deadline);
            const isExceeded = now > deadlineDate;
            const isOpen = openIndex === index;

            const formClasses = isExceeded
              ? "bg-gray-300/70 dark:bg-gray-800 border-gray-400 dark:border-gray-700"
              : "bg-gradient-to-br from-rose-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 border-gray-300 dark:border-gray-700 hover:-translate-y-2 hover:shadow-xl hover:shadow-rose-200/50 dark:hover:shadow-red-900/30";

            return (
              <div
                key={index}
                className={`group relative w-full max-w-xs rounded-2xl overflow-hidden border transition-all duration-500 ${formClasses}`}
              >
                <Link to={isExceeded ? "#" : item.to} className={isExceeded ? "pointer-events-none" : null}>
                  {/* Image */}
                  <div className="h-40 overflow-hidden">
                    <img
                      src={item.img}
                      alt={item.title || "Form Image"}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-2">
                    <h2 className="text-lg font-semibold text-rose-600 dark:text-rose-400">
                      {item.title}
                    </h2>

                    <p className="text-sm text-gray-700 dark:text-gray-500">
                      {item.desc}
                    </p>

                    <p className="text-sm font-medium text-gray-800 dark:text-gray-400 pt-2">
                      Deadline:{" "}
                      {deadlineDate.toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>

                    {isExceeded && (
                      <p className="text-sm font-semibold text-red-500">
                        Submissions closed
                      </p>
                    )}
                  </div>
                </Link>

                {/* Response Section */}
                {isExceeded && (
                  <div className="border-t border-gray-300 dark:border-gray-700 px-4 py-3">
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                      className="w-full text-center text-sm font-semibold text-rose-600 dark:text-rose-400 hover:scale-105 transition-transform duration-300"
                    >
                      {isOpen ? "Hide Responses" : "View Responses"}
                    </button>

                    <div
                      className={`overflow-hidden transition-all duration-500 ${isOpen ? "max-h-[400px] mt-4" : "max-h-0"}`}
                    >
                      {isOpen && <ResponsePercentage formData={item} />}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Forms;