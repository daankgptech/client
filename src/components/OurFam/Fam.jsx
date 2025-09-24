import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import FamCard from "./FamCard";
import DeptPieChart from "./PieChart";
import DeptPolarChart from "./PolarChart";

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
    defaultCount: 32,
    year: "Fourth Years",
  },
  2021: {
    data: Intake2021Data,
    label: "'21",
    defaultCount: 19,
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
  { key: "dept", placeholder: "Dept" },
  { key: "hall", placeholder: "Hall" },
];

const Fam = ({ yearParam }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Convert "25" → 2025, fallback → 2025
  const getFullYear = (param) => (param ? 2000 + Number(param) : 2025);

  const [activeYear, setActiveYear] = useState(getFullYear(yearParam));

  // Update when URL param changes
  useEffect(() => {
    setActiveYear(getFullYear(yearParam));
  }, [yearParam]);

  // Filters state initialized from query params
  const [filters, setFilters] = useState(
    searchFields.reduce(
      (acc, { key }) => ({ ...acc, [key]: searchParams.get(key) || "" }),
      {}
    )
  );

  // Sync filters into URL query string
  useEffect(() => {
    const params = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value)
    );
    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  const handleChange = (key) => (e) =>
    setFilters((prev) => ({ ...prev, [key]: e.target.value }));

  const handleYearChange = (newYear) => {
    navigate(
      `/our-fam/${newYear.toString().slice(-2)}?${searchParams.toString()}`
    );
  };

  // Guard against invalid years
  if (!batchDataMap[activeYear]) {
    return <p className="text-center mt-10">Invalid year selected.</p>;
  }

  const { data: currentData, defaultCount, year } = batchDataMap[activeYear];

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
    <div className="dark:bg-gray-900 bg-gray-100 text-gray-900 dark:text-gray-400 min-h-screen container">
      <section data-aos="fade-up" className="container py-8">
        {/* Tabs */}
        <div className="hidden md:flex justify-center gap-3 flex-wrap mb-6 container">
          {Object.keys(batchDataMap)
            .sort((a, b) => b - a)
            .map((y) => (
              <button
                key={y}
                className={`px-4 py-2 rounded-md font-medium transition-all duration-300 ${
                  activeYear.toString() === y
                    ? "bg-red-400 dark:bg-red-800 text-white "
                    : "bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-red-300 dark:hover:bg-red-900 hover:text-white"
                }`}
                onClick={() => handleYearChange(Number(y))}
              >
                {batchDataMap[y].label}
              </button>
            ))}
        </div>

        {/* Dropdown */}
        <div className="md:hidden flex justify-center mb-6 rounded-xl">
          <select
            value={activeYear}
            onChange={(e) => handleYearChange(Number(e.target.value))}
            className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-400"
          >
            {Object.keys(batchDataMap)
              .sort((a, b) => b - a)
              .map((y) => (
                <option key={y} value={y}>
                  {batchDataMap[y].label}
                </option>
              ))}
          </select>
        </div>

        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-400 mb-4">
          {year}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 my-14">
          <DeptPieChart data={filteredItems} deptKey="dept" />
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
          {filteredItems.map((item) => (
            <FamCard key={item.id} {...item} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Fam;
