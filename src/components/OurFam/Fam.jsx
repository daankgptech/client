import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, useParams } from "react-router-dom";
import FamCard from "./FamCard";
import DeptPieChart from "./PieChart";
import DeptPolarChart from "./PolarChart";
import Overview from "./Overview"; // import your overview component
import { api } from "../../utils/Secure/api";
import batchDataMap from "./JSFiles/BatchDataMap";
import LoaderOverlay from "../../utils/LoaderOverlay";
import { FaFileDownload } from "react-icons/fa";

const searchFields = [
  { key: "name", placeholder: "Name" },
  { key: "branch", placeholder: "Branch" },
  { key: "hall", placeholder: "Hall" },
];

const Fam = () => {
  const navigate = useNavigate();
  const { year } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const [activeYear, setActiveYear] = useState(
    year ? 2000 + Number(year) : null
  );

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  useEffect(() => {
    api
      .get("/v1/me")
      .then((res) => setUser(res.data))
      .catch(() => setUser(null));
  }, []);
  const canAccessBatch = (userBatch, targetBatch) =>
    Math.abs(Number(userBatch) - Number(targetBatch)) <= 1;

  const [filters, setFilters] = useState(
    searchFields.reduce((acc, { key }) => {
      acc[key] = searchParams.get(key) || "";
      return acc;
    }, {})
  );
  useEffect(() => {
    if (year) setActiveYear(2000 + Number(year));
    else setActiveYear(null);
  }, [year]);
  useEffect(() => {
    const params = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v)
    );
    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);
  useEffect(() => {
    if (!activeYear) return;

    setMembers([]);
    setLoading(true);

    const params = Object.fromEntries(
      Object.entries({ year: activeYear, ...filters }).filter(([_, v]) => v)
    );

    api
      .get("/our-fam/members", { params })
      .then((res) => setMembers(res.data))
      .catch(() => setMembers([]))
      .finally(() => setLoading(false));
  }, [activeYear, filters]);

  const handleChange = (key) => (e) =>
    setFilters((prev) => ({ ...prev, [key]: e.target.value }));

  const goToYear = (y) => navigate(`/our-fam/${y.toString().slice(-2)}`);
  const backToOverview = () => navigate("/our-fam");

  const batchMeta = activeYear ? batchDataMap[activeYear] : null;
  const defaultCount = batchMeta?.defaultCount ?? 0;
  const yearLabel = batchMeta?.year ?? "";
  const filteredItems = members;

  const totalMembers = Object.values(filters).some(Boolean)
    ? filteredItems.length
    : defaultCount;
  if (!user) {
    return <Overview
        batchDataMap={batchDataMap}
        goToYear={goToYear}
        className="container"
      />;
  }
  if (!activeYear) {
    return (
      <Overview
        batchDataMap={batchDataMap}
        goToYear={goToYear}
        className="container"
      />
    );
  }
  return (
    <div className="dark:bg-gray-900 bg-gray-100 text-gray-900 dark:text-gray-400 min-h-screen container py-8">
      {/* Header */}
      <div className="flex justify-center items-center mb-6">
        {canAccessBatch(user.batch, activeYear) && (
          <a
            href={`${api.defaults.baseURL}/v1/vcf/${activeYear}`}
            className="inline-flex fixed bottom-4 left-4 z-50 items-center gap-2 px-3 py-1 rounded-3xl bg-gray-300 dark:bg-gray-800 text-rose-600 dark:text-rose-400 hover:scale-105 transition"
          >
            VCF <FaFileDownload />
          </a>
        )}
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
            className="px-3 py-2 border border-red-200 dark:border-gray-500 rounded-3xl shadow-sm placeholder-red-300 text-red-600
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
      {loading && <LoaderOverlay />}
      {/* Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 container">
        {filteredItems.map((item) => (
          <FamCard key={item._id} _id={item._id} {...item} />
        ))}
      </div>
      {/* Year Buttons */}
      <h2 className="text-xl font-bold text-center mt-10 mb-4">Other Years</h2>
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {Object.keys(batchDataMap)
          // .filter((y) => canAccessBatch(user.batch, Number(y)))
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
