import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

import formsData from "../components/Forms/formsData";
import ResponsePercentage from "../components/Forms/ResponsePercentage";

const Forms = () => {
  const now = new Date();
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="min-h-[80vh] bg-gray-100 dark:bg-gray-900  text-gray-900 dark:text-gray-400">
      <Helmet>
        {/* Standard metadata */}
        <title>Forms | DAAN KGP</title>
        <meta name="description" content="Access all DAAN KGP forms in one place. Submit responses, track deadlines, and stay updated with campus initiatives and activities. All current and future forms are available here for easy access." />
        <meta name="keywords" content="DAAN KGP, Dakshana Foundation, Dakshana Alumni Network, Dakshana IIT Kharagpur, Dakshana scholars IIT KGP, IIT Kharagpur alumni network, DAAN IIT Kharagpur, student mentorship IIT Kharagpur, career guidance Dakshana alumni, higher studies guidance IIT KGP, alumni mentorship programs IIT, student support Dakshana scholars, Dakshana community Kharagpur, alumni-student connect IIT KGP, networking for Dakshana alumni, IIT Kharagpur student-alumni network, collaboration among Dakshana scholars, social initiatives Dakshana alumni, outreach programs IIT KGP, volunteering at IIT Kharagpur, giving back to society IIT alumni, awareness campaigns by DAAN, how Dakshana alumni help IIT Kharagpur students, mentorship opportunities for Dakshana scholars, alumni guidance network at IIT Kharagpur, career counseling by Dakshana alumni, Dakshana student community at IIT KGP, daan kgp, daan-kgp, kgpian dakshanite, dakshanites at kgp, dakshanites at iit kgp, kgpian dakshanites, dakshana alumni network at Indian institute of technology Kharagpur, daan at iit kgp, daan at kgp, kgp dakshana, dakshana, iitkgp, kgp, kharagpur" />
        <link rel="canonical" href="https://daankgp.vercel.app/forms" />
        {/* Open Graph / Facebook / LinkedIn */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://daankgp.vercel.app/forms" />
        <meta property="og:title" content="Forms | DAAN KGP" />
        <meta property="og:description" content="Access all DAAN KGP forms in one place. Submit responses, track deadlines, and stay updated with campus initiatives and activities. All current and future forms are available here for easy access." />
        <meta property="og:image" content="https://res.cloudinary.com/dhv0sckmq/image/upload/v1769529398/Logo_NoBG_op55cy.avif" /> {/* Add a real path to your logo/banner */}
        {/* The Thumbnail Image - This is what shows up in the WhatsApp chat bubble */}
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Forms | DAAN KGP" />
        <meta name="twitter:description" content="Access all DAAN KGP forms in one place. Submit responses, track deadlines, and stay updated with campus initiatives and activities. All current and future forms are available here for easy access." />
        <meta name="twitter:image" content="https://res.cloudinary.com/dhv0sckmq/image/upload/v1769529398/Logo_NoBG_op55cy.avif" />
      </Helmet>
      <section data-aos="fade-up" className="container py-6">
        {/* Header */}
        <h1 className="mt-0 mb-8 border-l-8 border-red-300 dark:border-gray-300 dark:text-gray-200 py-2 pl-2 text-3xl font-semibold container">
          Forms
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
                className={`group relative w-full max-w-xs rounded-3xl overflow-hidden border transition-all duration-500 ${formClasses}`}
              >
                <Link
                  to={isExceeded ? "#" : item.to}
                  className={isExceeded ? "pointer-events-none" : null}
                >
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
                      className={`overflow-hidden transition-all duration-500 ${
                        isOpen ? "max-h-[400px] mt-4" : "max-h-0"
                      }`}
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
