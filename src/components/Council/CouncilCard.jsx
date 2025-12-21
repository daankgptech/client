import React from "react";
import { VscDiffIgnored } from "react-icons/vsc";
import { MdAddCall } from "react-icons/md";
import { IoIosMail } from "react-icons/io";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import ProtectedRoute from "../Secure/ProtectedRoute";

const CouncilCard = ({ img, title, portfolio, mail, mobile, year }) => {
  const navigate = useNavigate();
  return (
    <>
      <div className="shadow-md dark:hover:shadow-gray-500 hover:shadow-red-300 transition-all duration-500 hover:shadow-lg dark:bg-gray-900 dark:text-gray-400 rounded-lg bg-gradient-to-tr from-gray-100 dark:from-gray-800 dark:to-gray-700 to-gray-200">
        <div className="overflow-hidden h-[220px] transition duration-700 rounded-lg flex justify-center items-center">
          <Helmet>
            <link rel="preload" as="image" href={img} />
          </Helmet>
          <img
            src={img}
            alt={title}
            width="180px"
            height="180px"
            className="hover:skew-2 hover:scale-[1.04] transition duration-700  rounded-full"
          />
        </div>

        <div className="space-y-2 p-3">
          <h1 className="line-clamp-1 font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-red-700 dark:from-gray-300 to-orange-500 dark:to-gray-100">
            {title}
          </h1>
          <div className="flex items-center gap-2 opacity-70">
            <VscDiffIgnored />
            <span className="dark:text-gray-400">{portfolio}</span>
          </div>
          <div className="flex items-center justify-between border-t-2 dark:border-gray-600 py-3 !mt-3">
            <div className="opacity-70 flex justify-between items-center gap-4 w-1/4">
              <a
                href={`mailto:${mail}`}
                title="Mail Now"
                className="p-2 rounded-lg border border-rose-200 bg-rose-50 dark:bg-gray-800 text-rose-400 flex items-center hover:bg-rose-100 hover:scale-[1.05] hover:shadow-rose-300 transition-all hover:translate-x-1 hover:-translate-y-1 hover:shadow-lg hover:border-rose-300 duration-300"
              >
                <IoIosMail />
              </a>
              <ProtectedRoute
                fallback={
                  <button
                    onClick={() => navigate("/signin")}
                    className="p-2 rounded-lg border border-green-200 bg-green-50 dark:bg-gray-800 text-green-400 flex items-center hover:bg-green-100 hover:scale-[1.05] hover:shadow-green-300 transition-all hover:translate-x-1 hover:-translate-y-1 hover:shadow-lg hover:border-green-300 duration-300"
                  >
                    <MdAddCall />
                  </button>
                }
              >
                <a
                  href={`tel:${mobile}`}
                  title="Call Now"
                  className="p-2 rounded-lg border border-green-200 bg-green-50 dark:bg-gray-800 text-green-400 flex items-center hover:bg-green-100 hover:scale-[1.05] hover:shadow-green-300 transition-all hover:translate-x-1 hover:-translate-y-1 hover:shadow-lg hover:border-green-300 duration-300"
                >
                  <MdAddCall />
                </a>
              </ProtectedRoute>
            </div>
            <div>
              <div className="flex justify-between items-center"></div>
              <p className="text-2xl font-semibold text-red-700 dark:text-cyan-700">
                {year} Yr
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CouncilCard;
