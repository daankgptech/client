import { Link } from "react-router-dom";
import CouncilCard from "./CouncilCard";
import { CouncilData } from "./CouncilData";

const Council = () => (
  <section
    id="council"
    className="scroll-mt-[100px] bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-400 py-10"
  >
    <div data-aos="fade-up" className="container">
      <h1 className="my-8 border-l-8 border-red-300 dark:border-gray-300 py-2 pl-2 text-3xl font-bold">
        Our DAAN Council Members
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {CouncilData.map((member, i) => (
          <CouncilCard key={i} {...member} />
        ))}
      </div>

      <div className="text-center mt-8 flex justify-evenly items-center flex-wrap-reverse gap-8">
        <a
          href="https://docs.google.com/spreadsheets/d/1BIJwqFV_7au6KPHp2FoAkSCFSiJT0DRD1aHl1t6pKiI/edit?usp=sharing"
          target="_blank"
          rel="noopener noreferrer"
          title="DAAN Council 2024-25"
          className="p-2 rounded-xl border shadow-sm shadow-gray-600 text-red-600 dark:text-gray-400 
            bg-gradient-to-tr from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 
            border-gray-300 dark:border-gray-600 
            transition-all duration-300 
            hover:from-gray-300 hover:to-gray-400 dark:hover:from-gray-700 dark:hover:to-gray-600 
            hover:border-gray-500 dark:hover:border-cyan-400"
        >
          DAAN Council 2024-25
        </a>
        {/* <Link to="/council/election" className="p-2 rounded-xl border shadow-sm shadow-gray-600 text-red-600 dark:text-gray-400 
            bg-gradient-to-tr from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 
            border-gray-300 dark:border-gray-600 
            transition-all duration-300 
            hover:from-gray-300 hover:to-gray-400 dark:hover:from-gray-700 dark:hover:to-gray-600 
            hover:border-gray-500 dark:hover:border-cyan-400">DAAN Council Election 2025-26</Link> */}
      </div>
    </div>
  </section>
);

export default Council;