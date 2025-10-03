import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

import formsData from "../components/Forms/formsData";
import ResponsePercentage from "../components/Forms/ResponsePercentage";

const Forms = () => {
  useEffect(() => {
    document.title = "Our Forms | DAAN KGP";
  }, []);

  const now = new Date(); // current time in browser (auto-handles timezone)

  return (
    <div className="min-h-[80vh] bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-400">
      <Helmet>
        <meta
          name="description"
          content="This page includes our forms related queries."
        />
      </Helmet>

      <section data-aos="fade-up" className="container">
        <h1 className="my-8 border-l-8 border-red-300 py-2 pl-2 text-3xl font-bold">
          Our Forms
        </h1>
        <div className="flex flex-wrap justify-center items-start gap-4 container">
          {formsData.map((item, index) => {
            const deadlineDate = new Date(item.deadline); // deadline with correct IST offset
            const isExceeded = now > deadlineDate;
            const tshirtForm = formsData[0];
            const [open, setOpen] = useState(false); // toggle state

            return (
              <div
                key={index}
                className={`relative block max-w-xs mx-auto my-4 rounded-lg shadow-md border transition-all duration-300 overflow-hidden
                  ${
                    isExceeded
                      ? "bg-gray-300 dark:bg-gray-700 border-gray-400 dark:border-gray-600 cursor-not-allowed"
                      : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-red-400"
                  }
                `}
              >
                <Link
                  to={isExceeded ? "#" : item.to}
                  className={`block ${isExceeded ? "pointer-events-none" : ""}`}
                >
                  {/* Image Preview */}
                  <div className="w-full h-40 overflow-hidden">
                    <img
                      src={item.img}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Text Content */}
                  <div className="p-4">
                    <h2 className="text-lg font-semibold text-red-600 dark:text-red-400">
                      {item.title}
                    </h2>
                    <p className="text-gray-700 dark:text-gray-400 mt-1 text-sm">
                      {item.desc}
                    </p>
                    <p className="text-gray-800 dark:text-gray-400 mt-4 text-sm font-bold">
                      Deadline:{" "}
                      {deadlineDate.toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                    {isExceeded && (
                      <p className="text-red-600 mt-2 text-sm font-bold">
                        Too Late!
                      </p>
                    )}
                  </div>
                </Link>
                {
                  isExceeded && (
                    <div>
                  <h2
                    className="text-lg font-semibold text-center mb-4 cursor-pointer select-none hover:scale-105 transition-all duration-300 hover:text-blue-600"
                    onClick={() => setOpen((prev) => !prev)} // toggle on click
                  >
                    Get Response %
                  </h2>
                  {open && <ResponsePercentage formData={tshirtForm} />}
                </div>
                  )
                }
                
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Forms;
