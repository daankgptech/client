import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, useParams } from "react-router-dom";
import FamCard from "./FamCard";
import DeptPieChart from "./PieChart";
import DeptPolarChart from "./PolarChart";
import Overview from "./Overview"; // import your overview component

// Import data for all batches
import Intake2020Data from "./JSFiles/Intake2020Data";
import Intake2021Data from "./JSFiles/Intake2021Data";
import Intake2022Data from "./JSFiles/Intake2022Data";
import Intake2023Data from "./JSFiles/Intake2023Data";
import Intake2024Data from "./JSFiles/Intake2024Data";
import Intake2025Data from "./JSFiles/Intake2025Data";

// Map batch years
const batchDataMap = {
  2025: {
    data: Intake2025Data,
    label: "'25",
    defaultCount: 42,
    year: "First Years",
  },
  2024: {
    data: Intake2024Data,
    label: "'24",
    defaultCount: 46,
    year: "Second Years",
  },
  2023: {
    data: Intake2023Data,
    label: "'23",
    defaultCount: 35,
    year: "Third Years",
  },
  2022: {
    data: Intake2022Data,
    label: "'22",
    defaultCount: 27,
    year: "Fourth Years",
  },
  2021: {
    data: Intake2021Data,
    label: "'21",
    defaultCount: 17,
    year: "Fifth Years",
  },
  2020: {
    data: Intake2020Data,
    label: "'20",
    defaultCount: 9,
    year: "Graduated!",
  },
};

const searchFields = [
  { key: "name", placeholder: "Name" },
  { key: "branch", placeholder: "Branch" },
  { key: "hall", placeholder: "Hall" },
];

const Fam = () => {
  const navigate = useNavigate();
  const { year } = useParams(); // URL year
  const [searchParams, setSearchParams] = useSearchParams();

  const [activeYear, setActiveYear] = useState(
    year ? 2000 + Number(year) : null
  );

  useEffect(() => {
    if (year) setActiveYear(2000 + Number(year));
    else setActiveYear(null);
  }, [year]);

  const [filters, setFilters] = useState(
    searchFields.reduce(
      (acc, { key }) => ({ ...acc, [key]: searchParams.get(key) || "" }),
      {}
    )
  );

  useEffect(() => {
    const params = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value)
    );
    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  const handleChange = (key) => (e) =>
    setFilters((prev) => ({ ...prev, [key]: e.target.value }));

  const goToYear = (y) => navigate(`/our-fam/${y.toString().slice(-2)}`);
  const backToOverview = () => navigate("/our-fam");

  // **OVERVIEW PAGE**
  if (!activeYear) {
    return <Overview batchDataMap={batchDataMap} goToYear={goToYear} />;
  }

  // **YEAR PAGE**
  if (!batchDataMap[activeYear]) {
    return <p className="text-center mt-10">Invalid year selected.</p>;
  }

  const {
    data: currentData,
    defaultCount,
    year: yearLabel,
  } = batchDataMap[activeYear];
  const filteredItems = currentData.filter((item) =>
    searchFields.every(
      ({ key }) =>
        !filters[key] ||
        item[key].toLowerCase().includes(filters[key].toLowerCase())
    )
  );
  const totalMembers = Object.values(filters).some(Boolean)
    ? filteredItems.length
    : defaultCount;

  return (
    <div className="dark:bg-gray-900 bg-gray-100 text-gray-900 dark:text-gray-400 min-h-screen container py-8">
      {/* Header */}
      <div className="flex justify-center items-center mb-6">
        <h1 className="text-2xl font-bold">{yearLabel}</h1>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 my-14">
        <DeptPieChart data={filteredItems} deptKey="branch" />
        <DeptPolarChart data={filteredItems} deptKey="hall" />
      </div>

      {/* Filters */}
      <div className="flex gap-2 items-center justify-center flex-wrap mb-4 container">
        {searchFields.map(({ key, placeholder }) => (
          <input
            key={key}
            type="text"
            placeholder={placeholder}
            value={filters[key]}
            onChange={handleChange(key)}
            className="px-3 py-2 border border-red-200 dark:border-gray-500 rounded-lg shadow-sm placeholder-red-300 text-red-600
            focus:outline-none focus:ring-2 focus:ring-red-200 dark:focus:ring-gray-500 
            transition-all duration-300 ease-in-out
            dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-400
            hover:shadow-md w-[30%]"
          />
        ))}
      </div>

      <h3 className="mb-6 italic text-center">
        Total : {totalMembers} Members
      </h3>

      {/* Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 container">
        {filteredItems.map((item) => (
          <FamCard key={item.id} {...item} />
        ))}
      </div>

      {/* Year Buttons */}
      <h2 className="text-xl font-bold text-center mt-10 mb-4">Other Years</h2>
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {Object.keys(batchDataMap)
          .sort((a, b) => b - a)
          .map((y) => (
            <button
              key={y}
              onClick={() => goToYear(Number(y))}
              className={`
    px-4 py-2
    sm:px-5 sm:py-2.5
    text-sm sm:text-base
    font-medium
    rounded-lg
    transition-colors duration-200
    focus:outline-none
    focus:ring-2 focus:ring-rose-400
    focus:ring-offset-2 focus:ring-offset-gray-100
    dark:focus:ring-rose-500 dark:focus:ring-offset-gray-900

    ${
      Number(y) === activeYear
        ? "bg-red-500 text-white dark:bg-red-700"
        : "bg-gray-200 text-gray-800 hover:bg-rose-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-rose-500"
    }
  `}
            >
              {batchDataMap[y].label}
            </button>
          ))}
      </div>
      <div className="flex justify-center items-center w-full">
        <button
          onClick={backToOverview}
          className="
    px-5 py-2.5
    text-sm font-medium
    rounded-lg
    transition-all duration-200
    bg-gray-200 text-gray-800
    hover:bg-rose-300 hover:text-gray-900
    active:bg-red-400
    focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-2 focus:ring-offset-gray-100

    dark:bg-gray-700 dark:text-gray-100
    dark:hover:bg-rose-500 dark:hover:text-white
    dark:active:bg-red-600
    dark:focus:ring-rose-500 dark:focus:ring-offset-gray-900
  "
        >
          Overview
        </button>
      </div>
    </div>
  );
};

export default Fam;
